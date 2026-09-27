# Build and verification notes

Updated 27 September 2026. The implementation brief is [CREATIVE-DIRECTION-v2.md](CREATIVE-DIRECTION-v2.md).

## Architecture

Normal mode is pre-rendered React HTML with searchable projects, category filters, selected work, About and Contact. GitHub Pages receives 89 static pages plus a 404 page. A scrolling Clients & collaborators strip begins Google, Netflix and Lollapalooza, with the remaining names supplied by the owner, the original portfolio and the résumé. The opening starts with Darlings and has a randomized seven-project deck. It pauses on hover/focus and under reduced-motion preferences. The résumé contributes two attributed results: 5.2M views in one month at Trunativ and 305% viewership growth at Schbang. The archive count comes from the project data.

Overview and Explore both use a complete, native portfolio scroll. All 79 projects appear exactly once across 15 sections, after a curated opening of the major-name work. The remaining projects are grouped and interleaved by film, campaigns, short form, YouTube and live events. Six layout arrangements and five internal visual treatments provide variety. Public labels describe the work; design-process labels are not shown. New projects automatically join the sequence.

The opening shuffle advances roughly every two seconds. A moving thumbnail strip includes the complete archive before the client marquee. The browser title and social metadata use “Prantik Dutta's Portfolio”.

Explore retains the reactive Three.js geometry underneath the scrolling collection. Overview keeps the floating 3D controls. Both scroll views use IntersectionObserver to limit autoplay to three visible YouTube projects on larger screens and two on phones. Offscreen players unmount. Images remain visible for other providers, with the original project viewer and source links available. Reduced-motion and data-saving settings disable automatic player loading.

Media is rendered in HTML, independently of the WebGL canvas. This avoids making original images depend on successful GPU texture uploads. React Three Fiber / Three.js load only in Fun mode. A room environment supplies reflections; rendering happens on demand and suspends in hidden documents and while a project panel is open. Pixel density is capped at 1.75, or 1 in Eco mode. Eco also disables glass transmission. The same worlds keep working with CSS depth and reactive geometric forms if WebGL fails.

Up to three YouTube IFrame API players are mounted for visible projects on larger screens; phone layouts use two. Companion films remain muted. Opening a themed Easter egg pauses the scene films and runs its own temporary player. It starts muted, waits for the provider's PLAYING event before dissolving the local poster, and debounces rapid project switches. Portrait and landscape work use their source aspect ratios. Playback pauses in hidden tabs; opening a project removes the ambient player. Visitors can pause or enable sound. Reduced motion and data-saving preferences disable automatic video loading. A local poster, manual Play button and project/source links remain available when streaming is blocked or fails.

Small themed controls open a floating film window after a short pointer dwell, scrolling over them, or tap/keyboard activation. Its treatment matches the trigger: aperture flash, film frame, backstage ticket or retro dialog. Floating 3D forms on Normal also reveal films. Peripheral images open their corresponding film or project. All 79 original project records, source URLs, embeds and 11 AI disclosures are retained. Instagram and Drive use their original provider embeds inside the project viewer. Source links are always available.

## Verification

- Content validation passed for all 79 records; all four project-editing tests passed.
- The `/portfolio/` production build passed TypeScript, both rendering entries and all 89 pre-rendered pages plus 404.
- The revised project data has been compared with the prior published commit: every project ID, original URL, embed and disclosure matches.
- The desktop and 390 × 844 phone layouts have been inspected in the browser, including the opening shuffle/stats, glass/brutalist/collage/retro compositions and portrait framing.
- The compatibility scene renders actual local images rather than empty frames when the browser disables WebGL. The complete-scroll update includes a direct coverage check: 79 of 79 project IDs appear exactly once across 15 sections.

The test browser disables WebGL, so hardware rendering and sustained GPU performance still need a physical-device check. The browser loaded YouTube embeds but streaming remained at zero ready state, so successful continuous playback could not be confirmed in this environment. The poster and manual-play fallback were inspected. No field Core Web Vitals score, formal accessibility audit or device battery benchmark is claimed.

## Owner editing and automation

The public GitHub repository is the source of truth; visitors receive no write interface or publishing token. Publishing, media recovery and project editing check `github.actor == github.repository_owner`. No collaborators are added. The publishing workflow tests and builds before deployment. Account and repository permissions remain controlled by the owner.

The media recovery action now tries genuine larger YouTube thumbnails and preserves the current image when a higher-resolution original is unavailable. It does not upscale small originals. Its automatic commit triggers the reusable publishing workflow.

| Change | File or interface |
| --- | --- |
| Add or edit projects | GitHub Actions → Add or update a project |
| Opening shuffle selection | `content/showcase.json` |
| Client and collaborator strip | `content/clients.json` |
| Floating Easter egg player | `src/SecretPlayer.tsx` |
| Bio, contacts, disciplines | `content/site.json` |
| Project data and original links | `content/projects.json` |
| Media | `public/media/` |
| Restore or improve posters | GitHub Actions → Restore missing portfolio images |
| Normal opening | `src/HomeIntro.tsx`, `src/experience.css` |
| Complete scroll and section layouts | `src/PortfolioScroll.tsx`, `src/portfolioSections.ts`, `src/portfolio-scroll.css` |
| Explore background | `src/Universe.tsx`, `src/JourneyScene.tsx` |
| 3D geometry | `src/JourneyScene.tsx` |
| Reused video player | `src/JourneyPlayer.tsx` |
| Reactive name | `src/KineticName.tsx` |
| Deployment | `.github/workflows/deploy.yml` |

Source recovery inventory: 41 original YouTube embeds, one original Drive embed and 37 linked image records, subsequently linked to their original providers. There are 78 local posters; one stand-up record has a type fallback. The original showreel was under maintenance and has not been invented. Two original brand TinyURLs could not be resolved during migration and are kept unchanged. Platform login, geographic restrictions and later source removals remain under the providers' control.


## Infinite journey restoration — September 27

Explore now uses native scrolling with recycled depth panels, a smooth camera approach and a continuous loop across every category. Category jumps, brand filtering and sorting share the same complete content source as Overview and All work. The Three scene reuses five zones of low-poly platforms, faceted objects, film cameras, CRT monitors and gateways; CSS perspective and faceted geometry preserve the interaction when WebGL is unavailable.

Desktop scenes mount up to three official YouTube players; narrow scenes mount two. Non-active streams unmount, and all media retain posters and source links. Rendering is demand-driven and capped at DPR 1.5; hidden tabs and overlays suspend motion and playback. Scroll settles at a viewing position after travel.

`content/positioning.json` holds six results and three short process write-ups grounded in the supplied résumé. A retention percentage is not supplied and has not been invented. Known brand/channel mappings come from the original portfolio headings and the recovered publisher metadata; unmapped work remains visible under All brands. Public project counts are removed.
