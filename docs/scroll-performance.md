# Explore motion and rendering

Explore keeps the existing category order, art direction, depth, orbiting frames and outward zoom transition. Desktop wheel input uses `wheel-gestures` (the engine behind Embla's Wheel Gestures plugin) for normalized input and momentum recognition. Normal gestures select one page regardless of a single event's magnitude. Multiple pages require sustained measured velocity or rapid repeated mouse-wheel ticks. Inertia does not add pages, and a fresh gesture can be queued during an existing transition.

`ScenePager` owns fixed-duration page transactions. Each adjacent transition completes at an integer page after 380 ms; queued input cannot keep resetting its deadline. Late animation frames catch up to the clock. Reversals, category jumps and modal interruptions also finish on integer pages. This implements the mandatory page-resting behavior of short-video feeds while retaining the authored zoom/dispersal renderer. No Instagram or YouTube proprietary implementation is claimed.

Wheel events over the category bar and decorative objects now reach the pager. Easter eggs remain available on intentional hover or click, but scrolling cannot open them and interrupt a page transition. Mobile swipe thresholds remain unchanged.

The wheel input is normalized for pixel, line and page delta modes. Native scrolling stays available in Overview and dialogs. Browser zoom is not intercepted. Explore iframe previews pass pointer input to the scene; the expanded player remains interactive.

References: [Wheel Gestures](https://github.com/xiel/wheel-gestures), [Embla wheel plugin](https://www.embla-carousel.com/docs/v8/plugins/wheel-gestures), [W3C mandatory snapping](https://www.w3.org/TR/css-scroll-snap-1/), [MDN wheel event](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event) and [MDN scroll-snap-stop](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-stop). These inform paging and momentum handling; this is not an implementation of Instagram's internal gesture code. Native snap alone cannot control the existing zoom/dispersal transforms.

`scripts/scenery-source.tsx` retains the original low-poly meshes. `npm run bake:scenery` projects and shades them into cached SVG planes during dev/build, so visitors do not download Three.js or initialize WebGL. Camera-like movement uses compositor transforms on those same scenes.

The motion loop stops at rest. Layout geometry is cached per scene/layout/viewport, reads are batched before writes, and depth filters update on whole planes at bounded precision. Typography observers are limited in Explore. Completed orbit animations release their resources. Media starts after the interface, is staggered, and waits until transitions settle; the automatic cap is two previews on full devices, one on balanced devices, and click-to-play on constrained devices. The same Explore layout remains in all tiers.

Run `npm test` for recorded real trackpad gestures, fixed page deadlines, queue and capability regressions, then `npm run build` for content, types, baked scenery and static pages. Real-device performance still depends on third-party media, connection and browser hardware.
