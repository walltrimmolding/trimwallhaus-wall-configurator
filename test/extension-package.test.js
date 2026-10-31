import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const extensionFiles = [
  'extension/index.html',
  'extension/utility.html',
  'extension/utility.css',
  'extension/src/utility-app.js',
  'extension/src/utility-calculators.js',
];

test('extension package includes all calculator entry points', async () => {
  for (const file of extensionFiles) {
    const stat = await fs.stat(file);
    assert.ok(stat.size > 0, `${file} should not be empty`);
  }

  const manifest = JSON.parse(await fs.readFile('extension/manifest.json', 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, '1.2.0');

  const wallApp = await fs.readFile('extension/index.html', 'utf8');
  assert.match(wallApp, /href="\.\/utility\.html"/);

  const utilityApp = await fs.readFile('extension/utility.html', 'utf8');
  assert.match(utilityApp, /src="\.\/src\/utility-app\.js"/);
  assert.match(utilityApp, /href="\.\/index\.html"/);
});
