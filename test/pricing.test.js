import test from 'node:test';
import assert from 'node:assert/strict';

async function load() {
  try {
    return await import('../src/pricing.js');
  } catch {
    return {};
  }
}

const product = {
  title: 'Picture Frame Kit',
  handle: 'picture-frame-kit',
  variants: [
    { id: 1, title: '2.5 cm / 1 in / Non-Adhesive / 3 Panel', price: 17236, available: true },
    { id: 2, title: '2.5 cm / 1 in / Self-Adhesive / 3 Panel', price: 17476, available: true },
    { id: 3, title: '4 cm / 1.6 in / Non-Adhesive / 3 Panel', price: 24170, available: true },
    { id: 4, title: '2.5 cm / 1 in / Non-Adhesive / 4 Panel', price: 27805, available: true },
  ],
};

test('selects live Shopify variant by panel count and customer choices', async () => {
  const { selectVariant } = await load();
  const variant = selectVariant?.(product, { quantity: 3, profile: '2.5 cm', installation: 'Self-Adhesive' });
  assert.equal(variant?.id, 2);
  assert.equal(variant?.price, 174.76);
});

test('returns price range when no exact option is chosen', async () => {
  const { priceRange } = await load();
  assert.deepEqual(priceRange?.(product, { quantity: 3 }), { min: 172.36, max: 241.7 });
});

test('matches Shopify board and batten variants sold as sets', async () => {
  const { priceRange } = await load();
  const boardProduct = {
    variants: [
      { title: '3 Set (360 cm / 141.7 in) / 4 cm / 1.6 in / Non-Adhesive', price: 20329, available: true },
      { title: '4 Set (480 cm / 189 in) / 4 cm / 1.6 in / Non-Adhesive', price: 27889, available: true },
    ],
  };
  assert.deepEqual(priceRange?.(boardProduct, { quantity: 3 }), { min: 203.29, max: 203.29 });
});

test('builds tracked discount URL and shows WALL20 only at threshold', async () => {
  const { buildShopUrl, discountForPrice } = await load();
  assert.equal(discountForPrice?.(349.99), null);
  assert.equal(discountForPrice?.(350), 'WALL20');
  const url = buildShopUrl?.({ collection: 'board-and-batten-kits', campaign: 'board-batten', source: 'calculator', code: 'WALL20' });
  assert.match(url || '', /^https:\/\/trimwallhaus\.com\/discount\/WALL20\?redirect=/);
  assert.match(decodeURIComponent(url || ''), /utm_source=calculator/);
  assert.match(decodeURIComponent(url || ''), /utm_campaign=board-batten/);
});

test('builds a tracked direct product URL for the French step-corner kit', async () => {
  const { buildShopUrl } = await load();
  const url = buildShopUrl?.({ product: 'french-step-corner-picture-frame-wall-molding-kit-pre-cut-mdf', campaign: 'french-step-corner-calculator' });
  assert.equal(url, 'https://trimwallhaus.com/products/french-step-corner-picture-frame-wall-molding-kit-pre-cut-mdf?utm_source=calculator&utm_medium=tool&utm_campaign=french-step-corner-calculator');
});

test('caches a live product request so measurement changes do not hammer Shopify', async () => {
  const { createProductLoader } = await load();
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return { ok: true, json: async () => product };
  };
  const loadProduct = createProductLoader?.(fetchImpl);
  const first = await loadProduct?.('picture-frame-kit');
  const second = await loadProduct?.('picture-frame-kit');
  assert.equal(first, second);
  assert.equal(calls, 1);
});
