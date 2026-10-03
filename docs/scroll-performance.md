# Explore motion and rendering

Explore keeps the existing category order, art direction, depth, orbiting frames and outward zoom transition. Normal input selects one integer scene target. A 240 ms wheel gap starts a new gesture; only repeated high-energy events within the first 170 ms can earn additional scenes, capped at three. Decaying momentum cannot accumulate more pages. Touch uses distance and velocity, and keyboard/category controls use the same scene transition.

The wheel input is normalized for pixel, line and page delta modes. Native scrolling stays available in Overview and dialogs. Browser zoom is not intercepted. Explore iframe previews pass pointer input to the scene; the expanded player remains interactive.

References: [MDN wheel event](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event) and [MDN scroll-snap-stop](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-stop). These inform paging and momentum handling; this is not an implementation of Instagram's internal gesture code. Native snap alone cannot control the existing zoom/dispersal transforms.

`scripts/scenery-source.tsx` retains the original low-poly meshes. `npm run bake:scenery` projects and shades them into cached SVG planes during dev/build, so visitors do not download Three.js or initialize WebGL. Camera-like movement uses compositor transforms on those same scenes.

The motion loop stops at rest. Layout geometry is cached per scene/layout/viewport, reads are batched before writes, and depth filters update on whole planes at bounded precision. Typography observers are limited in Explore. Completed orbit animations release their resources. Media starts after the interface, is staggered, and waits until transitions settle; the automatic cap is two previews on full devices, one on balanced devices, and click-to-play on constrained devices. The same Explore layout remains in all tiers.

Run `npm test` for gesture, queue and capability regressions, then `npm run build` for content, types, baked scenery and static pages. Real-device performance still depends on third-party media, connection and browser hardware.
