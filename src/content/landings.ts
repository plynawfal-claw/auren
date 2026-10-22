import type { Locale } from "@/i18n/config";

/**
 * French search pages: one city or one commercial intent per page.
 *
 * The capability pages (`services.ts`) describe *what* AUREN does in all three
 * languages. These pages answer the searches people in Morocco actually type —
 * "agence digitale Tanger", "création site e-commerce Maroc" — in French,
 * which is the language those searches are made in. They are French-only by
 * design, and the translation registry (`i18n/translated.ts`) knows it, so no
 * hreflang points at an English or Darija version that does not exist.
 *
 * Rules every entry follows, because they are what separates a useful local
 * page from a doorway page:
 *
 *   - Nothing is claimed that is not true today. AUREN is based in Tangier and
 *     meets clients in person across the North; no client listed here is
 *     claimed to be from a city it is not from. No prices, no review counts,
 *     no rankings, no "n°1".
 *   - The first paragraph answers the search on its own. It is the sentence a
 *     search engine or an assistant is most likely to quote.
 *   - Each page links to the capability pages that do the work, and to real
 *     case studies, so the page is a door into the site rather than a dead end.
 *   - Written for a business owner. No stack, no jargon.
 */

export type LandingSection = { heading: string; body: string[] };
export type LandingFaq = { q: string; a: string };

export type Landing = {
  slug: string;
  /** The only locales this page exists in. */
  locales: readonly Locale[];
  /** `<title>` — the search phrase first. */
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  /** Answers the search in one paragraph. */
  answer: string;
  takeaways: string[];
  sections: LandingSection[];
  /** Places served, shown as a list where it matters. */
  areas?: readonly string[];
  faq: LandingFaq[];
  /** Capability pages this page leads into. */
  services: string[];
  /** Case studies that show the work. */
  projects: string[];
  /** Other search pages worth linking from here. */
  related: string[];
  /** `Service` (a commercial offer) or `Place` (a city / region page). */
  kind: "service" | "place";
  /** Shown in JSON-LD `serviceType` for service pages. */
  serviceType?: string;
  /** Last real edit. Shown on the page and in the sitemap. */
  updated: string;
};

const NORTH = ["Tanger", "Tétouan", "M’diq", "Larache", "Asilah", "Al Hoceïma", "Nador", "Chefchaouen"];

export const landings: readonly Landing[] = [
  {
    slug: "agence-digitale-tanger",
    locales: ["fr"],
    kind: "place",
    metaTitle: "Agence digitale à Tanger — sites web, marque et publicité",
    description:
      "AUREN est une agence digitale basée à Tanger : création de sites internet et de boutiques en ligne, identité de marque, Google Ads, Meta Ads et automatisation, avec des rendez-vous en personne.",
    eyebrow: "Tanger · Nord du Maroc",
    h1: "Agence digitale à Tanger",
    answer:
      "AUREN est une agence digitale basée à Tanger. Nous créons des sites internet, des boutiques en ligne, des identités de marque et des campagnes Google et Meta pour les entreprises de Tanger et du Nord, avec des rendez-vous en personne et un seul interlocuteur du début à la fin.",
    takeaways: [
      "Basés à Tanger : on se rencontre dans vos locaux ou autour d’un café, pas seulement en visio.",
      "Le site, la marque, la publicité et le suivi des demandes sont faits par la même équipe, donc ils racontent la même chose.",
      "Nous travaillons en français, en darija, en arabe et en anglais, et nous avons déjà livré en espagnol.",
    ],
    sections: [
      {
        heading: "Ce que nous faisons pour les entreprises de Tanger",
        body: [
          "Un site internet qui explique clairement ce que vous faites et qui donne envie de vous contacter : un appel, un message WhatsApp, une demande de devis ou un achat.",
          "Une boutique en ligne pensée pour le Maroc, avec le paiement à la livraison quand c’est ce que vos clients attendent, et des pages qui se lisent bien sur un téléphone.",
          "Un nom, un logo et un style qui se reconnaissent, puis les publicités Google, Facebook et Instagram qui amènent les bonnes personnes vers vous.",
          "Et derrière, un suivi simple : chaque demande arrive au bon endroit, personne n’est oublié, et vous savez quelle publicité a amené quel client.",
        ],
      },
      {
        heading: "Pourquoi une agence à Tanger plutôt qu’à distance",
        body: [
          "Un projet digital se joue souvent dans les détails : la façon dont vous parlez à vos clients, ce qu’ils demandent au téléphone, ce qui les fait hésiter. Ces choses-là s’entendent mieux en face à face.",
          "Être sur place permet aussi de venir photographier votre lieu, votre équipe ou vos produits, et de faire le point régulièrement sans attendre un créneau en visio.",
        ],
      },
      {
        heading: "Le marché de Tanger, vu de près",
        body: [
          "Tanger mélange des clientèles très différentes : les habitants, les entreprises liées au port Tanger Med et aux zones industrielles, les visiteurs et les clients venus d’Espagne et d’Europe. Un même site doit souvent parler à plusieurs de ces publics, dans plusieurs langues.",
          "Beaucoup de recherches se font en français, beaucoup de messages arrivent en darija sur WhatsApp, et une partie des clients cherche en espagnol ou en anglais. Nous construisons les pages et les parcours en tenant compte de ces habitudes, plutôt qu’avec un modèle conçu pour un autre pays.",
        ],
      },
      {
        heading: "Comment se passe un projet",
        body: [
          "Un premier échange, en personne ou par téléphone, pour comprendre votre activité et ce que vous attendez. Nous vous proposons ensuite un périmètre écrit et un calendrier.",
          "Pendant le projet, vous voyez des pages réelles au fur et à mesure, pas des images figées. Après la mise en ligne, nous restons disponibles pour faire évoluer le site et les campagnes.",
        ],
      },
    ],
    faq: [
      {
        q: "Où se trouve AUREN ?",
        a: "AUREN est basée à Tanger. Nous n’avons pas de bureau ouvert au public : nous venons vous voir dans vos locaux à Tanger et dans le Nord, ou nous nous retrouvons dans un lieu qui vous convient.",
      },
      {
        q: "Travaillez-vous uniquement avec des entreprises de Tanger ?",
        a: "Non. Nous sommes basés à Tanger et nous nous déplaçons dans tout le Nord, mais nous travaillons aussi avec des entreprises du reste du Maroc et de l’étranger, à distance.",
      },
      {
        q: "Combien coûte un site internet à Tanger ?",
        a: "Le prix dépend du nombre de pages, des langues, de la boutique en ligne éventuelle et de ce que vous attendez du site. Nous ne publions pas de tarif fixe : après un premier échange, vous recevez un devis écrit qui détaille ce qui est inclus.",
      },
      {
        q: "Combien de temps faut-il pour lancer un site ?",
        a: "Un site vitrine ciblé prend généralement de quatre à huit semaines, du premier échange à la mise en ligne. Une boutique en ligne ou un projet avec plusieurs langues demande plus de temps ; le calendrier est fixé une fois le périmètre écrit.",
      },
      {
        q: "Pouvez-vous gérer nos publicités Facebook, Instagram et Google ?",
        a: "Oui. Nous préparons les visuels et les textes, nous lançons les campagnes et nous les suivons, en reliant chaque demande ou chaque commande à la publicité qui l’a amenée.",
      },
    ],
    services: ["web-design-development", "creative-branding", "google-ads", "meta-ads", "seo", "ai-automation-crm"],
    projects: ["tagpet", "promostore-alu", "docteur-plante"],
    related: ["agence-digitale-nord-maroc", "creation-site-e-commerce-maroc", "agence-marketing-digital-maroc"],
    updated: "2026-10-22",
  },
  {
    slug: "agence-digitale-nord-maroc",
    locales: ["fr"],
    kind: "place",
    metaTitle: "Agence digitale dans le Nord du Maroc — Tanger, Tétouan, Nador",
    description:
      "Basée à Tanger, AUREN accompagne les entreprises de tout le Nord du Maroc — Tétouan, M’diq, Larache, Asilah, Al Hoceïma, Nador, Chefchaouen — en personne : sites internet, boutiques en ligne, marque et publicité.",
    eyebrow: "Nord du Maroc",
    h1: "Agence digitale pour le Nord du Maroc",
    answer:
      "AUREN accompagne les entreprises du Nord du Maroc depuis Tanger : Tétouan, M’diq, Larache, Asilah, Al Hoceïma, Nador et Chefchaouen. Nous nous déplaçons pour les rendez-vous importants et nous suivons le reste du projet à distance, avec un seul interlocuteur.",
    takeaways: [
      "Une équipe basée à Tanger qui se déplace dans tout le Nord pour les rendez-vous qui comptent.",
      "Les mêmes services partout : site internet, boutique en ligne, marque, publicité et suivi des demandes.",
      "Des sites qui parlent aux clients d’ici et à ceux de passage, en plusieurs langues.",
    ],
    sections: [
      {
        heading: "Un seul partenaire pour toute la région",
        body: [
          "Dans le Nord, beaucoup d’entreprises vivent de saisons, de visiteurs et de clients qui viennent d’ailleurs : tourisme, restauration, commerce, artisanat, services aux entreprises. Le site et la publicité doivent suivre ce rythme.",
          "Nous travaillons depuis Tanger et nous venons sur place au lancement du projet, pour les photos et pour les points importants. Le reste avance à distance, par téléphone, WhatsApp et visio, sans que vous ayez à courir après qui que ce soit.",
        ],
      },
      {
        heading: "Ce que nous mettons en place",
        body: [
          "Un site internet ou une boutique en ligne qui se lit bien sur téléphone et qui mène à une action claire : appeler, écrire sur WhatsApp, réserver ou commander.",
          "Une présence locale propre : votre fiche Google, vos réseaux et votre site disent la même chose, avec les mêmes coordonnées, pour que les gens qui vous cherchent vous trouvent.",
          "Des campagnes Google, Facebook et Instagram ciblées sur votre ville et vos clients, et un suivi qui montre ce qu’elles rapportent.",
        ],
      },
    ],
    areas: NORTH,
    faq: [
      {
        q: "Vous déplacez-vous à Tétouan, Nador ou Al Hoceïma ?",
        a: "Oui. Nous sommes basés à Tanger et nous venons sur place pour le premier rendez-vous, les prises de vue et les étapes importantes. Entre deux visites, le projet avance par téléphone, WhatsApp et visio.",
      },
      {
        q: "Mon entreprise vit surtout de l’été. Est-ce adapté ?",
        a: "Oui, et c’est même une raison de s’y prendre tôt. Nous préparons le site et les campagnes avant la saison, pour que tout soit en place quand les visiteurs commencent à chercher.",
      },
      {
        q: "Pouvez-vous créer un site en espagnol ou en anglais ?",
        a: "Oui. Nous construisons des sites en plusieurs langues, chacune avec ses propres pages, pour toucher les clients venus d’Espagne, d’Europe ou d’ailleurs.",
      },
    ],
    services: ["web-design-development", "creative-branding", "google-ads", "meta-ads", "seo"],
    projects: ["tagpet", "promostore-alu", "docteur-plante"],
    related: ["agence-digitale-tanger", "creation-site-e-commerce-maroc", "agence-marketing-digital-maroc"],
    updated: "2026-10-22",
  },
  {
    slug: "creation-site-e-commerce-maroc",
    locales: ["fr"],
    kind: "service",
    serviceType: "Création de site e-commerce",
    metaTitle: "Création de site e-commerce au Maroc — boutique en ligne",
    description:
      "Création de site e-commerce au Maroc : une boutique en ligne pensée pour le téléphone, le paiement à la livraison et WhatsApp, avec la gestion des produits et le suivi des commandes. Par AUREN, à Tanger.",
    eyebrow: "Boutique en ligne",
    h1: "Création de site e-commerce au Maroc",
    answer:
      "Nous créons des boutiques en ligne pour les marques et les commerces au Maroc : des pages produits qui donnent envie d’acheter sur un téléphone, une commande simple avec paiement à la livraison si vos clients le préfèrent, et un espace pour gérer vos produits et vos commandes.",
    takeaways: [
      "Pensée pour le Maroc : paiement à la livraison, confirmation par téléphone ou WhatsApp, pages en arabe et en français.",
      "La page produit fait le travail d’un bon vendeur : elle montre, rassure et rend la commande évidente.",
      "Vous savez quelle publicité a amené chaque commande, donc vous savez où mettre votre budget.",
    ],
    sections: [
      {
        heading: "Ce qui fait vendre une boutique en ligne au Maroc",
        body: [
          "Ici, une grande partie des achats en ligne se fait sur téléphone et se paie à la livraison. La boutique doit donc rassurer vite : des photos nettes, un prix clair, la livraison expliquée, et un bouton de commande qui ne demande pas de créer un compte.",
          "Pour beaucoup de clients, la langue compte autant que le design. Une boutique en arabe doit se lire dans le bon sens jusque dans les détails, et pas comme une traduction posée sur une page française.",
        ],
      },
      {
        heading: "Ce que nous construisons",
        body: [
          "Le catalogue et les pages produits, avec les choix (taille, couleur, modèle) présentés de façon visuelle. Le panier et la commande, avec paiement à la livraison ou paiement en ligne selon votre activité.",
          "Un espace d’administration pour ajouter vos produits, suivre les commandes et les confirmer. Le suivi des publicités, pour relier chaque commande à la campagne qui l’a amenée.",
          "Et si vous le souhaitez, les visuels et les vidéos des publicités, faits dans le même style que la boutique, pour que la publicité et la page sur laquelle elle mène se ressemblent.",
        ],
      },
      {
        heading: "Un exemple concret",
        body: [
          "Pour TagPet, une marque marocaine d’accessoires pour animaux, nous avons refait la boutique, l’identité et toutes les publicités : une boutique en trois langues, en arabe d’abord, avec le paiement à la livraison, un espace d’administration et le suivi de chaque commande jusqu’à la publicité d’origine.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on accepter le paiement à la livraison ?",
        a: "Oui. C’est souvent le mode de paiement que les clients préfèrent au Maroc. La commande est enregistrée, vous la confirmez par téléphone ou WhatsApp, puis le livreur encaisse à la porte.",
      },
      {
        q: "Peut-on aussi payer par carte ?",
        a: "Oui, la boutique peut proposer un paiement en ligne en plus du paiement à la livraison. Le choix dépend de votre activité et des solutions de paiement que vous utilisez déjà.",
      },
      {
        q: "Combien coûte un site e-commerce ?",
        a: "Le prix dépend du nombre de produits, des langues, des modes de paiement et de ce que vous voulez gérer vous-même. Nous ne publions pas de tarif fixe : vous recevez un devis écrit après un premier échange.",
      },
      {
        q: "Combien de temps faut-il pour lancer la boutique ?",
        a: "Comptez généralement plus de temps qu’un site vitrine, car il faut le catalogue, la commande et l’administration. Le calendrier est fixé une fois le périmètre écrit, plutôt que deviné au départ.",
      },
    ],
    services: ["web-design-development", "meta-ads", "google-ads", "creative-branding"],
    projects: ["tagpet"],
    related: ["agence-digitale-tanger", "agence-marketing-digital-maroc"],
    updated: "2026-10-22",
  },
  {
    slug: "agence-marketing-digital-maroc",
    locales: ["fr"],
    kind: "service",
    serviceType: "Marketing digital",
    metaTitle: "Agence marketing digital au Maroc — Google, Meta et SEO",
    description:
      "Agence de marketing digital au Maroc, basée à Tanger : publicité Google Ads et Meta Ads, référencement SEO, contenus et suivi des demandes, reliés à un site qui transforme les visites en clients.",
    eyebrow: "Marketing digital",
    h1: "Agence marketing digital au Maroc",
    answer:
      "AUREN est une agence de marketing digital basée à Tanger qui travaille partout au Maroc. Nous faisons venir des clients avec Google, Facebook, Instagram et le référencement naturel, et nous relions chaque campagne à un site et à un suivi qui montrent ce qu’elle rapporte.",
    takeaways: [
      "La publicité, le site et le suivi sont faits ensemble, pour que chaque dirham dépensé mène quelque part.",
      "Vous voyez quelles campagnes amènent des demandes ou des ventes, pas seulement des clics.",
      "Les visuels et les textes des publicités sont créés dans le style de votre marque.",
    ],
    sections: [
      {
        heading: "Ce que couvre notre marketing digital",
        body: [
          "La publicité sur Google, pour être là quand quelqu’un cherche ce que vous vendez. La publicité sur Facebook et Instagram, pour vous faire connaître des bonnes personnes et les faire revenir.",
          "Le référencement naturel, pour apparaître dans les résultats de Google sans payer chaque clic, et dans les réponses des assistants comme ChatGPT. Les visuels, les vidéos et les textes des publicités.",
        ],
      },
      {
        heading: "Pourquoi relier la publicité au site",
        body: [
          "Une bonne publicité qui mène vers une page confuse fait perdre de l’argent. Nous travaillons la page d’arrivée en même temps que la campagne, pour que la personne qui clique trouve tout de suite ce qu’on lui a promis.",
          "Chaque demande, chaque appel et chaque commande est relié à la campagne qui l’a amené. Vous savez où mettre votre budget, et ce qu’il faut arrêter.",
        ],
      },
    ],
    faq: [
      {
        q: "Quel budget publicitaire faut-il prévoir ?",
        a: "Cela dépend de votre activité, de votre ville et de la concurrence sur vos mots-clés. Nous commençons par un budget de test raisonnable, nous regardons ce qui amène des demandes, puis nous augmentons ce qui fonctionne.",
      },
      {
        q: "Combien de temps avant de voir des résultats ?",
        a: "La publicité peut amener des visites dès les premiers jours ; il faut ensuite quelques semaines pour savoir ce qui fonctionne vraiment. Le référencement naturel est plus lent : comptez plusieurs mois pour des effets nets.",
      },
      {
        q: "Travaillez-vous avec des entreprises hors de Tanger ?",
        a: "Oui. Nous sommes basés à Tanger et nous travaillons avec des entreprises de tout le Maroc, en personne dans le Nord et à distance ailleurs.",
      },
    ],
    services: ["google-ads", "meta-ads", "seo", "creative-branding", "ai-automation-crm"],
    projects: ["tagpet", "promostore-alu"],
    related: ["agence-digitale-tanger", "creation-site-e-commerce-maroc", "agence-digitale-nord-maroc"],
    updated: "2026-10-22",
  },
];

export const landingBySlug = Object.fromEntries(landings.map((l) => [l.slug, l])) as Record<
  string,
  Landing
>;

/** Locale-free path → the only locales it exists in. Read by `i18n/translated`. */
export const exclusiveRoutes: Record<string, readonly Locale[]> = Object.fromEntries(
  landings.map((l) => [`/${l.slug}`, l.locales]),
);

export const northCities = NORTH;
