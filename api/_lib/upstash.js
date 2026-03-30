const REQUIRED_ENV = ['RollON_Database_KV_REST_API_URL', 'RollON_Database_KV_REST_API_TOKEN'];

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function runCommand(command, ...args) {
  assertEnv();
  const response = await fetch(process.env.RollON_Database_KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RollON_Database_KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });

  const body = await response.json();

  if (!response.ok || body.error) {
    throw new Error(body.error || `Redis command failed (${response.status})`);
  }

  return body.result;
}

async function runPipeline(commands) {
  assertEnv();

  const response = await fetch(`${process.env.RollON_Database_KV_REST_API_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RollON_Database_KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  const body = await response.json();
  if (!response.ok || body.error) {
    throw new Error(body.error || `Redis pipeline failed (${response.status})`);
  }

  return body;
}

module.exports = {
  runCommand,
  runPipeline,
};
