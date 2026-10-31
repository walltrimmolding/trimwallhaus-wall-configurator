import {
  calculateBaseboard,
  calculatePaint,
  calculateStairs,
  calculateWallpaper,
  calculateWallArea,
  fromInches,
  toInches,
} from './utility-calculators.js';

const measure = (name, label, value, min = 0.1) => ({ name, label, value, min, step: 0.1, measurement: true });
const number = (name, label, value, min = 0, step = 1, suffix = '') => ({ name, label, value, min, step, suffix });

const TOOLS = {
  stair: {
    label: 'Stair Calculator',
    title: 'Stair Riser and Tread Calculator',
    description: 'Estimate riser count, actual riser height, tread count and total horizontal run from a measured floor-to-floor rise.',
    campaign: 'stair-calculator',
    fields: [measure('totalRise','Floor-to-floor rise',108),measure('preferredRiser','Maximum preferred riser',7.5),measure('treadDepth','Tread depth',10.5),number('landingCount','Landing count',0,0,1),measure('landingDepth','Landing depth',36)],
    calculate: calculateStairs,
  },
  paint: {
    label: 'Paint Calculator',
    title: 'Room Paint Calculator',
    description: 'Estimate paintable wall area and gallons after subtracting typical doors and windows and applying the selected number of coats.',
    campaign: 'paint-calculator',
    fields: [measure('roomLength','Room length',144),measure('roomWidth','Room width',168),measure('wallHeight','Wall height',96),number('doors','Door count',1),number('windows','Window count',2),number('coats','Coats',2,1),number('coverageSqFt','Coverage per gallon',350,1,1,'sq ft'),{name:'includeCeiling',label:'Include the ceiling',value:false,type:'checkbox'}],
    calculate: calculatePaint,
  },
  'wall-area': {
    label: 'Wall Area',
    title: 'Wall Square Footage Calculator',
    description: 'Calculate gross wall square footage, subtract openings and add a selectable material allowance.',
    campaign: 'wall-square-footage-calculator',
    fields: [measure('totalWallWidth','Combined wall width',480),measure('wallHeight','Wall height',96),number('openingAreaSqFt','Doors and windows area',36,0,.1,'sq ft'),number('wastePercent','Material allowance',10,0,1,'%')],
    calculate: calculateWallArea,
  },
  wallpaper: {
    label: 'Wallpaper',
    title: 'Wallpaper Roll Calculator',
    description: 'Estimate strip count and roll quantity using wall size, roll dimensions, pattern repeat and a waste allowance.',
    campaign: 'wallpaper-calculator',
    fields: [measure('wallWidth','Wall width',144),measure('wallHeight','Wall height',96),measure('rollWidth','Roll width',20.5),measure('rollLength','Roll length',396),measure('patternRepeat','Pattern repeat',21,0),number('openingAreaSqFt','Doors and windows area',0,0,.1,'sq ft'),number('wastePercent','Waste allowance',10,0,1,'%')],
    calculate: calculateWallpaper,
  },
  baseboard: {
    label: 'Baseboard',
    title: 'Baseboard and Trim Calculator',
    description: 'Estimate net room perimeter, material length and stock pieces after removing door openings and adding waste.',
    campaign: 'baseboard-calculator',
    fields: [measure('roomLength','Room length',144),measure('roomWidth','Room width',168),number('doorCount','Door count',2),measure('doorWidth','Average door width',36),measure('stockLength','Stock piece length',96),number('wastePercent','Waste allowance',10,0,1,'%')],
    calculate: calculateBaseboard,
  },
};

const params = new URLSearchParams(location.search);
if (params.get('embed') === '1') document.documentElement.dataset.embed = 'true';
let active = TOOLS[params.get('calculator')] ? params.get('calculator') : 'stair';
let unit = params.get('unit') === 'cm' ? 'cm' : 'in';
const values = Object.fromEntries(Object.entries(TOOLS).map(([key, tool]) => [key, Object.fromEntries(tool.fields.map((field) => [field.name, field.value]))]));

for (const [key, value] of params.entries()) {
  if (key in values[active] && key !== 'calculator') values[active][key] = value === 'true' ? true : value === 'false' ? false : Number(value);
}

const title = document.querySelector('#tool-title');
const description = document.querySelector('#tool-description');
const tabs = document.querySelector('#tool-tabs');
const fields = document.querySelector('#utility-fields');
const results = document.querySelector('#utility-results');
const error = document.querySelector('#utility-error');
const note = document.querySelector('#method-note');
const cta = document.querySelector('#collection-cta');

function convert(value, from, to) {
  return Number(fromInches(toInches(value, from), to).toFixed(2));
}

function selectTool(key) {
  capture();
  active = key;
  const next = new URL(location.href);
  next.searchParams.set('calculator', key);
  history.replaceState(null, '', next);
  render();
}

function renderTabs() {
  tabs.replaceChildren(...Object.entries(TOOLS).map(([key, tool]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = tool.label;
    button.setAttribute('aria-pressed', String(key === active));
    button.addEventListener('click', () => selectTool(key));
    return button;
  }));
}

function renderFields() {
  fields.replaceChildren(...TOOLS[active].fields.map((field) => {
    const wrapper = document.createElement('div');
    if (field.type === 'checkbox') {
      wrapper.className = 'check-field';
      wrapper.innerHTML = `<input id="u-${field.name}" name="${field.name}" type="checkbox" ${values[active][field.name] ? 'checked' : ''}><label for="u-${field.name}">${field.label}</label>`;
    } else {
      wrapper.className = 'field';
      wrapper.innerHTML = `<label for="u-${field.name}">${field.label}</label><span class="input-wrap"><input id="u-${field.name}" name="${field.name}" type="number" value="${values[active][field.name]}" min="${field.min}" step="${field.step}"><span>${field.measurement ? unit : field.suffix || ''}</span></span>`;
    }
    wrapper.querySelector('input').addEventListener('input', calculate);
    return wrapper;
  }));
}

function capture() {
  for (const field of TOOLS[active].fields) {
    const input = document.querySelector(`[name="${field.name}"]`);
    if (input) values[active][field.name] = field.type === 'checkbox' ? input.checked : Number(input.value);
  }
  return values[active];
}

function normalizedInput() {
  const input = { ...capture() };
  for (const field of TOOLS[active].fields) if (field.measurement) input[field.name] = toInches(input[field.name], unit);
  return input;
}

const length = (value) => `${fromInches(value, unit).toLocaleString('en-US',{maximumFractionDigits:1})} ${unit}`;
const sq = (value) => `${Number(value).toLocaleString('en-US',{maximumFractionDigits:1})} sq ft`;

function rows(result) {
  if (result.type === 'stair') return [['Risers',result.riserCount],['Actual riser',length(result.actualRiser)],['Treads',result.treadCount],['Total run',length(result.totalRun)],['Sloped stringer run',length(result.slopedRun)]];
  if (result.type === 'paint') return [['Paintable area',sq(result.paintableArea)],['Area with coats',sq(result.coatedArea)],['Calculated paint',`${result.gallons} gal`],['Purchase estimate',`${result.purchaseGallons} gal`],['Metric equivalent',`${result.liters} L`]];
  if (result.type === 'wall-area') return [['Gross wall area',sq(result.grossArea)],['Openings',sq(result.openingArea)],['Net wall area',sq(result.netArea)],['With allowance',sq(result.wasteArea)]];
  if (result.type === 'wallpaper') return [['Required strips',result.strips],['Matched strip length',length(result.matchedStripLength)],['Wall area',sq(result.wallArea)],['Estimated rolls',result.rolls]];
  return [['Net perimeter',length(result.netPerimeter)],['With waste',length(result.materialLength)],['Stock pieces',result.stockPieces],['Doorway returns',result.doorwayReturns]];
}

function method(result) {
  if (result.type === 'stair') return 'Method: risers are rounded up from total rise divided by the preferred maximum riser; total run uses one fewer tread than risers. Landings add horizontal depth. Verify every result against the building code and inspector requirements for the project location.';
  if (result.type === 'paint') return 'Method: wall area equals room perimeter multiplied by height. Typical door and window areas are subtracted, selected coats are applied, then the result is divided by the coverage entered. The paint label is the final authority.';
  if (result.type === 'wall-area') return 'Method: combined wall width multiplied by height gives gross area. Enter the measured square footage of doors and windows to calculate net area, then add the selected allowance for cuts and waste.';
  if (result.type === 'wallpaper') return 'Method: strip count is wall width divided by roll width, rounded up. Each strip is extended to the next full pattern repeat before waste and roll length are applied. Large openings receive a conservative partial credit.';
  return 'Method: room perimeter minus measured door openings gives net trim length. The waste allowance is added before dividing by the selected stock-piece length.';
}

function calculate() {
  try {
    const result = TOOLS[active].calculate(normalizedInput());
    results.innerHTML = rows(result).map(([label,value]) => `<div class="result"><span>${label}</span><strong>${value}</strong></div>`).join('');
    note.textContent = method(result);
    error.hidden = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'calc_complete',calc_type:active});
    requestAnimationFrame(reportHeight);
  } catch (reason) {
    error.textContent = reason.message;
    error.hidden = false;
  }
}

function render() {
  const tool = TOOLS[active];
  title.textContent = tool.title;
  description.textContent = tool.description;
  cta.href = `https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=${tool.campaign}`;
  renderTabs();
  renderFields();
  calculate();
  document.querySelectorAll('[data-unit]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.unit === unit)));
}

function reportHeight() {
  if (window.parent !== window) window.parent.postMessage({type:'twh-calculator-height',height:document.documentElement.scrollHeight}, '*');
}

document.querySelectorAll('[data-unit]').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.unit === unit) return;
  capture();
  const previous = unit;
  unit = button.dataset.unit;
  for (const toolValues of Object.values(values)) {
    const tool = TOOLS[Object.keys(values).find((key) => values[key] === toolValues)];
    for (const field of tool.fields) if (field.measurement) toolValues[field.name] = convert(toolValues[field.name], previous, unit);
  }
  render();
}));
document.querySelector('#print-result').addEventListener('click', () => window.print());
window.addEventListener('resize', reportHeight);
render();

