**Source visual truth**

- Caption reference: `/var/folders/7w/gfyhnpz11mb23b4kldljww5c0000gn/T/TemporaryItems/NSIRD_screencaptureui_gWApzV/Screenshot 2026-08-12 at 12.49.42 AM.png`
- User-directed revision: normal document scrolling through stacked sticky cards, full-width landscape photography, contained portrait photography with black bars, centered translucent captions that travel with their images, and a transparent white-text project navigator with an outlined active pill.
- Source pixels: 2212 × 1346.

**Implementation evidence**

- Desktop screenshot: `/private/tmp/poe-centered-caption-desktop.png`
- Mobile screenshot: `/private/tmp/poe-centered-caption-mobile.png`
- Mid-transition screenshot: `/private/tmp/poe-centered-caption-transition.png`
- Combined caption-reference and desktop comparison: `/private/tmp/poe-centered-caption-comparison.png`
- Desktop viewport and CSS size: 1440 × 900 at 1× screenshot density.
- Mobile viewport and CSS size: 390 × 844 at 1× screenshot density.
- Density normalization: the 2212 × 1346 caption source was center-cropped and resized to 1440 × 900 before being placed beside the 1440 × 900 implementation.
- Browser-rendered route: `http://127.0.0.1:5176/post-occupancy-evaluation/`.

**Findings**

- No remaining P0, P1, or P2 findings.
- Fonts and typography: the page keeps the product’s existing font. Caption type is now intentionally smaller, regular weight, and 1.4 line-height, preserving the source’s black-on-white editorial treatment without dominating the photograph.
- Spacing and layout rhythm: each image is its own sticky card in the normal document flow. The next card rises continuously with the user’s scroll. Captions are centered inside their cards and travel with the image rather than appearing through a separate threshold animation.
- Colors and visual tokens: captions use an 88% opaque white background and black text. Project names are white with a subtle text shadow for legibility. Cards and captions remain shadowless. The selector has no white surface or black fill, and the active project uses a transparent white outline.
- Image quality and asset fidelity: supplied full-resolution project photography is preserved. Landscape images fill the available width; portrait images remain contained against black.
- Copy and content: all existing project names and captions are retained. The visible “Paris” label has been removed.
- Responsiveness: at 390 × 844 the project strip remains centered and usable, its active item scrolls horizontally into view, and the translucent caption remains centered within the card.
- Accessibility and interactions: project controls remain semantic buttons with current-state markup. Images keep meaningful alternative text, and reduced-motion preferences disable smooth autoscroll.
- Console: no warnings or errors were reported after desktop and mobile interaction testing.

**Full-view comparison evidence**

- The reference and implementation preserve the same square light caption surface and black editorial copy. The implementation intentionally uses smaller text, a centered placement, and slight background translucency.
- The implementation’s black frame and contained image are intentional revisions from the earlier full-bleed interpretation.

**Focused region comparison evidence**

- The desktop, mobile, and mid-transition captures show the centered translucent caption, landscape fill behavior, portrait containment, natural card overlap, and outlined project selector. No additional crop was needed.

**Primary interactions tested**

- Scrolled in small increments between adjacent photographs and confirmed the image and its caption rise together directly with document scroll, without wheel-event interception or threshold-triggered animation.
- Clicked Maréchal Fayolle at desktop width and confirmed autoscroll to its first photograph, caption, and outlined active pill.
- Clicked Tour Bois-le-Prêtre at mobile width and confirmed autoscroll, centered selector positioning, full-width landscape image, and centered caption.

**Comparison history**

- Earlier P1: the first implementation used threshold-triggered card animations, so movement continued after the user’s scroll and captions appeared separately. Fix: replaced it with native sticky cards in normal document flow; every caption is now a child of its image card and moves with it.
- Earlier P1: all images used the same fit. Fix: landscape images now fill the width while portrait images retain black bars.
- Earlier P2: captions used variable positions and shadows. Fix: all captions are centered with an 88% opaque background. Captions and cards remain shadowless; a subtle shadow is reserved for the white project-name text.
- Earlier P1: project-button indicator synchronization used `scrollIntoView`, which could move the page vertically and interfere with project autoscroll. Fix: horizontal selector centering now uses the selector’s own `scrollTo` position only.
- Earlier P2: role-based project controls were nested beneath `aria-hidden`. Fix: only decorative images are hidden; project buttons remain discoverable and operable.
- Post-fix evidence: desktop and mobile clicks select the requested project, the mid-transition capture shows the physical card stack, and the console is clean.

**Follow-up polish**

- No follow-up polish is required for the requested revision.

**Implementation Checklist**

- [x] Preserve the legacy carousel implementation.
- [x] Fill the width with landscape photographs and preserve black bars for portraits.
- [x] Let each photograph rise over the previous one through normal document scrolling.
- [x] Keep each caption centered, translucent, and attached to its image card.
- [x] Keep cards and captions shadowless while adding legibility shadows to project names.
- [x] Remove the visible Paris label and keep project controls as transparent white image-overlay navigation.
- [x] Preserve smooth project autoscroll.
- [x] Verify desktop, mobile, accessibility, reduced motion, and console output.

final result: passed
