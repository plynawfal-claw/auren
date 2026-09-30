# AUREN Claude Code Handoff

## Current state
AUREN is a Next.js 16.3.5 + React + TypeScript + Tailwind 4 site with:
- i18n (English, French, Arabic) via next-intl
- Dark/light palette system via `src/lib/palette-store.ts`
- Lenis smooth scroll + Motion (Framer Motion 12) scroll animations
- Custom scroll-reveal engine in `src/components/motion/reveal.tsx`
- Custom hero/parallax/spatial/3D effects
- Multi-section landing page + `/work`, `/insights`, `/studio`, `/contact`, etc.
- Local development works (`npm run dev` on `http://localhost:3000`)
- Production build succeeds and generates 61 static/dynamic pages

The repository has been prepared for Verdent deploy with `output: "standalone"`, a `Dockerfile`, `.verdentc.json`, and `.dockerignore`. A previous deployment produced `https://auren-uwespy6.verdent.app`, but it was private/behind sign-in, so the public iPhone test was blocked.

## Latest work (Verdent sessions)
1. **Deployment fixes**: reverted the previous agent's incomplete OpenNext/Cloudflare path and configured a standard Next.js standalone container for Verdent hosting.
2. **iOS Safari diagnostic instrumentation** (branch `debug/ios-diagnostics`):
   - `src/lib/debug.ts` — zero-cost debug marks and a query-gated (`?debug=1`) bootstrap that loads `public/auren-debug.js`.
   - `public/auren-debug.js` — on-screen debug panel with error/resource/unhandled-rejection capture, viewport/media-query/touch/pointer probes, live scroll/FPS/lenis state, animation probes, reveal/IO/failsafe counters, tap-inspect hit-test logging, and a JSON report exporter.
   - `src/app/[locale]/layout.tsx` — injects the debug gate only when `?debug=1` is present.
   - `src/components/providers/smooth-scroll.tsx` — instrumented with marks for Lenis lifecycle, import resolution, `register()` triggers, resize behavior, and opt-out flags (`dbg-nolenis`, `dbg-noresize`).
   - `src/components/motion/reveal.tsx` — instrumented with failsafe marks so we can detect if IntersectionObserver is missing reveals.
3. **ESLint config updated** to temporarily ignore the debug script's warnings (overrides for `public/auren-debug.js`).

No design, animation, content, typography, images, scrolling behavior, buttons, navigation, or responsive rules were intentionally changed. The panel is off by default.

## iPhone / iOS Safari problem
- The physical iPhone shows broken/missing scroll-linked animations and some unresponsive buttons/tap interactions.
- Reduce Motion is OFF.
- The same problems reproduce on the real HTTPS deployment, proving it is not a localhost-only issue.
- Desktop Safari and Chrome behave correctly; the failure is specific to mobile WebKit / iOS.
- The project uses several patterns that are known to be problematic on iOS:
  - `perspective` on `<main>` + `preserve-3d` + scroll-linked Motion transforms inside hero.
  - Motion 12 may use native `ViewTimeline`/`ScrollTimeline` on iOS Safari 26+ (the build ships `framer-motion@12.9.4`).
  - Lenis `syncTouch:false` with native touch scroll and address-bar resize re-runs the scroll animation setup.
  - Some interactive components change content that is off-screen on mobile, making taps appear dead.
  - Several pointer-only effects are intentionally disabled on phones (WebGL hero surface, magnetic buttons, parallax cards, spatial tilt). This is correct design, not a bug.
- Goal: fix real iOS failures without removing animations or dumbing down desktop.

## Root causes discovered

**CONFIRMED**
- The previous deployment path expected a Cloudflare Worker (`dist/server/index.js`), but this project's correct target is a Next.js standalone container. This was corrected and the standalone server passes local and Docker smoke tests.
- The public Verdent preview was **private**, so anonymous iPhone testing was blocked by a login redirect. This is a platform setting, not a code bug.
- The A/B debug system works in Playwright WebKit iPhone emulation: `?debug=1` enables the panel, `?debug=0` clears it, flags (`dbg-no3d`, `dbg-nonative`, `dbg-noresize`, `dbg-nolenis`) are applied, and native timelines can be suppressed.

**LIKELY**
- Native `ViewTimeline`/`ScrollTimeline` path in Motion 12 may stall or behave differently on iOS Safari than on desktop Safari. Emulation shows they are supported (`ScrollTimeline: true`, `ViewTimeline: true`), and the code uses them for hero exit, hero parallax, and intelligent systems.
- Scroll animation setup is re-run on every `resize` (debounced 150 ms), and iOS Safari fires resize on address-bar show/hide, which can cause animation stutter or replay.
- Some taps on `/contact` accordion, WhatWeBuild rows, and IntelligentSystems steps change state but the visual target is off-screen on mobile, so the interaction feels broken.
- 3D hit-testing (`perspective` on `main`, `transform-style: preserve-3d`) may cause iOS Safari to resolve taps to the wrong composited layer.

**NOT YET VERIFIED**
- Whether native timelines actually stall on the physical iPhone (needs `?debug=1&dbg-nonative=1` test on real device).
- Whether 3D compositing is swallowing taps (needs `?debug=1&dbg-no3d=1` test on real device).
- Whether Lenis is causing scroll-lock desync with the mobile menu (needs `?debug=1&dbg-nolenis=1` test).
- Whether IntersectionObserver misses reveals (failsafe mark will tell us).
- Whether there is a JS/hydration error before the panel mounts on the physical device.

## Files changed
| File | Change |
|------|--------|
| `next.config.ts` | Added `output: "standalone"` for Verdent/standalone deployment. No effect on `next dev`. |
| `Dockerfile` | Three-stage Node 22 build serving the standalone output on port 8080. |
| `.dockerignore` | Keeps build/dependency caches out of the Docker context. |
| `.verdentc.json` | Verdent deployment manifest: fullstack, port 8080. |
| `eslint.config.mjs` | Added override to disable TS warnings for the temporary `public/auren-debug.js` vanilla script. |
| `src/app/[locale]/layout.tsx` | Injects the debug gate inline script only when `?debug=1`. No effect otherwise. |
| `src/lib/debug.ts` | New. Debug marks (`dbgMark`) and the `DEBUG_GATE` inline bootstrap. Tree-shaken/zero-cost when debug is off. |
| `public/auren-debug.js` | New. Full diagnostic panel. Only loaded when `?debug=1`. |
| `src/components/providers/smooth-scroll.tsx` | Marks for Lenis/scroll animation lifecycle; A/B flags (`nolenis`, `noresize`). |
| `src/components/motion/reveal.tsx` | Marks when a reveal element is only shown by the 1.6 s failsafe. |

`package.json` and `package-lock.json` were restored to the committed state (the previous agent's uncommitted `@opennextjs/cloudflare` and `wrangler` additions were removed because they are not needed for this target).

## Testing performed
- `npm run lint` — passes with max-warnings=0 (debug script excluded).
- `npx tsc --noEmit -p .` — passes.
- `npm run build` — passes, 61 pages generated.
- Local standalone server (`node .next/standalone/server.js`) — pages, CSS, and `/_next/image` return 200.
- Docker image build and run (`linux/arm64`) — returns 200, no image-cache permission error.
- Playwright WebKit with iPhone 15 Pro emulation:
  - `?debug=1` panel mounts; `?debug=0` removes debug state.
  - A/B flags applied and persisted across route changes via sessionStorage.
  - `dbg-nonative` suppresses native `ScrollTimeline`/`ViewTimeline`.
  - Taps, menu open/close, scroll, and animation probes are logged.
- Verdent deployment reached `live` status but was private, so the physical iPhone could not test the public URL.

## Remaining work (ordered for Claude Code)
1. **Get a public iPhone test URL** — make the Verdent preview public, or deploy to a host that allows anonymous access.
2. **Run the diagnostic sessions on the physical iPhone**:
   - Session A: `/?debug=1` — collect baseline report (boot, env, errors).
   - Session B: reproduce broken animations/taps while the panel is open, then copy the report.
   - Session C: `/?debug=1&dbg-nonative=1` — test native timeline fallback.
   - Session D: `/?debug=1&dbg-no3d=1` — test 3D hit-testing/compositing.
   - Session E: `/?debug=1&dbg-nolenis=1` — test Lenis scroll-lock behavior.
   - Session F: `/?debug=1&dbg-noresize=1` — test address-bar resize re-register.
3. **Analyze the reports** against the proof matrix in the diagnostic plan and confirm the actual root cause(s).
4. **Write a fix plan** that addresses only the confirmed root causes, preserving desktop behavior and all existing animations.
5. **Implement, verify in Playwright WebKit + physical iPhone, then remove the diagnostics** before merging to `main`.

## Local development
- Package manager: npm (lockfile at `package-lock.json`)
- Install: `npm install`
- Dev server: `npm run dev`
- Default URL: `http://localhost:3000`
- Network URL (LAN/mobile): look for the `Network:` line printed by `next dev` (typically `http://192.168.x.x:3000`)
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit -p .`

## Git state
- Branch: `debug/ios-diagnostics`
- Latest commit before handoff: `7deae46` — `chore: publish workspace changes`
- Working tree: contains the iOS diagnostic changes listed above (to be committed by this handoff)
- Remote: see `git remote -v` output; upstream branch is `origin/debug/ios-diagnostics` if configured.

---

*This file was created by Verdent as a checkpoint before transferring the project to Claude Code.*
