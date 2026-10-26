const formattedValue = (value, unit) => {
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  return typeof value === 'number' ? `${value} ${unit}` : String(value);
};

export function buildLeadMessage({ modeLabel, unit, measurements, result, note, pageUrl }) {
  const measurementLines = Object.entries(measurements || {})
    .map(([key, value]) => `- ${key}: ${formattedValue(value, unit)}`)
    .join('\n');
  const resultLines = Object.entries(result || {})
    .filter(([key, value]) => ['materialLength', 'stockPieces', 'frameWidth', 'frameHeight', 'gap', 'panelWidth', 'cellWidth', 'cellHeight'].includes(key) && typeof value !== 'object')
    .map(([key, value]) => `- ${key}: ${value}${key === 'materialLength' ? ' in' : ''}`)
    .join('\n');

  return [
    'FREE ARCHITECTURAL DRAWING REQUEST',
    `Design: ${modeLabel}`,
    `Display unit: ${unit}`,
    '',
    'Measurements:',
    measurementLines,
    '',
    'Calculator result:',
    resultLines,
    '',
    'Customer note:',
    note || 'No additional note.',
    '',
    `Calculator page: ${pageUrl}`,
  ].join('\n');
}
