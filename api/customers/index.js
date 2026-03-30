const { withErrorHandling, sendJson } = require('../_lib/http');
const { requireAdmin } = require('../_lib/auth');
const { KEYS, customerKey, getAllFromSet } = require('../_lib/repositories');

module.exports = withErrorHandling(async (req, res) => {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  requireAdmin(req);

  const customers = await getAllFromSet(KEYS.customers, customerKey);
  sendJson(res, 200, customers);
});
