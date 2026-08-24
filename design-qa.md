# Design QA: resident quote Sankey

- Source visual truth: `/Users/ananmaysharan/Downloads/Screenshot 2026-08-20 at 9.11.16 AM.png`
- Source dimensions: 1770 × 1540 px, normalized to 1280 × 720 px for composition comparison
- Implementation: `http://localhost:5173/post-occupancy-evaluation`
- Implementation screenshot: `/private/tmp/sru-resident-sankey-default.png`
- Highlight screenshot: `/private/tmp/sru-resident-sankey-highlight.png`
- Combined comparison: `/private/tmp/sru-sankey-comparison.png`
- Browser viewport: 1280 × 720 CSS px at device scale factor 1
- State: default and “Healthcare access and affordability” selected

## Full-view comparison

The implementation preserves the reference’s defining composition: category nodes on the left, a central field of curved links, and destination text nodes on the right. It intentionally uses the project’s established sans-serif type and graphics palette. All six categories, nineteen full quotations, and every link fit inside the browser viewport without scrolling within the graphic.

## Focused interaction evidence

Selecting “Healthcare access and affordability” highlights its three links and three complete quotations while muting the other sixteen. Escape clears the selection. The same state is available through pointer hover and keyboard focus. The category buttons expose pressed state, the quote controls expose their full visible text, and the graphic relationships are supplementary rather than the only way to access the content.

## Required fidelity surfaces

- Fonts and typography: uses the site’s existing sans-serif family and condensed setting; quotation text is deliberately small enough to keep the complete text in one viewport.
- Spacing and layout rhythm: the section occupies the available viewport below the fixed navigation; title, diagram headers, nodes, and text remain inside the frame.
- Colors and visual tokens: uses the shared project palette, with low-opacity default links and stronger matched states.
- Image quality and asset fidelity: no raster assets are required; the Sankey is rendered as resolution-independent data graphics.
- Copy and content: the requested title and all nineteen original quotations are present in full. The visible instructional subtitle was removed.

## Findings

No actionable P0, P1, or P2 differences remain. The implementation is an adaptation of the reference interaction rather than a literal copy because the destination labels are full resident quotations and the project’s established visual system takes precedence.

## Comparison history

1. The first implementation used a two-column scrolling list. It did not provide actual Sankey links and did not fit in one viewport.
2. It was replaced with measured Sankey nodes and curved links, smaller complete quote text, a viewport-constrained layout, and pointer plus keyboard highlighting.
3. An independent accessibility review found that the visual relationships were not named for screen readers, quote focus incorrectly exposed toggle semantics, and the category controls used an inappropriate navigation landmark.
4. Categories now announce their connected quote counts; every quote announces its category, sequence number, and full text; quote controls no longer expose false pressed state; and the category container uses a labeled group. The reviewer rechecked these changes and returned a full pass.
5. The final browser capture confirms that all content fits and the selected-category state isolates exactly the associated quotes.

## Follow-up polish

No blocking follow-up remains.

final result: passed

---

# Design QA: shared case-study select component

- Implementation: `http://localhost:5173/post-occupancy-evaluation`.
- Browser viewports: 1440 × 1024 and 390 × 844 CSS px at device pixel ratio 1.
- State: case-study selector resting and open inside the gallery.

## Findings and fixes

- Earlier P2: the compact selector duplicated dropdown behavior and styling locally. Fix: it now uses the project-standard `Select.Root`, `Select.Trigger`, `Select.Content`, and `Select.Item` components.
- The shared component provides the selected check mark, keyboard navigation, focus treatment, Escape handling, portal positioning, and collision-aware opening direction.
- Desktop alignment remains on the caption inset: the 143.9 × 36 px trigger begins at x = 24 px and y = 89 px.
- Mobile remains bottom-centered with a 12 px bottom inset. The 275.1 × 234 px menu automatically opens upward and creates no horizontal overflow.
- Selecting Rue Jean-Bart closed the menu, updated the trigger, and aligned the first Rue Jean-Bart frame at y = 65 px without traversing intervening cases.
- `svelte-check` reported zero errors and zero warnings.

No actionable P0, P1, or P2 issues remain.

final result: passed

---

# Design QA: case-study navigation grid and compact sticky index

- Source visual truth: `/Users/ananmaysharan/.codex/generated_images/01a01d56-3e6c-70e3-873c-6b806ec23aed/exec-979fd961-cd54-4e4d-8513-f17bd7ea0456.png` at 1487 × 1058 px, normalized to 1440 × 1024 for comparison.
- Implementation: `http://localhost:5173/post-occupancy-evaluation`.
- Resting implementation screenshot: `/private/tmp/sru-case-grid-resting.png`.
- Sticky implementation screenshot: `/private/tmp/sru-case-grid-sticky.png`.
- Mobile resting screenshot: `/private/tmp/sru-case-grid-mobile.png`.
- Mobile sticky screenshot: `/private/tmp/sru-case-grid-mobile-sticky.png`.
- Full-view comparison: `/private/tmp/sru-case-grid-comparison.png`.
- Focused navigation comparison: `/private/tmp/sru-case-grid-nav-comparison.png`.
- Browser viewports: 1440 × 1024 CSS px at DPR 1 and 390 × 844 CSS px.
- State: Samaritaine selected, with both the full resting grid and compact sticky index verified.

## Full-view comparison

The implemented navigation uses the selected seven-column structure on the live post-occupancy page. Paris spans four case-study columns, while Brittany, French Riviera, and Overseas Territories each occupy one column. Fine shared rules, real project thumbnails, region labels, and a single active outline produce the same clear hierarchy as the source direction.

Once the gallery reaches the site header, the navigation changes into the user-requested compact state: all seven case-study names remain visible in the same column structure, while thumbnails and region headings are removed. The compact index remains fixed directly below the 65 px site header and the story cards begin below it, so neither navigation nor content overlaps.

## Focused region comparison

The focused comparison confirms that the resting navigation preserves a continuous grid rather than separate pill controls or disconnected rows. The implementation uses the actual project names and first images from the live case-study dataset. The active Samaritaine cell is distinguished with a dark inset outline without changing the grid geometry.

## Required fidelity surfaces

- Fonts and typography: the site’s existing type families, weights, and uppercase region-label convention are preserved; no new font was introduced.
- Spacing and layout rhythm: the grid aligns with the page’s 1232 px editorial width, uses even cell spacing, and transitions to an 80 px compact sticky band.
- Colors and visual tokens: the navigation uses the project’s existing neutral rules, white surface, dark text, and selected-state outline.
- Image quality and asset fidelity: each resting cell uses the corresponding real case-study image with cover cropping; the compact state contains zero images by design.
- Copy and content: all seven case-study names and four region names match the live case-study data.

## Interaction and responsive verification

- Clicking Brittany · Talgen switches the active region and project, scrolls to Talgen, and leaves the compact navigation image-free.
- Clicking Paris · Maréchal Fayolle from another region switches back to Paris and scrolls to the correct story frame.
- Desktop geometry confirmed a 1232 px resting grid, an 80 px compact sticky index, and story cards beginning immediately below the sticky index.
- At 390 × 844, the resting image grid uses contained horizontal scrolling without widening the document. The compact text index keeps all seven case-study labels visible and does not introduce page overflow.
- Browser console inspection returned no errors or warnings.

## Findings

No actionable P0, P1, or P2 differences remain. The text-only sticky state is an intentional deviation from the generated reference and follows the user’s final instruction. The reference’s placeholder imagery and invented labels were replaced with the real project assets and names.

## Comparison history

1. The earlier live implementation used separate region and project pill menus.
2. Those menus were replaced by a single seven-column navigation grid on the actual post-occupancy page.
3. The scrolling state was refined to retain only case-study text, removing thumbnails and region headings while sticky.
4. Desktop, mobile, cross-region selection, fixed-header positioning, and console state were verified in the browser.

## Follow-up polish

- P3: the seven compact labels are necessarily dense at very narrow widths, but they remain visible, selectable, and contained within the viewport.

final result: passed

---

# Design QA: health × housing evidence matrix

**Source visual truth**

- PDF: `/Users/ananmaysharan/Downloads/2026.08.19 Health x Housing Diagram.pdf`
- Rendered source: `/private/tmp/sru-health-housing-source.jpg`
- Spreadsheet evidence map: `/Users/ananmaysharan/Downloads/Housing x Health Diagram References + Links.xlsx`
- Supplied skyline: `/Users/ananmaysharan/Downloads/BACKGROUND1 FOR DIAGRAMArtboard 1.jpg`
- Source dimensions: 4800 × 2700 px at 180 DPI.

**Implementation evidence**

- Browser route: `http://127.0.0.1:5173/health-outcomes`
- Default screenshot: `/private/tmp/sru-health-housing-matrix-final.png`
- Keyboard-focus screenshot: `/private/tmp/sru-health-housing-keyboard.png`
- Mobile screenshot: `/private/tmp/sru-health-housing-mobile.png`
- Combined source/implementation comparison: `/private/tmp/sru-health-housing-comparison.png`
- Browser viewport: 1440 × 1000 CSS px at device pixel ratio 1.
- Implementation screenshot: 1440 × 1000 px. Diagram bounds: 1392 × 725 CSS px, from y 77 to y 802.
- Comparison normalization: the 4800 × 2700 source was contained in a 1440 × 810 panel; the implementation diagram was cropped from the 1440 × 1000 browser screenshot and placed in a matching 1440 × 810 panel.
- State: complete matrix at the bottom of the health-outcomes page, plus first study link in pointer-hover and keyboard-focus states.

## Full-view comparison

The implementation preserves the reference structure: skyline and title, physical/mental health split, seven outcome columns, twelve housing-factor rows, and the exact evidenced intersections. It intentionally adopts the project’s smaller chart typography, shared palette, fine gray rules, and compact density. All visible diagram content fits in one 1440 × 1000 viewport without replacing any existing health-outcomes content.

## Focused interaction evidence

- The browser found 45 semantic article links, matching the 45 linked cells in the spreadsheet.
- Hovering the first dot displays the full peer-reviewed article title and leaves the dot itself as the link target.
- Keyboard focus exposes the same tooltip; the focused element remains the article anchor.
- The first dot resolves to the spreadsheet URL `https://www.mdpi.com/1660-4601/18/6/2815`.
- At 390 × 844, the housing-factor columns stay pinned while the outcome columns remain horizontally scrollable.

## Required fidelity surfaces

- Fonts and typography: uses the site’s Open Sans stack at compact chart sizes. The title is 27 px, domains 15 px, outcomes 10.5 px, rows 11.5 px, and group labels 8.5 px.
- Spacing and layout rhythm: the 725 px diagram height leaves both the fixed navigation and page navigation visible in the 1000 px browser viewport. The 12 matrix rows share a 38 px rhythm.
- Colors and visual tokens: location, proximity, indoor, and outdoor groups use the existing alert, focus, primary, and primary-dark chart tokens. Rules use the existing grid and context colors.
- Image quality and asset fidelity: the supplied skyline was cropped directly from the source asset and converted to a 2800 × 406 WebP; no synthetic or placeholder imagery is used.
- Copy and content: only source-diagram labels and spreadsheet article titles are present. No subtitle, instructions, legend, or generated explanatory copy was added.
- Accessibility and behavior: every dot is an actual external anchor with a descriptive accessible name; hover and focus states are equivalent; reduced-motion preferences remove transitions.
- Responsiveness: desktop fits in one viewport; narrow viewports preserve row context with pinned labels and horizontal outcome scrolling.

## Findings

No actionable P0, P1, or P2 differences remain. The smaller typography and four project-token group colors are intentional style adaptations requested by the user. Existing PMTiles/MapLibre fallback warnings from the page’s earlier map sections remain visible in local browser logs; they are unrelated to the new matrix and do not affect its rendering or links.

## Comparison history

1. The first implementation placed the new diagram above the maps and used display-sized chart typography. The user requested that it be added below all existing content and fit in one viewport.
2. The component was moved beneath the final SRU methodology section without changing any existing page content.
3. The skyline, domain headers, outcomes, row labels, group labels, row heights, and dots were reduced to the site’s compact chart density.
4. The final browser capture confirms the complete 1392 × 725 diagram fits between the fixed navigation and page navigation at 1440 × 1000.
5. Pointer, keyboard, link-count, URL, mobile overflow, build, and type-check verification all passed.

## Follow-up polish

No blocking follow-up remains for the requested diagram.

final result: passed

## Revision: skyline scale, header frames, and graphic placement

- User feedback reference: `/Users/ananmaysharan/Downloads/Screenshot 2026-08-21 at 12.03.05 PM.png`
- Corrected implementation screenshot: `/private/tmp/sru-health-housing-frame-final.png`
- Combined before/after comparison: `/private/tmp/sru-health-housing-frame-comparison.png`
- Browser viewport: 1430 × 900 CSS px at device pixel ratio 1. The centered diagram frame is 1232 × 726 px, matching the page's `max-w-7xl` graphic width.
- Earlier P1: containing the skyline inside a reduced right-side area changed the building scale and distribution. Fix: the supplied skyline now fills the original 138 px header across the complete graphic width, retaining every building base and restoring the source composition.
- Earlier P2: separate dashed borders on adjacent grid items produced a one-pixel horizontal shift. Fix: one grid-spanning divider now runs at x = 916 px from the domain row through the last data row.
- Earlier P2: the Physical Health and Mental Health vertical borders stopped after the 40 px domain row. Fix: overlay frames now span both header rows from y = 240.6 px to y = 370.6 px; the outer diagram border completes the Mental Health right edge.
- Earlier P2: the diagram used a wider placement than the other health graphics and overlapping child edges doubled the outer border. Fix: the page wrapper now uses `max-w-7xl`, the diagram has one outer border, and the final column and row suppress overlapping right and bottom edges.
- The focused browser comparison shows the skyline, the three vertical boundaries, and the complete matrix with no added copy. Browser console output is clean.

final result: passed

## Revision: two parent categories with horizontal subcategories

- Source visual truth: `/private/tmp/sru-health-housing-source.jpg` rendered from `/Users/ananmaysharan/Downloads/2026.08.19 Health x Housing Diagram.pdf`.
- Implementation screenshot: `/private/tmp/sru-health-housing-two-categories-final.png`.
- Focused source/implementation comparison: `/private/tmp/sru-health-housing-two-categories-comparison.png`.
- Browser viewport: 1430 × 1050 CSS px at device pixel ratio 1. The diagram remains centered in the existing 1232 px outer frame.
- Earlier P2: the adapted matrix promoted all four subcategories to separate vertical side labels, obscuring the original two-level hierarchy. Fix: the first column now contains only Housing and Environment, each spanning one half of the matrix.
- The four original subcategories now read horizontally in compact 28 px bands: Location + Conditions, Proximities + Accessibility, Indoor Environmental Quality, and Outdoor Environmental Quality.
- Twelve evidence rows retain their 38 px rhythm, original factor wording, dot colors, article links, centered health-outcome columns, continuous dashed divider, and single outer border.
- The final comparison confirms that the hierarchy now matches the PDF while typography, spacing, color tokens, skyline asset, and interaction behavior remain consistent with the other site graphics. A clean browser tab reported no console warnings or errors.

final result: passed

## Revision: narrative placement and continuous subcategory bands

- Source visual truth: `/private/tmp/sru-health-housing-source.jpg`, rendered from `/Users/ananmaysharan/Downloads/2026.08.19 Health x Housing Diagram.pdf`.
- Implementation screenshots: `/private/tmp/sru-health-housing-placement-bands-final.jpg` for the in-browser viewport and `/private/tmp/sru-health-housing-placement-bands-stitched.jpg` for the complete matrix.
- Focused source/implementation comparison: `/private/tmp/sru-health-housing-placement-bands-comparison-final.jpg`.
- Browser viewport: 1280 × 720 CSS px at device pixel ratio 1. The matrix remains 1232 × 838 CSS px in the same `max-w-7xl` frame as the other full-width graphics.
- State: health-housing diagram directly after the scatter-chart metric definitions and before the SRU methodology and footnote material.

### Findings and fixes

- Earlier P2: the diagram followed the methodology and footnote content rather than the chart definitions it extends. Fix: the component now appears after “Explanation of key health outcome metrics” and before “Looking at the SRU Law as a way to move to opportunity.” Browser geometry confirms the definition, matrix, and methodology begin at absolute y positions 3212.9, 4266.3, and 5168.3 respectively.
- Earlier P2: subcategory color ended in the label cell while the rest of each band reverted to white and gray. Fix: all four subcategory bands now use one continuous 7% tint and a matching category-colored bottom rule from the factor-label column through the final health-outcome column. Browser checks confirm every label/rule seam is continuous and every band reaches the matrix’s right edge.
- Earlier P3: small vertical color accents repeated beside the subcategory and factor labels. Fix: those pseudo-elements were removed from every label cell; only the two parent-category side blocks retain vertical orientation.
- The original single outer border remains 1 px on all four sides, the middle divider remains one continuous dashed rule, and row/cell edges still avoid doubled right and bottom borders.
- Evidence links remain intact: all 45 dots are 9 px solid circles with no border or outline.

### Required fidelity surfaces

- Fonts and typography: the compact Open Sans hierarchy, weights, wrapping, and vertically centered outcome labels are unchanged.
- Spacing and layout rhythm: the requested narrative order is now correct; the 1232 px graphic width and 838 px matrix height remain aligned with other page graphics.
- Colors and visual tokens: each subcategory uses its existing alert, focus, primary, or primary-dark token for text and the rule, plus a light mixed tint across the whole band.
- Image quality and asset fidelity: the supplied skyline asset remains uncropped and fully contained in its 138 px header.
- Copy and content: no titles, subtitles, instructions, legends, or generated copy were added or removed.

No actionable P0, P1, or P2 differences remain in this revision.

final result: passed

## Revision: enlarged rotated parent headings

- Source visual truth: `/private/tmp/sru-health-housing-source.jpg`, rendered from `/Users/ananmaysharan/Downloads/2026.08.19 Health x Housing Diagram.pdf`.
- Implementation screenshots: `/private/tmp/sru-health-housing-rotated-headings-final.jpg` and `/private/tmp/sru-health-housing-rotated-headings-bottom.jpg`.
- Combined comparison: `/private/tmp/sru-health-housing-rotated-headings-comparison.jpg`.
- Browser viewport: 1280 × 720 CSS px at device pixel ratio 1.
- State: default health-housing matrix with the Housing and Environment parent headings visible across the two captures.

### Findings

- The two rotated parent headings increased from 9 px to 11 px while retaining 700 weight, vertical orientation, category colors, centered alignment, and their existing side-column width.
- Browser geometry confirms both labels render at 11 px without clipping: Housing occupies 46.3 px vertically and Environment 73.8 px.
- Typography is more legible and closer to the source hierarchy. Grid spacing, color tokens, skyline quality, copy, dots, links, borders, and matrix dimensions remain unchanged.
- The full-view and lower-matrix focused captures show no overlap or overflow. No actionable P0, P1, or P2 differences remain.

final result: passed

## Revision: header and parent-category divider colors

- Source visual truth: `/private/tmp/sru-health-housing-source.jpg`, rendered from `/Users/ananmaysharan/Downloads/2026.08.19 Health x Housing Diagram.pdf`.
- Implementation screenshots: `/private/tmp/sru-health-housing-divider-top-final.jpg` and `/private/tmp/sru-health-housing-divider-bottom-final.jpg`.
- Combined comparison: `/private/tmp/sru-health-housing-divider-colors-comparison.jpg`.
- Browser viewport: 1280 × 720 CSS px at device pixel ratio 1.
- State: default diagram top plus the lower matrix edge.

### Findings

- The divider beneath “How Housing Impacts Health” now uses the shared light grid gray `rgb(218, 218, 215)` instead of the darker context gray.
- The Housing parent block ends with its alert red `rgb(188, 57, 57)` rule, and the Environment parent block ends with its primary-dark blue `rgb(49, 90, 103)` rule.
- Each rule remains a single 1 px edge. The outer frame, grid geometry, typography, skyline asset, copy, dots, links, and interaction states are unchanged.
- Full-view and focused lower-edge comparison found no overlap, clipping, or actionable P0, P1, or P2 differences.

final result: passed

## Revision: compact full-width metric-definition grid

- Source visual truth: `/private/tmp/sru-health-metric-definitions-before-crop.jpg`, captured from the earlier stacked definition block.
- Desktop implementation: `/private/tmp/sru-health-metric-grid-final.jpg` at 1280 × 720 CSS px and device pixel ratio 1.
- Mobile implementation: `/private/tmp/sru-health-metric-grid-mobile.jpg` at 390 × 844 CSS px and device pixel ratio 1.
- Before/after comparison: `/private/tmp/sru-health-metric-grid-before-after.jpg`.
- Responsive-state comparison: `/private/tmp/sru-health-metric-grid-comparison.jpg`.

### Findings and fixes

- Earlier P2: nine definitions were stacked in a narrow 768 px prose column, creating roughly 989 px of vertical content. Fix: the section now occupies the same 1232 px `max-w-7xl` frame as the page graphics and uses three equal columns at desktop width.
- Earlier P2: an initial two-column table separated metric names from their definitions and still required nine horizontal rows. Fix: each name and definition now remain together in one cell; the nine cells form three desktop rows totaling 458 px.
- The single-border treatment uses a 1 px grid gap over the shared gray token, preventing doubled internal edges. Desktop cells use consistent 20 px horizontal padding and compact 14 px typography.
- At 390 px, the grid collapses to one 356 px column with every name attached to its definition and no horizontal overflow.

### Required fidelity surfaces

- Fonts and typography: existing site family, weights, and text content are preserved; headings remain bold and definitions use a compact 20 px line height.
- Spacing and layout rhythm: the desktop block is less than half the former height and aligns with the scatter chart and health-housing diagram widths.
- Colors and visual tokens: white cells and the shared `#dadad7` rule color match the other graphics.
- Image quality and asset fidelity: the section contains no image assets; the adjacent skyline remains untouched.
- Copy and content: all nine metric names and definitions remain unchanged and paired together.

No actionable P0, P1, or P2 differences remain.

final result: passed

## Revision: red accessibility theme and unified outcome divider

- Source visual truth: `/private/tmp/sru-health-housing-source-1280.jpg`, normalized from the supplied PDF to 1280 × 720 px.
- Implementation screenshot: `/private/tmp/sru-health-housing-proximity-red-final.jpg` at 1280 × 720 CSS px and device pixel ratio 1.
- Full-view comparison: `/private/tmp/sru-health-housing-proximity-red-comparison.jpg`.
- State: default health-housing matrix at `health-outcomes#health-housing-title`.

### Findings and fixes

- Earlier P2: “Proximities + Accessibility” used the orange focus theme while its sibling Housing group used alert red. Fix: the proximity group now shares `GRAPHICS_COLORS.alert` with “Location + Conditions”; its full-width band, label, rule, and all linked evidence dots render in `rgb(188, 57, 57)`.
- Earlier P3: the outcome-header baseline used a darker gray than the other diagram rules. Fix: the spacer and all seven outcome labels now share one continuous `rgb(218, 218, 215)` bottom border.
- Browser-computed styles confirmed the two Housing subcategory bands have identical red text, tint, and bottom rules; a proximity evidence dot resolves to `rgb(188, 57, 57)`; and every outcome-label border resolves to the same light gray.
- No geometry, typography, skyline imagery, copy, study URLs, hover behavior, or matrix placement changed.

### Required fidelity surfaces

- Fonts and typography: unchanged; the compact Open Sans hierarchy and centered header labels remain intact.
- Spacing and layout rhythm: unchanged; the matrix remains in its 1232 px full-width frame with the same row and column geometry.
- Colors and visual tokens: the two Housing subgroups now use one coherent red semantic token, and the header divider matches the shared grid gray.
- Image quality and asset fidelity: the supplied skyline remains sharp, fully visible, and uncropped.
- Copy and content: unchanged; no extra labels, subtitles, or generated text were introduced.

Focused-region evidence was not needed because both requested changes are fully legible in the 1280 × 720 full-view comparison. No actionable P0, P1, or P2 differences remain.

final result: passed

## Revision: full-cell article links

- Source visual truth: `/private/tmp/sru-health-housing-source-1280.jpg`, normalized from the supplied PDF to 1280 × 720 px.
- Implementation screenshot: `/private/tmp/sru-health-housing-cell-link-final.jpg` at 1280 × 720 CSS px and device pixel ratio 1.
- Full-view comparison: `/private/tmp/sru-health-housing-cell-link-comparison.jpg`.
- State: default health-housing matrix at `health-outcomes#health-housing-title`.

### Findings and fixes

- Earlier P2: only the 9 px evidence dot was the article anchor, creating an unnecessarily small pointer target. Fix: every populated matrix cell now contains a full-width, full-height article anchor, with the dot retained as its centered visual marker.
- Pointer enter and pointer move handlers now belong to the cell-filling anchor, so the article tooltip follows the pointer anywhere in the populated cell. Keyboard focus exposes the same tooltip and uses the category color for a clear inset focus ring.
- Browser geometry confirmed all 45 article anchors remain present. The first populated cell measures 138 × 38 px including its rules, and hit testing at all four inner corners plus the center resolves to the same article link.
- The anchor keeps the original peer-reviewed article URL, descriptive accessible name, new-tab behavior, and centered dot.

### Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: unchanged; the link fills the existing cell without altering grid tracks or row heights.
- Colors and visual tokens: the resting matrix is unchanged; hover uses a 6% tint of the row's semantic color and focus uses the same token.
- Image quality and asset fidelity: the supplied skyline remains unchanged and uncropped.
- Copy and content: all article titles, labels, and URLs remain unchanged.

The full-view comparison confirms no resting-state visual drift. Focused hit-target evidence came from the browser geometry and five-point hit test because the requested change is interactive rather than a new static visual. No actionable P0, P1, or P2 differences remain.

final result: passed

## Revision: unified neutral grid borders

- Source visual truth: `/private/tmp/sru-health-housing-source-1280.jpg`, normalized from the supplied PDF to 1280 × 720 px.
- Implementation screenshot: `/private/tmp/sru-health-housing-all-borders-final.jpg` at 1280 × 720 CSS px and device pixel ratio 1.
- Full-view comparison: `/private/tmp/sru-health-housing-all-borders-comparison.jpg`.
- State: default health-housing matrix at `health-outcomes#health-housing-title`.

### Findings and fixes

- Earlier P2: neutral vertical grid rules used a lighter value than the horizontal rules, and the outcome header did not draw the same vertical separators as the data grid. Fix: outcome-header verticals, matrix-cell verticals, matrix-cell horizontals, and the physical/mental dashed divider now all use the shared `#dadad7` gray.
- The vertical outcome rules are suppressed at the dashed domain boundary and final column, preserving the existing single-border treatment without doubled edges.
- Colored Housing and Environment section rules remain unchanged.
- Browser-computed styles confirmed `rgb(218, 218, 215)` for every neutral vertical and horizontal border surface requested.

Typography, spacing, skyline imagery, article links, hover behavior, and copy remain unchanged. The combined comparison shows a consistent table grid with no geometry drift or new overlap.

final result: passed

---

# Design QA: case-study caption edge alignment

- Implementation: `http://localhost:5173/post-occupancy-evaluation`.
- Implementation screenshot: `/private/tmp/sru-caption-insets-final.png`.
- Browser viewports: desktop and 390 × 844 CSS px.
- State: first Samaritaine story frame with the compact case-study index active.

## Findings and fixes

- The former top-caption offset was 4.5 rem while the left and right offsets were 1 rem, which made the caption positions feel disconnected from the image edges.
- Top-left, top-center, and top-right captions now share one responsive edge inset: `clamp(1rem, 2vw, 1.5rem)`.
- Desktop browser geometry confirmed a 24 px top inset, a 24 px left inset for top-left captions, and a 24 px right inset for top-right captions. Top-center captions use the same 24 px top inset and remain centered at 50%.
- Mobile geometry confirmed a 16 px top/edge inset and no document overflow at 390 px width.
- The same inset token is also used for center-side and bottom caption positions so debug placement remains internally consistent.

Typography, caption width, internal padding, image crops, text, sticky navigation, and caption-debug behavior remain unchanged. No actionable P0, P1, or P2 differences remain.

final result: passed

---

# Design QA: simplified case-study selector and smart scroll navigation

- Reference: the previous live selector captured before this revision at desktop and narrow viewports.
- Implementation: `http://localhost:5173/post-occupancy-evaluation`.
- Browser viewports: 1440 × 1024 and 390 × 844 CSS px.
- States checked: resting selector, downward-scroll hidden state, upward-scroll and pointer reveal, open change-case menu, and case-study selection.

## Findings and fixes

- Earlier P1: the selected case used a heavy black two-pixel inset outline against shared cell borders, creating a doubled and uneven edge. Fix: the selector now uses one-pixel gap-based rules and a single subtle dark-gray selected treatment.
- Earlier P2: thumbnail images had inner padding and inconsistent framing. Fix: each thumbnail now fills a square cell edge to edge, with the place title separated below by one neutral gray rule.
- Earlier P2: Rue Jean-Bart used a plan drawing as its thumbnail. Fix: it now uses the stepped façade photograph from the same case-study image set.
- Earlier P1: the scrolled selector became a dense, full-width two-row bar that competed with the main header. Fix: downward scrolling hides the selector; upward scrolling or moving the pointer near the top reveals a centered 44 px contextual control containing only the current region, current project, and a Change case action.
- The Change case action opens a compact region-grouped menu. Paris keeps its four projects together; the three single-project regions stay visually simple. The menu closes after selection and supports Escape.
- The story image begins directly below the 65 px site header, removing the former empty selector band when the navigation is hidden.

## Responsive and interaction verification

- Desktop geometry confirmed the revealed compact control is 704 × 44 px at y = 73 px, leaving a deliberate 8 px gap below the site header.
- Pointer-near-top reveal and downward-scroll hiding were verified in the live browser.
- Selecting Talgen updated the active case, visible story image, and compact label, then closed the menu.
- At 390 px, the contextual control and grouped menu stay within the viewport with no document overflow; Paris uses a compact two-by-two option grid.
- The keyboard focus ring remains orange and two pixels wide for accessibility, while resting, hover, and selected states use neutral gray.

No actionable P0, P1, or P2 issues remain.

final result: passed

---

# Design QA: persistent case-study pill and instant case switching

- Source visual truth: the preceding centered compact selector captured in the live implementation at 1440 × 1024 CSS px.
- Implementation: `http://localhost:5173/post-occupancy-evaluation`.
- Rendered implementation states: desktop left pill and open menu at 1440 × 1024; mobile bottom pill and upward-opening menu at 390 × 844.
- Density normalization: source and implementation were captured at device pixel ratio 1 and compared at matching CSS dimensions.
- Full-view comparison evidence: the previous centered selector and revised left pill were opened together in one browser comparison input.
- Focused-region evidence: desktop and mobile pill/menu captures were compared together because navigation position, density, and collision behavior were the fidelity-critical surfaces.

## Findings and fixes

- Earlier P1: hiding the selector while scrolling made navigation difficult to rediscover. Fix: the compact selector remains visible throughout the gallery, anchored at x = 24 px on desktop and centered 12 px above the mobile viewport bottom.
- Earlier P1: project selection inherited the page-level smooth-scroll rule and visibly traversed intervening cases. Fix: selection temporarily uses an immediate scroll jump, restores the page rule on the next animation frame, and applies only a small smooth correction if the target is not aligned to the 65 px header edge.
- Earlier P2: the centered desktop selector competed with top captions and the main header. Fix: the pill now occupies the quiet top-left edge; every caption previously assigned to top-left resolves to top-right.
- Earlier P2: the grouped menu carried more hierarchy than seven choices required. Fix: one flat seven-row list now shows region, case name, and a Lucide check icon on the active case.
- Earlier mobile P2: a bottom-centered pill could overlap bottom captions. Fix: bottom captions receive an additional 3.25 rem mobile offset while the menu opens upward.

## Interaction and responsive verification

- Desktop geometry: the pill measured 146.3 × 40 px at x = 24 px and y = 77 px.
- The pill updated from `Paris – Rue Jean-Bart` to `Paris – Tour Bois-le-Prêtre` as the active project changed on scroll.
- Selecting Rue Jean-Bart aligned its first frame at y = 65 px within 80 ms and closed the menu without showing intervening projects.
- Cross-region selection changed directly to `Brittany – Talgen`; the first Talgen frame aligned at y = 65 px and the menu closed.
- Mobile geometry: the pill measured 137.4 × 40 px, centered at x = 126.3 px with a 12 px bottom inset. The seven-row menu measured 312 × 321.6 px, opened upward, and produced no horizontal overflow.
- Escape handling, selected `aria-checked` state, keyboard focus styling, image assets, and existing caption-debug controls remain intact.
- `svelte-check` reported zero errors and zero warnings. No new runtime errors were observed during the browser interaction pass.

## Required fidelity surfaces

- Fonts and typography: existing compact navigation typography is preserved; labels remain readable at desktop and mobile sizes.
- Spacing and layout rhythm: the desktop pill no longer spans the composition, while the mobile pill and menu use explicit safe-edge spacing.
- Colors and visual tokens: neutral gray borders, white translucent surfaces, and the existing orange focus state remain consistent with the site.
- Image quality and asset fidelity: gallery images and thumbnails are unchanged by this revision.
- Copy and content: the pill shows `Region – Case study`; the menu contains exactly the seven supplied cases with no additional explanatory copy.

No actionable P0, P1, or P2 issues remain.

final result: passed
