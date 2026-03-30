const { runCommand, runPipeline } = require('./upstash');

const KEYS = {
  products: 'rollon:idx:products',
  categories: 'rollon:idx:categories',
  orders: 'rollon:idx:orders',
  customers: 'rollon:idx:customers',
};

function productKey(id) {
  return `rollon:product:${id}`;
}

function categoryKey(id) {
  return `rollon:category:${id}`;
}

function orderKey(id) {
  return `rollon:order:${id}`;
}

function customerKey(id) {
  return `rollon:customer:${id}`;
}

async function getJson(key) {
  return runCommand('JSON.GET', key);
}

async function getAllFromSet(setKey, keyBuilder) {
  const ids = await runCommand('SMEMBERS', setKey);
  if (!ids || ids.length === 0) {
    return [];
  }

  const commandList = ids.map((id) => ['JSON.GET', keyBuilder(id)]);
  const result = await runPipeline(commandList);

  return result
    .map((entry) => entry.result)
    .filter(Boolean)
    .map((json) => JSON.parse(json));
}

async function saveMany(items, idxKey, keyBuilder) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const commands = [];
  for (const item of items) {
    commands.push(['JSON.SET', keyBuilder(item.id), '$', JSON.stringify(item)]);
    commands.push(['SADD', idxKey, item.id]);
  }

  await runPipeline(commands);
}

async function createOrder(order) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const orderRecord = {
    ...order,
    id,
    orderNumber: `ORD-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  const existingCustomerRaw = await getJson(customerKey(orderRecord.customerId));
  const existingCustomer = existingCustomerRaw ? JSON.parse(existingCustomerRaw) : null;

  const customerRecord = {
    id: orderRecord.customerId,
    name: orderRecord.customerName,
    email: orderRecord.shippingAddress?.email || existingCustomer?.email || '',
    phone: orderRecord.shippingAddress?.phone || existingCustomer?.phone || '',
    totalSpent: Number(existingCustomer?.totalSpent || 0) + Number(orderRecord.total || 0),
    orders: Number(existingCustomer?.orders || 0) + 1,
    createdAt: existingCustomer?.createdAt || now,
    city: orderRecord.shippingAddress?.city || existingCustomer?.city || '',
    zone: orderRecord.shippingAddress?.zone || existingCustomer?.zone || '',
    address: orderRecord.shippingAddress?.address || existingCustomer?.address || '',
  };

  await runPipeline([
    ['JSON.SET', orderKey(id), '$', JSON.stringify(orderRecord)],
    ['SADD', KEYS.orders, id],
    ['JSON.SET', customerKey(orderRecord.customerId), '$', JSON.stringify(customerRecord)],
    ['SADD', KEYS.customers, orderRecord.customerId],
  ]);

  return orderRecord;
}

module.exports = {
  KEYS,
  productKey,
  categoryKey,
  orderKey,
  customerKey,
  getJson,
  getAllFromSet,
  saveMany,
  createOrder,
};
