const CM_PER_INCH = 2.54;
const SQ_IN_PER_SQ_FT = 144;
const LITERS_PER_GALLON = 3.785411784;

const round = (value, digits = 3) => Number(value.toFixed(digits));

function positive(name, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return number;
}

function nonNegative(name, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new RangeError(`${name} cannot be negative.`);
  return number;
}

function whole(name, value, minimum = 0) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum) throw new RangeError(`${name} must be a whole number of at least ${minimum}.`);
  return number;
}

export function toInches(value, unit = 'in') {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError('Measurement must be a number.');
  return unit === 'cm' ? number / CM_PER_INCH : number;
}

export function fromInches(value, unit = 'in') {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError('Measurement must be a number.');
  return unit === 'cm' ? number * CM_PER_INCH : number;
}

export function calculateStairs(input) {
  const totalRise = positive('Floor-to-floor rise', input.totalRise);
  const preferredRiser = positive('Preferred riser height', input.preferredRiser);
  const treadDepth = positive('Tread depth', input.treadDepth);
  const landingCount = whole('Landing count', input.landingCount || 0);
  const landingDepth = landingCount ? positive('Landing depth', input.landingDepth || treadDepth) : 0;
  const riserCount = Math.max(2, Math.ceil(totalRise / preferredRiser));
  const treadCount = riserCount - 1;
  const actualRiser = totalRise / riserCount;
  const treadRun = treadCount * treadDepth;
  const totalRun = treadRun + landingCount * landingDepth;
  const slopedRun = Math.hypot(totalRise, treadRun);
  return {
    type: 'stair',
    totalRise: round(totalRise),
    riserCount,
    treadCount,
    actualRiser: round(actualRiser),
    treadDepth: round(treadDepth),
    totalRun: round(totalRun),
    slopedRun: round(slopedRun),
    landingCount,
  };
}

export function calculatePaint(input) {
  const roomLength = positive('Room length', input.roomLength);
  const roomWidth = positive('Room width', input.roomWidth);
  const wallHeight = positive('Wall height', input.wallHeight);
  const coats = whole('Coat count', input.coats, 1);
  const doors = whole('Door count', input.doors || 0);
  const windows = whole('Window count', input.windows || 0);
  const coverage = positive('Coverage per gallon', input.coverageSqFt || 350);
  const doorArea = nonNegative('Door area', input.doorAreaSqFt ?? 21);
  const windowArea = nonNegative('Window area', input.windowAreaSqFt ?? 15);
  const grossWallArea = (2 * (roomLength + roomWidth) * wallHeight) / SQ_IN_PER_SQ_FT;
  const openingArea = doors * doorArea + windows * windowArea;
  const ceilingArea = input.includeCeiling ? (roomLength * roomWidth) / SQ_IN_PER_SQ_FT : 0;
  const paintableArea = Math.max(0, grossWallArea - openingArea + ceilingArea);
  const coatedArea = paintableArea * coats;
  const gallons = coatedArea / coverage;
  return {
    type: 'paint',
    grossWallArea: round(grossWallArea),
    openingArea: round(openingArea),
    ceilingArea: round(ceilingArea),
    paintableArea: round(paintableArea),
    coatedArea: round(coatedArea),
    gallons: round(gallons, 2),
    liters: round(gallons * LITERS_PER_GALLON, 2),
    purchaseGallons: Math.ceil(gallons),
    coats,
  };
}

export function calculateWallArea(input) {
  const totalWallWidth = positive('Combined wall width', input.totalWallWidth);
  const wallHeight = positive('Wall height', input.wallHeight);
  const openingArea = nonNegative('Doors and windows area', input.openingAreaSqFt || 0);
  const grossArea = (totalWallWidth * wallHeight) / SQ_IN_PER_SQ_FT;
  const netArea = Math.max(0, grossArea - openingArea);
  return {
    type: 'wall-area',
    grossArea: round(grossArea),
    openingArea: round(openingArea),
    netArea: round(netArea),
    wasteArea: round(netArea * (1 + nonNegative('Waste allowance', input.wastePercent || 0) / 100)),
  };
}

export function calculateWallpaper(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const wallHeight = positive('Wall height', input.wallHeight);
  const rollWidth = positive('Roll width', input.rollWidth);
  const rollLength = positive('Roll length', input.rollLength);
  const patternRepeat = nonNegative('Pattern repeat', input.patternRepeat || 0);
  const wastePercent = nonNegative('Waste allowance', input.wastePercent || 0);
  const openingArea = nonNegative('Doors and windows area', input.openingAreaSqFt || 0);
  const strips = Math.ceil(wallWidth / rollWidth);
  const matchedStripLength = patternRepeat > 0 ? Math.ceil(wallHeight / patternRepeat) * patternRepeat : wallHeight;
  const grossLength = strips * matchedStripLength;
  const grossAreaSqIn = wallWidth * wallHeight;
  const openingAreaSqIn = openingArea * SQ_IN_PER_SQ_FT;
  const openingRatio = Math.min(0.35, openingAreaSqIn / grossAreaSqIn);
  const adjustedLength = grossLength * (1 - openingRatio * 0.5) * (1 + wastePercent / 100);
  const rolls = Math.ceil(adjustedLength / rollLength);
  return {
    type: 'wallpaper',
    strips,
    matchedStripLength: round(matchedStripLength),
    totalMaterialLength: round(adjustedLength),
    rolls,
    wallArea: round((grossAreaSqIn - openingAreaSqIn) / SQ_IN_PER_SQ_FT),
    patternRepeat: round(patternRepeat),
  };
}

export function calculateBaseboard(input) {
  const roomLength = positive('Room length', input.roomLength);
  const roomWidth = positive('Room width', input.roomWidth);
  const doorCount = whole('Door count', input.doorCount || 0);
  const doorWidth = nonNegative('Average door width', input.doorWidth || 0);
  const stockLength = positive('Stock length', input.stockLength);
  const wastePercent = nonNegative('Waste allowance', input.wastePercent || 0);
  const netPerimeter = Math.max(0, 2 * (roomLength + roomWidth) - doorCount * doorWidth);
  const materialLength = netPerimeter * (1 + wastePercent / 100);
  return {
    type: 'baseboard',
    netPerimeter: round(netPerimeter),
    materialLength: round(materialLength),
    stockPieces: Math.ceil(materialLength / stockLength),
    insideCorners: 4,
    doorwayReturns: doorCount * 2,
  };
}

