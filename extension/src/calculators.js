const CM_PER_INCH = 2.54;

const round = (value, digits = 3) => Number(value.toFixed(digits));

function positive(name, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${name} must be greater than zero.`);
  }
  return number;
}

function whole(name, value, minimum = 1) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum) {
    throw new RangeError(`${name} must be a whole number of at least ${minimum}.`);
  }
  return number;
}

function material(rawLength, wastePercent, stockLength) {
  const waste = Math.max(0, Number(wastePercent) || 0);
  const stock = positive('Stock length', stockLength);
  const materialLength = rawLength * (1 + waste / 100);
  return {
    rawLength: round(rawLength),
    materialLength: round(materialLength),
    stockPieces: Math.ceil(materialLength / stock),
  };
}

export function toInches(value, unit = 'in') {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError('Measurement must be a number.');
  return unit === 'cm' ? round(number / CM_PER_INCH, 6) : number;
}

export function fromInches(value, unit = 'in') {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError('Measurement must be a number.');
  return unit === 'cm' ? round(number * CM_PER_INCH, 6) : number;
}

export function calculateBoardBatten(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const wallHeight = positive('Wall height', input.wallHeight);
  const battenWidth = positive('Batten width', input.battenWidth);
  const targetGap = positive('Target gap', input.targetGap);
  const edgeBattens = input.edgeBattens !== false;
  let battenCount = Math.round((wallWidth - battenWidth) / (targetGap + battenWidth)) + 1;
  battenCount = Math.max(edgeBattens ? 2 : 1, battenCount);
  const panelCount = edgeBattens ? battenCount - 1 : battenCount + 1;
  const divisor = edgeBattens ? battenCount - 1 : battenCount + 1;
  const gap = (wallWidth - battenCount * battenWidth) / divisor;
  if (gap <= 0) throw new RangeError('The requested board and batten layout does not fit this wall.');
  const verticalLength = battenCount * wallHeight;
  const railLength = input.topRail === false ? 0 : wallWidth;
  return {
    type: 'board-batten',
    wallWidth,
    wallHeight,
    battenWidth,
    battenCount,
    panelCount,
    gap: round(gap),
    cuts: [
      { label: 'Vertical battens', quantity: battenCount, length: wallHeight },
      ...(railLength ? [{ label: 'Top rail', quantity: 1, length: wallWidth }] : []),
    ],
    ...material(verticalLength + railLength, input.wastePercent, input.stockLength),
  };
}

export function calculatePictureFrame(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const regionHeight = positive('Design height', input.regionHeight);
  const frames = whole('Frame count', input.frames);
  const sideMargin = Math.max(0, Number(input.sideMargin) || 0);
  const gap = Math.max(0, Number(input.gap) || 0);
  const topMargin = Math.max(0, Number(input.topMargin) || 0);
  const bottomMargin = Math.max(0, Number(input.bottomMargin) || 0);
  const frameWidth = (wallWidth - 2 * sideMargin - (frames - 1) * gap) / frames;
  const frameHeight = regionHeight - topMargin - bottomMargin;
  if (frameWidth <= 0 || frameHeight <= 0) throw new RangeError('The requested picture frame layout does not fit this wall.');
  const rawLength = frames * 2 * (frameWidth + frameHeight);
  return {
    type: 'picture-frame',
    wallWidth,
    wallHeight: regionHeight,
    frames,
    frameWidth: round(frameWidth),
    frameHeight: round(frameHeight),
    sideMargin,
    gap,
    topMargin,
    bottomMargin,
    mitreCuts: frames * 4,
    cuts: [
      { label: 'Horizontal frame pieces', quantity: frames * 2, length: round(frameWidth) },
      { label: 'Vertical frame pieces', quantity: frames * 2, length: round(frameHeight) },
    ],
    ...material(rawLength, input.wastePercent, input.stockLength),
  };
}

export function calculateFrenchStepCorner(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const regionHeight = positive('Design height', input.regionHeight);
  const panels = whole('Panel count', input.panels);
  const sideMargin = Math.max(0, Number(input.sideMargin) || 0);
  const gap = Math.max(0, Number(input.gap) || 0);
  const topMargin = Math.max(0, Number(input.topMargin) || 0);
  const bottomMargin = Math.max(0, Number(input.bottomMargin) || 0);
  const stepSize = positive('L-corner step', input.stepSize);
  const outerWidth = (wallWidth - 2 * sideMargin - (panels - 1) * gap) / panels;
  const outerHeight = regionHeight - topMargin - bottomMargin;
  const innerWidth = outerWidth - 2 * stepSize;
  const innerHeight = outerHeight - 2 * stepSize;
  if (outerWidth <= 0 || outerHeight <= 0 || innerWidth <= 0 || innerHeight <= 0) {
    throw new RangeError('The requested French step-corner layout does not fit this wall.');
  }
  const outerPerimeter = 2 * (outerWidth + outerHeight);
  const innerPerimeter = 2 * (innerWidth + innerHeight);
  const returnLength = 8 * stepSize;
  const rawLength = panels * (outerPerimeter + innerPerimeter + returnLength);
  return {
    type: 'french-step-corner',
    wallWidth,
    wallHeight: regionHeight,
    panels,
    outerWidth: round(outerWidth),
    outerHeight: round(outerHeight),
    innerWidth: round(innerWidth),
    innerHeight: round(innerHeight),
    sideMargin,
    gap,
    topMargin,
    bottomMargin,
    stepSize: round(stepSize),
    cornerModules: panels * 4,
    mitreCuts: panels * 8,
    cuts: [
      { label: 'Outer horizontal pieces', quantity: panels * 2, length: round(outerWidth) },
      { label: 'Outer vertical pieces', quantity: panels * 2, length: round(outerHeight) },
      { label: 'Inner horizontal pieces', quantity: panels * 2, length: round(innerWidth) },
      { label: 'Inner vertical pieces', quantity: panels * 2, length: round(innerHeight) },
      { label: 'French L-corner legs', quantity: panels * 8, length: round(stepSize) },
    ],
    ...material(rawLength, input.wastePercent, input.stockLength),
  };
}

export function calculateAccentGrid(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const wallHeight = positive('Wall height', input.wallHeight);
  const columns = whole('Columns', input.columns);
  const rows = whole('Rows', input.rows);
  const battenWidth = positive('Batten width', input.battenWidth);
  const cellWidth = (wallWidth - (columns + 1) * battenWidth) / columns;
  const cellHeight = (wallHeight - (rows + 1) * battenWidth) / rows;
  if (cellWidth <= 0 || cellHeight <= 0) throw new RangeError('The requested accent wall grid does not fit this wall.');
  const verticals = columns + 1;
  const horizontals = rows + 1;
  const rawLength = verticals * wallHeight + horizontals * wallWidth;
  return {
    type: 'accent-grid',
    wallWidth,
    wallHeight,
    battenWidth,
    columns,
    rows,
    cellWidth: round(cellWidth),
    cellHeight: round(cellHeight),
    cuts: [
      { label: 'Vertical grid pieces', quantity: verticals, length: wallHeight },
      { label: 'Horizontal grid pieces', quantity: horizontals, length: wallWidth },
    ],
    ...material(rawLength, input.wastePercent, input.stockLength),
  };
}

export function calculateWainscoting(input) {
  const wallWidth = positive('Wall width', input.wallWidth);
  const ceilingHeight = positive('Ceiling height', input.ceilingHeight);
  const panels = whole('Panel count', input.panels);
  const sideMargin = Math.max(0, Number(input.sideMargin) || 0);
  const gap = Math.max(0, Number(input.gap) || 0);
  const inset = Math.max(0, Number(input.frameInset) || 0);
  const recommendedHeight = round(ceilingHeight / 3);
  const panelWidth = (wallWidth - 2 * sideMargin - (panels - 1) * gap) / panels;
  const frameWidth = panelWidth - 2 * inset;
  const frameHeight = recommendedHeight - 2 * inset;
  if (frameWidth <= 0 || frameHeight <= 0) throw new RangeError('The requested wainscoting layout does not fit this wall.');
  const frameLength = panels * 2 * (frameWidth + frameHeight);
  const rawLength = wallWidth + frameLength;
  return {
    type: 'wainscoting',
    wallWidth,
    wallHeight: ceilingHeight,
    ceilingHeight,
    panels,
    recommendedHeight,
    panelWidth: round(panelWidth),
    frameWidth: round(frameWidth),
    frameHeight: round(frameHeight),
    sideMargin,
    gap,
    frameInset: inset,
    cuts: [
      { label: 'Chair rail', quantity: 1, length: wallWidth },
      { label: 'Horizontal frame pieces', quantity: panels * 2, length: round(frameWidth) },
      { label: 'Vertical frame pieces', quantity: panels * 2, length: round(frameHeight) },
    ],
    ...material(rawLength, input.wastePercent, input.stockLength),
  };
}
