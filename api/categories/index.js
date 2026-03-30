const { withErrorHandling, sendJson } = require('../_lib/http');
const { KEYS, categoryKey, getAllFromSet } = require('../_lib/repositories');

module.exports = withErrorHandling(async (req, res) => {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const categories = await getAllFromSet(KEYS.categories, categoryKey);
  sendJson(res, 200, categories);
});
