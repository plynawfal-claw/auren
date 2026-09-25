/**
 * Insights.
 *
 * Written from work actually done, not from a keyword list. Each article
 * opens with a self-contained definitional paragraph, states its takeaways
 * where they can be extracted, and answers real questions — the structure a
 * generative retriever can lift from cleanly.
 *
 * Body paragraphs are plain strings rendered as <p>. Headings are separate
 * entries so the document outline stays correct and machine-readable.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  /** Front-loads the searched term. */
  metaTitle: string;
  description: string;
  published: string;
  updated?: string;
  readingMinutes: number;
  topic: string;
  takeaways: string[];
  blocks: Block[];
};

export const articles: readonly Article[] = [
  {
    slug: "why-your-site-is-invisible-to-ai-search",
    title: "Why your site is invisible to AI search",
    metaTitle: "Why your site is invisible to AI search (and how to fix it)",
    description:
      "AI answer engines can only cite text they can read. Here is what makes a site quotable — and the four habits that make a beautiful site invisible.",
    published: "2026-09-19",
    readingMinutes: 7,
    topic: "Generative engine optimisation",
    takeaways: [
      "If a sentence only exists after JavaScript runs, assume no answer engine will ever see it.",
      "Write one self-contained definitional sentence per page. Pronouns pointing backwards make a paragraph unquotable.",
      "An entity graph — named person, linked profiles, consistent organisation — is what turns a studio from a string into something citable.",
    ],
    blocks: [
      {
        type: "p",
        text: "Generative engine optimisation is the practice of structuring a site so AI answer engines can quote it. It overlaps heavily with classic SEO — fast pages, semantic markup, structured data — but it rewards a different kind of writing, because the unit of success is no longer a ranked link. It is a sentence lifted out of your page and placed inside someone else's answer.",
      },
      {
        type: "p",
        text: "That difference has consequences, and most of them are unkind to exactly the sort of site a design studio likes to build.",
      },
      { type: "h2", text: "The canvas problem" },
      {
        type: "p",
        text: "A motion-led site often puts its most important statement inside a canvas, a WebGL scene or a scroll-driven animation that only assembles after hydration. To a person it reads as the boldest thing on the page. To a crawler it is nothing at all — there is no text node, so there is no text.",
      },
      {
        type: "p",
        text: "This is the single most expensive mistake available to a studio site, because the more ambitious the execution, the more likely it is. The fix is not to abandon the motion. It is to make the motion decorative by definition: the headline is real HTML, the instrument sits behind it, and the page still says everything it needs to say with the canvas removed.",
      },
      { type: "h2", text: "Write sentences that survive being moved" },
      {
        type: "p",
        text: "A paragraph that begins \"This approach lets you…\" cannot be quoted, because \"this approach\" refers to something two paragraphs up that will not travel with it. Every page should carry at least one sentence that names its subject, states what it is, and depends on nothing around it.",
      },
      {
        type: "p",
        text: "Test it by cutting the sentence out and reading it cold. If it still makes sense to someone who has never seen the page, it is quotable. If it does not, it is decoration with a full stop at the end.",
      },
      { type: "h2", text: "Become an entity, not a string" },
      {
        type: "p",
        text: "Retrieval systems resolve names to entities. A studio name on its own is ambiguous — it could be a font, a band, a town. What disambiguates it is structure: an Organization node with a stable identifier, a named Person linked to it as founder, and profile URLs that corroborate both.",
      },
      {
        type: "p",
        text: "This is the part most agency sites skip, and it costs them more than any keyword decision. A business that cannot be resolved gets paraphrased without attribution. One that can gets cited by name.",
      },
      { type: "h2", text: "The unglamorous checklist" },
      {
        type: "list",
        items: [
          "Server-render every sentence that matters. Nothing important behind hydration.",
          "One definitional sentence per page, written to stand alone.",
          "Real questions with direct answers, marked up as FAQPage.",
          "Organization, Person and Service nodes with stable identifiers that reference each other.",
          "A robots file that refuses to index preview deployments — otherwise a staging clone competes with you.",
          "An llms.txt describing the site in plain language.",
          "Headings that describe content rather than perform for it.",
        ],
      },
      {
        type: "p",
        text: "None of this is glamorous and none of it requires giving up a distinctive site. It requires deciding, before the first component is written, that the copy is not allowed to live inside the animation.",
      },
    ],
  },
  {
    slug: "cash-on-delivery-changes-what-you-can-measure",
    title: "Cash on delivery changes what you can measure",
    metaTitle: "Cash on delivery and ad tracking: what actually counts",
    description:
      "In a COD market a submitted form is not revenue. If your pixel fires on checkout, you are optimising toward a number that has not happened yet.",
    published: "2026-09-19",
    readingMinutes: 6,
    topic: "Performance marketing",
    takeaways: [
      "In cash-on-delivery markets the conversion that matters is the confirmed delivery, not the submitted form.",
      "Order totals must come from the server. A price read out of the browser cart is a price a visitor can edit.",
      "Write the order down before calling any third party, or a webhook outage becomes lost revenue.",
    ],
    blocks: [
      {
        type: "p",
        text: "Cash on delivery is a purchase method where the customer pays the courier at the door rather than online at checkout. It dominates e-commerce across Morocco and much of the region, and it quietly breaks the assumption every advertising platform is built on: that a completed checkout is a completed sale.",
      },
      {
        type: "p",
        text: "It is not. It is an intention to buy, and a meaningful share of those intentions never become revenue — wrong number, nobody home, changed their mind when the box arrived.",
      },
      { type: "h2", text: "What the pixel is actually learning" },
      {
        type: "p",
        text: "When a purchase event fires at checkout, the ad platform starts optimising toward people who complete forms. In a card market those are nearly the same population as people who pay. In a COD market they are not, and the gap is where the budget goes.",
      },
      {
        type: "p",
        text: "The honest setup sends the checkout event as a lead signal and reserves the revenue event for confirmed delivery, fed back once the order is actually settled. It is more work, and it is the difference between optimising toward sales and optimising toward form-fillers.",
      },
      { type: "h2", text: "Never trust the browser for money" },
      {
        type: "p",
        text: "On a COD store the price shown in the cart is a display value. The price recorded against the order must be resolved on the server from the selected product and size, because anything sent from the client is something a visitor can change before sending it.",
      },
      {
        type: "p",
        text: "The same applies to what you report. An order total taken from the browser cart is a number the customer had the opportunity to edit; one resolved server-side at order time is a fact.",
      },
      { type: "h2", text: "Write it down before you integrate" },
      {
        type: "p",
        text: "Order capture should persist before any third party is contacted. If the CRM is down, the webhook times out, or the automation is mid-migration, the order still exists and can be recovered. This ordering costs almost nothing to implement and is usually adopted only after a week of orders has been lost.",
      },
      { type: "h2", text: "What to instrument" },
      {
        type: "list",
        items: [
          "View content, initiate checkout and purchase, each firing exactly once.",
          "Order totals resolved server-side, never read from the client.",
          "A delivery-confirmed event fed back to the ad platform as the revenue signal.",
          "UTM parameters captured with the order, not reconstructed from a referrer afterwards.",
          "Every order written to durable storage before any webhook is called.",
        ],
      },
      {
        type: "p",
        text: "Get this right and the reporting stops being an argument. Get it wrong and every channel decision for the next quarter rests on a number that was never true.",
      },
    ],
  },
] as const;

export const articleBySlug = Object.fromEntries(
  articles.map((a) => [a.slug, a]),
) as Record<string, Article>;
