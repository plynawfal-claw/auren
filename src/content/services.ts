import type { PracticeId } from "./practices";

/**
 * Capability pages.
 *
 * These carry the search and generative-search load, so each one is written to
 * a fixed shape:
 *
 *   definition   One sentence, self-contained, no pronouns reaching backwards.
 *                It opens the page and is the sentence a retrieval system is
 *                most likely to quote. It must be true standing alone.
 *   takeaways    Three extractable claims. Short enough to lift, specific
 *                enough to be worth lifting.
 *   sections     The substance. Headings phrased as the questions people
 *                actually ask.
 *   faq          Real questions with direct answers, emitted as FAQPage.
 *
 * No page claims a result that has not happened.
 */

export type ServiceSection = { heading: string; body: string[] };
export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  /** Used in <title>. Front-loads the term people search. */
  metaTitle: string;
  discipline: PracticeId;
  definition: string;
  takeaways: string[];
  sections: ServiceSection[];
  deliverables: string[];
  faq: ServiceFaq[];
  /** Case studies that evidence this capability. */
  projects: string[];
};

export const services: readonly Service[] = [
  {
    slug: "web-design-development",
    title: "Web design and development",
    metaTitle: "Web design and development",
    discipline: "experiences",
    definition:
      "Web design and development brings the story, design and working website together so people can understand a business and take the next step.",
    takeaways: [
      "The words, design and build are shaped together, so the finished site feels like one piece of work.",
      "Pages should load quickly, read clearly on a phone and be usable by more people.",
      "A useful website makes its next step obvious, whether that is an enquiry, a booking or a purchase.",
    ],
    sections: [
      {
        heading: "A site with a clear purpose",
        body: [
          "We start with what your visitors need to know: what you offer, why it matters and what they should do next. Those answers shape the pages before visual details do.",
          "The look is then written down — type, colour, imagery and movement — so every page belongs to the same business. We build for real phones and real connections, not just a perfect desktop preview.",
          "Your team gets a clear way to update important content, with page titles and links planned from the start so the site can be found and maintained.",
        ],
      },
      {
        heading: "How we make it",
        body: [
          "First we learn the business and its customers. Then we agree on a direction, build the pages and check how people use them.",
          "We show finished sections as the work moves forward, so you can judge the real site rather than imagine it from a static picture.",
        ],
      },
    ],
    deliverables: [
      "Art direction document",
      "Design system and component library",
      "Production front end",
      "Content architecture",
      "Structured data and metadata",
      "Analytics instrumentation",
      "Performance and accessibility audit",
    ],
    faq: [
      {
        q: "How long does a site take?",
        a: "A focused marketing site is usually four to eight weeks from first conversation to launch. A storefront or an application with accounts, payments and an admin surface takes longer, and the timeline is set once the scope is written rather than guessed at the start.",
      },
      {
        q: "Do you work with an existing codebase?",
        a: "Yes. The first step on an existing project is an audit: stack, dependencies, what is worth keeping. Rewriting working infrastructure because it is unfamiliar is a cost with no return, so we reuse what is good and replace only what is holding the site back.",
      },
      {
        q: "Who writes the copy?",
        a: "We do, unless you would rather. Copy is treated as design material and drafted alongside the layout, because words chosen after the design is finished tend to be squeezed into space that was never shaped for them.",
      },
    ],
    projects: ["tagpet", "promostore-alu"],
  },
  {
    slug: "apps-digital-products",
    title: "Apps and digital products",
    metaTitle: "App and digital product development",
    discipline: "experiences",
    definition:
      "App and digital product work turns a useful idea into a tool people can understand, rely on and return to.",
    takeaways: [
      "The main task should be easy to complete, even when the connection is unreliable.",
      "Ask people to create an account when it gives them a clear benefit.",
      "Plan privacy, running costs and support before the product launches.",
    ],
    sections: [
      {
        heading: "Useful from the first visit",
        body: [
          "Docteur Plante lets people identify a plant, keep a journal and see a care calendar without signing in. Those parts continue to work when the phone loses signal; an account adds backup across devices.",
          "That order keeps the product focused on helping someone before asking them to commit.",
        ],
      },
      {
        heading: "Built to keep working",
        body: [
          "If a feature has a cost each time someone uses it, we set limits and a fallback from the beginning. That keeps the product dependable and the running bill predictable.",
        ],
      },
    ],
    deliverables: [
      "Product and interface design",
      "Progressive web application",
      "Offline data layer and sync",
      "Third-party API integration",
      "Optional accounts",
      "Rate and cost ceilings",
      "Multi-language interface",
    ],
    faq: [
      {
        q: "Native or web?",
        a: "Web first, in almost every case. A progressive web app installs to the home screen, works offline and ships updates without a review queue. Native becomes the right answer when you need hardware a browser cannot reach.",
      },
      {
        q: "Can you add AI to an existing product?",
        a: "Usually, and the first question is whether it earns its cost. An assistant that is optional, rate-limited and switched off by default is a feature; one the product cannot function without is a dependency and a running bill.",
      },
    ],
    projects: ["docteur-plante", "tagpet"],
  },
  {
    slug: "creative-branding",
    title: "Creative and branding",
    metaTitle: "Brand identity and performance creative",
    discipline: "creative",
    definition:
      "Creative and branding give a business a recognisable look and voice, then carry that identity through its website, photography, film and campaigns.",
    takeaways: [
      "A written visual direction keeps every piece of work recognisably yours.",
      "The strongest identity grows from what is distinctive about the business itself.",
      "An advert and the page it opens should feel like the same company.",
    ],
    sections: [
      {
        heading: "One direction across every channel",
        body: [
          "For TagPet, we set the materials, lighting, photography and writing rules before making the campaign. That gave every image and advert a common direction.",
          "We also reviewed the work against those rules. Images with incorrect text or a visible phone number were rejected before they could appear in public.",
        ],
      },
      {
        heading: "A look that belongs to the business",
        body: [
          "PromoStore Alu's marks take their shapes from the aluminium profiles and joints used in the workshop. The result connects the identity to the work rather than to a passing style.",
        ],
      },
    ],
    deliverables: [
      "Brand marks and lockups",
      "Visual style guide",
      "Art direction for photography and film",
      "Campaign creative",
      "Vertical film for paid social",
      "Poster and static sets",
      "Asset ledger",
    ],
    faq: [
      {
        q: "Do you use AI to generate creative?",
        a: "Where it is the right tool, and always under a written style guide with a human approving every frame. The work is logged: model, prompt, cost quoted against cost charged, and the reason for each rejection. Anything with a visible watermark, a garbled wordmark or real personal data in frame does not ship.",
      },
      {
        q: "Can you work from an existing brand?",
        a: "Yes. If the brand has conventions worth keeping, we extend them systematically rather than starting a second, competing system beside them.",
      },
    ],
    projects: ["tagpet", "promostore-alu"],
  },
  {
    slug: "seo",
    title: "SEO and generative search",
    metaTitle: "SEO and GEO — search and AI visibility",
    discipline: "growth",
    definition:
      "Search visibility helps the right people find a business through search results and the answers they read online.",
    takeaways: [
      "A page should answer a real customer question clearly, in words people use.",
      "Search engines need pages they can read, with clear titles and links between related topics.",
      "Real business details and consistent public profiles help people recognise who is behind a site.",
    ],
    sections: [
      {
        heading: "Be clear about what you offer",
        body: [
          "People now discover businesses through both search results and AI answers. In either place, vague claims are hard to use. We write pages that say plainly what you do, who it helps and what someone should know before contacting you.",
          "Each important service gets its own useful page. Related pages link to each other, so a visitor can keep learning without starting another search.",
        ],
      },
      {
        heading: "Make the site easy to find and understand",
        body: [
          "We give every page a useful title and description, make the site easy to navigate and check that search engines see the right version of each page. Business details, service information and common questions are organised consistently behind the scenes.",
        ],
      },
    ],
    deliverables: [
      "Technical audit",
      "Metadata and canonical architecture",
      "Structured data and entity graph",
      "Sitemap and robots strategy",
      "llms.txt and extractable content structure",
      "Internal linking plan",
      "Content architecture for topical depth",
    ],
    faq: [
      {
        q: "How long does SEO take to show results?",
        a: "Technical fixes can move things within weeks. Building authority on competitive terms takes months, and anyone promising a position by a date is guessing. What can be committed to is the work: the audit, the architecture, the structured data and the content plan.",
      },
      {
        q: "What is GEO?",
        a: "It is the work of making your business easier for AI answer tools to understand and reference. Clear explanations, real business details and pages that are easy to read help with that. No one can promise a citation.",
      },
      {
        q: "Do you build local SEO pages for each city?",
        a: "Only where there is genuinely different content to put on them. Spinning up near-identical pages for twenty towns is a pattern search engines have penalised for years and answer engines ignore entirely.",
      },
    ],
    projects: ["promostore-alu", "tagpet"],
  },
  {
    slug: "google-ads",
    title: "Google Ads",
    metaTitle: "Google Ads management",
    discipline: "growth",
    definition:
      "Google Ads puts a business in front of people who are already searching for what it offers.",
    takeaways: [
      "The page people reach after an advert matters as much as the advert itself.",
      "Decide what a useful enquiry or order looks like before spending the first budget.",
      "For cash-on-delivery sales, a confirmed order tells you more than a form submission.",
    ],
    sections: [
      {
        heading: "Give each click a good destination",
        body: [
          "An advert can bring the right person in and still lose them on a slow or confusing page. We look at the page, the offer and the next step before increasing the budget.",
        ],
      },
      {
        heading: "Count what really happened",
        body: [
          "Where customers pay on delivery, an order request is only the start. We separate requests from confirmed orders so the reports reflect the business more honestly.",
        ],
      },
    ],
    deliverables: [
      "Account structure and campaign build",
      "Keyword and intent research",
      "Ad copy",
      "Conversion tracking",
      "Landing page alignment",
      "Reporting",
    ],
    faq: [
      {
        q: "What budget makes sense to start?",
        a: "Enough to gather signal inside a month at your cost per click, which varies by market and term. We work that out from the actual numbers before proposing a figure, rather than quoting a round one.",
      },
      {
        q: "Do you take a percentage of ad spend?",
        a: "Pricing is agreed per engagement. Percentage-of-spend creates an incentive to spend more, which is not always the right advice.",
      },
    ],
    projects: ["promostore-alu"],
  },
  {
    slug: "meta-ads",
    title: "Meta Ads",
    metaTitle: "Meta Ads — Facebook and Instagram",
    discipline: "growth",
    definition:
      "Meta Ads bring a business to people on Facebook and Instagram through images, films and messages worth stopping for.",
    takeaways: [
      "Show several genuinely different ideas, then learn which one people respond to.",
      "Keep the adverts and the page they open in the same visual and verbal world.",
      "Look at the whole journey from first view to enquiry or purchase.",
    ],
    sections: [
      {
        heading: "More than one reason to care",
        body: [
          "For TagPet, we made several films and still images from one visual direction. Each tried a different opening or reason to pay attention, while still looking like the same brand as the shop.",
          "We keep track of what was tried and why a piece was rejected or changed. That helps the next round improve for a reason.",
        ],
      },
      {
        heading: "See where interest turns into action",
        body: [
          "We look beyond views and clicks. Seeing where people leave the shop or form helps us improve the experience instead of guessing which advert to change.",
        ],
      },
    ],
    deliverables: [
      "Creative strategy and hooks",
      "Vertical film production",
      "Static and poster sets",
      "Campaign structure and audiences",
      "Pixel and Conversions API setup",
      "Funnel reporting",
    ],
    faq: [
      {
        q: "How many creatives do you need to test?",
        a: "Several distinct angles rather than several versions of one. Changing a caption is not a test; changing the reason someone should care is.",
      },
      {
        q: "Can you produce the film as well as run the ads?",
        a: "Yes — that is the usual arrangement, and it is why the creative and the landing page stay consistent. TagPet's entire ad library was produced in-house.",
      },
    ],
    projects: ["tagpet"],
  },
  {
    slug: "ai-automation-crm",
    title: "Customer follow-up and automation",
    metaTitle: "AI automation, CRM and lead routing",
    discipline: "systems",
    definition:
      "Customer follow-up and automation help a business respond to enquiries, keep track of conversations and handle repeated tasks without losing the personal touch.",
    takeaways: [
      "A visitor should only see a success message once their enquiry has reached a working inbox.",
      "Keep the source of an enquiry with the conversation, so you know what brought the customer in.",
      "Let software handle the repeated work and leave important decisions with a person.",
    ],
    sections: [
      {
        heading: "Make every enquiry count",
        body: [
          "We connect your form to the place your team actually checks. If that destination is unavailable, the visitor sees a clear error and can try again; the site never claims to have received a message it cannot deliver.",
          "The enquiry can include where the visitor came from, helping you see which pages and campaigns bring in useful conversations.",
        ],
      },
      {
        heading: "Follow up at the right time",
        body: [
          "New enquiries can reach the right person based on what the customer needs. Reminders can help the team reply on time, with a clear point where automated messages stop.",
          "If your customers prefer WhatsApp, we can make it part of the conversation instead of adding a disconnected button to the page.",
        ],
      },
    ],
    deliverables: [
      "Reliable enquiry form and inbox connection",
      "Customer records in a tool your team uses",
      "Enquiry source tracking",
      "Clear ownership for each enquiry",
      "WhatsApp workflow",
      "Follow-up reminders",
      "Simple reporting",
    ],
    faq: [
      {
        q: "Which CRM should we use?",
        a: "The one your team will actually use. We look at how enquiries arrive and who needs to respond before recommending a tool.",
      },
      {
        q: "Does every task need AI?",
        a: "No. A simple rule is often faster and more dependable. AI can help sort a free-text enquiry; pricing decisions and sensitive replies stay with a person.",
      },
    ],
    projects: ["tagpet", "docteur-plante"],
  },
] as const;

export const serviceBySlug = Object.fromEntries(
  services.map((s) => [s.slug, s]),
) as Record<string, Service>;
