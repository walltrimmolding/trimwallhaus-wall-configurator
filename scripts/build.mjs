import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const baseUrl = 'https://trimwallhaus-tools.pages.dev';

const pages = [
  {
    slug: 'picture-frame-molding-calculator',
    title: 'Picture Frame Molding Calculator (Free)',
    meta: 'Calculate balanced picture frame molding widths, gaps, miter cuts, material length and stock pieces for a measured wall.',
    eyebrow: 'Picture frame molding tool',
    answer: 'A picture frame molding calculator divides the usable wall width into equal decorative frames after side margins and gaps are removed. This free tool also calculates each frame height, total molding length, 45-degree miter count, waste and stock-piece quantity.',
    formula: 'Frame width = (wall width - two side margins - all internal gaps) divided by frame count. Frame height = design height - top margin - bottom margin. Total molding is the number of frames multiplied by twice the frame width plus twice the frame height.',
    example: 'For a 120-inch wall with three frames, 6-inch side margins and 4-inch gaps, each frame is 33.3 inches wide. With a 72-inch finished frame height, the layout needs 632 linear inches before waste and 12 mitered corners.',
    iframe: '/index.html?design=picture-frame&embed=1',
    collection: 'https://trimwallhaus.com/collections/picture-frame-molding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=picture-frame-molding-calculator',
    cta: 'Compare picture frame molding kits',
    table: [['96 in wall','2 frames','39.0 in frame width'],['120 in wall','3 frames','33.3 in frame width'],['144 in wall','4 frames','30.0 in frame width'],['168 in wall','5 frames','28.0 in frame width'],['192 in wall','6 frames','26.0 in frame width']],
    faqs: [['How many picture frames should go on a wall?','Use the number that leaves repeated frames wide enough to look intentional after margins and gaps are removed. Two to six frames are common planning ranges, but furniture alignment and wall openings matter more than a fixed rule.'],['What gap should I leave between molding frames?','Start with a repeated gap that is visually close to the side margins, then test the layout with painter tape. The calculator accepts any measured gap and keeps frame widths equal.'],['Does the calculator include waste?','Yes. The default adds 10 percent to the calculated perimeter before converting the total into stock pieces.'],['How many miter cuts does one frame need?','A rectangular frame has four corners. The result reports four mitered corners per frame.'],['Can I use centimeters?','Yes. Switch the tool to centimeters; the same physical dimensions and calculation are preserved.']],
  },
  {
    slug: 'board-and-batten-calculator',
    title: 'Board and Batten Calculator (Free)',
    meta: 'Calculate even board and batten spacing, batten count, panel width, material length, waste and stock pieces for any wall.',
    eyebrow: 'Board and batten spacing tool',
    answer: 'A board and batten calculator finds the number of vertical battens that fits a measured wall near a preferred clear gap, then recalculates one exact repeated spacing. The result includes batten count, panel count, top rail, linear material, waste and stock-piece quantity.',
    formula: 'Batten count is estimated from wall width divided by the target gap plus batten width. Exact clear gap = (wall width - total batten width) divided by the number of spaces. The top rail is added only when selected.',
    example: 'On a 120-inch wall with 2-inch battens and an 18-inch target gap, the balanced result uses seven vertical battens and six panels. The actual clear gap is 17.67 inches. At 96 inches tall with a top rail, raw material length is 792 inches.',
    iframe: '/index.html?design=board-batten&embed=1',
    collection: 'https://trimwallhaus.com/collections/board-and-batten-kits?utm_source=calculator&utm_medium=tool&utm_campaign=board-and-batten-calculator',
    cta: 'Compare board and batten kits',
    table: [['96 in wall','6 battens','17.2 in gap'],['120 in wall','7 battens','17.7 in gap'],['144 in wall','8 battens','18.3 in gap'],['168 in wall','9 battens','18.8 in gap'],['192 in wall','11 battens','17.0 in gap']],
    faqs: [['How is equal batten spacing calculated?','Subtract the total width occupied by the battens from the wall width, then divide the remainder by the number of clear spaces.'],['Should battens sit on both wall edges?','Edge battens create a framed appearance, while layouts without them can keep trim away from inside corners. The calculator supports either choice.'],['What is a good board and batten spacing?','Spacing depends on wall scale and batten width. Enter the visual target you prefer; the tool finds the nearest balanced count rather than forcing the target exactly.'],['Does a top rail change the spacing?','No. A top rail adds material length but does not change the horizontal positions of vertical battens.'],['Can I calculate half-wall board and batten?','Yes. Enter the intended batten height instead of the ceiling height.']],
  },
  {
    slug: 'wainscoting-calculator',
    title: 'Wainscoting Calculator (Free)',
    meta: 'Estimate wainscoting height, equal panel widths, chair rail length, frame dimensions, waste and stock pieces.',
    eyebrow: 'Wainscoting planning tool',
    answer: 'A wainscoting calculator estimates a lower-wall height from the ceiling height and balances equal frames across a measured wall. The tool starts at one third of the ceiling height, then reports panel width, frame size, chair rail length, material length and cut list.',
    formula: 'Recommended starting height = ceiling height divided by three. Panel width = usable wall width after side margins and gaps, divided by panel count. The frame inset is removed from both sides of every panel.',
    example: 'For a 96-inch ceiling, the one-third starting height is 32 inches. On a 120-inch wall with four panels, 4-inch side margins and 4-inch gaps, each panel is 25 inches wide before the selected frame inset.',
    iframe: '/index.html?design=wainscoting&embed=1',
    collection: 'https://trimwallhaus.com/collections/premium-wainscoting-wall-molding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=wainscoting-calculator',
    cta: 'Compare wainscoting kits',
    table: [['8 ft ceiling','32 in start height','classic proportion'],['9 ft ceiling','36 in start height','mid-height option'],['10 ft ceiling','40 in start height','taller room'],['11 ft ceiling','44 in raw third','review furniture'],['12 ft ceiling','48 in raw third','review doors and windows']],
    faqs: [['How high should wainscoting be?','One third of the wall height is a useful starting point, not a universal requirement. Align the finished height with windows, switches, furniture and the room scale.'],['Does chair rail height equal frame height?','No. The frame normally sits below the chair rail with a visible inset at the top and bottom.'],['How many panels should I use?','Choose a count that leaves panels wide enough for the selected profile and aligns with major furniture. The calculator keeps widths equal.'],['Can wainscoting be taller than one third?','Yes. Dining rooms, stairs and dramatic feature walls often use different proportions. Use the result as a starting point and verify the final height in the room.'],['Does the estimate include a chair rail?','Yes. One wall-width chair rail is included in the material and cut list.']],
  },
  {
    slug: 'accent-wall-calculator',
    title: 'Accent Wall Grid Calculator (Free)',
    meta: 'Calculate accent wall grid cell width, cell height, trim length, waste and stock pieces from wall size, rows and columns.',
    eyebrow: 'Grid accent wall tool',
    answer: 'An accent wall grid calculator converts a wall width, wall height, row count, column count and batten width into equal open cells. The result shows precise cell dimensions, vertical and horizontal trim pieces, total linear material and a waste-adjusted stock estimate.',
    formula: 'Cell width = (wall width - all vertical batten widths) divided by columns. Cell height = (wall height - all horizontal batten widths) divided by rows. A closed grid uses one more line than the number of cells in each direction.',
    example: 'A 120 by 96-inch wall with four columns, three rows and 2-inch battens creates 27.5-inch-wide by 29.33-inch-high open cells. Five verticals and four horizontals use 960 inches of trim before waste.',
    iframe: '/index.html?design=accent-grid&embed=1',
    collection: 'https://trimwallhaus.com/collections/accent-wall-kits?utm_source=calculator&utm_medium=tool&utm_campaign=accent-wall-calculator',
    cta: 'Compare accent wall kits',
    table: [['3 x 3 grid','9 cells','square-room starting point'],['4 x 3 grid','12 cells','wide-wall starting point'],['4 x 4 grid','16 cells','fine square grid'],['5 x 3 grid','15 cells','long feature wall'],['5 x 4 grid','20 cells','dense architectural grid']],
    faqs: [['How many battens does a grid wall need?','A closed grid needs columns plus one vertical lines and rows plus one horizontal lines. The calculator includes both edge lines.'],['How do I make the cells square?','Adjust rows, columns or batten width until the reported clear cell width and height are close. Real wall proportions may make perfect squares impractical.'],['Are baseboards included?','No. The grid result covers the decorative grid shown in the preview. Measure existing baseboard and crown details separately.'],['Should outlets be subtracted?','Do not subtract outlet area from trim length. Move the grid or plan safe cutouts so battens do not cover electrical devices.'],['Is waste included?','Yes. The default estimate adds 10 percent and can be changed in the tool.']],
  },
  {
    slug: 'baseboard-calculator',
    title: 'Baseboard Calculator (Free)',
    meta: 'Calculate room baseboard length, subtract door openings, add waste and estimate the number of stock trim pieces.',
    eyebrow: 'Room perimeter tool',
    answer: 'A baseboard calculator measures the room perimeter, subtracts door openings, adds a waste allowance and divides the total by stock-piece length. This produces a transparent material estimate while keeping inside corners and doorway returns visible in the plan.',
    formula: 'Net perimeter = two times room length plus room width, minus the combined door opening widths. Material length = net perimeter multiplied by one plus the waste percentage. Stock pieces are always rounded up.',
    example: 'A 12 by 14-foot room has a 52-foot perimeter. Two 36-inch door openings reduce the measured run to 46 feet. With 10 percent waste, the purchase estimate is 50.6 feet, or seven 8-foot stock pieces.',
    iframe: '/utility.html?calculator=baseboard&embed=1',
    collection: 'https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=baseboard-calculator',
    cta: 'Explore matching wall trim',
    table: [['10 x 10 ft room','40 ft perimeter','before doors'],['10 x 12 ft room','44 ft perimeter','before doors'],['12 x 14 ft room','52 ft perimeter','before doors'],['14 x 16 ft room','60 ft perimeter','before doors'],['16 x 20 ft room','72 ft perimeter','before doors']],
    faqs: [['How much extra baseboard should I buy?','Ten percent is a practical starting allowance for cuts and defects. Complex rooms, scarf joints or inexperienced installation can justify more.'],['Do I subtract door openings?','Yes. Subtract the measured opening where baseboard will not run, then keep enough material for returns if the casing detail needs them.'],['How many 8-foot pieces do I need?','Divide the waste-adjusted total by 96 inches and round up. The calculator performs that step automatically.'],['Does the result optimize every cut?','No. It is a purchase estimate, not a cutting-stock optimizer. Plan joints and reusable offcuts before cutting.'],['Should closets be included?','Include any wall run that will actually receive baseboard, including closets when they are part of the project.']],
  },
  {
    slug: 'stair-calculator',
    title: 'Stair Calculator (Free Riser and Tread Plan)',
    meta: 'Estimate stair riser count, actual riser height, tread count, total run and sloped stringer length from a measured rise.',
    eyebrow: 'Stair planning tool',
    answer: 'A stair calculator divides the measured floor-to-floor rise into equal risers that do not exceed the preferred planning height entered. It then uses one fewer tread than risers to estimate horizontal run and the sloped stringer line.',
    formula: 'Riser count = total rise divided by preferred maximum riser, rounded up. Actual riser = total rise divided by riser count. Tread count = riser count minus one. Run = tread count multiplied by tread depth, plus any landing depth.',
    example: 'A 108-inch floor-to-floor rise with a 7.5-inch preferred maximum creates 15 equal risers at 7.2 inches each. Fourteen 10.5-inch treads produce a 147-inch horizontal run before landings.',
    iframe: '/utility.html?calculator=stair&embed=1',
    collection: 'https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=stair-calculator',
    cta: 'Explore stair wall molding ideas',
    table: [['96 in rise','13 risers','7.38 in each'],['102 in rise','14 risers','7.29 in each'],['108 in rise','15 risers','7.20 in each'],['114 in rise','16 risers','7.13 in each'],['120 in rise','16 risers','7.50 in each']],
    faqs: [['How many steps are needed for a 9-foot rise?','With a 7.5-inch preferred maximum, a 108-inch rise produces 15 risers and 14 treads. Local rules may require a different result.'],['Why are there fewer treads than risers?','The upper floor normally acts as the final walking surface, so a straight flight has one fewer tread than vertical rises.'],['Does the calculator verify building code?','No. It is a planning estimator. Confirm rise, run, headroom, width, landings, guards and handrails with the current local authority.'],['What measurement should I use for total rise?','Measure vertically from the finished lower floor to the finished upper floor, including final flooring thicknesses.'],['Can I add a landing?','Yes. Enter the landing count and depth to add its horizontal length to the total run estimate.']],
  },
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator for Rooms (Free)',
    meta: 'Estimate paintable wall area, subtract doors and windows, apply coat count and calculate gallons and liters for a room.',
    eyebrow: 'Room paint estimator',
    answer: 'A room paint calculator multiplies the room perimeter by wall height, subtracts door and window area, adds the ceiling when selected, applies the number of coats and divides by the paint coverage rate. The output shows both calculated volume and whole gallons to purchase.',
    formula: 'Gross wall area = two times room length plus room width, multiplied by wall height. Paintable area = gross wall area - openings + optional ceiling. Gallons = paintable area multiplied by coats, divided by coverage per gallon.',
    example: 'A 12 by 14-foot room with 8-foot walls has 416 square feet of gross wall area. Subtracting one typical door and two typical windows leaves 365 square feet. Two coats at 350 square feet per gallon calculate to 2.09 gallons, so the purchase estimate is three gallons.',
    iframe: '/utility.html?calculator=paint&embed=1',
    collection: 'https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=paint-calculator',
    cta: 'Plan molding before painting',
    table: [['10 x 10 x 8 ft','320 sq ft walls','gross'],['10 x 12 x 8 ft','352 sq ft walls','gross'],['12 x 14 x 8 ft','416 sq ft walls','gross'],['14 x 16 x 9 ft','540 sq ft walls','gross'],['16 x 20 x 9 ft','648 sq ft walls','gross']],
    faqs: [['How much area does one gallon of paint cover?','The calculator defaults to 350 square feet per gallon, but the selected product label should replace that assumption. Surface texture and application method affect coverage.'],['Should I subtract doors and windows?','Yes. The tool uses typical opening areas from the entered counts. For unusual openings, calculate wall area separately with exact measurements.'],['How many coats should I plan?','Two coats are a common planning assumption for a color change or even finish. Primer, deep colors and porous surfaces can change the requirement.'],['Does the estimate include the ceiling?','Only when the ceiling option is selected. The ceiling area is room length multiplied by room width.'],['Why does the tool round gallons up?','Paint is purchased in container sizes, and stopping short mid-wall can create color or sheen differences. The tool shows the calculated volume and a whole-gallon purchase estimate.']],
  },
  {
    slug: 'wall-square-footage-calculator',
    title: 'Wall Square Footage Calculator (Free)',
    meta: 'Calculate gross and net wall square footage, subtract doors and windows and add a material allowance for wall projects.',
    eyebrow: 'Wall area tool',
    answer: 'A wall square footage calculator multiplies the combined width of all project walls by their common height, subtracts measured doors and windows and optionally adds a waste allowance. The result can be used to plan paint, panels, wallpaper or decorative molding coverage.',
    formula: 'Gross wall area = combined wall width multiplied by wall height, converted from square inches to square feet. Net area = gross area - openings. Purchase area = net area multiplied by one plus the selected allowance.',
    example: 'Four walls with a combined width of 480 inches and a height of 96 inches equal 320 square feet. Subtracting 36 square feet of openings leaves 284 square feet. A 10 percent allowance produces a 312.4-square-foot material target.',
    iframe: '/utility.html?calculator=wall-area&embed=1',
    collection: 'https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=wall-square-footage-calculator',
    cta: 'Explore wall molding kits',
    table: [['12 ft wall x 8 ft','96 sq ft','gross'],['14 ft wall x 8 ft','112 sq ft','gross'],['16 ft wall x 8 ft','128 sq ft','gross'],['18 ft wall x 9 ft','162 sq ft','gross'],['20 ft wall x 10 ft','200 sq ft','gross']],
    faqs: [['How do I calculate square footage of several walls?','Add all wall widths, multiply the total by the common wall height, then convert to square feet. Separate walls with different heights should be calculated individually and added.'],['Should doors and windows be subtracted?','Subtract openings when the material will not cover them. Keep a waste allowance for cuts around those openings.'],['What waste percentage should I use?','Ten percent is a common planning start. Pattern matching, fragile panels and complex cuts can require more.'],['Can I use the result for paint?','Yes, but paint also needs coat count and product coverage. Use the dedicated paint calculator for gallons.'],['Can I use centimeters?','Yes. The tool converts entered lengths while reporting area in square feet for US product comparison.']],
  },
  {
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator (Free Roll Estimate)',
    meta: 'Estimate wallpaper strips and rolls from wall size, roll dimensions, pattern repeat, openings and waste allowance.',
    eyebrow: 'Wallpaper roll estimator',
    answer: 'A wallpaper calculator first determines how many full-width strips cover the wall, then rounds each strip length up to the next complete pattern repeat. The adjusted total is divided by roll length after openings and waste are considered.',
    formula: 'Strips = wall width divided by roll width, rounded up. Matched strip length = wall height rounded up to the next pattern repeat. Rolls = all matched strip lengths plus waste, divided by roll length and rounded up.',
    example: 'A 144-inch wall with 20.5-inch-wide wallpaper needs eight strips. For a 96-inch wall height and a 21-inch repeat, each strip is rounded to 105 inches. With 10 percent waste and a 396-inch roll, the estimate is three rolls.',
    iframe: '/utility.html?calculator=wallpaper&embed=1',
    collection: 'https://trimwallhaus.com/collections/wall-moulding-kits?utm_source=calculator&utm_medium=tool&utm_campaign=wallpaper-calculator',
    cta: 'Compare molding for wallpapered walls',
    table: [['0 in repeat','wall height per strip','no match added'],['10.5 in repeat','next 10.5 in step','small repeat'],['21 in repeat','next 21 in step','common large repeat'],['25.2 in repeat','next 25.2 in step','metric 64 cm repeat'],['36 in repeat','next 36 in step','large mural-style repeat']],
    faqs: [['Why does pattern repeat increase wallpaper use?','Every strip must begin at the position that aligns the printed pattern with the previous strip, so usable length is lost at the top or bottom.'],['Do I subtract windows and doors?','The tool gives only partial credit for openings because full strips are still needed above and beside them. Save usable offcuts for those smaller sections.'],['What roll size should I enter?','Use the exact width and total length printed on the product label. Do not assume every single or double roll has the same dimensions.'],['How much waste should I add?','Ten percent is a starting point. Large repeats, drop matches and irregular walls can require more.'],['Should I buy all rolls at once?','Yes when possible. Order the calculated quantity from the same batch or dye lot, and follow the seller policy for unopened extra rolls.']],
  },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function toolPage(page) {
  const canonical = `${baseUrl}/tools/${page.slug}/`;
  const faqSchema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
  const appSchema = {'@context':'https://schema.org','@type':'WebApplication',name:page.title,applicationCategory:'DesignApplication',operatingSystem:'Any',url:canonical,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},provider:{'@type':'Organization',name:'Trim Wall Haus',url:'https://trimwallhaus.com/'}};
  const breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Calculators',item:baseUrl},{'@type':'ListItem',position:2,name:page.title,item:canonical}]};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(page.title)} | Trim Wall Haus</title><meta name="description" content="${escapeHtml(page.meta)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.meta)}"><meta property="og:url" content="${canonical}"><link rel="stylesheet" href="/tool-page.css"><script type="application/ld+json">${JSON.stringify(appSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script></head><body><header><a class="brand" href="/">Trim Wall Haus Tools</a><nav><a href="/">Wall configurator</a><a href="/utility.html">All calculators</a></nav></header><main><article><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.title)}</h1><p class="answer">${escapeHtml(page.answer)}</p><iframe class="tool-frame" src="${page.iframe}" title="${escapeHtml(page.title)}" loading="eager"></iframe><p class="tool-disclaimer">This calculator is a planning estimate. Verify the actual site, product specifications and applicable local requirements before ordering or building.</p><section><h2>How the calculation works</h2><p>${escapeHtml(page.formula)}</p><h3>Worked example</h3><p>${escapeHtml(page.example)}</p></section><section><h2>Reference table</h2><div class="table-wrap"><table><thead><tr><th>Input</th><th>Result</th><th>Use</th></tr></thead><tbody>${page.table.map(row=>`<tr>${row.map(cell=>`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Reference rows are examples, not product orders. Enter the measured project values in the calculator for a usable estimate.</p></section><section><h2>How to use the result</h2><ol><li>Measure finished surfaces, not rough framing, and record every obstruction.</li><li>Enter the real product dimensions when the tool offers an editable width, length, repeat or coverage field.</li><li>Compare the calculated result with the supplier label and round purchase quantities up only after checking package size.</li><li>Mark the proposed layout on the wall before cutting, attaching or ordering custom pieces.</li></ol><a class="cta" href="${page.collection}" target="_blank" rel="noopener">${escapeHtml(page.cta)}</a></section><section><h2>Frequently asked questions</h2>${page.faqs.map(([q,a])=>`<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`).join('')}</section></article><aside><h2>Related free tools</h2>${pages.filter(other=>other.slug!==page.slug).slice(0,6).map(other=>`<a href="/tools/${other.slug}/">${escapeHtml(other.title)}</a>`).join('')}</aside></main><footer>Calculators and product planning by <a href="https://trimwallhaus.com/">Trim Wall Haus</a>.</footer><script src="/tool-page.js" defer></script></body></html>`;
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'src'), { recursive: true });
for (const file of ['index.html','styles.css','utility.html','utility.css','privacy.html','_headers','robots.txt','llms.txt']) await cp(join(root, file), join(dist, file));
for (const file of ['app.js','calculators.js','configurator.js','leads.js','pricing.js','renderers.js','utility-app.js','utility-calculators.js']) await cp(join(root, 'src', file), join(dist, 'src', file));

const pageCss = `:root{--ink:#1b1d18;--muted:#5f665a;--line:#d9ddcf;--soft:#f2f4ec;--accent:#435035;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:#fbfbf7}a{color:inherit}header{height:64px;padding:0 clamp(18px,5vw,68px);display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid var(--line)}.brand{font-family:Georgia,serif;font-weight:700;text-decoration:none}nav{display:flex;gap:18px;font-size:.88rem}main{width:min(1180px,calc(100% - 28px));margin:44px auto;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:44px}article{min-width:0}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.74rem;color:var(--accent);font-weight:800}h1{font:700 clamp(2.2rem,5vw,4.2rem)/1.03 Georgia,serif;margin:.25em 0}.answer{font-size:1.12rem;line-height:1.75;color:#42483f;max-width:850px}section{margin:42px 0}h2{font:700 1.75rem/1.2 Georgia,serif}h3{margin-top:1.5rem}p,li{line-height:1.72}.tool-frame{width:100%;height:920px;border:1px solid var(--line);border-radius:18px;background:#fff;margin-top:22px}.tool-disclaimer{font-size:.85rem;color:var(--muted)}table{border-collapse:collapse;width:100%;background:#fff}th,td{border:1px solid var(--line);padding:12px;text-align:left}th{background:var(--soft)}.table-wrap{overflow:auto}.cta{display:inline-block;background:var(--accent);color:#fff;padding:13px 17px;border-radius:9px;text-decoration:none;font-weight:800}aside{position:sticky;top:28px;align-self:start;background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px}aside h2{font-size:1.1rem;margin-top:0}aside a{display:block;padding:10px 0;border-top:1px solid var(--line);font-size:.88rem}footer{text-align:center;border-top:1px solid var(--line);padding:24px;color:var(--muted)}@media(max-width:850px){main{grid-template-columns:1fr;margin-top:28px}aside{position:static}.tool-frame{height:1120px}nav{display:none}}`;
const pageJs = `window.addEventListener('message',(event)=>{if(event.origin!==location.origin||event.data?.type!=='twh-calculator-height')return;const frame=document.querySelector('.tool-frame');if(frame)frame.style.height=Math.max(640,Math.min(1500,Number(event.data.height)||900))+'px';});`;
await writeFile(join(dist, 'tool-page.css'), pageCss);
await writeFile(join(dist, 'tool-page.js'), pageJs);

for (const page of pages) {
  const directory = join(dist, 'tools', page.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), toolPage(page));
}

const urls = ['', 'privacy.html', ...pages.map((page) => `tools/${page.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path)=>`  <url><loc>${baseUrl}/${path}</loc><lastmod>2026-10-31</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);

const rootHtml = await readFile(join(dist, 'index.html'), 'utf8');
if (!rootHtml.includes('Free Wall Molding Configurator')) throw new Error('Root calculator was not copied correctly.');
console.log(`Built ${pages.length} calculator landing pages in ${dist}`);
