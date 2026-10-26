import test from 'node:test';
import assert from 'node:assert/strict';

async function load() {
  try {
    return await import('../src/leads.js');
  } catch {
    return {};
  }
}

test('builds a Shopify contact message with design, measurements, result and customer note', async () => {
  const { buildLeadMessage } = await load();
  const message = buildLeadMessage?.({
    modeLabel: 'Board and Batten',
    unit: 'in',
    measurements: { wallWidth: 120, wallHeight: 96, topRail: true },
    result: { materialLength: 871.2, stockPieces: 10 },
    note: 'There is one outlet on the right.',
    pageUrl: 'https://example.test/?design=board-batten',
  });
  assert.match(message || '', /Board and Batten/);
  assert.match(message || '', /wallWidth: 120 in/);
  assert.match(message || '', /topRail: yes/);
  assert.match(message || '', /stockPieces: 10/);
  assert.match(message || '', /one outlet on the right/);
  assert.match(message || '', /example\.test/);
});
