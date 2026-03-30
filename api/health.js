const { withErrorHandling, sendJson } = require('./_lib/http');
const { runCommand } = require('./_lib/upstash');

module.exports = withErrorHandling(async (req, res) => {
  const ping = await runCommand('PING');
  sendJson(res, 200, {
    status: 'ok',
    redis: ping,
    timestamp: new Date().toISOString(),
  });
});
