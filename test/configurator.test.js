import test from 'node:test';
import assert from 'node:assert/strict';

async function load() {
  try {
    return await import('../src/configurator.js');
  } catch {
    return {};
  }
}

test('exposes French step-corner as a dedicated fifth wall design mode', async () => {
  const { MODES } = await load();
  assert.deepEqual(Object.keys(MODES || {}), ['picture-frame', 'french-step-corner', 'board-batten', 'accent-grid', 'wainscoting']);
});

test('routes French step-corner centimetre measurements through its calculator', async () => {
  const { calculateDesign } = await load();
  const result = calculateDesign?.('french-step-corner', {
    wallWidth: 304.8,
    regionHeight: 213.36,
    panels: 3,
    sideMargin: 15.24,
    gap: 10.16,
    topMargin: 15.24,
    bottomMargin: 15.24,
    stepSize: 10,
    wastePercent: 10,
    stockLength: 243.84,
  }, 'cm');
  assert.equal(result?.type, 'french-step-corner');
  assert.equal(result?.panels, 3);
  assert.equal(result?.stepSize, 3.937);
});

test('routes board and batten values through unit conversion and its calculator', async () => {
  const { calculateDesign } = await load();
  const result = calculateDesign?.('board-batten', {
    wallWidth: 304.8,
    wallHeight: 243.84,
    battenWidth: 5.08,
    targetGap: 45.72,
    edgeBattens: true,
    topRail: true,
    wastePercent: 10,
    stockLength: 243.84,
  }, 'cm');
  assert.equal(result?.wallWidth, 120);
  assert.equal(result?.wallHeight, 96);
  assert.equal(result?.battenCount, 7);
});

test('rejects unknown design modes instead of rendering a broken panel', async () => {
  const { calculateDesign } = await load();
  assert.throws(() => calculateDesign?.('tv-unit', {}, 'in'), /unknown design/i);
});

test('converts only measurement fields when the display unit changes', async () => {
  const { convertDisplayValues } = await load();
  const converted = convertDisplayValues?.('picture-frame', { wallWidth: 120, frames: 3, gap: 4 }, 'in', 'cm');
  assert.equal(converted?.wallWidth, 304.8);
  assert.equal(converted?.gap, 10.16);
  assert.equal(converted?.frames, 3);
});

test('converts saved measurements for every mode when the global unit changes', async () => {
  const { convertValuesByMode } = await load();
  const converted = convertValuesByMode?.({
    'picture-frame': { wallWidth: 120, frames: 3 },
    wainscoting: { wallWidth: 96, panels: 4 },
  }, 'in', 'cm');
  assert.equal(converted?.['picture-frame'].wallWidth, 304.8);
  assert.equal(converted?.['picture-frame'].frames, 3);
  assert.equal(converted?.wainscoting.wallWidth, 243.84);
  assert.equal(converted?.wainscoting.panels, 4);
});
