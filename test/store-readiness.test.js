import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('extension manifest includes required branded icon sizes and focused metadata', async () => {
  const manifest = JSON.parse(await readFile(new URL('extension/manifest.json', root), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.match(manifest.name, /wall molding calculator/i);
  assert.ok(manifest.description.length <= 132);
  assert.deepEqual(Object.keys(manifest.icons || {}).sort(), ['128', '16', '32', '48']);
  assert.deepEqual(manifest.action?.default_icon, manifest.icons);
});

test('calculator presents exactly eleven contextual product collection links', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const section = html.match(/<section[^>]+id="collection-links"[\s\S]*?<\/section>/i)?.[0] || '';
  const links = [...section.matchAll(/href="https:\/\/trimwallhaus\.com\/collections\/([^"]+)"/g)].map((match) => match[1]);
  assert.equal(links.length, 11);
  assert.equal(new Set(links).size, 11);
});

test('privacy page explains local storage, live pricing and voluntary form submission', async () => {
  const html = await readFile(new URL('privacy.html', root), 'utf8');
  assert.match(html, /stored locally/i);
  assert.match(html, /live product pricing/i);
  assert.match(html, /only when you submit/i);
  assert.match(html, /contact/i);
});
