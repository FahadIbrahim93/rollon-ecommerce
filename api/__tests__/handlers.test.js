const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const productsHandler = require('../products');
const ordersHandler = require('../orders');
const customersHandler = require('../customers');

function createRes() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };
}


function createToken(payload, secret = process.env.ROLLON_JWT_SECRET) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const encodedHeader = encode({ alg: 'HS256', typ: 'JWT' });
  const encodedPayload = encode(payload);
  const signature = crypto.createHmac('sha256', secret).update(`${encodedHeader}.${encodedPayload}`).digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function installFetchMock() {
  process.env.RollON_Database_KV_REST_API_URL = 'https://mock.upstash.io';
  process.env.RollON_Database_KV_REST_API_TOKEN = 'mock-token';
  process.env.ROLLON_JWT_SECRET = 'test-secret';

  const dataset = {
    products: [
      { id: '1', slug: 'alpha', name: 'Alpha Grinder', description: 'Premium grinder', categoryId: '2', featured: true, tags: ['grinder'] },
      { id: '2', slug: 'beta', name: 'Beta Papers', description: 'Ultra thin papers', categoryId: '4', featured: false, tags: ['papers'] },
      { id: '3', slug: 'gamma', name: 'Gamma Grinder', description: 'Travel grinder', categoryId: '2', featured: true, tags: ['grinder', 'travel'] },
    ],
  };

  global.fetch = async (url, init) => {
    const cmd = JSON.parse(init.body);
    const pipeline = String(url).endsWith('/pipeline');

    if (pipeline) {
      return {
        ok: true,
        json: async () => cmd.map((entry) => {
          if (entry[0] === 'JSON.GET' && entry[1].startsWith('rollon:product:')) {
            const id = entry[1].split(':').pop();
            const product = dataset.products.find((p) => p.id === id);
            return { result: product ? JSON.stringify(product) : null };
          }
          return { result: 'OK' };
        }),
      };
    }

    if (cmd[0] === 'SMEMBERS' && cmd[1] === 'rollon:idx:products') {
      return { ok: true, json: async () => ({ result: dataset.products.map((p) => p.id) }) };
    }

    if (cmd[0] === 'JSON.GET' && cmd[1].startsWith('rollon:product:')) {
      const id = cmd[1].split(':').pop();
      const product = dataset.products.find((p) => p.id === id);
      return { ok: true, json: async () => ({ result: product ? JSON.stringify(product) : null }) };
    }

    if (cmd[0] === 'JSON.GET' && cmd[1].startsWith('rollon:customer:')) {
      return { ok: true, json: async () => ({ result: null }) };
    }

    if (cmd[0] === 'SMEMBERS' && (cmd[1] === 'rollon:idx:orders' || cmd[1] === 'rollon:idx:customers')) {
      return { ok: true, json: async () => ({ result: [] }) };
    }

    if (cmd[0] === 'JSON.GET' && (cmd[1].startsWith('rollon:order:') || cmd[1].startsWith('rollon:customer:'))) {
      return { ok: true, json: async () => ({ result: null }) };
    }

    return { ok: true, json: async () => ({ result: 'OK' }) };
  };
}

test.beforeEach(() => {
  installFetchMock();
});

test('GET /products returns paginated payload by default', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: {} }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.page, 1);
  assert.equal(res.payload.limit, 50);
  assert.equal(res.payload.total, 3);
  assert.equal(res.payload.items.length, 3);
});

test('GET /products applies search, featured and pagination filters', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { search: 'grinder', featured: 'true', page: '1', limit: '1' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.total, 2);
  assert.equal(res.payload.items.length, 1);
  assert.equal(res.payload.items[0].categoryId, '2');
});

test('GET /products clamps excessively large limit', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { limit: '10000' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.limit, 100);
});

test('GET /products by id returns not found when missing', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { id: '404' } }, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.payload.error, 'Not found');
});

test('GET /products rejects unsupported methods', async () => {
  const res = createRes();
  await productsHandler({ method: 'POST', query: {} }, res);

  assert.equal(res.statusCode, 405);
});

test('POST /orders validates missing payload fields', async () => {
  const res = createRes();
  await ordersHandler({ method: 'POST', body: { customerId: 'c1', items: [] }, query: {} }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.payload.error, /customerId and customerName are required/);
});

test('POST /orders validates item quantity and price', async () => {
  const res = createRes();
  await ordersHandler({
    method: 'POST',
    query: {},
    body: {
      customerId: 'c1',
      customerName: 'Test',
      items: [{ name: 'Bad Item', quantity: 0, price: -1 }],
    },
  }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.payload.error, /Each order item/);
});

test('POST /orders creates order for valid payload', async () => {
  const res = createRes();
  await ordersHandler({
    method: 'POST',
    query: {},
    body: {
      customerId: 'c1',
      customerName: 'Test',
      total: 200,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      items: [{ name: 'Good Item', quantity: 1, price: 200, image: '/x.jpg' }],
      shippingAddress: { name: 'A', address: 'B', city: 'Dhaka', phone: '01' },
    },
  }, res);

  assert.equal(res.statusCode, 201);
  assert.ok(res.payload.id);
  assert.match(res.payload.orderNumber, /^ORD-/);
});

test('orders route rejects unsupported methods', async () => {
  const res = createRes();
  await ordersHandler({ method: 'PUT', query: {} }, res);

  assert.equal(res.statusCode, 405);
});


test('GET /products by slug returns a single product', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { slug: 'alpha' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.slug, 'alpha');
});

test('GET /products uses safe defaults for invalid page and limit', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { page: '0', limit: 'abc' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.page, 1);
  assert.equal(res.payload.limit, 50);
});

test('GET /products search can return zero results with stable schema', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: { search: 'nonexistent-keyword' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.total, 0);
  assert.equal(res.payload.items.length, 0);
});

test('POST /orders rejects missing payload', async () => {
  const res = createRes();
  await ordersHandler({ method: 'POST', query: {}, body: null }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.payload.error, /Payload is required/);
});


test('GET /orders requires authentication token', async () => {
  const res = createRes();
  await ordersHandler({ method: 'GET', query: {}, headers: {} }, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.payload.error, 'Authentication token required');
});

test('GET /orders requires admin role token', async () => {
  const res = createRes();
  const token = createToken({ sub: '2', role: 'user' });
  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${token}` } }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.error, 'Admin access required');
});

test('GET /orders allows admin role token', async () => {
  const res = createRes();
  const token = createToken({ sub: '1', role: 'admin' });
  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${token}` } }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, []);
});

test('GET /customers requires admin role token', async () => {
  const res = createRes();
  const token = createToken({ sub: '2', role: 'user' });
  await customersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${token}` } }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.error, 'Admin access required');
});


test('GET /customers returns 500 when jwt secret is not configured', async () => {
  const res = createRes();
  const token = createToken({ sub: '1', role: 'admin' });
  delete process.env.ROLLON_JWT_SECRET;

  await customersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${token}` } }, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.payload.error, 'ROLLON_JWT_SECRET is not configured');
});

test('GET /orders returns 500 when jwt secret is not configured', async () => {
  const res = createRes();
  const token = createToken({ sub: '1', role: 'admin' });
  delete process.env.ROLLON_JWT_SECRET;

  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${token}` } }, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.payload.error, 'ROLLON_JWT_SECRET is not configured');
});

test('GET /orders rejects malformed bearer token', async () => {
  const res = createRes();
  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: 'Bearer not-a-jwt' } }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.error, 'Admin access required');
  assert.ok(res.payload.requestId);
});

test('GET /orders rejects expired admin token', async () => {
  const res = createRes();
  const expiredToken = createToken({ sub: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) - 60 });
  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${expiredToken}` } }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.error, 'Admin access required');
  assert.ok(res.payload.requestId);
});

test('GET /orders rejects forged signature token', async () => {
  const res = createRes();
  const encodedHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify({ sub: '1', role: 'admin' })).toString('base64url');
  const forged = `${encodedHeader}.${encodedPayload}.forged-signature`;

  await ordersHandler({ method: 'GET', query: {}, headers: { authorization: `Bearer ${forged}` } }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.error, 'Admin access required');
});

test('auth errors include propagated request id', async () => {
  const res = createRes();
  await customersHandler({ method: 'GET', query: {}, headers: { 'x-request-id': 'req-123' } }, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.payload.error, 'Authentication token required');
  assert.equal(res.payload.requestId, 'req-123');
});
