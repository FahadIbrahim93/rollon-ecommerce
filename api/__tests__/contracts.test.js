const test = require('node:test');
const assert = require('node:assert/strict');

const productsHandler = require('../products');
const ordersHandler = require('../orders');

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

function installFetchMock() {
  process.env.RollON_Database_KV_REST_API_URL = 'https://mock.upstash.io';
  process.env.RollON_Database_KV_REST_API_TOKEN = 'mock-token';

  const dataset = {
    products: [
      { id: '1', slug: 'alpha', name: 'Alpha Grinder', description: 'Premium grinder', categoryId: '2', featured: true, tags: ['grinder'] },
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

    if (cmd[0] === 'JSON.GET' && cmd[1].startsWith('rollon:customer:')) {
      return { ok: true, json: async () => ({ result: null }) };
    }

    return { ok: true, json: async () => ({ result: null }) };
  };
}

test.beforeEach(() => {
  installFetchMock();
});

test('GET /products contract contains pagination envelope', async () => {
  const res = createRes();
  await productsHandler({ method: 'GET', query: {} }, res);

  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.payload.items));
  assert.equal(typeof res.payload.total, 'number');
  assert.equal(typeof res.payload.page, 'number');
  assert.equal(typeof res.payload.limit, 'number');
});

test('POST /orders contract returns required fields', async () => {
  const res = createRes();

  await ordersHandler({
    method: 'POST',
    query: {},
    body: {
      customerId: 'c1',
      customerName: 'Contract User',
      total: 250,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      items: [{ name: 'Contract Item', quantity: 1, price: 250, image: '/x.png' }],
      shippingAddress: { name: 'A', address: 'B', city: 'Dhaka', phone: '01' },
    },
  }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(typeof res.payload.id, 'string');
  assert.equal(typeof res.payload.orderNumber, 'string');
  assert.equal(typeof res.payload.createdAt, 'string');
  assert.equal(typeof res.payload.customerId, 'string');
  assert.ok(Array.isArray(res.payload.items));
});
