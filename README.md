# Trim Wall Haus Wall Molding Configurator

A browser-based wall molding planner for balanced layouts, material estimates, cut lists, live product pricing, and design-request handoff.

## Live calculator

**[Open the free Wall Molding Configurator](https://trimwallhaus-wall-configurator.idealcamel10.chatgpt.site)**

Browse pre-cut molding kits and installation-ready wall designs at **[Trim Wall Haus](https://trimwallhaus.com/)**.

## Included calculators

- **[Picture Frame Molding Kits](https://trimwallhaus.com/collections/picture-frame-molding-kits)** — calculate balanced decorative wall frames, panel dimensions, mitre cuts, and material requirements.
- **[French Step Corner Picture Frame Kit](https://trimwallhaus.com/products/french-step-corner-picture-frame-wall-molding-kit-pre-cut-mdf)** — calculate outer and inner panels with four 10 cm L-shaped corner steps per frame.
- **[Board and Batten Wall Kits](https://trimwallhaus.com/collections/board-and-batten-kits)** — calculate batten spacing, panel count, top rail length, and matching kit sizes.
- **[Accent Wall Kits](https://trimwallhaus.com/collections/accent-wall-kits)** — plan full-height square and rectangular grid accent walls with an instant cut list.
- **[Wainscoting Wall Molding Kits](https://trimwallhaus.com/collections/premium-wainscoting-wall-molding-kits)** — calculate lower-wall panel proportions, chair rail length, and recommended wainscoting height.

These calculators help homeowners and installers plan wall molding projects before ordering pre-cut kits from [Trim Wall Haus](https://trimwallhaus.com/collections/wall-moulding-kits).

## Browse Trim Wall Haus collections

- [Accent Wall Molding Kits](https://trimwallhaus.com/collections/accent-wall-kits)
- [Arched Wall Molding Kits](https://trimwallhaus.com/collections/arched-wall-molding-kits)
- [Board and Batten Wall Kits](https://trimwallhaus.com/collections/board-and-batten-kits)
- [Chair Rail Molding](https://trimwallhaus.com/collections/chair-rail-moulding)
- [Decorative Wall Molding Kits](https://trimwallhaus.com/collections/decorative-wall-molding-kits)
- [Half Wall Paneling Kits](https://trimwallhaus.com/collections/half-wall-paneling-kits)
- [MDF Wall Paneling Kits](https://trimwallhaus.com/collections/mdf-panelling-kits)
- [Peel and Stick Wall Molding Kits](https://trimwallhaus.com/collections/peel-and-stick-moldings-kit)
- [Picture Frame Molding Kits](https://trimwallhaus.com/collections/picture-frame-molding-kits)
- [Shaker Wall Paneling Kits](https://trimwallhaus.com/collections/shaker-panelling-kits)
- [Trim Wall Molding Kits](https://trimwallhaus.com/collections/wall-moulding-kits)
- [Wainscoting Kits](https://trimwallhaus.com/collections/premium-wainscoting-wall-molding-kits)

## Features

- Proportional SVG wall preview
- Inch and centimetre measurements
- Equal-spacing calculations
- French step-corner geometry with adjustable L-corner depth
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
