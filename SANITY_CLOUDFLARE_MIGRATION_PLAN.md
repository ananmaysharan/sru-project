# Sanity text editing and Cloudflare Pages migration plan

Status: implementation in progress on September 7, 2026.

Last reviewed: September 7, 2026.

This plan reflects the approved site after the recent cleanup. Commit `0a319d9` records the cleanup baseline. Commit `978efe3` updates the browser tests to match the current mobile case study navigator. The type check and production build pass. The current migration branch has 22 passing browser tests.

This version of the plan does not include section or item reordering. All page and list structure will remain fixed in code.

The repository code does not need to remain frozen during the migration. We may change data structures, component inputs, content loading, tests, and build settings when those changes make the Sanity integration safer. The public markup, styling, content, page order, and interactions must remain unchanged unless a change is required to preserve the existing behavior.

## Implementation progress

The first implementation checkpoint is complete on branch `codex/sanity-text-migration`.

1. The approved baseline is commits `0a319d9` and `978efe3`.
2. Sanity Studio is installed in `studio` with its own package and lock file.
3. The Studio is connected to project `c5o3dddy` and the `production` dataset.
4. The Studio lists the seven fixed documents and disables the general create button.
5. English and French fields appear in separate tabs.
6. Rich text is limited to the heading, list, bold, italic, link, and note formats used by the current site.
7. Related content types include permanent read-only IDs, and sorting is disabled for fixed arrays.
8. The Studio build passes.
9. The public site still passes the type check and production build, and all 19 browser tests pass.
10. The local Studio origin `http://127.0.0.1:3333` is allowed in Sanity for development.
11. Case study project cards and navigator items now use permanent project IDs instead of visible English project names.
12. All 44 case study captions resolve through permanent image IDs, and resident topic and quote keys are independent of editable text.
13. Fixed Studio arrays now hide add, insert, remove, duplicate, copy, and reorder controls while keeping their text fields editable.
14. The repeatable import report validates the 180 English and 180 French news source entries, IDs, counts, and links.
15. The published Sanity dataset now contains the verified `resourcesPage` document. Backups were saved before and after the import.
16. The resources route has a build-time `local` or `sanity` source setting. Local remains the default.
17. Local and Sanity builds produce byte-for-byte identical `<main>` markup for the resources page.
18. The English bibliography was extracted into the same segment model as the French bibliography. All seven section counts, 40 entry counts, and corresponding links match.
19. The published Sanity dataset contains the verified `bibliographyPage` document, with a new dataset backup saved after import.
20. The bibliography route uses the same build-time content source setting and converts Portable Text back into the existing inline renderer.
21. The local bibliography markup matches the baseline exactly after ignoring internal Svelte hydration comments. Local and Sanity modes both pass the English and French bibliography tests.
22. The published Sanity dataset contains the `siteSettings` document for the browser title, skip link, navigation labels, previous and next labels, and glossary text. A new dataset backup was saved after this import.
23. The root layout and shared navigation components now receive global text through a validated content layer. Interactive control labels remain fixed in code.
24. Local and Sanity builds produce identical main content, navigation, browser title, and skip link markup on the introduction, resources, and bibliography pages.
25. The full Sanity backed browser suite passes all 22 tests, including new English and French checks for the shared navigation and glossary.
26. The Playwright web server startup limit is now two minutes because the complete static build can take longer than the former 60 second test limit.
27. The published Sanity dataset contains the `supplyPage` document with 22 fixed text fields, 16 Portable Text blocks, and two endnotes in each language.
28. Supply essay headings keep permanent IDs, note references keep permanent targets, and the build rejects changed block, list, heading, or endnote structure.
29. The local refactor and the published Sanity document both produce the same 86,755 character Supply `<main>` HTML and SHA-256 hash as the saved baseline.
30. The Supply map now catches a WebGL initialization failure so the rest of the page, including language switching, remains usable when the map cannot start.
31. The full Sanity backed suite passes all 24 tests, including focused English and French Supply content tests. A new dataset backup was saved after the import.
32. The published Sanity dataset contains the `healthOutcomesPage` document with seven fixed text fields, nine metric definitions, the methods text, and one endnote in each language.
33. Health metric definitions use permanent IDs and fixed order. The build rejects missing, reordered, or changed metric IDs and unsupported methods structure.
34. The local refactor and published Sanity document both produce the same 463,784 character Health Outcomes `<main>` HTML and SHA-256 hash as the saved baseline.
35. Both Health maps now catch WebGL initialization failures so the rest of the page remains usable if a map cannot start.
36. The full Sanity backed suite passes all 26 tests, including focused English and French Health Outcomes tests. A new dataset backup was saved after the import.

The migration branch can build Resources, Bibliography, Supply, Health Outcomes, and global site text from Sanity by setting `CONTENT_SOURCE=sanity`. Local content remains the default, and the deployed production site has not changed.

## Goal

The finished system should let a nontechnical administrator do the following work:

1. Edit the English and French page text.
2. Edit headings, captions, links, and descriptions.
3. Press Publish in Sanity.
4. Open the public site after Cloudflare finishes the new static build.

The editor should not be able to change section order, page structure, the visual design, chart data, map data, component code, routes, image crops, or interactive controls.

## Recommended system

The recommended system has four parts.

1. GitHub stores the code, styles, images, tests, and data files.
2. Sanity Studio provides the editing screen.
3. Sanity stores the published English and French content.
4. Cloudflare Pages builds and hosts the static site.

The publishing flow will be:

```text
Editor opens Sanity Studio
              |
              v
Editor changes English or French page content
              |
              v
Editor presses Publish
              |
              v
Sanity sends a webhook to Cloudflare Pages
              |
              v
Cloudflare builds the SvelteKit site with published Sanity content
              |
              v
The new static site becomes public
```

The browser will not fetch page content from Sanity. Cloudflare will fetch the content during the build. Each page will contain both languages, so the current instant language switch can remain in place.

Sanity recommends the live API for static builds because it returns the newest published content. The site client should therefore use `useCdn: false` during the Cloudflare build. See the [Sanity client guidance](https://www.sanity.io/docs/help/js-client-cdn-configuration).

## Current codebase map

The site is a static SvelteKit application. The current setup is already close to what Cloudflare Pages needs.

* Static rendering is enabled in [`src/routes/+layout.ts`](src/routes/+layout.ts).
* SvelteKit uses `adapter-static` in [`svelte.config.js`](svelte.config.js).
* The build output is the `build` directory.
* GitHub Actions currently deploys that directory to GitHub Pages through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
* Production builds currently use `/sru-project` as the base path.
* The language store in [`src/lib/i18n.ts`](src/lib/i18n.ts) reads `?lang`, saves the choice in local storage, and updates the document language.
* The route list in [`src/lib/data/routes.ts`](src/lib/data/routes.ts) controls the main navigation and the previous and next page links.
* Shared layout and editorial styles are in [`src/routes/layout.css`](src/routes/layout.css).
* The global layout in [`src/routes/+layout.svelte`](src/routes/+layout.svelte) owns navigation, scroll restoration, the page title, and the main page wrapper.

The recent cleanup removed the internal skyline editor. It also removed the unused European map, legacy carousels, gallery components, several unused UI component groups, old map assets, duplicate images, and thumbnail images that are no longer used. None of those removed items should appear in the Sanity plan.

The Svelte type check passes after the cleanup with zero errors and zero warnings.

### Public pages

#### Introduction

The route is [`src/routes/+page.svelte`](src/routes/+page.svelte).

The page contains:

1. A fixed hero with bilingual text and links.
2. A supporter section with linked logos.
3. A scroll controlled housing history graphic.
4. A long introduction.
5. A guide to the dashboard.
6. Acknowledgements.
7. Notes for the introduction.

The scroll graphic depends on page scroll, viewport height, fixed navigation height, and responsive layout. Sanity may supply its text, but the Svelte component must continue to own its structure and behavior.

#### Supply

The route is [`src/routes/supply/+page.svelte`](src/routes/supply/+page.svelte).

The page contains:

1. The page introduction.
2. The national stock and tenure chart pair.
3. The regional narrative and chart pair.
4. The interactive supply map.
5. The noncompliance graphic.
6. The overseas atlas.
7. The European comparison atlas.
8. The methods essay.

The old European map has been deleted. The European comparison atlas is the only European graphic that remains.

#### Health outcomes

The route is [`src/routes/health-outcomes/+page.svelte`](src/routes/health-outcomes/+page.svelte).

The page contains:

1. The page introduction.
2. The main health map.
3. The corner map about access to opportunity.
4. The commune scatterplot.
5. The metric definition list.
6. The health and housing evidence matrix.
7. The methods text.

The unused health chart text has been removed from the English Markdown source and from the Markdown parser. It is no longer part of the migration.

#### Post occupancy evaluation

The route is [`src/routes/post-occupancy-evaluation/+page.svelte`](src/routes/post-occupancy-evaluation/+page.svelte).

This is the most complex page. It contains:

1. The page introduction.
2. The case study index.
3. Project information cards.
4. A scroll controlled image story with captions.
5. The resident voice diagram.
6. The final essay.

The old carousel path and its hidden sections have been removed. The page now has one case study presentation.

Several current relationships are fragile:

* French image captions are matched by array position.
* Project cards are found through visible English project names.
* Resident topics, quotes, colors, and diagram positions depend on matching array indexes and quote counts.
* Image paths are used as rendering keys and caption placement keys.

These relationships must use permanent internal IDs before the related text becomes editable.

#### Resources

The route is [`src/routes/resources/+page.svelte`](src/routes/resources/+page.svelte).

English and French resource lists are stored in separate TypeScript files. Each section contains text and an optional URL. Sanity should store both languages in one section record and should use permanent IDs instead of editable titles as keys.

#### Bibliography

The route is [`src/routes/bibliography/+page.svelte`](src/routes/bibliography/+page.svelte).

The French bibliography is stored as structured text segments. The English bibliography is written directly in the Svelte file. The migration must preserve every link, italic phrase, bold phrase, quote mark, space, and punctuation mark.

### Editing scope

The first version will cover text that a reader sees as page content:

* Page titles and section headings.
* Introductory text and long essays.
* Explanatory text placed before or after a graphic.
* Chart and image captions.
* Source lines.
* Acknowledgements.
* Glossary definitions.
* Project information card text.
* Case study image captions.
* Resident topic names and resident quotes.
* Resource entries.
* Bibliography entries.
* Link text and link destinations within this content.

The first version will not cover text that forms part of an interactive control or data display. Map tabs, filter labels, search fields, buttons, legends, axis labels, data tooltips, empty states, and screen reader instructions will remain in code. Image alternative text will also remain in code for the first version. We can move any of these fields into Sanity later if the owner needs to edit them.

### Long form text

The long essays are stored in:

* [`src/lib/data/editorial-content.md`](src/lib/data/editorial-content.md)
* [`src/lib/data/editorial-content.fr.md`](src/lib/data/editorial-content.fr.md)

The parser is in [`src/lib/utils/editorial-markdown.ts`](src/lib/utils/editorial-markdown.ts). The renderer and its exact styles are in [`src/lib/components/sections/EditorialMarkdown.svelte`](src/lib/components/sections/EditorialMarkdown.svelte).

The current renderer supports:

* Paragraphs.
* Level two and level three headings.
* Ordered and unordered lists.
* Bold text.
* Italic text.
* External links.
* Numbered note references.
* Endnotes with return links.

The Sanity rich text setup must support this exact set. It should not offer extra blocks that the current design does not support.

### External services and map files

The maps currently use:

* MapTiler for the base map style.
* Public PMTiles files from `data.gouv.fr` for the main geographic data.
* Local GeoJSON files as a fallback when PMTiles fail.
* A Natural Earth GeoJSON file from GitHub for the European atlas.

These sources are not Sanity content. They should remain under code control.

There are two issues to resolve before a Cloudflare cutover:

1. `static/communes_2022_outre_mer.geojson` is 59,760,696 bytes. Cloudflare Pages has a 25 MiB limit for one static file. The file cannot be deployed to Pages in its current form. See the [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/).
2. The main map still requests `/departments_2022_outre_mer_100m.geojson` in its fallback path, but that file is not present. This does not affect the main PMTiles path, but it can break the fallback when PMTiles fail.

The recommended fix for the large GeoJSON file is to split the same features into several files under the Pages limit and combine them in the map code. This can preserve the exact geometry. Simplifying the geometry should only be considered if visual comparison proves that the map does not change. Another option is to host the large file outside Pages, but that adds another service to the handoff.

## What Sanity should control

Sanity should control the following content:

* English and French headings.
* Paragraphs and short descriptions.
* Captions and source labels.
* Glossary definitions.
* Acknowledgements.
* Editorial links.
* Resource and bibliography links.
* Image captions.
* Project card labels and values.
* Resident topic names and quotes.
* Resource and bibliography entry text.

## What should remain in code

The following items should not be editable in Sanity:

* CSS and Tailwind classes.
* Fonts, colors, spacing, widths, and responsive rules.
* HTML structure and heading levels.
* Svelte component choices.
* Route paths.
* The order of every section and list item.
* Chart numbers and series data.
* Chart legends, axes, controls, and data tooltips.
* Geographic data and map layer rules.
* Map tabs, filters, search fields, and data tooltips.
* Metric IDs and data keys.
* Image paths, crops, object positions, and caption placement.
* Image alternative text.
* Diagram geometry and category relationships.
* Animation and scroll behavior.
* Focus and keyboard behavior.
* Screen reader instructions for interactive controls.
* Debug tools.

Sanity should never store a CSS class, raw Svelte markup, component path, or arbitrary HTML fragment.

## Sanity document design

Sanity should use one document for each page. Each document will contain fixed, named English and French fields that match the current page sections. This is field level localization. Sanity recommends this approach when a document has shared fields and translated fields that publish together. See the [Sanity localization guide](https://www.sanity.io/docs/studio/localization).

### Shared field types

The Studio should define these reusable field types:

1. `localizedString` with `en` and `fr` values.
2. `localizedText` with `en` and `fr` values.
3. `localizedRichText` with separate English and French rich text values.
4. `externalLink` with English and French labels and one URL where both languages use the same destination.
5. `localizedExternalLink` for the few cases where the languages use different destinations.

The rich text toolbar should only offer the formatting that the current renderer supports. Sanity lets developers choose the heading styles, lists, text marks, and link fields that appear in the editor. See the [Portable Text editor guide](https://www.sanity.io/docs/studio/portable-text-editor-configuration).

### Page documents

The Studio should contain these fixed documents:

1. Site settings.
2. Introduction page.
3. Supply page.
4. Health outcomes page.
5. Post occupancy evaluation page.
6. Resources page.
7. Bibliography page.

These documents should have fixed IDs and should appear as a short page list in Studio. The editor should not see a general create document screen.

### Stable content IDs

Every project, image caption, resident topic, quote, resource item, and bibliography entry needs a permanent internal ID. The visible text must never serve as the ID.

Heading links and note links also need permanent IDs. A person should be able to edit a heading without changing its URL anchor or breaking a note return link.

## Fixed page structure

The first version will not include any ordering controls. Every page will keep its current section order. Resource groups, bibliography groups, project images, resident topics, and resident quotes will also keep their current order.

Each page document will use named fields that match the current structure. The supply document will have separate named fields for its introduction, regional description, map description, noncompliance description, overseas description, European description, captions, and methods text. The Svelte page will place these values into the current markup in the current order.

Sanity lists are normally editable arrays. For fixed lists such as resources and bibliography entries, the Studio should hide or disable controls that add, remove, duplicate, or sort items. The website build should also check the permanent IDs and expected item order.

Sanity applies schema validation in Studio, but it does not apply those rules to direct API writes or imports. The website must therefore repeat the important content checks during each build. See the [Sanity validation guide](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake).

## Implementation phases

### Phase 1. Choose and record the baseline

1. Review the current cleanup changes.
2. Fix or explicitly accept any current defects before the content migration begins.
3. Commit the approved baseline.
4. Run the current type check, build, and browser tests.
5. Save a complete list of the English and French fields in the editing scope.
6. Save a separate list of visible text that will remain in code.
7. Capture the current pages at desktop and mobile sizes.
8. Capture important open, selected, hover, and focus states.
9. Record the page structure and important computed styles.

The existing tests cover the bibliography, Markdown rendering, project cards, and the introduction graphic in an iframe. They do not cover complete page content or full visual comparison. The team should add those checks before replacing any content source.

Completion rule: the approved current site can be rebuilt and compared in a repeatable way.

### Phase 2. Create Sanity under separate project files

Create a `studio` directory with its own package and lock file. This keeps Sanity Studio dependencies separate from the public SvelteKit build.

Set up:

1. One public production dataset.
2. The seven fixed documents.
3. English and French fields in clear tabs or groups.
4. Restricted rich text controls.
5. Fixed page sections with no ordering controls.
6. Fixed resource and bibliography lists.
7. Required field checks.
8. URL checks.
9. Clear help text for the editor.
10. A link to the public site.

Do not add a preview system or Sanity visual editing in the first version.

Completion rule: the Studio forms work, but the public site still reads its current local content.

### Phase 3. Protect relationships from text edits

1. Match image captions by image ID instead of array position.
2. Find project cards by project ID instead of visible project name.
3. Give resident categories and quotes permanent IDs.
4. Keep the current resident order and quote counts fixed.
5. Give resource and bibliography entries permanent IDs.
6. Keep heading and note anchors separate from editable text.

Completion rule: changing a visible label cannot change a relationship, image caption, chart value, anchor, or interaction.

### Phase 4. Build a repeatable content import

Write one import program that reads the current Svelte, TypeScript, and Markdown content.

The import should:

1. Produce fixed Sanity document IDs and array keys.
2. Convert the current Markdown into the restricted rich text format.
3. Preserve accents, punctuation, spacing, paragraph breaks, lists, links, italics, bold text, and notes.
4. Report missing translations.
5. Report mismatched IDs or list lengths.
6. Support a report only mode before it writes anything.
7. Be safe to run again without making duplicates.
8. Export a backup before and after the import.
9. Run Sanity document validation after the import.

Completion rule: a content comparison reports no missing or changed text.

### Phase 5. Add the website content layer

Add:

1. A Sanity client with a fixed API date.
2. One query for site settings.
3. One query for each page.
4. Generated TypeScript types.
5. Build checks for required content and fixed item identities.
6. A `local` or `sanity` content source setting during the migration.

The website should read only published content. It should not contain a Sanity write token. Both languages should be part of the static page data.

Existing Svelte components should receive text through typed properties. They should keep the same markup, classes, data, and behavior.

Completion rule: local content and Sanity content produce the same page structure and appearance.

### Phase 6. Migrate one route at a time

Use this order:

1. Resources.
2. Bibliography.
3. Global navigation and glossary.
4. Supply.
5. Health outcomes.
6. Introduction.
7. Post occupancy evaluation.

Run the content, structure, visual, and interaction checks after each route. Keep the original local content until the whole site passes.

### Phase 7. Prepare Cloudflare Pages

Connect the GitHub repository to Cloudflare Pages with these settings:

* Production branch: `main`.
* Build command: `npm run build`.
* Output directory: `build`.
* Node version: 22.

Cloudflare supports Git builds, build settings, and environment variables. See the [Cloudflare Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/).

Make the SvelteKit base path depend on the hosting environment:

* GitHub Pages keeps `/sru-project` during the review period.
* Cloudflare Pages uses an empty base path.

Keep GitHub Pages available while the Cloudflare version is tested. Do not change the public domain yet.

Completion rule: the GitHub Pages site and the Cloudflare Pages site show the same approved version.

### Phase 8. Connect Publish to Cloudflare

Create one Cloudflare deploy hook for the `main` branch. Store its URL in Sanity webhook settings. Do not commit the hook URL. Cloudflare documents direct Sanity support for Pages deploy hooks. See the [Cloudflare deploy hook guide](https://developers.cloudflare.com/pages/configuration/deploy-hooks/).

The Sanity webhook should:

1. Use the production dataset only.
2. Send a POST request.
3. Ignore draft changes.
4. Watch only the seven content document types.
5. Start a build when published content changes or is removed.

Sanity webhooks ignore draft documents by default and support filters by document type. See the [Sanity webhook guide](https://www.sanity.io/docs/content-lake/webhooks).

Completion rule: pressing Publish starts one production build, and the new content appears when that build succeeds.

### Phase 9. Review and cut over

1. Stop content edits for the short final review period.
2. Publish the final Sanity documents.
3. Check both languages on every page.
4. Check the final Cloudflare build.
5. Point the public domain to Cloudflare if the project uses one.
6. Keep the GitHub Pages version and the local content setting for a rollback period.
7. Save a final Sanity dataset export.

Cloudflare can return production to a previous successful deployment. See the [Cloudflare rollback guide](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Do not remove the old local content files until the owner accepts the new editing system and the rollback period ends.

## Regression checks

### Content checks

* Every English and French field in the editing scope has an owner and source.
* No paragraph, heading, caption, source, link, note, project card value, resident quote, resource entry, or bibliography entry is missing.
* Bibliography formatting and punctuation match the baseline.
* No Markdown symbols appear as visible text.
* Missing translations stop the build.
* Removed or unused content does not return.
* Text outside the editing scope remains unchanged in code.

### Structure and style checks

* The renderer produces the same HTML elements and classes.
* Heading levels remain the same.
* Paragraphs and lists have the same boundaries.
* Note links and return links work.
* Paired charts keep the same grid.
* Every page and list keeps its original order.
* Rich text does not add wrapper elements that change spacing.
* Important font, width, spacing, position, and color values match the baseline.
* Browser screenshots match at the approved desktop and mobile sizes.

### Interaction checks

* The language choice still updates `?lang` and local storage.
* The table of contents and previous and next links work.
* The glossary works with pointer and keyboard input.
* Map tabs, filters, zoom, drilldown, tooltips, and reset actions work.
* Chart filters, legends, search, and tooltips work in both languages.
* The introduction graphic works in normal, short iframe, and mobile layouts.
* The post occupancy index reaches the correct project.
* Project cards remain readable and keyboard accessible.
* Every image keeps the correct caption.
* The resident voice diagram keeps its current hover, focus, selection, Escape, count, color, and geometry behavior.
* All links and assets load.

### Build checks

The build should stop when it finds:

* A missing English or French value.
* A missing named content field.
* An invalid link.
* A missing project, image, resident topic, or quote ID.
* A changed relationship between post occupancy translations.
* A changed fixed list order.
* A rich text element that the renderer does not support.

If a new build fails, the last successful public deployment should remain active.

## Accounts, access, and cost

The Sanity project is named `Loi SRU 25`. Its project ID is `c5o3dddy`, and it uses the `production` dataset. The project was created by Ananmay Sharan. Professor Magda Maaoui must receive organization and project administrator access before handoff.

A separate Cloudflare account named `Loi SRU 25` has been created for this website. It does not contain personal projects. Professor Maaoui must receive Super Administrator access before handoff. Ananmay can leave the account after the owner confirms access.

The intended permanent GitHub repository is `magdamaaoui/loi-sru-25`. Ananmay currently has write access. The implementation branch is `codex/sanity-text-migration`.

Sanity Free currently includes up to 20 seats and two public datasets. The only Free roles are Administrator and Viewer. The person who edits and publishes will therefore need the Administrator role. See [Sanity pricing](https://www.sanity.io/pricing) and [Sanity roles](https://www.sanity.io/docs/content-lake/roles-concepts).

Cloudflare Pages currently allows 500 builds each month on the Free plan. A normal publishing schedule for this site should stay below that limit. The Sanity webhook should only run for published changes so drafts do not use builds.

The plan does not require a paid server, a database server, a Cloudflare Worker, or a preview site.

## Handoff material

The completed project should include:

1. The Sanity Studio source and schemas.
2. The repeatable content import.
3. Generated query types.
4. A list of every editable field.
5. A list of page text that remains in code.
6. A short editor guide with screenshots.
7. Instructions for publishing and checking a Cloudflare build.
8. Backup and rollback instructions.
9. Instructions for replacing the deploy hook.
10. The expanded English and French test suite.
11. A final report that confirms no content is missing.

## Implementation decisions

The first implementation uses these decisions.

1. Main navigation labels and previous and next page labels are editable. Route paths and page order remain fixed in code.
2. Studio shows English and French in separate field groups so the form stays readable.
3. Resource and bibliography items keep their current count and order. The editor may change their text and links.
4. Cloudflare will first publish to a `pages.dev` address. A custom domain can be connected after the owner approves the site.
5. Professor Magda Maaoui will own the GitHub repository, Sanity organization, and Cloudflare account after handoff.
6. The large overseas commune file will be split into several local files without simplifying its geometry.
7. A normal content update may take a few minutes because Cloudflare must rebuild the static site after each Sanity publication.
8. The local content will remain in the repository during the rollback period. It can be removed only after the owner accepts the editing system and a final Sanity export has been saved.
