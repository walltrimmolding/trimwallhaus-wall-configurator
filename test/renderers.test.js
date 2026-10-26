import test from 'node:test';
import assert from 'node:assert/strict';

async function load() {
  try {
    return await import('../src/renderers.js');
  } catch {
    return {};
  }
}

test('renders board and batten SVG with one element per vertical batten', async () => {
  const { renderWallSvg } = await load();
  const svg = renderWallSvg?.({ type: 'board-batten', wallWidth: 120, wallHeight: 96, battenWidth: 2, battenCount: 7, gap: 17.667, cuts: [] });
  assert.equal((svg?.match(/data-piece="batten"/g) || []).length, 7);
  assert.match(svg || '', /<svg/);
  assert.doesNotMatch(svg || '', /NaN/);
});

test('renders one rectangle per picture frame', async () => {
  const { renderWallSvg } = await load();
  const svg = renderWallSvg?.({ type: 'picture-frame', wallWidth: 120, wallHeight: 84, frames: 3, frameWidth: 33.333, frameHeight: 72, sideMargin: 6, gap: 4, topMargin: 6, cuts: [] });
  assert.equal((svg?.match(/data-piece="frame"/g) || []).length, 3);
});

test('renders accent grid and wainscoting without invalid coordinates', async () => {
  const { renderWallSvg } = await load();
  const grid = renderWallSvg?.({ type: 'accent-grid', wallWidth: 120, wallHeight: 96, battenWidth: 2, columns: 4, rows: 3, cuts: [] });
  const wainscot = renderWallSvg?.({ type: 'wainscoting', wallWidth: 120, wallHeight: 96, panels: 4, recommendedHeight: 32, frameWidth: 19, frameHeight: 26, sideMargin: 4, gap: 4, frameInset: 3, cuts: [] });
  assert.equal((grid?.match(/data-piece="grid-line"/g) || []).length, 9);
  assert.equal((wainscot?.match(/data-piece="wainscot-frame"/g) || []).length, 4);
  assert.doesNotMatch(`${grid}${wainscot}`, /NaN|undefined/);
});

test('paints wainscoting background before the visible frames', async () => {
  const { renderWallSvg } = await load();
  const svg = renderWallSvg?.({ type: 'wainscoting', wallWidth: 120, wallHeight: 96, panels: 4, recommendedHeight: 32, frameWidth: 19, frameHeight: 26, sideMargin: 4, gap: 4, frameInset: 3, cuts: [] });
  assert.ok(svg.indexOf('svg-wainscot-fill') < svg.indexOf('data-piece="wainscot-frame"'));
});

test('formats cut list in the selected unit', async () => {
  const { formatCutList } = await load();
  const rows = formatCutList?.([{ label: 'Vertical battens', quantity: 7, length: 96 }], 'cm');
  assert.deepEqual(rows, [{ label: 'Vertical battens', quantity: 7, length: '243.8 cm' }]);
});
