import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBaseboard,
  calculatePaint,
  calculateStairs,
  calculateWallpaper,
  calculateWallArea,
} from '../src/utility-calculators.js';

test('stair calculator rounds risers up so the actual riser does not exceed the preferred height', () => {
  const result = calculateStairs({ totalRise: 108, preferredRiser: 7.5, treadDepth: 10.5, landingCount: 0 });
  assert.equal(result.riserCount, 15);
  assert.equal(result.treadCount, 14);
  assert.equal(result.actualRiser, 7.2);
  assert.equal(result.totalRun, 147);
});

test('paint calculator subtracts openings, applies coats and recommends whole gallons', () => {
  const result = calculatePaint({ roomLength: 144, roomWidth: 168, wallHeight: 96, doors: 1, windows: 2, coats: 2, coverageSqFt: 350 });
  assert.equal(result.grossWallArea, 416);
  assert.equal(result.paintableArea, 365);
  assert.equal(result.coatedArea, 730);
  assert.equal(result.purchaseGallons, 3);
});

test('wall area calculator reports gross and net square footage', () => {
  const result = calculateWallArea({ totalWallWidth: 480, wallHeight: 96, openingAreaSqFt: 36, wastePercent: 10 });
  assert.equal(result.grossArea, 320);
  assert.equal(result.netArea, 284);
  assert.equal(result.wasteArea, 312.4);
});

test('wallpaper calculator accounts for pattern repeat and roll length', () => {
  const result = calculateWallpaper({ wallWidth: 144, wallHeight: 96, rollWidth: 20.5, rollLength: 396, patternRepeat: 21, openingAreaSqFt: 0, wastePercent: 10 });
  assert.equal(result.strips, 8);
  assert.equal(result.matchedStripLength, 105);
  assert.equal(result.rolls, 3);
});

test('baseboard calculator removes door openings and adds waste', () => {
  const result = calculateBaseboard({ roomLength: 144, roomWidth: 168, doorCount: 2, doorWidth: 36, stockLength: 96, wastePercent: 10 });
  assert.equal(result.netPerimeter, 552);
  assert.equal(result.materialLength, 607.2);
  assert.equal(result.stockPieces, 7);
});
