# AUREN — live keyword research brief (OpenSEO)

Status: **not started — needs live data.** Nothing in the site hard-codes a
target keyword yet; titles and copy are written in plain language and get
tuned only once real volume/difficulty/SERP data exists.

## Before running
1. OpenSEO MCP is registered at local scope for this repo
   (`claude mcp get openseo`). It needs a one-time login: run `/mcp` in an
   interactive `claude` session in `/Users/nefonefo/auren`, pick `openseo`,
   approve in the browser.
2. The OpenSEO skills are installed in `.claude/skills/` (keyword-research,
   keyword-clustering, competitor-analysis, competitive-landscape, local-seo,
   seo-audit, seo-project-setup, …) — reviewed: Markdown only, no scripts.
3. **The production domain is not bought yet.** `https://auren.studio` is a
   provisional canonical. Skip site audit, rank tracking and AI-visibility
   until the domain is live; keyword + SERP research does not need it.

## Market
Morocco. Languages in this order of commercial weight: French, Darija/Arabic,
English. AUREN serves Morocco and remote clients; no physical-office claims,
no city pages without genuinely different content.

## Seed concepts (research, do not assume)
- création site web maroc · création site internet maroc · agence web maroc
- site e-commerce maroc · boutique en ligne maroc · landing page maroc
- agence digitale maroc · agence marketing digital maroc
- agence seo maroc · référencement naturel maroc
- branding maroc · identité visuelle maroc · agence créative maroc
- automatisation ia maroc · crm maroc · chatbot whatsapp entreprise maroc
- price intent: prix création site web maroc · site internet pas cher maroc ·
  tarif site e-commerce maroc · combien coûte un site web au maroc
- Darija/Arabic equivalents: تصميم مواقع المغرب · إنشاء موقع إلكتروني المغرب ·
  ثمن موقع إلكتروني المغرب · متجر إلكتروني المغرب
- English: web design agency morocco · website development morocco

For each: volume, KD, CPC, intent, SERP composition, domains actually ranking.

## Output expected
`docs/seo/keyword-map.md`: clusters (one primary intent per page, no
cannibalisation) mapped onto the existing pages first —
`/fr/services/web-design-development`, `/fr/services/seo`,
`/fr/services/creative-branding`, `/fr/services/ai-automation-crm`, … —
then a top-10 opportunity table (keyword · language · intent · target page ·
volume · KD · why · next action) and a page roadmap for gaps.

## Pricing
No approved prices exist. If price-intent demand is real, draft the cost
guide in `docs/seo/drafts/` only — a public price page without prices is thin.
