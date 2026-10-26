import { fromInches } from './calculators.js';

const f = (value) => Number(value).toFixed(3).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '');

function svgShell(result, body) {
  const width = Number(result.wallWidth);
  const height = Number(result.wallHeight);
  return `<svg viewBox="0 0 ${f(width)} ${f(height)}" role="img" aria-label="${result.type} wall layout" xmlns="http://www.w3.org/2000/svg">
    <rect class="svg-wall" x="0" y="0" width="${f(width)}" height="${f(height)}" rx="1" />
    ${body}
  </svg>`;
}

function boardBatten(result) {
  const pieces = [];
  const step = result.gap + result.battenWidth;
  for (let index = 0; index < result.battenCount; index += 1) {
    const x = index * step;
    pieces.push(`<rect data-piece="batten" class="svg-trim" x="${f(Math.min(x, result.wallWidth - result.battenWidth))}" y="0" width="${f(result.battenWidth)}" height="${f(result.wallHeight)}" />`);
  }
  if (result.cuts?.some((cut) => cut.label === 'Top rail')) {
    pieces.push(`<rect data-piece="rail" class="svg-trim" x="0" y="0" width="${f(result.wallWidth)}" height="${f(result.battenWidth)}" />`);
  }
  return svgShell(result, pieces.join('\n'));
}

function pictureFrame(result) {
  const frames = [];
  for (let index = 0; index < result.frames; index += 1) {
    const x = result.sideMargin + index * (result.frameWidth + result.gap);
    frames.push(`<rect data-piece="frame" class="svg-frame" x="${f(x)}" y="${f(result.topMargin)}" width="${f(result.frameWidth)}" height="${f(result.frameHeight)}" rx="0.8" />`);
  }
  return svgShell(result, frames.join('\n'));
}

function accentGrid(result) {
  const pieces = [];
  const xStep = (result.wallWidth - result.battenWidth) / result.columns;
  const yStep = (result.wallHeight - result.battenWidth) / result.rows;
  for (let index = 0; index <= result.columns; index += 1) {
    const x = Math.min(index * xStep, result.wallWidth - result.battenWidth);
    pieces.push(`<rect data-piece="grid-line" class="svg-trim" x="${f(x)}" y="0" width="${f(result.battenWidth)}" height="${f(result.wallHeight)}" />`);
  }
  for (let index = 0; index <= result.rows; index += 1) {
    const y = Math.min(index * yStep, result.wallHeight - result.battenWidth);
    pieces.push(`<rect data-piece="grid-line" class="svg-trim" x="0" y="${f(y)}" width="${f(result.wallWidth)}" height="${f(result.battenWidth)}" />`);
  }
  return svgShell(result, pieces.join('\n'));
}

function wainscoting(result) {
  const scaleY = result.recommendedHeight / result.wallHeight;
  const railY = result.wallHeight - result.recommendedHeight;
  const panelWidth = (result.wallWidth - 2 * result.sideMargin - (result.panels - 1) * result.gap) / result.panels;
  const frames = [`<rect class="svg-wainscot-fill" x="0" y="${f(railY)}" width="${f(result.wallWidth)}" height="${f(result.wallHeight * scaleY)}" />`];
  for (let index = 0; index < result.panels; index += 1) {
    const x = result.sideMargin + index * (panelWidth + result.gap) + result.frameInset;
    const y = railY + result.frameInset;
    frames.push(`<rect data-piece="wainscot-frame" class="svg-frame" x="${f(x)}" y="${f(y)}" width="${f(result.frameWidth)}" height="${f(result.frameHeight)}" rx="0.8" />`);
  }
  frames.push(`<rect data-piece="chair-rail" class="svg-trim" x="0" y="${f(railY)}" width="${f(result.wallWidth)}" height="${f(Math.max(1.5, result.wallHeight * 0.018))}" />`);
  return svgShell(result, frames.join('\n'));
}

export function renderWallSvg(result) {
  if (!result || !result.type) throw new TypeError('A calculation result is required.');
  if (result.type === 'board-batten') return boardBatten(result);
  if (result.type === 'picture-frame') return pictureFrame(result);
  if (result.type === 'accent-grid') return accentGrid(result);
  if (result.type === 'wainscoting') return wainscoting(result);
  throw new RangeError(`Unsupported design type: ${result.type}`);
}

export function formatCutList(cuts, unit = 'in') {
  return cuts.map((cut) => ({
    label: cut.label,
    quantity: cut.quantity,
    length: `${fromInches(cut.length, unit).toFixed(1)} ${unit}`,
  }));
}
