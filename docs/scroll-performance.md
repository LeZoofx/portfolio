# Desktop startup and scrolling

The artwork, mobile swipe interaction, categories and content remain intact.

## What was making startup and tab return worse

- Scene changes called React `flushSync` inside the scroll frame, forcing rendering and pending effects into the same frame as camera motion.
- Main-thread JavaScript wrote each scene's camera, dispersal and focus every scroll frame. Third-party iframe work could delay those writes while native scrolling continued.
- Instagram previews were destroyed while hidden and recreated on return. YouTube players resumed independently and simultaneously.
- Native scroll capture and the Explore motion event maintained separate idle timers, competing over media admission.
- Card rotation used wall-clock timeouts that kept progressing while its animation was paused. Video reassignment could precede the actual end of a paused rotation.
- Broad animation-pausing rules froze entry lettering before it reached a visible state. Font completion also failed to invalidate cached scene geometry.

These are code-level causes; they are not a claim that every external player's delay can be controlled by the portfolio.

## Current ownership

1. **Input:** `NativeSceneScroll` observes passive wheel input without cancelling deltas. The browser performs scrolling and momentum. CSS snapping is suspended during wheel input; one controller settles after the gesture. A short gesture advances one page, longer travel keeps its natural distance, and a new gesture interrupts a pending snap immediately. Three native cycles allow invisible recentring at rest. No intensity classifier or input lockout.
2. **Scene motion:** supporting browsers use `ScrollTimeline` with the existing camera/dispersal/focus curves, sampled once per scene layout. Three buffered scene planes are retained. React changes scene content normally, without `flushSync`. Older browsers use the event-driven RAF path; mobile retains its existing pager.
3. **Loading:** prerendered text and poster facades appear first. Core fonts are preloaded and posters have responsive WebP derivatives. A nonblocking loading label covers initial font/poster readiness, capped at one second. New players enter a shared capacity-limited queue only after the interface is ready and scrolling is idle.
4. **Tab lifecycle:** existing preview containers survive tab hiding. The central policy pauses YouTube playback, then resumes after a short idle period. Orbit animations pause on hide/scroll and resume on the same rest event. Video handover follows animation completion, not a separate timer. Instagram's cross-origin playback remains provider-controlled; the page does not reload the embed on tab return.
5. **Geometry:** font loading invalidates cached layout. Scene decorations are present in the buffer before a scene enters; scenery fades in after decode. Intro lettering is allowed to finish, while decorative loops pause during motion.

## References used

- React, `flushSync` caveats: https://react.dev/reference/react-dom/flushSync
- Chrome's scroll animation performance comparison: https://developer.chrome.com/blog/scroll-animation-performance-case-study/
- Native ScrollTimeline examples: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Page lifecycle and hidden-state handling: https://developer.chrome.com/docs/web-platform/page-lifecycle-api
- Video facades and third-party iframe loading: https://web.dev/learn/performance/video-performance

## Build

GitHub Actions generates responsive previews automatically with Pillow. For local development, install `Pillow==12.3.0` in Python, then use the normal npm commands. Original posters remain unchanged; generated scenery and previews are not committed.
