# Trim Wall Haus Wall Molding Configurator

A browser-based wall molding planner for balanced layouts, material estimates, cut lists, live product pricing, and design-request handoff.

## Live calculator

**[Open the free Wall Molding Configurator](https://trimwallhaus-wall-configurator.idealcamel10.chatgpt.site)**

Browse pre-cut molding kits and installation-ready wall designs at **[Trim Wall Haus](https://trimwallhaus.com/)**.

## Included calculators

- Picture Frame Molding
- Board and Batten
- Accent Wall Grid
- Wainscoting

## Features

- Proportional SVG wall preview
- Inch and centimetre measurements
- Equal-spacing calculations
- Material total with waste allowance
- Printable cut list and PDF workflow
- Live Trim Wall Haus Shopify product pricing
- Tracked product and discount links
- Local measurement saving
- Free architectural drawing request through the store contact form
- Chrome Manifest V3 extension bundle

## Run locally

Requires Node.js 20 or newer.

```bash
npm test
npm run serve
```

Then open `http://127.0.0.1:4173`.

## Chrome extension

The `extension/` directory contains the unpacked Manifest V3 extension. In Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select the `extension/` directory.

Clicking the toolbar icon opens the full bundled configurator in a browser tab.

## Verification

The calculation, rendering, pricing, unit-conversion, and lead-message logic is covered by Node's built-in test runner. The public deployment and live Shopify price requests were also verified in a browser.

Calculator results are estimates. Always verify real wall measurements and obstructions before ordering.
