const { randomUUID } = require('node:crypto');

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

function getRequestId(req) {
  const inboundId = req?.headers?.['x-request-id'] || req?.headers?.['X-Request-Id'];
  return typeof inboundId === 'string' && inboundId.trim() ? inboundId : randomUUID();
}

function withErrorHandling(handler) {
  return async (req, res) => {
    const requestId = getRequestId(req);

    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(res, error.statusCode, { error: error.message, requestId });
        return;
      }

      console.error('[api:error]', {
        requestId,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

      sendJson(res, 500, {
        error: 'Internal server error',
        requestId,
      });
    }
  };
}

module.exports = {
  HttpError,
  sendJson,
  withErrorHandling,
};
