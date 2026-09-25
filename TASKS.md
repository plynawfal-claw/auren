# AUREN — status

Last updated: 2026-09-21

## Current direction

The hero is locked — its composition, typography, ambient surface and
navigation are approved and should be polished, not redesigned.

Everything after it is visual and written for a business owner, not a
developer. Editorial minimalism, spatial interaction, one motion idea per
section, and no technical vocabulary in anything a visitor reads.

## Homepage

| Section | Its one motion idea |
|---|---|
| Hero | Ambient light on a pointer-driven surface |
| Why AUREN | Five loose labels pull into one connected row |
| Selected work | Six projects on an ellipse, dragged and thrown |
| What we build | Eight cells reform between four capabilities |
| Who we build for | A slow marquee that pauses under the pointer |
| How we work | A line that lights as you travel it |
| Studio | Still — deliberately, as a rest before the close |
| Contact | One soft light rising from the base |

## Done in this pass

- [x] Hero preserved; only the copy around it changed
- [x] Second section rebuilt as an animated scattered-to-connected explainer
- [x] Kutia removed from the homepage selection (still archived at `/work`)
- [x] Docteur Plante promoted to first in the selection
- [x] Three studio concepts built, captured and published — Meridián (restaurant, Spain), Atelier Nord (fashion), Obra (interiors)
- [x] Orbit widened for six, with per-project motion languages
- [x] "What we build" rebuilt as one transforming stage
- [x] Process rebuilt as a four-stage journey on a lit line
- [x] "Who we build for" range band added
- [x] All homepage copy rewritten in plain language
- [x] Concept badge on every concept frame, a notice at the top of every concept case study, and a separate section in `llms.txt`
- [x] Mobile pass at 320 / 360 / 375 / 390 / 414 / 430 — no overflow, no text under 10px
- [x] Build, typecheck, lint clean; 51 static pages
- [x] English routes serve without a redirect loop in Next 16
- [x] Briefs only report success after the configured inbox accepts them
- [x] Service detail pages rewritten for business owners in plain language

## Real vs concept — the rule

`kind: "client"` is shipped work for a real business.
`kind: "concept"` is a studio exploration with no client, no brief and no
results. It is labelled in the browser frame, at the top of its case study, on
the work index, in the range band and in `llms.txt`.

**This distinction is never blurred, and nothing on either side carries a
metric, a testimonial or an award.**

## Concept assets

The restaurant photograph was generated (Nano Banana 2, 12 credits) with an
explicit no-text, no-signage, no-logo prompt and audited before use.

**The KIE account ran out of credits after that single image.** The fashion and
interiors concepts were therefore built without photography — garments and a
room elevation are drawn instead, which is a real convention in both categories
and reads as art direction rather than as a missing asset. If credits are topped
up, generating a campaign image for Atelier Nord and a room photograph for Obra
would lift both.

Concept pages live in the scratchpad as standalone HTML and were captured with
headless Chrome, exactly like the client projects.

## Needs input

- [ ] **Contact email and WhatsApp number** — `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] **Real domain** — `NEXT_PUBLIC_SITE_URL`
- [ ] **Founder profile URLs** for `founder.sameAs` in `src/config/site.ts` — still the highest-value SEO item open
- [ ] **Founder photograph** for `/studio`
- [ ] **Webhook destination** — `BRIEF_WEBHOOK_URL`
      Until this is set, the contact page shows an opening-soon state and
      `/api/brief` returns 503. Server logs are not a durable lead inbox.
- [ ] **KIE credits**, if the two remaining concept photographs are wanted

## Next

- [ ] Shared-element transition from an orbit card into the case study hero
- [ ] Deepen the concepts into full multi-page case studies
- [ ] Per-route OG images
- [ ] French content pass

## Rules that must not drift

- No invented metrics, testimonials, clients or awards, on client work or concepts.
- No UGC or creator footage representing a project.
- The interface stays monochrome. Colour belongs to the work.
- Client-facing copy stays human. Technical accuracy lives in the code, not on the page.
- Copy is server-rendered. Nothing that matters lives inside a canvas.
