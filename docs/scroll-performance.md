# Explore motion and rendering

Desktop Explore is a native vertical scroll container with mandatory CSS page snapping. All wheel and trackpad input reaches the browser unchanged through passive listeners. There is no fast/slow classification, momentum rejection, wheel cancellation, cooldown or animation queue. The existing zoom, dispersal and whole-plane depth use the native scroll position directly.

Transparent page markers define full-scene resting positions. `scroll-snap-stop: normal` lets a long or fast gesture cross multiple pages. `scrollend` completes any fractional resting position. Only browsers without `scrollend` use an idle fallback; the two paths never compete. A separate no-travel guard only releases the motion flag when wheel input causes no scroll event; it never invents a page movement from an inertia tail. New input can interrupt browser snapping immediately. Three lightweight marker cycles are recentered at rest to preserve infinite travel without rendering the whole archive.

The main header, category bar and bottom controls share the scroll container, eliminating sibling overlay dead zones. Every preview has a single full-frame expand target above its inert media surface; embedded players cannot capture page gestures. A continuously animated next-category link leads from Film to YouTube, YouTube to Short form, and onward. React commits newly visible planes before the corresponding animation frame is painted. Hover easter eggs remain available while settled and cannot intercept wheel input. Narrow touch screens keep the existing mobile gesture controller. Orbit animations pause during scroll input, and dialog focus restoration uses `preventScroll` so closing a film cannot pull the scene out of position.

References: [W3C CSS Scroll Snap](https://www.w3.org/TR/css-scroll-snap-1/), [MDN scroll-snap-stop](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-stop), [Chrome scrollend](https://developer.chrome.com/blog/scrollend-a-new-javascript-event). These are browser mechanisms for page feeds; no Instagram or YouTube proprietary code is claimed.

`scripts/scenery-source.tsx` retains the original low-poly meshes. `npm run bake:scenery` projects and shades them into cached SVG planes during dev/build, so visitors do not download Three.js or initialize WebGL. Camera-like movement uses compositor transforms on those same scenes.

The motion loop stops at rest. Layout geometry is cached per scene/layout/viewport, reads are batched before writes, and depth filters update on whole planes at bounded precision. Typography observers are limited in Explore. Completed orbit animations release their resources. Media starts after the interface, is staggered, and waits until transitions settle; the automatic cap is two previews on full devices, one on balanced devices, and click-to-play on constrained devices. The same Explore layout remains in all tiers.

Run `npm test` for native snap recovery, infinite recentring, mobile page deadlines, queue and capability regressions, then `npm run build` for content, types, baked scenery and static pages. Real-device performance still depends on third-party media, connection and browser hardware.

## Why the previous desktop implementation failed

The previous release discarded events classified as momentum and used device-dependent sample, acceleration and velocity thresholds to identify deliberate gestures. Those guesses could reject slow renewed input or treat a mouse differently from a trackpad. Fixed-duration page transactions then queued behind input. Loosening the thresholds did not remove either cause. Whole-page unit tests covered the animation endpoint, not actual browser input routing, so they were insufficient evidence of a responsive experience.

The desktop no longer uses that classifier, cancels wheel events, or queues page animations. CSS snapping receives the original browser input; long native travel remains multi-page. Only two neighbouring art planes are mounted, independent of how far the browser travels. Scroll recovery never rebuilds the media or installs per-frame geometry observers.
