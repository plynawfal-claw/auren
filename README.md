# AUREN

Studio site for AUREN — digital experiences, creative, growth and intelligent systems.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npx tsc --noEmit
npx eslint .
```

## Design

Editorial minimalism, spatial interaction, landing-page-first portfolio. The
interface is monochrome with a single accent (`--lume`, a cool pale light used
on focus rings, the active orbit position and the light in the hero surface).
Every hue on the site comes from the client work itself — TagPet's gold,
Kutia's warm neutrals, PromoStore's architectural light, Docteur Plante's
green. The wrapper stays out of their way.

`src/content/practices.ts` names the four practices in plain language:
digital experiences, creative systems, growth, intelligent systems. There is no
colour, index or code attached to them — a visitor should know what the studio
does without decoding anything.

> An earlier version encoded these four as coloured spectral emission lines at
> 486/546/589/656nm. It read as a concept rather than as navigation and fought
> every screenshot it sat beside. It was removed in full; see `TASKS.md`.

## Motion

`src/lib/spring.ts` implements the apple-design rules:

- **Interruptible.** Re-targeting mid-flight keeps position *and* velocity, so a
  reversed gesture never hits a discontinuity.
- **Velocity handoff.** A released drag hands its velocity to the spring, so
  there is no seam between dragging and settling.
- **Momentum projection.** A flick snaps to the nearest target from where the
  gesture is *going*, using the exponential-decay form Apple ships.
- **One rAF loop** shared by every spring on the page.

The first two rules are in active use — the hero's signature object and the
hero surface both re-target mid-flight without a seam. Momentum projection is
currently unused (see "Selected work" below): it shipped with the orbit, and
`projectMomentum` is retained unused rather than deleted, so the rule and its
tuning stay documented next to the code.

A tuning note worth keeping: Apple's `0.998` deceleration constant is calibrated
for scroll surfaces and has an effective multiplier of ~500. On a small carousel
that projects a gentle flick nearly two positions too far, so momentum
projection is calibrated to `0.975` (~39x). Anything that reintroduces
flick-to-snap must keep that number — feeding radians through a px-calibrated
constant, or using `0.998`, overshoots by orders of magnitude.

## Sections and their motion

Each homepage section owns exactly one motion idea, and nothing else animates:

| Section | Idea |
|---|---|
| Hero | ambient light on a pointer-driven surface, plus the signature object unfolding on scroll |
| Why AUREN | five labels pull from scattered into one connected row |
| Selected work | four presentations — full-bleed, split, cinematic, device |
| What we build | eight cells reform between four capabilities, then the concept stage |
| Who we build for | a marquee that pauses under pointer or focus |
| How we work | a line that lights as you travel it |
| Contact | one soft light rising from the base |

### Selected work

`src/components/sections/work-showcase.tsx` replaced the orbit carousel. The
ellipse was a good interaction and a bad presentation: six identical frames, one
at a time, each at a third of its size — and work is the reason anyone visits.
There are now four layouts, each laid out *for* the project rather than pouring
the project into a slot, and the interaction is carried by the layout rather
than by a hover effect competing with it.

The `work-orbit.tsx` and `orbital-sculpture.tsx` files it replaced are deleted.
Nothing imports them, and the README previously still documented the orbit's
momentum constants, which no longer exist.

`src/lib/spring.ts` still owns the spring and ticker primitives, used by the
hero's signature object, the hero surface and "Why AUREN". Its three carousel
helpers — `projectMomentum`, `rubberband` and `VelocityTracker` — are now
imported by nothing, because the orbit was their only consumer. They are left in
place rather than deleted, so the momentum-projection and rubber-banding rules
they encode stay available and documented; nothing depends on them either way.

### What we build

Eight cells, four arrangements, one stable index per cell — that is what makes
it morph rather than cross-fade. It uses CSS transitions rather than JS springs
deliberately: thirty-two rAF-driven values would cost far more than this earns,
and a CSS transition already re-targets from its current computed value, so
switching capability mid-flight stays continuous.

## The hero surface

`src/components/surface/surface-shader.ts` is one fullscreen triangle and one
fragment shader in raw WebGL — a domain-warped field lit by a light that the
pointer pulls on a critically damped spring. No Three.js; it would add ~150KB to
draw a quad. DPR is capped at 1.25 (four octaves of fbm over every pixel is the
most expensive thing on the page), and it does not run under reduced motion or
below 768px, where a CSS gradient stands in.

Two things here are load-bearing and easy to undo by accident:

1. **Cleanup never calls `WEBGL_lose_context`.** React Strict Mode mounts,
   cleans up and remounts in development. Once a canvas's context is lost,
   `getContext` on that element returns the dead one and the surface silently
   never appears.
2. **The canvas is never `display: none`.** A hidden element measures 0x0, the
   drawing buffer is sized from that, and the IntersectionObserver never reports
   it visible — so it sizes itself to one pixel and never starts.

## SEO and GEO

The site sells search visibility, so its own has to hold up.

- Every sentence is server-rendered. Nothing that matters lives inside the canvas.
- The connected-system section server-renders as a plain stacked list; pinning
  and scrubbing are a client-side enhancement.
- The capability accordion keeps all panels in the DOM, hidden with
  `grid-template-rows` rather than unmounted.
- Entity graph: Organization + Person + ProfessionalService + WebSite, with
  stable `@id`s that per-page Service, CreativeWork, Article, FAQPage and
  BreadcrumbList nodes reference.
- `llms.txt` describes the site in prose, including an explicit note that no
  metrics or testimonials are published — so a model cannot attribute invented
  figures to the studio.

### Locales

Three locales are declared in `src/i18n/config.ts` — `en`, `fr`, `ar` — and all
three are routable and reachable from the header switcher. English is served
unprefixed; the other two carry a segment.

Two things about this setup are load-bearing:

1. **The proxy derives its prefixes from the locale registry.** It used to
   hardcode `/fr`, so adding `ar` to the config published a locale that 404'd on
   every route — `/ar/work` was rewritten to `/en/ar/work`, which matches no
   segment pair. Deriving `prefixed` from `locales` means a declared locale
   cannot be silently unrouted.
2. **`canonical`, `hreflang`, `og:url` and `twitter:url` all come from one
   component**, `src/components/seo/locale-alternates.tsx`. A relative
   `alternates.canonical` in a page's `metadata` is resolved against the
   locale-free `metadataBase`, so it emits the *English* URL on every locale —
   telling crawlers that `/fr/work` and `/ar/work` are duplicates of `/work` and
   should be dropped. That was latent while only English was routable and became
   a live bug the moment the other two started resolving. Do not reintroduce
   `alternates.canonical` in a page's `metadata`.

English is currently the only locale with written copy. The French and Arabic
routes serve the same content with translated `lang`/`dir`, and are deliberately
absent from `sitemap.xml` — listing three copies of the same English text is a
reliable way to earn a thin-content assessment. They are added to the sitemap the
day the translations land; nothing else needs to change at that point.

## Honesty rules

No fabricated metrics, testimonials, client names or awards. `results` and
`testimonial` are `null` on every project deliberately, and the case studies say
so in plain language rather than hiding the section.

### Client work vs studio concepts

`kind: "client"` is shipped work for a real business. `kind: "concept"` is a
studio exploration with no client, no brief and no results — Meridián, Atelier
Nord and Obra. Concepts are labelled in the browser frame, at the top of their
case study, on the work index, in the range band and as a separate section of
`llms.txt` that tells a model in plain terms not to describe them as clients.

Nothing on either side carries a metric, a testimonial or an award.

The original brief also named a "Snack App" and a real-estate project. Neither
exists on disk, so neither appears here.

No UGC, selfie or creator footage represents a project anywhere on this site.
AUREN is the studio that made the campaign, not someone appearing inside it.

Project previews are captured from the running products. TagPet is captured
from `/fr/bowls` rather than its homepage because its product photography has
placeholder phone numbers engraved into the source images, legible at any size
this site would publish them. See `TASKS.md`.

## Environment

See `.env.example`. Nothing is hardcoded; every CTA degrades gracefully when its
channel is unconfigured.
