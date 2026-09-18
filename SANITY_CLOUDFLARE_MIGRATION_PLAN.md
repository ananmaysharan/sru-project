# Sanity and Cloudflare Pages: current status and handoff

Last updated: September 17, 2026.

The text migration is implemented and deployed. All six public pages and the shared site settings use published Sanity content on Cloudflare Pages. The hosted Studio is available, the publishing webhook is configured, and all seven case study projects now have bilingual hover cards. The remaining work is owner acceptance, access verification, the domain decision, and the final handoff.

This document replaces the original migration proposal. Completed work is summarized below; the remaining checklist records work that has not yet been confirmed.

## Access and project identifiers

| Resource | Address or setting |
| --- | --- |
| Public website | [loi-sru-25.pages.dev](https://loi-sru-25.pages.dev/) |
| Content editor | [loi-sru-25.sanity.studio](https://loi-sru-25.sanity.studio/) |
| Sanity administration | [Manage Loi SRU 25](https://www.sanity.io/manage/project/c5o3dddy) |
| Production repository | [magdamaaoui/loi-sru-25](https://github.com/magdamaaoui/loi-sru-25), branch `main` |
| Development repository | [ananmaysharan/sru-project](https://github.com/ananmaysharan/sru-project), branch `codex/sanity-text-migration` |
| Local Git remotes | `professor` is production; `origin` is development |
| Cloudflare account and Pages project | Account `Loi SRU 25`; project `loi-sru-25` |
| Sanity organization | `oiwpiiob7`, last observed under Ananmay Sharan |
| Sanity project and dataset | Project `c5o3dddy`; dataset `production` |
| Studio application | `xck3fw3i96als2wphn06c6f5`, recorded in `studio/sanity.cli.ts` |

Sign in to Studio with a Sanity account that has permission to edit the project. Sanity Manage is for administration, members, and webhooks. Page text is edited in Studio. The Studio address may redirect into Sanity’s organization interface.

## Editor workflow

1. Open the hosted Studio and select a page or Site settings.
2. Select the English or French tab and edit the relevant fields.
3. Resolve validation errors, then press Publish. Both languages belong to the same document and publish together.
4. Allow Cloudflare to finish rebuilding, then refresh the public website. Observed builds took roughly two to three minutes; timing can vary.

Draft edits do not update the public site. A failed build leaves the previous successful deployment available. When a published change does not appear, check the Sanity webhook attempt log and the Cloudflare deployment log.

## Editing scope and fixed structure

Editors can change headings, paragraphs, descriptions, captions, source labels, acknowledgements, glossary definitions, project card text, resident topic names and quotes, resource and bibliography entries, and their supported links. Main navigation labels and previous/next labels are also editable.

Section and item reordering is out of scope. Page structure, route paths, CSS, fonts, colors, layout, heading levels, image files and crops, chart data, geographic data, animations, and interaction behavior remain in code. Interactive control labels, legends, axes, data tooltips, image alternative text, and accessibility instructions also remain in code.

Studio exposes named English and French fields, generally with `En` and `Fr` suffixes. Rich text is restricted to formats supported by the existing renderer. Fixed arrays hide add, remove, duplicate, copy, and reorder actions. Permanent IDs connect captions, projects, topics, quotes, headings, and notes to their intended content. Website validation checks required values, IDs, counts, order, links, and supported rich text structure during builds.

Project card Notes fields may be empty and are hidden on the website when blank. Other card values remain required. Project card links use the same destination in both languages.

## Migrated documents

There are seven fixed Sanity documents, covering six pages plus shared settings.

| Document ID | Public route | Content included |
| --- | --- | --- |
| `siteSettings` | Shared layout | Browser title, skip link, navigation labels, previous/next labels, glossary |
| `introductionPage` | `/` | Hero text, introduction, dashboard guide, acknowledgements, eight endnotes per language |
| `supplyPage` | `/supply` | Section text, captions, descriptions, methods essay, two endnotes per language |
| `healthOutcomesPage` | `/health-outcomes` | Section text, nine metric definitions, methods text, one endnote per language |
| `postOccupancyPage` | `/post-occupancy-evaluation` | Three opening paragraphs, 44 image captions, seven project cards, six resident topics, 19 quotes, conclusion, nine endnotes per language |
| `resourcesPage` | `/resources` | Two fixed sections and 180 entries per language, including links |
| `bibliographyPage` | `/bibliography` | Seven fixed sections and 40 entries per language, preserving inline formatting and links |

### Latest addition: the two missing hover cards

Gignac-la-Nerthe and Maréchal Fayolle were added in English and French. All seven projects now have cards, with eight stored fields per card. Gignac has seven visible rows because its Notes field was supplied empty. Source links are now clickable in the card renderer.

The addition updated local fallback content, the website validator, the Studio schema, and the published Sanity document. The migration preserved the original five cards and every other field in the document, verified against a saved backup. The Studio was redeployed and the public cards were checked in both languages.

Relevant commits:

- `0142b28`: new hover cards, source links, schema updates, browser tests, and migration script.
- `6fb02a1`: corrected the migration to update both language arrays in one revision-guarded patch.

Both commits are on the development branch and the professor’s `main` branch. The migration is repeatable and leaves existing cards untouched. Its default mode only reports proposed additions.

## Architecture and deployment

GitHub stores the code, images, styles, chart data, and map assets. Sanity stores editorial content. Cloudflare builds and serves a static SvelteKit site. The public browser receives both languages in the generated page data; it does not fetch editorial content from Sanity at runtime.

The Sanity client uses `useCdn: false` and the `published` perspective. The public site does not need a Sanity write token.

### Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Git repository | `magdamaaoui/loi-sru-25` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | Repository root |
| Build command | `npm run build` |
| Output directory | `build` |
| `NODE_VERSION` | `22` |
| `CONTENT_SOURCE` | `sanity` |
| `DEPLOY_TARGET` | `cloudflare` |

Automatic Pages builds run after pushes to `main`. The earlier Workers setup was replaced with the correct Pages setup; `wrangler deploy` is not this project’s deployment command.

`svelte.config.js` selects the production base path. Cloudflare uses `/`; the retained GitHub Pages build uses `/sru-project`. Development mode uses `/`.

### Publishing webhook

Cloudflare has a deploy hook named `Sanity Publish`, targeting `main`. Sanity has an enabled webhook named `Rebuild Cloudflare Pages` with these settings:

- Dataset: `production`.
- Method: `POST`.
- Events: create, update, and delete of published documents.
- Filter: the seven document types listed above.
- Draft and version triggers: disabled.

The private hook URL is stored in the service settings and must not be committed. A direct POST to the hook successfully produced deployment `44b03fa2-d91c-4416-b8d3-6ed0912afd81`. Automatic Git deployments were also verified. The later card update reached the public site after the code and Sanity content changes.

The initial hook test was a direct POST, not an editor pressing Publish. The final owner walkthrough should verify the complete Studio Publish flow and its Sanity delivery log.

### Studio deployment

Studio has separate dependencies and a lock file under `studio/`. Website deployments do not deploy Studio changes. After changing schemas or Studio configuration, deploy it separately:

```sh
cd studio
npm run deploy -- --yes --schema-required
```

The configured application ID updates the existing hosted Studio. Auto-updates are enabled. During the latest deployment, Sanity reported local version 6.12.0 and hosted runtime 6.15.0; the Studio build and deployment succeeded. Align those versions and review the hosted editor before handoff.

### Map assets

Map data is not stored in Sanity. The maps retain remote PMTiles sources and local GeoJSON fallbacks. The former 57 MiB commune fallback was replaced by roughly 3 MiB of boundaries for the 2,180 SRU communes; the nationwide department fallback is roughly 2.6 MiB. The migration build passed the Cloudflare asset-size check. Regenerate these files with `npm run build-map-fallbacks`.

## Code map

| Location | Responsibility |
| --- | --- |
| `studio/sanity.config.ts`, `studio/structure.ts` | Studio setup and seven fixed document entries |
| `studio/schemaTypes/` | Bilingual fields, rich text rules, fixed arrays, validation |
| `studio/sanity.cli.ts` | Sanity project, dataset, and hosted application ID |
| `src/lib/server/sanity.ts` | Published-content Sanity client |
| `src/lib/server/*-content.ts`, `src/lib/server/site-content.ts` | Queries, typed conversions, validation, local/Sanity selection |
| `src/routes/+layout.server.ts`, `src/routes/**/+page.server.ts` | Load validated text for the layout and pages |
| `src/lib/server/editorial-portable-text.ts` | Converts Sanity rich text into the editorial model |
| `src/lib/utils/editorial-markdown.ts` | Parses retained local essays |
| `src/lib/components/sections/EditorialMarkdown.svelte` | Editorial markup and formatting |
| `src/lib/data/case-study-ids.ts`, `src/lib/data/project-id-cards.ts` | Permanent project/image IDs and local card content |
| `src/lib/components/sections/ProjectIdCard.svelte` | Hover-card layout, optional Notes, source links |
| `src/lib/i18n.ts`, `src/lib/data/routes.ts` | Language preference, route identities, navigation order |
| `scripts/sanity/build-import.ts` | Reports and exports original local content as Sanity documents |
| `scripts/sanity/add-missing-project-cards.ts` | Adds cards with backup, revision check, preservation verification |
| `e2e/` | Browser, content, interaction, and map asset tests |
| `.github/workflows/deploy.yml` | Retained GitHub Pages workflow using local content |

The content layer uses handwritten TypeScript types and runtime validation. Generated Sanity query types were proposed in the original plan but were not implemented.

## Local development and checks

From the repository root, run the website with current published Sanity content:

```sh
CONTENT_SOURCE=sanity DEPLOY_TARGET=cloudflare npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open [the local website](http://127.0.0.1:5173/) or [the case study page](http://127.0.0.1:5173/post-occupancy-evaluation?lang=en). This reads published content, not drafts. Without `CONTENT_SOURCE=sanity`, `npm run dev` uses retained local content.

Run the editor locally with `npm run studio:dev`, then use the address printed by Sanity. The hosted Studio is sufficient for normal editing.

Useful checks:

```sh
npm run check
npm run content:report
npm run studio:build
CONTENT_SOURCE=sanity DEPLOY_TARGET=cloudflare npm run build
CONTENT_SOURCE=sanity DEPLOY_TARGET=cloudflare PLAYWRIGHT_SITE_PATH='' npm run test:e2e
```

The default browser test configuration builds the website and starts a preview server on port 4173. That port must be available. `content:report` checks local import data; it is not a comparison against current editorial changes in Sanity.

### Verification record

- During migration, local and Sanity output were compared for content, markup, formatting, headings, links, and notes. The complete 31-test suite passed in the Cloudflare root-path configuration before the latest card addition.
- For the two new cards, the website type check passed with zero errors or warnings, and the local content report found no relationship errors. The Studio build and deployment succeeded.
- The 14 focused project-card and post-occupancy tests passed with local content and again with live Sanity content. They cover both languages, hover/focus behavior, Escape, source links, caption relationships, mobile navigation, and the 844 × 390 layout.
- Four browser checks passed directly against the public Cloudflare site for the new bilingual card details and short-screen layouts. Rendered screenshots were also inspected.
- The full suite has not been rerun since the two-card addition. Run it for final acceptance rather than treating the historical 31-test result as a current full-suite result.
- A standalone Studio `tsc --noEmit` check exposed existing singleton-type errors in `studio/sanity.config.ts`. The Studio build succeeds; resolve the separate type-check issue before calling all repository checks clean.

The original migration comparisons apply to the original content. Later approved edits, including the new cards and clickable source links, intentionally change that output.

## Backups and rollback

Local content remains in the repository, and the previous GitHub Pages site has not been removed or redirected by this migration. It uses local content and will not automatically reflect later Sanity edits. It is a fallback snapshot, not a continuously synchronized copy of Cloudflare.

Sanity exports and migration backups are stored locally in the ignored `.sanity-import/` directory. They are not included when the professor clones the repository. Transfer a final export to storage she controls as part of handoff.

Before bulk content changes, export or back up the affected documents. Do not reimport the full original content over current Sanity documents: that could replace later editorial edits. The card migration updates only its intended arrays, checks the document revision, and verifies all other content afterward.

If a deployment fails, inspect its log and correct the offending content or code. For a bad successful release, an administrator can restore a previous Cloudflare deployment. A website rollback does not undo Sanity edits, so correct Sanity too before the next build. Keep local fallback files until the owner accepts the site and a final export is secured.

## Remaining handoff checklist

- [ ] Confirm Professor Maaoui can sign in to Studio and edit/publish. The project was created under Ananmay’s organization; ownership transfer and her administrator access are not yet recorded as complete.
- [ ] Confirm the professor controls Cloudflare account recovery and administrator access. Repository connection and deployments are complete; access handoff needs explicit verification.
- [ ] Confirm permanent GitHub, Sanity, and Cloudflare ownership before removing Ananmay’s access.
- [ ] Walk through an approved text edit, Publish, successful Sanity webhook delivery, completed Cloudflare build, and visible website update with the professor.
- [ ] Review all six pages in both languages on desktop and mobile. Include map mainland/overseas views, filters, glossary, case study navigation, captions, resident interactions, notes, and links.
- [ ] Run the full regression suite after final content approval. Resolve Studio type-check errors and review its automatic runtime updates.
- [ ] Decide whether to retain `pages.dev` or connect a custom domain. No custom-domain cutover is recorded as complete.
- [ ] Confirm account plans remain suitable for the zero-cost goal. Sanity was last observed on a Growth trial; verify the post-trial plan and current usage before handoff. This document does not assume paid features or promise current plan limits.
- [ ] Save a fresh complete Sanity export and give the professor the backup, repository access, editor instructions, build troubleshooting steps, and rollback instructions.
- [ ] Agree on the fallback retention period before removing local content or the previous deployment.

No section reordering, visual editing, dedicated preview site, or additional editable data controls are included in this completed migration.
