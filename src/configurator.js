import {
  calculateAccentGrid,
  calculateBoardBatten,
  calculatePictureFrame,
  calculateWainscoting,
  fromInches,
  toInches,
} from './calculators.js';

const measurement = (name, label, value, min = 0.1) => ({ name, label, value, min, step: 0.1, measurement: true });
const count = (name, label, value, min = 1, max = 12) => ({ name, label, value, min, max, step: 1 });

export const MODES = {
  'picture-frame': {
    label: 'Picture Frame Molding',
    shortLabel: 'Picture Frame',
    description: 'Balanced rectangular frames with equal margins.',
    collection: 'picture-frame-molding-kits',
    campaign: 'picture-frame-molding-calculator',
    productHandle: 'entryway-accent-picture-frame-molding-set-1-to-5-panels-kits-easy-installation',
    quantityKey: 'frames',
    fields: [
      measurement('wallWidth', 'Wall width', 120),
      measurement('regionHeight', 'Design height', 84),
      count('frames', 'Number of frames', 3, 1, 8),
      measurement('sideMargin', 'Side margin', 6, 0),
      measurement('gap', 'Gap between frames', 4, 0),
      measurement('topMargin', 'Top margin', 6, 0),
      measurement('bottomMargin', 'Bottom margin', 6, 0),
      measurement('stockLength', 'Stock length', 96),
      count('wastePercent', 'Waste allowance (%)', 10, 0, 30),
    ],
    calculate: calculatePictureFrame,
  },
  'board-batten': {
    label: 'Board and Batten',
    shortLabel: 'Board and Batten',
    description: 'Even vertical battens with an optional top rail.',
    collection: 'board-and-batten-kits',
    campaign: 'board-and-batten-calculator',
    productHandle: 'board-and-batten-wall-kit-shaker-grid-1-to-5-sets-self-adhesive-wainscoting',
    quantityKey: 'panelCount',
    fields: [
      measurement('wallWidth', 'Wall width', 120),
      measurement('wallHeight', 'Batten height', 96),
      measurement('battenWidth', 'Batten width', 2),
      measurement('targetGap', 'Target clear gap', 18),
      { name: 'edgeBattens', label: 'Include edge battens', value: true, type: 'checkbox' },
      { name: 'topRail', label: 'Include top rail', value: true, type: 'checkbox' },
      measurement('stockLength', 'Stock length', 96),
      count('wastePercent', 'Waste allowance (%)', 10, 0, 30),
    ],
    calculate: calculateBoardBatten,
  },
  'accent-grid': {
    label: 'Accent Wall Grid',
    shortLabel: 'Accent Grid',
    description: 'A full-height square or rectangular Shaker grid.',
    collection: 'accent-wall-kits',
    campaign: 'accent-wall-calculator',
    productHandle: 'square-grid-board-and-batten-accent-wall-kit-pre-cut-mdf-easy-installation',
    quantityKey: null,
    fields: [
      measurement('wallWidth', 'Wall width', 120),
      measurement('wallHeight', 'Wall height', 96),
      count('columns', 'Columns', 4, 1, 12),
      count('rows', 'Rows', 3, 1, 12),
      measurement('battenWidth', 'Batten width', 2),
      measurement('stockLength', 'Stock length', 96),
      count('wastePercent', 'Waste allowance (%)', 10, 0, 30),
    ],
    calculate: calculateAccentGrid,
  },
  wainscoting: {
    label: 'Wainscoting',
    shortLabel: 'Wainscoting',
    description: 'One-third wall-height frames with a chair rail.',
    collection: 'premium-wainscoting-wall-molding-kits',
    campaign: 'wainscoting-calculator',
    productHandle: 'chair-rail-half-wall-wainscoting-kit-6-cm-rail-self-adhesive-easy-installation',
    quantityKey: 'panels',
    fields: [
      measurement('wallWidth', 'Wall width', 120),
      measurement('ceilingHeight', 'Ceiling height', 96),
      count('panels', 'Number of panels', 4, 1, 8),
      measurement('sideMargin', 'Side margin', 4, 0),
      measurement('gap', 'Gap between panels', 4, 0),
      measurement('frameInset', 'Frame inset', 3, 0),
      measurement('stockLength', 'Stock length', 96),
      count('wastePercent', 'Waste allowance (%)', 10, 0, 30),
    ],
    calculate: calculateWainscoting,
  },
};

export function defaultsFor(mode) {
  const config = MODES[mode];
  if (!config) throw new RangeError(`Unknown design mode: ${mode}`);
  return Object.fromEntries(config.fields.map((field) => [field.name, field.value]));
}

export function calculateDesign(mode, values, unit = 'in') {
  const config = MODES[mode];
  if (!config) throw new RangeError(`Unknown design mode: ${mode}`);
  const input = { ...values };
  for (const field of config.fields) {
    if (field.measurement && field.name in input) input[field.name] = toInches(input[field.name], unit);
  }
  return config.calculate(input);
}

export function convertDisplayValues(mode, values, fromUnit, toUnit) {
  const config = MODES[mode];
  if (!config) throw new RangeError(`Unknown design mode: ${mode}`);
  if (fromUnit === toUnit) return { ...values };
  const converted = { ...values };
  for (const field of config.fields) {
    if (!field.measurement || !(field.name in converted)) continue;
    const inches = toInches(converted[field.name], fromUnit);
    converted[field.name] = Number(fromInches(inches, toUnit).toFixed(2));
  }
  return converted;
}

export function convertValuesByMode(valuesByMode, fromUnit, toUnit) {
  return Object.fromEntries(Object.entries(valuesByMode).map(([mode, values]) => [
    mode,
    convertDisplayValues(mode, values, fromUnit, toUnit),
  ]));
}
