function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function validateOrderPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Payload is required' };
  }

  if (!payload.customerId || !payload.customerName) {
    return { valid: false, error: 'customerId and customerName are required' };
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return { valid: false, error: 'Order items are required' };
  }

  const hasInvalidItem = payload.items.some((item) => {
    const qty = Number(item.quantity);
    const price = Number(item.price);
    return !item.name || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price < 0;
  });

  if (hasInvalidItem) {
    return { valid: false, error: 'Each order item must include name, quantity > 0, and price >= 0' };
  }

  return { valid: true };
}

module.exports = {
  toPositiveInt,
  validateOrderPayload,
};
