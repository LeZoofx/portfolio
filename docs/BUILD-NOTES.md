# Build and verification notes

Prepared 26 September 2026.

## Architecture

Normal mode is pre-rendered React HTML with searchable projects, category filters, selected work, About and Contact. React hydrates those pages. GitHub Pages receives only static files, with an explicit HTML page for every project and original category route.

Fun mode lazily imports React Three Fiber and Three.js. A perspective camera advances exponentially toward a render-to-texture portal. Crossing the portal rebases camera progress and recycles the stage. Only the current world and the next preview world are retained. Texture, geometry and render-target lifecycles are explicitly managed. Rendering happens on demand and pauses while a project panel is open or the page is hidden. Phone pixel density is capped at 1; desktop at 1.5. The quality control lowers resolution further.

The five visual chapters are Archive, Impression, Collage, Language and Frame. Their design uses condensed type, warm white/black, acid yellow, red, blue, hard masks, angled project frames, faceted geometry, registration marks and image treatments. This is a code-built interpretation of the creative brief using existing portfolio assets. It does not replace original videos or claim newly commissioned artwork. The Impression chapter applies a high-contrast print/scan treatment; a custom physical scanography artwork can be added later.

If WebGL cannot start, the site mounts a complete CSS perspective experience with a bounded two-stage 20× zoom loop. Normal mode remains available. Reduced-motion users get direct chapter changes. The website does not autoplay video, audio or a continuous camera fly-through. Browser zoom gestures remain available.

Only one video iframe can be active. YouTube uses its privacy-enhanced embed hostname; Instagram and Drive use their original provider hosts. Every item has an original-source link. AI disclosures remain verbatim.

## Verified

- TypeScript compilation and content validation: passed for 79 projects.
- Production build: 89 pages plus 404; root and `/portfolio/` base paths compile.
- Subpath build: checked asset URLs, project links, serialized route state and disclosure text. A production project deep link was also opened in the browser and hydrated successfully.
- Initial server-rendered page: no provider iframe.
- Four content automation tests: passed (featured ordering, Instagram/disclosure preservation, unsafe URL and unknown ID rejection, safe existing-project update).
- Browser: Normal homepage, project search and empty state, project modal, YouTube player loading on click, player removed on close, phone layouts at 390 × 844, and Fun compatibility scene.
- Browser: forward chapter navigation, return from chapter five to chapter one, and two retained CSS stages after looping.
- Fonts and project posters are self-hosted. One project without a recoverable poster has an intentional type treatment.
- A fresh clone of the completed GitHub repository passed all four editing tests, content validation, TypeScript compilation and the `/portfolio/` production build. All 78 image files decoded successfully.

The production Normal entry and its shared runtime total approximately 80 KiB compressed. The 3D chunk is approximately 240 KiB compressed and is requested only in Fun mode. These are bundle measurements, not page speed scores.

## Remaining verification limits

The test browser disables WebGL. The WebGL renderer compiles but has not been visually or performance-tested on a graphics-enabled physical phone or laptop. The complete compatibility experience was inspected instead. Browser-level input automation is not a substitute for touch testing on actual iOS/Android devices. No field Core Web Vitals, sustained GPU-memory profile, formal accessibility audit or long-duration device battery measurement is claimed.

The repository is published at `https://lezoofx.github.io/portfolio/`, with source at `https://github.com/LeZoofx/portfolio`. GitHub Actions successfully restored and committed all missing posters, then passed dependency installation, tests, production build, artifact upload and deployment. The first live publication completed on 27 September 2026 (India time). The live homepage and Fun compatibility mode were opened in the browser; the initial page contained no provider iframe. The earlier browser connection failure was recovered and no manual setup step remains. The optional local publisher is syntax-checked; its separate authenticated setup path has not run.

## Owner editing

The personal GitHub repository is the source of truth. Public viewers get no write interface or token. Both publishing and content-editing jobs check `github.actor == github.repository_owner`. No collaborators are added by the project. The project-edit workflow serializes updates; the publication workflow serializes deployment. GitHub runs tests and builds before publication. Account and repository permissions remain controlled by the owner.

## Source recovery

79 work records: 41 YouTube embeds, one Drive embed and 37 linked image records. 78 local project posters. 39 public YouTube titles recovered; remaining records retain source section labels or descriptive fallbacks. Eleven AI disclosures preserved. Original source occurrences are mapped in `source-audit.json`; `source-inventory.json` keeps source links and recovery status. The About background is a texture, not a portrait, and is not presented as a personal photograph. No showreel was fabricated.

## Maintenance map

| Change | File or interface |
| --- | --- |
| Add/edit a project | GitHub Actions → Add or update a project |
| Bio/contact/disciplines | `content/site.json` |
| Project data and poster paths | `content/projects.json` |
| Media | `public/media/` |
| Restore missing original posters | GitHub Actions → Restore missing portfolio images |
| Layout and typography | `src/styles.css`, `src/App.tsx` |
| WebGL scene | `src/Universe.tsx` |
| Lightweight scene and zoom | `src/ArchiveArt.tsx`, `src/LightUniverse.tsx` |
| GitHub deployment | `.github/workflows/deploy.yml` |
| Pre-rendered routes and SEO | `scripts/prerender.mjs` |

WebGPU, real-time video textures, post-processing stacks and ambient audio are not enabled in this version. They would add compatibility and resource costs without resolving the core portfolio task.
