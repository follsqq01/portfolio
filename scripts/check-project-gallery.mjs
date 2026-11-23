import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base = 'http://localhost:3000';
const endpoint = '/api/projects/penta-q/gallery';
const password = readFileSync('.dev.vars', 'utf8').match(/^ADMIN_PASSWORD=(.+)$/m)?.[1];
assert(password, 'Author password is configured');
let cookie = '';
async function request(path, method = 'GET', body, author = false, origin = base) {
  const response = await fetch(base + path, { method, headers: {
    Origin: origin, ...(author ? { Cookie: cookie } : {}),
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
  }, body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: text }; }
  return { response, data };
}
const { data: initial } = await request(endpoint);
assert(Array.isArray(initial.items));
assert.equal((await request(endpoint, 'PUT', { ids: [], revision: initial.revision })).response.status, 401);
assert.equal((await request(endpoint, 'POST', new FormData())).response.status, 401);
const signedIn = await request('/api/archive/session', 'POST', { password });
assert.equal(signedIn.response.status, 200);
cookie = signedIn.response.headers.get('set-cookie').split(';')[0];
assert.equal((await request(endpoint, 'PUT', {}, true, 'https://other.example')).response.status, 403);
let latest = initial;
try {
  const invalid = new FormData(); invalid.set('revision', String(latest.revision)); invalid.set('file', new Blob(['not an image'], { type: 'image/png' }), 'invalid.png');
  assert.equal((await request(endpoint, 'POST', invalid, true)).response.status, 400);
  for (let i = 0; i < 2; i++) {
    const form = new FormData(); form.set('revision', String(latest.revision));
    form.set('file', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL9sAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'test.png');
    const uploaded = await request(endpoint, 'POST', form, true);
    assert.equal(uploaded.response.status, 200, JSON.stringify(uploaded.data)); latest = uploaded.data;
    assert.equal((await fetch(base + latest.items.at(-1).src)).status, 200);
  }
  assert.equal((await request(endpoint)).data.items.length, initial.items.length + 2);
  assert.equal((await request(endpoint, 'PUT', { revision: initial.revision, ids: [] }, true)).response.status, 409);
  assert.equal((await request(endpoint, 'PUT', { revision: latest.revision, ids: ['foreign-image'] }, true)).response.status, 400);
  const order = latest.items.map(i => i.id).reverse();
  const changed = await request(endpoint, 'PUT', { revision: latest.revision, ids: order }, true);
  assert.equal(changed.response.status, 200); latest = changed.data;
  assert.deepEqual((await request(endpoint)).data.items.map(i => i.id), order);
} finally {
  latest = (await request(endpoint)).data;
  const restored = await request(endpoint, 'PUT', { revision: latest.revision, ids: initial.items.map(i => i.id) }, true);
  assert.equal(restored.response.status, 200);
  assert.deepEqual(restored.data.items, initial.items);
}
console.log('PASS: author protection, origin protection, invalid file rejection, uploads, public media, persistent reorder, conflict handling and original gallery restoration.');
