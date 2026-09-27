# Prantik Dutta — spatial portfolio, revision 2

## The prompt

Act as Prantik Dutta's art director and creative developer. Revise the existing GitHub Pages portfolio in place. The deliverable is an elegant, tactile journey through genuinely different art directions, with working moving images and discoverable interactions. It must feel composed on a laptop and a phone, including when WebGL is unavailable. Reuse the existing React, Three.js, content inventory, images, official video players and publishing automation. Do not replace the project or invent credits or new portfolio work.

The first version failed artistically and functionally: a repeated collage layout is not a journey through different visual languages; unreadable texture zoom and empty frames are unacceptable. Resolve those failures structurally before adding effects.

Lead the opening selection with the major work already present in the portfolio: Netflix trailers, Prime Video comedy, Mumbai Indians, Lollapalooza and the major YouTube work. Shuffle only this curated set; start with Darlings. Keep every original project ID, source URL, embed URL and disclosure intact. Use the supplied résumé only for relevant creative-production positioning and two clearly attributed performance figures: Trunativ's 5.2 million views in one month, and Schbang's 305% viewership growth. Do not reproduce the résumé's address, employment history or unrelated claims. The third opening statistic is the actual archive count.

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
- In Fun, use a single reusable YouTube player for the selected film. Request muted inline playback, wait for the playing event, then dissolve from the poster to the film. Never fade in an empty white iframe.
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
