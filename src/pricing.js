const SITE = 'https://trimwallhaus.com';

const dollars = (cents) => Number((Number(cents) / 100).toFixed(2));

function eligibleVariants(product, choices = {}) {
  const quantity = Number(choices.quantity);
  return (product?.variants || []).filter((variant) => {
    if (!variant.available) return false;
    const title = String(variant.title || '').toLowerCase();
    if (Number.isFinite(quantity) && quantity > 0) {
      const hasQuantity = title.includes(`${quantity} panel`) || title.includes(`${quantity} set`);
      if (!hasQuantity) return false;
    }
    if (choices.profile && !title.includes(String(choices.profile).toLowerCase())) return false;
    if (choices.installation && !title.includes(String(choices.installation).toLowerCase())) return false;
    return true;
  });
}

export function selectVariant(product, choices = {}) {
  const [variant] = eligibleVariants(product, choices);
  if (!variant) return null;
  return { ...variant, price: dollars(variant.price) };
}

export function priceRange(product, choices = {}) {
  const prices = eligibleVariants(product, choices).map((variant) => dollars(variant.price));
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function discountForPrice(price) {
  return Number(price) >= 350 ? 'WALL20' : null;
}

export function buildShopUrl({ collection, product, campaign, source = 'calculator', code = null }) {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: 'tool',
    utm_campaign: campaign,
  });
  const destination = product ? `/products/${product}` : `/collections/${collection}`;
  const redirect = `${destination}?${params.toString()}`;
  return code
    ? `${SITE}/discount/${encodeURIComponent(code)}?redirect=${encodeURIComponent(redirect)}`
    : `${SITE}${redirect}`;
}

export async function fetchProduct(handle, fetchImpl = fetch) {
  const response = await fetchImpl(`${SITE}/products/${encodeURIComponent(handle)}.js`);
  if (!response.ok) throw new Error(`Shopify price request failed (${response.status}).`);
  return response.json();
}

export function createProductLoader(fetchImpl = fetch) {
  const cache = new Map();
  return (handle) => {
    if (!cache.has(handle)) {
      const request = fetchProduct(handle, fetchImpl).catch((error) => {
        cache.delete(handle);
        throw error;
      });
      cache.set(handle, request);
    }
    return cache.get(handle);
  };
}
