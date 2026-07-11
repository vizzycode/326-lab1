import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let server;
let output = '';

test.before(async () => {
  server = spawn(process.execPath, ['server.js'], {
    cwd: new URL('.', import.meta.url),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (chunk) => {
    output += chunk;
  });

  server.stderr.on('data', (chunk) => {
    output += chunk;
  });

  const deadline = Date.now() + 5000;
  while (!output.includes(`Server running at http://localhost:${PORT}`)) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited before startup:\n${output}`);
    }

    if (Date.now() > deadline) {
      throw new Error(`Server did not start in time:\n${output}`);
    }

    await delay(50);
  }
});

test.after(async () => {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await once(server, 'exit');
  }
});

test('GET / responds with the greeting', async () => {
  const response = await fetch(`${BASE_URL}/`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(await response.text(), 'Hello, web!');
});

test('GET /hello responds with a course sentence', async () => {
  const response = await fetch(`${BASE_URL}/hello`);

  assert.equal(response.status, 200);
  assert.equal(
    await response.text(),
    'I am learning how Express routes turn browser requests into web server responses.',
  );
});

test('GET /hello/:name responds with a personalized greeting', async () => {
  const response = await fetch(`${BASE_URL}/hello/Alice`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Hello, Alice!');
});

test('GET /about responds with the course description', async () => {
  const response = await fetch(`${BASE_URL}/about`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'This is a web programming course.');
});

test('GET /repeat/:word repeats the URL parameter three times', async () => {
  const response = await fetch(`${BASE_URL}/repeat/web`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'web web web');
});

test('GET /count uses fallback query values', async () => {
  const response = await fetch(`${BASE_URL}/count`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Counting from 1 to 10.');
});

test('GET /count reads from and to query parameters', async () => {
  const response = await fetch(`${BASE_URL}/count?from=3&to=7`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Counting from 3 to 7.');
});

test('GET /api/info responds with JSON application information', async () => {
  const response = await fetch(`${BASE_URL}/api/info`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal(body.version, '1.0');
  assert.equal(body.status, 'ok');
});

test('GET /api/error responds with a 400 status code', async () => {
  const response = await fetch(`${BASE_URL}/api/error`);

  assert.equal(response.status, 400);
  assert.equal(await response.text(), 'Bad request.');
});

test('GET /api/status responds with JSON status and process uptime', async () => {
  const response = await fetch(`${BASE_URL}/api/status`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.equal(body.status, 'ok');
  assert.equal(typeof body.uptime, 'number');
  assert.ok(body.uptime >= 0);
});

test('GET /status returns 404 after status moves under /api', async () => {
  const response = await fetch(`${BASE_URL}/status`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'Page not found.');
});

test('unknown routes return a custom 404 response', async () => {
  const response = await fetch(`${BASE_URL}/doesnotexist`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'Page not found.');
});
