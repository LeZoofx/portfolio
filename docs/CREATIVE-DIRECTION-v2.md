# Prantik Dutta — spatial portfolio, revision 2

## The prompt

Act as Prantik Dutta's art director and creative developer. Revise the existing GitHub Pages portfolio in place. The deliverable is an elegant, tactile journey through genuinely different art directions, with working moving images and discoverable interactions. It must feel composed on a laptop and a phone, including when WebGL is unavailable. Reuse the existing React, Three.js, content inventory, images, official video players and publishing automation. Do not replace the project or invent credits or new portfolio work.

The first version failed artistically and functionally: a repeated collage layout is not a journey through different visual languages; unreadable texture zoom and empty frames are unacceptable. Resolve those failures structurally before adding effects.

Lead the opening selection with the major work already present in the portfolio: Netflix trailers, Prime Video comedy, Mumbai Indians, Lollapalooza and the major YouTube work. Shuffle only this curated set; start with Darlings. Keep every original project ID, source URL, embed URL and disclosure intact. Use the supplied résumé only for relevant creative-production positioning and the relevant, attributed results in content/positioning.json. Do not reproduce the résumé's address or unrelated claims. Do not display a project count.

## Art direction

Luxury comes from proportion, lighting, materials, precise motion and restraint. Do not put every world inside the same glass card or recolour the same composition five times. Keep the navigation stable while the world changes.

| World | Composition and material | Spatial movement | Discovery |
| --- | --- | --- | --- |
| Glass | Ink blue, translucent frost, large quiet serif lettering, luminous edges, restrained faceted geometry. One clean cinema frame and smaller floating photographic planes. | A slow lateral orbit and gentle approach; layers have different parallax depths. | A camera-like aperture reveals the Glambot film. |
| Mass | Chalk, black, red; monumental condensed lettering, concrete slabs, asymmetry, severe negative space. Media sits in an architectural opening. | Rise and move past a slab rather than magnifying the entire screen. | A film marker reveals a trailer. |
| Cut | Prantik's deliberate anti-design: actual work fragments, hard photocopy masks, purposeful collisions, offset registration, abrupt crops and legible bitmap-scale labels. | Diagonal displacement and controlled rotation, with an editorial overlap into the next world. | A concert-ticket fragment reveals the NH7 film. |
| Desktop | A recognisable late-1990s window system, pixel typography, restrained scanlines, suspended physical windows and a photographic desktop. Curseweb comes from displaced interface fragments and strange image relationships, not random neon glitches or nonsense writing. | Windows drift with inertia and rotate in depth while their readable faces settle square to the viewer. | A small executable/window control reveals an AI film; touch has a visible equivalent. |
| Afterimage | A dark photographic viewing space, warm white italic type, a vertical film beside a horizontal contact strip. Preserve the work's original colour. | Travel through the dominant frame; align the exit with the opening world for a repeating journey. | A contact-sheet thumbnail reveals another film. |

Worlds are visual environments, not category filters. Use relevant existing work across them. Preserve AI disclosures at the project level. Earlier preferences for scanner-contact realism, candid photographs, legible text and intentional bitmap fragments inform the treatment; do not publish literal subjects from unrelated personal conversations or fabricate a scanography artwork.

## Interaction and motion

- Normal and Fun remain plainly available. Remove repeated slogans, project IDs and explanatory paragraphs from the scene. A compact chapter navigator, media controls and the work index are enough.
- Render “Prantik Dutta” as individually responsive 3D letters. Cursor proximity determines the flip/tilt; the letters settle when the cursor leaves. Retain one accessible name and respect reduced motion.
- Use native wheel/touch scrolling through a bounded, repeating timeline. Map that timeline to a closed camera path, alternate lateral/vertical/orbital motion, layered parallax and distinct transition poses. Do not hijack pinch zoom or require drag on a small canvas.
- Provide direct chapter controls and keyboard operation. Suspend background interaction behind a project overlay.
- Use deliberate hover dwell before revealing a themed video. Do not steal keyboard focus or open modal dialogs merely because the pointer crossed an object. A tap or keyboard activation performs the same discovery on devices without hover.
- Keep the transition through adjacent worlds composed. Recycle scene objects; do not accumulate chapter instances on every loop.

## Moving images

- Keep crisp images, typography and official video players in the DOM; use WebGL for spatial geometry and lighting. An iframe is not a video texture.
- Choose the media frame from the project's real aspect ratio. Portrait work must not be stretched into a landscape box or hidden behind oversized crops. The frame may move, but the film stays correctly proportioned and readable.
- In Explore, use up to three simultaneously visible YouTube players on desktop and two on mobile. Request muted inline playback, wait for the playing event, then dissolve from the poster to the film. Never fade in an empty white iframe.
- Scrolling into the next world may select its film; retain the current player when the selected project is unchanged. Debounce fast travel so passing a chapter does not create a new stream for every scroll event.
- Sound requires an explicit control. Pause when the page is hidden or a project overlay is open. Respect reduced-motion and data-saving preferences with a poster and explicit Play action.
- Autoplay is a request, not a guarantee. If blocked or unavailable, keep the real poster, a usable Play control and the original-source link. Instagram/Drive items retain their supported players or source links; do not pretend their autoplay behaviour matches YouTube.

## Rendering and device requirements

- Reuse installed React Three Fiber and Three primitives, including built-in environment helpers where appropriate. No new physics engine, postprocessing stack or bespoke model pipeline is required for these interactions.
- One canvas, bounded geometry, shared materials, capped pixel ratio, and an on-demand render loop awakened by interaction or transitions. Keep media resolution independent of canvas quality.
- Render the entire content and interaction layer even when WebGL creation, textures or context restoration fails. The compatibility path must have the same composition and media, not empty boxes or a separate low-quality mockup.
- On narrow screens, recompose around one dominant frame, fewer peripheral images and safe-area-aware controls. Use 44px tap targets and keep the bottom player controls above the chapter rail.
- Use sharper available source thumbnails for focal artwork; retain a working local poster if an upstream high-resolution rendition is unavailable. Do not upscale a small image and call it high resolution.

## Acceptance

Before publication, inspect every world at desktop and phone sizes. Check the name response, distinct compositions, forward/reverse scroll, repeated wrap, portrait and landscape framing, poster-to-player handoff, mute/pause, hidden-tab behaviour, keyboard/touch alternatives, project overlay cleanup, reduced motion and rendering failure. Run the existing content/edit tests and production build. Verify the actual GitHub Pages deployment. Report any graphics-enabled physical-device testing that was not available.

## References used as principles

- Existing content and media: https://prantikdutta.myportfolio.com/
- Seamless scale continuity: https://zoomquilt.org/
- Discoverable spatial interaction: https://bruno-simon.com/
- Material, motion and art direction: https://lusion.co/
- Official YouTube player lifecycle and events: https://developers.google.com/youtube/iframe_api_reference
- Browser autoplay behaviour: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- On-demand rendering: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- Three.js texture lifecycle: https://threejs.org/docs/pages/Texture.html

These external sites are references for particular principles, not claims of Prantik's endorsement and not templates to copy.


## Final owner feedback · 27 September 2026

Show several moving films in every Fun world: three on larger screens, two on phones or Eco mode, with original portrait/landscape proportions. Keep companion audio muted. Reuse the same small player pool across worlds. A discovered film opens in a themed floating window and temporarily pauses the background players. Hover, scroll-over, tap and keyboard activation all reveal it. Normal also has floating, reactive 3D forms that conceal films.

Add a continuously scrolling “Clients & collaborators” strip on the first page, starting Google, Netflix and Lollapalooza. Google is explicitly supplied by the owner; the remaining brands and collaborators come from the original portfolio and résumé. Keep names editable in one JSON list.


## Complete portfolio revision · 27 September 2026

Both Overview and Explore must show every project in the main scroll. Lead with the major-name selection, then interleave the remaining projects in varied film, campaign, short-form, YouTube and live-event sections. Keep the searchable All work menu as an additional route. Use up to three visible autoplay players on larger screens and two on phones, with poster fallbacks and original sources retained. Make the opening shuffle run approximately every two seconds and expose the full archive in an animated thumbnail strip.

The public site name is “Prantik Dutta's Portfolio”. All interface copy must describe the work professionally. Internal visual-treatment names must never appear as page headings or navigation labels.


## September 27: binding recap and correction

The user positions himself as a **post-production specialist with reach and retention expertise**. Restore that context with concise process writing and résumé-backed outcomes; do not invent a retention percentage. Rotate all relevant statistics, including audience growth, delivery capacity, team leadership and managed budget scale. Remove project totals, progress fractions and numbered project cards from the public experience.

The existing elegant materials and different art directions must be developed into an actual low-poly game-like flight: faceted terrain, architectural platforms, physical film cameras, CRT objects, polygonal gates, a moving camera and reactive 3D props. Scroll travels through depth and loops continuously; a background canvas behind a flat archive does not satisfy this. Reuse React Three Fiber, shared geometry, official players and existing assets. No imported asset licence or new game engine is required.

Typography is part of the art direction: cursor-reactive 3D letters for the name, heavy condensed slab reveals for Film, offset registration and fragmented letter movement for Campaigns, stepped terminal reveals for Short form, restrained serif depth for Highlights/YouTube, and a scan-like reveal for Live & comedy. Text always resolves to readable professional headings. Use visual techniques from the user's cursedweb, anti-design micrographics and scanography preferences; do not add unrelated heart imagery, random chrome, random scribbles or nonsense words.

The public navigation is **Highlights, Film, Campaigns, Short form, YouTube, Live & comedy** with **All brands** filtering and **Brand A–Z** sorting. The complete source collection appears along the journey and in Overview/All work; highlights may also recur in their own category. Keep category sections contiguous. The labels Glass, Mass, Cut, Desktop and Afterimage are internal material names only.

Premium motion means the camera eases, media settles into a usable view, correct aspect ratios are preserved, and typography does not obstruct video. Several films may play together. Keep streams mounted only for the active scene, mute by default, dissolve only once playback starts, and preserve posters/source links when a provider blocks autoplay. Touch, keyboard, reduced motion and WebGL fallback retain a usable composition. Stats, positioning and brand/context labels are visible in Explore too, not only on an About page.


## Platform correction and stronger visual separation

Instagram source URLs must never be classified as YouTube. The seven Instagram promotions originally listed inside the source portfolio's Social (YT) page are now Short form. Platform labels derive from the canonical source host and appear independently of category and brand. The validator rejects future category/provider mismatches; original project IDs and source URLs remain unchanged.

The six environments now differ across the entire viewport: glacial ink and translucent frost; pale architectural Film with black slab lettering; cobalt/acid Campaigns with registered type fragments and halftone marks; green CRT Short form with bevelled windows and terminal type; warm photographic contact sheets with scanned serif lettering; and paper/red editorial YouTube with baseline rules. Long categories also vary material treatment between scenes. The background crossfades with camera depth. No public style names are used.

The opening name uses sculptural condensed capitals, an outlined second line and the existing reactive 3D reverse faces. Category headings use per-glyph reveal, registration, scanner and folding behaviours instead of one generic fade. The complete moving clients/collaborators ribbon is visible in both Overview and Explore, beginning Google, Netflix, Lollapalooza. It remains alongside the rotating results in Explore and has its own pause control.

## September 27, 2026 — twelve visual worlds and public reach

Preserve the continuous low-poly depth camera, two website experiences, all source links, complete category and brand browsing, multivideo viewing, native aspect ratios, hover discoveries, owner-controlled GitHub publishing and reduced-motion/data-saving behavior. Public-facing copy names the work and practice; never name design instructions in the UI.

The following are visual systems, not palette variants: liquid optical panels; baroque engraved filigree and Bodoni type; Indian matchbox commercial print; 8-bit pixels and quantized motion; noir diagonal light; Frutiger Aero sky/green/gloss; Indian functional calendar rules and signpaint; brutalist slabs; acid anti-design registration; scanner-cut cursed web micrographics; thorned symmetrical cybersigilism and blackletter; classic beveled retro GUI. No unrelated art subjects, fake awards, invented client relationships, chrome blobs or random hand-drawn lines.

Each category advances through its assigned sequence in both views. Display copy becomes explicitly composed kinetic poster lines. Long project notes and the full About copy remain readable, with timed animated word clusters. Font distinctions are actual local fonts. Motion holds legibly between gestures and pauses offscreen.

Marquee: exactly three independently scrolling rows, alternating direction. Interleave every original client/collaborator name across rows; Google, Netflix and Lollapalooza open the three tracks. No separate lead row or client-list drawer. All rows are user-pausable and become manually scrollable with reduced motion.

Reach: public watch-page counters from linked uploads, deduplicated by video ID. Combined views are plays, never unique viewers. Distinct publishing channels are not labelled managed channels. Present individual video reach, combined reach, channel count and sourced career outcomes together. A source drawer exposes exact counts and capture dates. Unavailable and Instagram counters are excluded. No invented retention percentages. Weekly GitHub builds refresh public counters without credentials and retain dated snapshots on failure. No public project count.

## Playback and camera refinement

Chronology is Highlights → Film → YouTube → Short form → Live & comedy → Campaigns in both views and the work filters. The first item remains the hero; supporting frames have larger, legible controls. Instagram uses its native embedded player for visible slots, with missing embed URLs derived only from each existing source URL. Instagram's own player controls playback; no undocumented autoplay control or extracted media URLs are used. Idle slots can be activated inline; the shared initial load budget is three players on desktop. Phone browsing loads no video player until a project is opened.

Both arriving and departing media planes remain at or behind the settled viewing plane. Arriving worlds advance from depth. Departing frames keep their settled size and disperse individually past the viewport edges, revealing the next world behind. They never recede or cross the camera. Persistent animated Expand cues open a viewport-filling viewer with an explicit native Fullscreen control. Reduced motion disables attention pulses.


## Depth focus and simple mobile viewing

Desktop Explore uses restrained depth blur (up to 3.2px, less on lower-powered devices) and brightness falloff. The settled main player stays sharp, supporting frames are slightly dimmer, and hover or keyboard focus restores full clarity. The camera and outward dispersal paths remain unchanged.

Phones automatically use the normal document view, including links that request Explore. Keep every project, category order, brand filter, client row and statistic. Use single-column cards, native video aspect ratios, lazy poster loading and on-demand playback in the large viewer. Do not load the 3D scene, inline autoplay players, duplicated image strip or ornamental scene nodes on phones. Disable pointer motion, floating objects, typography loops and automatic image shuffling; keep the inexpensive client and results ribbons and manual shuffle control. Show the work before the longer career write-ups on mobile. Desktop retains both experiences.
