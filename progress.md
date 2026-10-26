# Execution ledger: trimwallhaus-configurator-implementation-plan.md

- 2026-10-26: Setup complete. New isolated local repository; no production surface changed.
- Ruling: V1 uses automatic layouts and SVG only. Drag-and-drop/photo upload move to V2 to avoid repeating the previous dead-click failure.
- Ruling: Baseboard remains a separate calculator because it models room perimeter rather than a wall-face layout.
- Task 1 ruling: the supplied wainscoting example needs 6 stock pieces, not 5, because 480 in raw material plus 10% waste is 528 in and `ceil(528 / 96) = 6`.
- 2026-10-26: Four-mode UI complete with SVG preview, cut list, local save, print/PDF, live Shopify price matching, tracked product links, and Shopify contact-form handoff.
- Live-test fix: unit changes now convert the saved measurements for every design mode, preventing hidden-mode values from being converted twice after switching styles.
- Performance fix: Shopify product requests are cached per product so changing measurements does not repeatedly hit the live store.
- Verification: 22/22 automated tests pass; published page checked in a browser for Picture Frame and Board & Batten, live pricing, unit conversion, saved measurements, and free-drawing form visibility.
- Published public Site: https://trimwallhaus-wall-configurator.idealcamel10.chatgpt.site
- Chrome extension V1 packaged as Manifest V3; clicking the toolbar icon opens the full bundled configurator in a browser tab.
