import { MODES, calculateDesign, convertValuesByMode, defaultsFor } from './configurator.js';
import { formatCutList, renderWallSvg } from './renderers.js';
import { buildShopUrl, createProductLoader, discountForPrice, priceRange } from './pricing.js';
import { fromInches } from './calculators.js';
import { buildLeadMessage } from './leads.js';

const STORAGE_KEY = 'twh-wall-configurator-v2';
const modeGrid = document.querySelector('#mode-grid');
const fieldGrid = document.querySelector('#field-grid');
const formError = document.querySelector('#form-error');
const wallStage = document.querySelector('#wall-stage');
const metrics = document.querySelector('#metrics');
const cutList = document.querySelector('#cut-list');
const materialTotal = document.querySelector('#material-total');
const priceHeading = document.querySelector('#price-heading');
const priceDetail = document.querySelector('#price-detail');
const shopButton = document.querySelector('#shop-button');
const leadPanel = document.querySelector('#lead-panel');
const leadStatus = document.querySelector('#lead-status');
const loadProduct = createProductLoader();

const queryMode = new URLSearchParams(location.search).get('design');
const isEmbedded = new URLSearchParams(location.search).get('embed') === '1';
if (isEmbedded) document.documentElement.dataset.embed = 'true';
const restored = readSaved();
let state = {
  mode: MODES[queryMode] ? queryMode : (restored?.mode && MODES[restored.mode] ? restored.mode : 'picture-frame'),
  unit: restored?.unit === 'cm' ? 'cm' : 'in',
  valuesByMode: restored?.valuesByMode || {},
  result: null,
  price: null,
  product: null,
};

for (const mode of Object.keys(MODES)) {
  if (!state.valuesByMode[mode]) state.valuesByMode[mode] = defaultsFor(mode);
}

function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function track(event, properties = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...properties });
}

function modeCard(mode, config) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mode-card';
  button.dataset.mode = mode;
  button.setAttribute('aria-pressed', String(mode === state.mode));
  button.innerHTML = `<span class="mode-icon" aria-hidden="true"><span></span></span><strong>${config.label}</strong><small>${config.description}</small>`;
  button.addEventListener('click', () => selectMode(mode));
  return button;
}

function renderModes() {
  modeGrid.replaceChildren(...Object.entries(MODES).map(([mode, config]) => modeCard(mode, config)));
}

function selectMode(mode) {
  if (!MODES[mode] || mode === state.mode) return;
  captureValues();
  state.mode = mode;
  history.replaceState(null, '', `${location.pathname}?design=${mode}`);
  document.querySelector('#mode-description').textContent = MODES[mode].description;
  renderModes();
  renderFields();
  calculateAndRender();
  track('model_selected', { calc_type: mode });
}

function fieldElement(field) {
  const wrapper = document.createElement('div');
  wrapper.className = field.type === 'checkbox' ? 'checkbox-field field-wide' : 'field';
  const current = state.valuesByMode[state.mode][field.name];
  if (field.type === 'checkbox') {
    wrapper.innerHTML = `<input id="field-${field.name}" name="${field.name}" type="checkbox" ${current ? 'checked' : ''}><label for="field-${field.name}">${field.label}</label>`;
  } else {
    wrapper.innerHTML = `<label for="field-${field.name}">${field.label}</label><span class="input-wrap"><input id="field-${field.name}" name="${field.name}" type="number" value="${current}" min="${field.min}" ${field.max ? `max="${field.max}"` : ''} step="${field.step}" inputmode="decimal">${field.measurement ? `<span class="input-unit">${state.unit}</span>` : ''}</span>`;
  }
  wrapper.querySelector('input').addEventListener('input', calculateAndRender);
  return wrapper;
}

function renderFields() {
  const config = MODES[state.mode];
  document.querySelector('#mode-description').textContent = config.description;
  fieldGrid.replaceChildren(...config.fields.map(fieldElement));
  document.querySelectorAll('[data-unit]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.unit === state.unit)));
}

function captureValues() {
  const config = MODES[state.mode];
  const values = { ...state.valuesByMode[state.mode] };
  for (const field of config.fields) {
    const input = document.querySelector(`[name="${field.name}"]`);
    if (!input) continue;
    values[field.name] = field.type === 'checkbox' ? input.checked : Number(input.value);
  }
  state.valuesByMode[state.mode] = values;
  return values;
}

function shown(value, digits = 1) {
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function metricItems(result) {
  if (result.type === 'picture-frame') return [
    ['Frame width', result.frameWidth], ['Frame height', result.frameHeight], ['Miter cuts', result.mitreCuts, ''], ['Stock pieces', result.stockPieces, ''],
  ];
  if (result.type === 'french-step-corner') return [
    ['Outer width', result.outerWidth], ['Inner width', result.innerWidth], ['L step', result.stepSize], ['Stock pieces', result.stockPieces, ''],
  ];
  if (result.type === 'board-batten') return [
    ['Clear gap', result.gap], ['Vertical battens', result.battenCount, ''], ['Panels', result.panelCount, ''], ['Stock pieces', result.stockPieces, ''],
  ];
  if (result.type === 'accent-grid') return [
    ['Cell width', result.cellWidth], ['Cell height', result.cellHeight], ['Grid cells', result.columns * result.rows, ''], ['Stock pieces', result.stockPieces, ''],
  ];
  return [
    ['Recommended height', result.recommendedHeight], ['Panel width', result.panelWidth], ['Panels', result.panels, ''], ['Stock pieces', result.stockPieces, ''],
  ];
}

function renderResult(result) {
  wallStage.innerHTML = renderWallSvg(result);
  metrics.innerHTML = metricItems(result).map(([label, value, suffix]) => `<div class="metric"><span>${label}</span><strong>${suffix === '' ? value : `${shown(fromInches(value, state.unit))} ${state.unit}`}</strong></div>`).join('');
  const rows = formatCutList(result.cuts, state.unit);
  cutList.innerHTML = rows.map((row) => `<tr><td>${row.label}</td><td>${row.quantity}</td><td>${row.length}</td></tr>`).join('');
  materialTotal.innerHTML = `<span>Total with waste</span><strong>${shown(fromInches(result.materialLength, state.unit))} ${state.unit} · ${result.stockPieces} stock pieces</strong>`;
}

function priceQuantity(mode, result) {
  if (mode === 'board-batten') return Math.ceil(result.wallWidth / 47.2);
  const key = MODES[mode].quantityKey;
  return key ? result[key] : null;
}

async function renderPrice(result) {
  const config = MODES[state.mode];
  const modeAtRequest = state.mode;
  priceHeading.textContent = 'Checking live Trim Wall Haus pricing...';
  priceDetail.textContent = 'Prices are read from the live store. We never invent unavailable prices.';
  shopButton.textContent = 'Shop this layout';
  shopButton.href = buildShopUrl({ collection: config.collection, product: config.shopProduct, campaign: config.campaign });
  try {
    const product = await loadProduct(config.productHandle);
    if (state.mode !== modeAtRequest) return;
    const quantity = priceQuantity(state.mode, result);
    const range = quantity && quantity <= 6 ? priceRange(product, { quantity }) : priceRange(product);
    if (!range) throw new Error('No matching live variant.');
    state.product = product;
    state.price = range.min;
    const priceText = range.min === range.max ? `$${range.min.toFixed(2)}` : `$${range.min.toFixed(2)} to $${range.max.toFixed(2)}`;
    priceHeading.textContent = `Matching kits: ${priceText}`;
    priceDetail.textContent = quantity ? `Live store match for ${quantity} ${state.mode === 'board-batten' ? 'set(s)' : 'panel(s)'}. Final price depends on profile and installation type.` : 'Live price range for the recommended product. Final price depends on selected profile.';
    const discount = discountForPrice(range.min);
    shopButton.textContent = discount ? 'Get $20 off and shop this layout' : 'Shop this layout';
    shopButton.href = buildShopUrl({ collection: config.collection, product: config.shopProduct, campaign: config.campaign, code: discount });
  } catch (error) {
    state.product = null;
    state.price = null;
    priceHeading.textContent = 'Request a custom quote';
    priceDetail.textContent = 'A matching live store price is not available for this layout. Send the plan for a reviewed price.';
    shopButton.textContent = 'Browse matching kits';
  }
}

function calculateAndRender() {
  try {
    const values = captureValues();
    const result = calculateDesign(state.mode, values, state.unit);
    state.result = result;
    formError.hidden = true;
    renderResult(result);
    renderPrice(result);
    track('calc_complete', { calc_type: state.mode, material_inches: result.materialLength });
    requestAnimationFrame(reportHeight);
  } catch (error) {
    state.result = null;
    formError.textContent = error.message;
    formError.hidden = false;
  }
}

function reportHeight() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'twh-calculator-height', height: document.documentElement.scrollHeight }, '*');
  }
}

function setUnit(nextUnit) {
  if (nextUnit === state.unit) return;
  captureValues();
  state.valuesByMode = convertValuesByMode(state.valuesByMode, state.unit, nextUnit);
  state.unit = nextUnit;
  renderFields();
  calculateAndRender();
}

document.querySelectorAll('[data-unit]').forEach((button) => button.addEventListener('click', () => setUnit(button.dataset.unit)));
document.querySelector('#save-project').addEventListener('click', () => {
  captureValues();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: state.mode, unit: state.unit, valuesByMode: state.valuesByMode }));
  document.querySelector('#save-status').textContent = 'Saved on this device.';
});
document.querySelector('#reset-project').addEventListener('click', () => {
  state.valuesByMode[state.mode] = defaultsFor(state.mode);
  renderFields();
  calculateAndRender();
  document.querySelector('#save-status').textContent = 'This style was reset.';
});
document.querySelector('#print-plan').addEventListener('click', () => window.print());
document.querySelector('#email-plan-button').addEventListener('click', () => { leadPanel.hidden = false; leadPanel.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
document.querySelector('#close-lead').addEventListener('click', () => { leadPanel.hidden = true; });

document.querySelector('#lead-form').addEventListener('submit', (event) => {
  const form = event.currentTarget;
  const data = new FormData(form);
  if (data.get('website')) {
    event.preventDefault();
    return;
  }
  document.querySelector('#lead-message').value = buildLeadMessage({
    modeLabel: MODES[state.mode].label,
    unit: state.unit,
    measurements: state.valuesByMode[state.mode],
    result: state.result,
    note: data.get('projectNotes'),
    pageUrl: location.href,
  });
  leadStatus.textContent = 'Opening the secure Trim Wall Haus contact confirmation...';
  track('lead_submit', { source: 'calculator', calc_type: state.mode, marketing_consent: data.get('marketingConsent') === 'on' });
});

shopButton.addEventListener('click', () => track('coupon_click', { code: shopButton.href.includes('WALL20') ? 'WALL20' : 'none', calc_type: state.mode }));

renderModes();
renderFields();
calculateAndRender();
window.addEventListener('resize', reportHeight);
