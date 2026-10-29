import test from 'node:test';
import assert from 'node:assert/strict';

async function load() {
  try {
    return await import('../src/calculators.js');
  } catch {
    return {};
  }
}

test('converts centimetres and inches without changing physical length', async () => {
  const { toInches, fromInches } = await load();
  assert.equal(toInches?.(254, 'cm'), 100);
  assert.equal(fromInches?.(100, 'cm'), 254);
  assert.equal(toInches?.(100, 'in'), 100);
});

test('calculates equal board and batten spacing with edge battens and a top rail', async () => {
  const { calculateBoardBatten } = await load();
  const result = calculateBoardBatten?.({ wallWidth: 120, wallHeight: 96, battenWidth: 2, targetGap: 18, edgeBattens: true, topRail: true, wastePercent: 10, stockLength: 96 });
  assert.equal(result?.battenCount, 7);
  assert.equal(result?.panelCount, 6);
  assert.equal(result?.gap, 17.667);
  assert.equal(result?.rawLength, 792);
  assert.equal(result?.materialLength, 871.2);
  assert.equal(result?.stockPieces, 10);
});

test('calculates picture frame dimensions and four mitres per frame', async () => {
  const { calculatePictureFrame } = await load();
  const result = calculatePictureFrame?.({ wallWidth: 120, regionHeight: 84, frames: 3, sideMargin: 6, gap: 4, topMargin: 6, bottomMargin: 6, wastePercent: 10, stockLength: 96 });
  assert.equal(result?.frameWidth, 33.333);
  assert.equal(result?.frameHeight, 72);
  assert.equal(result?.mitreCuts, 12);
  assert.equal(result?.rawLength, 632);
  assert.equal(result?.stockPieces, 8);
});

test('calculates French step-corner outer and inner frames with 10 cm L returns', async () => {
  const { calculateFrenchStepCorner } = await load();
  const result = calculateFrenchStepCorner?.({ wallWidth: 120, regionHeight: 84, panels: 3, sideMargin: 6, gap: 4, topMargin: 6, bottomMargin: 6, stepSize: 3.937, wastePercent: 10, stockLength: 96 });
  assert.equal(result?.outerWidth, 33.333);
  assert.equal(result?.outerHeight, 72);
  assert.equal(result?.innerWidth, 25.459);
  assert.equal(result?.innerHeight, 64.126);
  assert.equal(result?.cornerModules, 12);
  assert.equal(result?.cuts?.at(-1)?.label, 'French L-corner legs');
  assert.equal(result?.cuts?.at(-1)?.quantity, 24);
  assert.equal(result?.cuts?.at(-1)?.length, 3.937);
  assert.equal(result?.rawLength, 1264);
  assert.equal(result?.stockPieces, 15);
});

test('calculates accent wall grid cell size and total trim length', async () => {
  const { calculateAccentGrid } = await load();
  const result = calculateAccentGrid?.({ wallWidth: 120, wallHeight: 96, columns: 4, rows: 3, battenWidth: 2, wastePercent: 10, stockLength: 96 });
  assert.equal(result?.cellWidth, 27.5);
  assert.equal(result?.cellHeight, 29.333);
  assert.equal(result?.rawLength, 960);
  assert.equal(result?.stockPieces, 11);
});

test('recommends one-third wall height for wainscoting and calculates frames', async () => {
  const { calculateWainscoting } = await load();
  const result = calculateWainscoting?.({ wallWidth: 120, ceilingHeight: 96, panels: 4, sideMargin: 4, gap: 4, frameInset: 3, wastePercent: 10, stockLength: 96 });
  assert.equal(result?.recommendedHeight, 32);
  assert.equal(result?.panelWidth, 25);
  assert.equal(result?.frameWidth, 19);
  assert.equal(result?.frameHeight, 26);
  assert.equal(result?.stockPieces, 6);
});

test('rejects layouts that cannot fit the requested wall', async () => {
  const { calculateAccentGrid } = await load();
  assert.throws(
    () => calculateAccentGrid?.({ wallWidth: 20, wallHeight: 20, columns: 10, rows: 10, battenWidth: 3, wastePercent: 10, stockLength: 96 }),
    /does not fit/i,
  );
});
