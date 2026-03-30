const { withErrorHandling, sendJson } = require('../_lib/http');
const { saveMany, KEYS, productKey, categoryKey } = require('../_lib/repositories');
const { categories, products } = require('../_lib/seedData');

module.exports = withErrorHandling(async (req, res) => {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!process.env.ROLLON_ADMIN_SEED_TOKEN) {
    return sendJson(res, 500, { error: 'ROLLON_ADMIN_SEED_TOKEN is not configured' });
  }

  const authToken = req.headers['x-admin-token'];
  if (authToken !== process.env.ROLLON_ADMIN_SEED_TOKEN) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  await saveMany(categories, KEYS.categories, categoryKey);
  await saveMany(products, KEYS.products, productKey);

  return sendJson(res, 200, {
    message: 'Seed completed successfully',
    categories: categories.length,
    products: products.length,
  });
});
