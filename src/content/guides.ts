/**
 * Guides — French, answer-first pages meant to be quoted.
 *
 * Each guide is written to one shape, because that shape is what search
 * engines and assistants lift from:
 *
 *   answer     The question answered in the first paragraph, on its own.
 *   sections   Headings phrased as the questions people ask. Every section
 *              carries at least one figure, and every figure carries its
 *              source (`cite`), linked on the page. No figure here is
 *              estimated, rounded up or invented; if a source could not be
 *              read, the figure is not used.
 *   table      One comparison table.
 *   quote      One attributed quote. External quotes are translated from the
 *              source and marked as such; where no outside source said it, the
 *              note is signed by the studio and labelled as its own view.
 *   faq        Visible questions and answers, emitted as FAQPage.
 *
 * Prices quoted are *other agencies'* published ranges, named and linked —
 * AUREN does not publish its own. Signed "Équipe AUREN": no personal byline.
 * Sources were read on 22 October 2026.
 */

export type Cite = { label: string; url: string };
export type GuideSection = { q: string; body: string[]; cite: Cite[] };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  answer: string;
  published: string;
  updated: string;
  sections: GuideSection[];
  table: { caption: string; head: string[]; rows: string[][]; cite?: Cite[] };
  quote: { text: string; who: string; note?: string; cite?: Cite };
  faq: { q: string; a: string }[];
  /** The capability page this guide leads to. */
  service: string;
  /** A French search page it also leads to, when one fits. */
  landing?: string;
};

/* Sources, defined once so the same figure is always cited the same way. */
const S = {
  datareportal: { label: "DataReportal, « Digital 2025: Morocco »", url: "https://datareportal.com/reports/digital-2025-morocco" },
  statPlatform: { label: "StatCounter, parts de plateforme au Maroc, septembre 2026", url: "https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/morocco" },
  statOs: { label: "StatCounter, systèmes mobiles au Maroc, septembre 2026", url: "https://gs.statcounter.com/os-market-share/mobile/morocco" },
  statSearch: { label: "StatCounter, moteurs de recherche au Maroc, septembre 2026", url: "https://gs.statcounter.com/search-engine-market-share/all/morocco" },
  webVitals: { label: "Google, web.dev, « Web Vitals »", url: "https://web.dev/articles/vitals" },
  baymard: { label: "Baymard Institute, taux d’abandon de panier (mis à jour le 22 septembre 2025)", url: "https://baymard.com/lists/cart-abandonment-rate" },
  nngroup: { label: "Jakob Nielsen, Nielsen Norman Group, « How Little Do Users Read? » (2008)", url: "https://www.nngroup.com/articles/how-little-do-users-read/" },
  googleSeo: { label: "Google Search Central, « Do you need an SEO? »", url: "https://developers.google.com/search/docs/fundamentals/do-i-need-seo" },
  adsBudget: { label: "Aide Google Ads, budget quotidien moyen", url: "https://support.google.com/google-ads/answer/2375423?hl=fr" },
  cmi: { label: "Finances News Hebdo, « Maroc : le e-paiement gagne en puissance et en maturité » (1er mars 2023)", url: "https://fnh.ma/article/actualite-economique/e-paiement-maroc" },
  mumtaz: { label: "Mumtaz, « Combien coûte un site web au Maroc » (mis à jour le 11 octobre 2026)", url: "https://mumtaz.ma/prix-site-web-maroc" },
  dotma: { label: "Dotma, « Quel est le prix de création d’un site web au Maroc ? » (28 août 2026)", url: "https://www.dotma.ma/prix-creation-site-web-maroc" },
  rimas: { label: "RIMAS Digital, « Prix référencement naturel (SEO) au Maroc » (29 juin 2026)", url: "https://rimasdigital.ma/blog/prix-referencement-seo-maroc/" },
  marketmedia: { label: "MarketMedia, « Prix du SEO au Maroc » (18 août 2026)", url: "https://www.marketmedia.ma/blog/prix-seo-maroc/" },
  apple: { label: "Apple, Apple Developer Program", url: "https://developer.apple.com/programs/" },
  playFee: { label: "Aide Google Play Console, frais d’inscription", url: "https://support.google.com/googleplay/android-developer/answer/6112435?hl=fr" },
  playService: { label: "Aide Google Play Console, frais de service", url: "https://support.google.com/googleplay/android-developer/answer/112622?hl=fr" },
  mckinsey: { label: "McKinsey, « The state of AI in 2025 »", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
  tagpet: { label: "Étude de cas AUREN : TagPet", url: "/work/tagpet" },
  promostore: { label: "Étude de cas AUREN : PromoStore Alu", url: "/work/promostore-alu" },
  plante: { label: "Étude de cas AUREN : Docteur Plante", url: "/work/docteur-plante" },
} satisfies Record<string, Cite>;

const TEAM = "Note de l’équipe AUREN";

export const guides: readonly Guide[] = [
  {
    slug: "creation-site-internet-maroc",
    title: "Création de site internet au Maroc : le guide complet",
    metaTitle: "Création de site internet au Maroc : le guide complet",
    description:
      "Combien coûte un site internet au Maroc, combien de temps faut-il, et comment choisir son prestataire : prix publiés, délais, critères et questions à poser.",
    answer:
      "Au Maroc, un site vitrine se situe le plus souvent entre quelques milliers et quelques dizaines de milliers de dirhams selon les agences qui publient leurs prix, et demande en général de quatre à huit semaines. Ce qui fait la différence n’est pas le prix, mais trois choses : un message clair, une page rapide sur téléphone et une action évidente pour vous contacter.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Qui va voir votre site, et sur quel écran ?",
        body: [
          "Presque tout le pays est en ligne : 35,3 millions de personnes utilisaient internet au Maroc au début de 2025, soit 92,2 % de la population.",
          "Le téléphone ne fait pas tout : en septembre 2026, 45,73 % des pages vues au Maroc venaient d’un mobile et 53,33 % d’un ordinateur. Un site doit donc être pensé d’abord pour le téléphone, sans négliger l’écran d’ordinateur des clients professionnels.",
        ],
        cite: [S.datareportal, S.statPlatform],
      },
      {
        q: "Combien coûte un site internet au Maroc ?",
        body: [
          "Les agences qui publient leurs tarifs donnent des fourchettes larges. Mumtaz indique 8 000 à 25 000 DH pour un site vitrine professionnel et 15 000 à 60 000 DH pour un site e-commerce. Dotma indique 3 500 à 6 000 DH pour un site vitrine simple et 8 000 à 15 000 DH pour un e-commerce simple.",
          "L’écart s’explique par le nombre de pages, les langues, la rédaction des textes, les photos, l’e-commerce et ce que le site doit relier (WhatsApp, prise de rendez-vous, gestion des commandes). Comparez toujours des devis qui listent les mêmes éléments.",
        ],
        cite: [S.mumtaz, S.dotma],
      },
      {
        q: "Que doit contenir un bon site ?",
        body: [
          "Une page d’accueil qui dit en une phrase ce que vous faites et pour qui. Une page par service, avec ses questions fréquentes. Des preuves : réalisations, photos réelles, avis s’ils existent. Et un moyen de contact visible sur chaque page — téléphone, WhatsApp ou formulaire court.",
          "La vitesse compte : Google considère qu’une page est bonne quand son plus grand élément s’affiche en 2,5 secondes au plus, mesuré sur 75 % des visites.",
        ],
        cite: [S.webVitals],
      },
      {
        q: "Combien de temps faut-il ?",
        body: [
          "Pour un site vitrine ciblé, comptez de quatre à huit semaines entre le premier échange et la mise en ligne, si les textes et les photos avancent en même temps que le design. Une boutique en ligne ou un site en plusieurs langues demande plus de temps.",
          "Chez PromoStore Alu, un atelier d’aluminium à Rabat, le projet comprenait le logo (onze déclinaisons, claires et sombres), le site avec ses pages de services et la demande de devis directement sur WhatsApp.",
        ],
        cite: [S.promostore],
      },
    ],
    table: {
      caption: "Fourchettes publiées par deux agences marocaines (en dirhams)",
      head: ["Type de site", "Mumtaz", "Dotma"],
      rows: [
        ["Site vitrine", "8 000 – 25 000", "3 500 – 10 000"],
        ["Site e-commerce", "15 000 – 60 000", "à partir de 8 000"],
        ["Sur mesure", "50 000 – 500 000 et plus", "à partir de 15 000"],
      ],
      cite: [S.mumtaz, S.dotma],
    },
    quote: {
      text: "Le plus grand élément de la page devrait s’afficher dans les 2,5 secondes qui suivent le début du chargement.",
      who: "Google, web.dev",
      note: "traduit de l’anglais",
      cite: S.webVitals,
    },
    faq: [
      { q: "Faut-il un site si l’on a déjà une page Facebook ou Instagram ?", a: "Oui, pour une raison simple : le site vous appartient, il apparaît dans Google et il peut expliquer vos services en détail. Les réseaux sociaux amènent des visiteurs ; le site les convainc et les fait passer à l’action." },
      { q: "Le prix comprend-il l’hébergement et le nom de domaine ?", a: "Pas toujours. Demandez si l’hébergement, le nom de domaine, la maintenance et les modifications après la mise en ligne sont inclus, et pour combien de temps." },
      { q: "Peut-on modifier le site soi-même ?", a: "Cela dépend de la façon dont il est construit. Demandez à voir comment se modifie un texte ou une photo avant de signer." },
      { q: "AUREN publie-t-elle ses prix ?", a: "Non. Nous envoyons un devis écrit après un premier échange, avec la liste de ce qui est inclus." },
    ],
    service: "web-design-development",
    landing: "agence-digitale-tanger",
  },
  {
    slug: "site-e-commerce-maroc",
    title: "Créer un site e-commerce au Maroc : le guide complet",
    metaTitle: "Créer un site e-commerce au Maroc : guide complet",
    description:
      "Paiement à la livraison ou par carte, ce qui fait abandonner un panier, les prix publiés et les étapes pour lancer une boutique en ligne au Maroc.",
    answer:
      "Pour vendre en ligne au Maroc, il faut une boutique qui rassure vite sur téléphone, propose le paiement à la livraison quand vos clients l’attendent, et confirme chaque commande par téléphone ou WhatsApp. Le paiement par carte progresse, mais c’est la confiance et la simplicité de la commande qui décident de la vente.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Les Marocains paient-ils en ligne ?",
        body: [
          "De plus en plus. Les sites marchands et facturiers affiliés au CMI ont enregistré 20,4 millions d’opérations de paiement en ligne par carte pour 7,1 milliards de DH sur les neuf premiers mois de 2022, en hausse de 37,1 % en nombre sur un an.",
          "Dans la pratique, beaucoup de boutiques proposent les deux : la carte pour ceux qui le souhaitent, et le paiement à la livraison pour les autres.",
        ],
        cite: [S.cmi],
      },
      {
        q: "Pourquoi les clients abandonnent-ils leur panier ?",
        body: [
          "Le Baymard Institute calcule un taux moyen d’abandon de panier de 70,22 %, à partir de 50 études. Les raisons citées le plus souvent pendant la commande : des frais supplémentaires trop élevés (40 %), un manque de confiance pour donner sa carte (19 %), l’obligation de créer un compte (18 %), une commande trop longue ou compliquée (17 %).",
          "Chacune a une réponse simple : afficher la livraison tôt, proposer le paiement à la livraison, permettre de commander sans compte, et réduire la commande à l’essentiel.",
        ],
        cite: [S.baymard],
      },
      {
        q: "Combien coûte une boutique en ligne ?",
        body: [
          "Les fourchettes publiées vont de 8 000 à 15 000 DH pour un e-commerce simple chez Dotma, et de 15 000 à 60 000 DH chez Mumtaz. Le prix dépend du nombre de produits, des langues, des modes de paiement et de l’espace d’administration.",
        ],
        cite: [S.dotma, S.mumtaz],
      },
      {
        q: "Que faut-il prévoir au-delà du site ?",
        body: [
          "Les photos des produits, les textes, la livraison et la confirmation des commandes. Et la publicité : au début de 2025, la portée publicitaire de Facebook au Maroc équivalait à 55,5 % de la population, celle d’Instagram à 34,2 %.",
          "Pour TagPet, une marque marocaine d’accessoires pour animaux, la boutique, l’identité et toutes les publicités ont été faites ensemble : boutique en trois langues, paiement à la livraison, espace d’administration et suivi de chaque commande jusqu’à la publicité d’origine.",
        ],
        cite: [S.datareportal, S.tagpet],
      },
    ],
    table: {
      caption: "Raisons d’abandon pendant la commande, et la réponse à apporter",
      head: ["Raison citée", "Part", "Réponse"],
      rows: [
        ["Frais supplémentaires trop élevés", "40 %", "Afficher la livraison dès la page produit"],
        ["Pas confiance pour la carte", "19 %", "Proposer le paiement à la livraison"],
        ["Création de compte obligatoire", "18 %", "Commander sans compte"],
        ["Commande trop longue", "17 %", "Une seule page, peu de champs"],
      ],
      cite: [S.baymard],
    },
    quote: {
      text: "Au Maroc, la page produit fait le travail d’un bon vendeur : elle montre, elle rassure, et elle rend la commande évidente.",
      who: "Équipe AUREN",
      note: TEAM,
    },
    faq: [
      { q: "Faut-il obligatoirement proposer le paiement par carte ?", a: "Non. Beaucoup de boutiques démarrent avec le paiement à la livraison et ajoutent la carte ensuite. Le choix dépend de vos clients et de votre activité." },
      { q: "Comment limiter les commandes non récupérées ?", a: "En confirmant chaque commande par téléphone ou WhatsApp avant l’envoi, et en affichant clairement le prix total et le délai de livraison." },
      { q: "Peut-on vendre en arabe et en français ?", a: "Oui, à condition que chaque langue ait ses propres pages, et que l’arabe se lise dans le bon sens jusque dans les détails." },
    ],
    service: "web-design-development",
    landing: "creation-site-e-commerce-maroc",
  },
  {
    slug: "agence-branding-maroc",
    title: "Agence branding au Maroc : comment la choisir",
    metaTitle: "Agence branding au Maroc : comment la choisir",
    description:
      "Ce que doit livrer une agence de branding, les questions à poser, les pièges à éviter et pourquoi l’identité doit tenir sur Instagram et sur le site.",
    answer:
      "Choisissez une agence de branding sur ce qu’elle livre, pas sur un logo isolé : un nom ou un logo qui part de votre métier, une charte écrite que d’autres peuvent appliquer, et des déclinaisons prêtes pour votre site, vos réseaux et vos supports. Demandez des exemples où l’identité vit dans le temps, pas seulement une belle présentation.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Que doit livrer une agence de branding ?",
        body: [
          "Au minimum : le logo et ses versions (claire, sombre, petite taille), les couleurs et les typographies, et des règles écrites. Idéalement : des exemples appliqués — publicité, publication, page web, emballage.",
          "Pour PromoStore Alu, à Rabat, le logo est parti du produit lui-même — le profil d’un cadre de fenêtre — et a été livré en onze déclinaisons, claires et sombres, avec une page de présentation de l’identité.",
        ],
        cite: [S.promostore],
      },
      {
        q: "Pourquoi l’identité doit-elle tenir sur les réseaux ?",
        body: [
          "Parce que c’est souvent là qu’on vous découvre : au début de 2025, le Maroc comptait 21,3 millions d’identités d’utilisateurs de réseaux sociaux, et la portée publicitaire d’Instagram équivalait à 34,2 % de la population.",
          "Une identité qui ne fonctionne qu’en grand format sur un écran d’ordinateur se perd dans un fil Instagram. Demandez à voir le logo en tout petit, en noir et blanc, et dans une publicité.",
        ],
        cite: [S.datareportal],
      },
      {
        q: "Quelles questions poser avant de signer ?",
        body: [
          "Combien de pistes créatives seront présentées ? Combien de tours de modification ? Qui possède les fichiers sources à la fin ? La charte est-elle écrite, ou seulement montrée en présentation ?",
          "Pour TagPet, l’identité a été écrite avant toute création — matières, finitions, lumière, et ce qu’on ne photographie jamais — puis chaque publicité a été vérifiée par rapport à ce document.",
        ],
        cite: [S.tagpet],
      },
    ],
    table: {
      caption: "Ce qu’on reçoit, selon le niveau de l’accompagnement",
      head: ["Livrable", "Logo seul", "Identité complète"],
      rows: [
        ["Logo et versions", "Oui", "Oui"],
        ["Couleurs et typographies", "Parfois", "Oui"],
        ["Règles écrites (charte)", "Non", "Oui"],
        ["Exemples appliqués (pub, réseaux, site)", "Non", "Oui"],
        ["Fichiers sources", "À vérifier", "À vérifier"],
      ],
    },
    quote: {
      text: "Une identité se juge dans une publicité Instagram en petit format, pas seulement sur une planche de présentation.",
      who: "Équipe AUREN",
      note: TEAM,
    },
    faq: [
      { q: "Faut-il refaire son logo si l’entreprise marche déjà ?", a: "Pas forcément. Souvent, il suffit de clarifier ce qui existe : couleurs, typographies, règles d’usage. Une refonte complète se justifie quand le logo ne se lit plus ou ne correspond plus à ce que vous vendez." },
      { q: "Combien de temps prend une identité ?", a: "Cela dépend du nombre de pistes et de déclinaisons. Fixez le calendrier avec l’agence une fois les livrables écrits." },
      { q: "Le branding comprend-il le site internet ?", a: "Pas toujours. Si l’agence fait aussi le site, la marque et le site restent cohérents ; sinon, vérifiez que la charte est assez précise pour être appliquée par quelqu’un d’autre." },
    ],
    service: "creative-branding",
  },
  {
    slug: "comment-choisir-agence-marketing-digital",
    title: "Agence de marketing digital au Maroc : comment choisir",
    metaTitle: "Comment choisir une agence de marketing digital au Maroc",
    description:
      "Les critères pour choisir une agence de marketing digital au Maroc : ce qu’elle mesure, qui possède les comptes, les promesses à fuir et les questions à poser.",
    answer:
      "Choisissez une agence de marketing digital qui mesure des demandes et des ventes, pas seulement des clics ; qui vous laisse propriétaire de vos comptes ; et qui ne promet jamais de place garantie dans Google. Demandez à voir comment elle relie une campagne à un client réel.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Où se trouvent vos clients en ligne ?",
        body: [
          "Au début de 2025, la portée publicitaire de Facebook au Maroc équivalait à 55,5 % de la population, celle d’Instagram à 34,2 %, et celle de TikTok à 41,3 % des internautes.",
          "Côté recherche, Google représentait 95,38 % des recherches au Maroc en septembre 2026. Une agence sérieuse doit savoir expliquer pourquoi elle choisit l’un ou l’autre pour votre activité.",
        ],
        cite: [S.datareportal, S.statSearch],
      },
      {
        q: "Quelles promesses faut-il fuir ?",
        body: [
          "La première place garantie sur Google. Google l’écrit lui-même : personne ne peut garantir un classement en première position, et si quelqu’un vous le garantit, il conseille de chercher quelqu’un d’autre.",
          "Méfiez-vous aussi des rapports qui ne parlent que de « portée » et de « clics » sans jamais parler de demandes, d’appels ou de ventes.",
        ],
        cite: [S.googleSeo],
      },
      {
        q: "Quelles questions poser avant de signer ?",
        body: [
          "À qui appartiennent les comptes publicitaires et les données ? Comment saurai-je quelle campagne a amené quel client ? Qui crée les visuels ? Que se passe-t-il si j’arrête le contrat ?",
          "Pour TagPet, chaque commande est reliée à la publicité qui l’a amenée, et le montant est confirmé côté serveur plutôt que lu dans le navigateur — c’est ce niveau de suivi qu’il faut demander.",
        ],
        cite: [S.tagpet],
      },
    ],
    table: {
      caption: "Agence orientée résultats ou agence orientée volume : les signes",
      head: ["Question", "Bon signe", "Mauvais signe"],
      rows: [
        ["Ce qui est mesuré", "Demandes, appels, ventes", "Clics et portée seulement"],
        ["Comptes publicitaires", "À votre nom", "Au nom de l’agence"],
        ["Promesse sur Google", "Un plan et un calendrier", "« Première place garantie »"],
        ["Visuels", "Dans le style de votre marque", "Modèles génériques"],
      ],
    },
    quote: {
      text: "Personne ne peut garantir un classement en première position sur Google.",
      who: "Google Search Central",
      note: "traduit de l’anglais",
      cite: S.googleSeo,
    },
    faq: [
      { q: "Faut-il une agence pour chaque canal ?", a: "Ce n’est pas obligatoire, et c’est souvent plus simple de ne pas le faire : quand la publicité, le site et le suivi sont faits par la même équipe, ils racontent la même chose." },
      { q: "Quel budget prévoir ?", a: "Il dépend de votre ville, de votre secteur et de la concurrence. Commencez par un budget de test, regardez ce qui amène des demandes, puis augmentez ce qui fonctionne." },
      { q: "Combien de temps avant d’évaluer une agence ?", a: "Pour la publicité, quelques semaines suffisent pour voir ce qui fonctionne. Pour le référencement naturel, il faut plusieurs mois." },
    ],
    service: "meta-ads",
    landing: "agence-marketing-digital-maroc",
  },
  {
    slug: "prix-referencement-seo-maroc",
    title: "Référencement SEO au Maroc : prix et résultats à attendre",
    metaTitle: "Prix du référencement SEO au Maroc et résultats à attendre",
    description:
      "Combien coûte le référencement naturel au Maroc selon les agences qui publient leurs prix, ce que comprend un forfait, et ce qu’on peut raisonnablement attendre.",
    answer:
      "Les agences marocaines qui publient leurs tarifs situent le référencement naturel entre environ 2 000 et 40 000 MAD par mois, et la plupart des forfaits pour PME entre 3 000 et 15 000 MAD par mois. Personne ne peut garantir la première place sur Google : attendez un plan clair, des pages utiles et un suivi mensuel des recherches qui amènent des clients.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Combien coûte le SEO au Maroc ?",
        body: [
          "MarketMedia écrit que le référencement naturel se vend au Maroc entre 2 000 et 40 000 MAD par mois. RIMAS Digital situe un forfait mensuel entre 3 000 et 15 000 MAD par mois pour une PME.",
          "L’écart dépend de l’état du site, du nombre de pages à créer, de la concurrence sur vos mots-clés et du nombre de villes visées.",
        ],
        cite: [S.marketmedia, S.rimas],
      },
      {
        q: "Pourquoi Google compte-t-il autant ?",
        body: [
          "En septembre 2026, Google représentait 95,38 % des recherches au Maroc, Bing 3,21 %. Travailler son référencement, au Maroc, c’est d’abord travailler sa place dans Google.",
        ],
        cite: [S.statSearch],
      },
      {
        q: "Que comprend un bon accompagnement ?",
        body: [
          "Une page par service et par ville réellement servie, avec des titres qui reprennent ce que les gens tapent. Une fiche Google Business Profile complète et à jour. Des pages rapides : Google vise un affichage du plus grand élément en 2,5 secondes au plus.",
          "Et un rapport mensuel qui parle de demandes, pas seulement de positions.",
        ],
        cite: [S.webVitals],
      },
      {
        q: "Quels résultats attendre, et quand ?",
        body: [
          "Google conseille de demander à tout prestataire quels résultats il attend et dans quel délai — et de partir s’il garantit la première place. Comptez plusieurs mois avant des effets nets ; la publicité peut amener des visites plus vite pendant ce temps.",
        ],
        cite: [S.googleSeo],
      },
    ],
    table: {
      caption: "Fourchettes mensuelles publiées (en MAD)",
      head: ["Source", "Fourchette", "Pour qui"],
      rows: [
        ["MarketMedia", "2 000 – 40 000 / mois", "Marché marocain, tous profils"],
        ["RIMAS Digital", "3 000 – 15 000 / mois", "PME"],
      ],
      cite: [S.marketmedia, S.rimas],
    },
    quote: {
      text: "S’ils vous garantissent la première place dans les résultats de recherche, cherchez quelqu’un d’autre.",
      who: "Google Search Central",
      note: "traduit de l’anglais",
      cite: S.googleSeo,
    },
    faq: [
      { q: "Le SEO remplace-t-il la publicité ?", a: "Non, ils se complètent. La publicité amène des visites tout de suite ; le référencement naturel construit une présence qui ne se paie pas au clic." },
      { q: "Faut-il une page par ville ?", a: "Seulement pour les villes où vous intervenez vraiment, avec un contenu propre à chacune. Des pages identiques qui ne changent que le nom de la ville sont à éviter." },
      { q: "Et les assistants comme ChatGPT ?", a: "Ils citent des pages qui répondent clairement aux questions, avec des faits et des sources. Le même travail sert donc Google et les assistants." },
    ],
    service: "seo",
  },
  {
    slug: "google-ads-maroc",
    title: "Google Ads pour les entreprises marocaines : guide de démarrage",
    metaTitle: "Google Ads au Maroc : guide de démarrage pour entreprises",
    description:
      "Comment fonctionne Google Ads, comment le budget est dépensé, comment démarrer une première campagne au Maroc et quelles erreurs éviter.",
    answer:
      "Google Ads affiche votre annonce quand quelqu’un cherche ce que vous vendez, et vous payez quand il clique. Pour démarrer au Maroc : une campagne sur les recherches liées à votre service et votre ville, une page d’arrivée qui répond exactement à la recherche, un budget de test, et le suivi des appels et des demandes dès le premier jour.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Pourquoi Google pour une entreprise au Maroc ?",
        body: [
          "Parce que c’est là que les gens cherchent : en septembre 2026, Google représentait 95,38 % des recherches au Maroc. Une annonce Google touche quelqu’un au moment précis où il a besoin de vous.",
        ],
        cite: [S.statSearch],
      },
      {
        q: "Comment le budget est-il dépensé ?",
        body: [
          "Vous fixez un budget quotidien moyen. Selon l’aide Google Ads, une campagne peut dépenser jusqu’à deux fois ce budget un jour donné, mais à la fin du mois vos dépenses ne dépasseront pas 30,4 fois votre budget quotidien moyen.",
          "Autrement dit, raisonnez en budget mensuel : un budget de 100 DH par jour correspond à 3 040 DH au plus sur le mois.",
        ],
        cite: [S.adsBudget],
      },
      {
        q: "Comment démarrer une première campagne ?",
        body: [
          "Choisissez quelques recherches précises (« plombier Tanger », « location voiture Tétouan ») plutôt que des mots trop larges. Écrivez des annonces qui reprennent ces mots. Envoyez chaque annonce vers la page qui répond à cette recherche, pas vers l’accueil.",
          "Mesurez dès le départ les appels, les messages WhatsApp et les formulaires. Sans cela, impossible de savoir quelles recherches rapportent.",
        ],
        cite: [S.adsBudget],
      },
      {
        q: "Où arrivent les gens qui cliquent ?",
        body: [
          "Sur une page qui doit se charger vite et se lire sur tous les écrans : en septembre 2026, 45,73 % des pages vues au Maroc venaient d’un mobile. Google vise un affichage du plus grand élément en 2,5 secondes au plus.",
        ],
        cite: [S.statPlatform, S.webVitals],
      },
    ],
    table: {
      caption: "Budget quotidien moyen et plafond mensuel (règle Google Ads)",
      head: ["Budget quotidien moyen", "Maximum un jour donné", "Maximum sur le mois"],
      rows: [
        ["50 DH", "100 DH", "1 520 DH"],
        ["100 DH", "200 DH", "3 040 DH"],
        ["300 DH", "600 DH", "9 120 DH"],
      ],
      cite: [S.adsBudget],
    },
    quote: {
      text: "À la fin du mois, vos dépenses ne dépasseront pas 30,4 fois votre budget quotidien moyen.",
      who: "Aide Google Ads",
      cite: S.adsBudget,
    },
    faq: [
      { q: "Quel budget pour commencer ?", a: "Un budget de test que vous pouvez dépenser sans stress pendant quelques semaines, le temps de voir quelles recherches amènent des demandes. On augmente ensuite ce qui fonctionne." },
      { q: "Faut-il un site pour faire de la publicité Google ?", a: "Il faut au moins une page d’arrivée claire et rapide. Envoyer les clics vers une page confuse fait perdre de l’argent." },
      { q: "Google Ads ou Facebook ?", a: "Google touche les gens qui cherchent déjà ; Facebook et Instagram font connaître votre offre à ceux qui ne cherchent pas encore. Beaucoup d’entreprises utilisent les deux." },
    ],
    service: "google-ads",
    landing: "agence-marketing-digital-maroc",
  },
  {
    slug: "application-mobile-maroc",
    title: "Créer une application mobile au Maroc : étapes et coûts",
    metaTitle: "Créer une application mobile au Maroc : étapes et coûts",
    description:
      "Les étapes pour créer une application mobile au Maroc, Android ou iPhone, les frais fixes des stores, et quand une application web suffit.",
    answer:
      "Pour créer une application mobile au Maroc, commencez par Android, qui équipe environ trois téléphones sur quatre, et demandez-vous si une application web installable ne suffit pas. Les stores ont leurs propres frais : 25 USD une fois pour Google Play, 99 USD par an pour l’Apple Developer Program, et une commission sur les ventes dans l’application.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Android ou iPhone d’abord ?",
        body: [
          "En septembre 2026, Android représentait 74,02 % des systèmes mobiles au Maroc, et iOS 25,97 %. Pour une application grand public, Android passe en premier ; pour une clientèle aisée ou internationale, l’iPhone compte davantage.",
        ],
        cite: [S.statOs],
      },
      {
        q: "Quels sont les frais fixes des stores ?",
        body: [
          "Google Play demande un versement unique de 25 USD pour l’inscription. L’Apple Developer Program coûte 99 USD par an.",
          "Sur les ventes dans l’application, Google Play prélève 15 % sur le premier million de dollars de revenus annuels et 30 % au-delà, et 15 % sur les abonnements.",
        ],
        cite: [S.playFee, S.apple, S.playService],
      },
      {
        q: "Une application web peut-elle suffire ?",
        body: [
          "Souvent, oui. Une application web s’installe depuis le navigateur, sans passer par les stores ni payer leurs frais, et peut fonctionner sans connexion.",
          "Docteur Plante en est un exemple : une application qui identifie une plante à partir d’une photo, en quatre langues, installable depuis le navigateur et qui fonctionne sans réseau.",
        ],
        cite: [S.plante],
      },
      {
        q: "Quelles sont les étapes ?",
        body: [
          "Définir le problème et le premier usage — ce que l’utilisateur doit pouvoir faire dès l’ouverture. Dessiner les écrans, puis construire une première version limitée, la tester avec de vrais utilisateurs, et seulement ensuite ajouter des fonctions.",
        ],
        cite: [S.plante],
      },
    ],
    table: {
      caption: "Application des stores ou application web installable",
      head: ["Critère", "Application des stores", "Application web installable"],
      rows: [
        ["Frais d’inscription", "25 USD (Google Play), 99 USD/an (Apple)", "Aucun"],
        ["Commission sur les ventes", "15 % à 30 % (Google Play)", "Aucune"],
        ["Installation", "Depuis le store", "Depuis le navigateur"],
        ["Présence dans les stores", "Oui", "Non"],
      ],
      cite: [S.playFee, S.apple, S.playService],
    },
    quote: {
      text: "Commencez par la seule chose que l’utilisateur doit pouvoir faire en ouvrant l’application, et rien d’autre devant.",
      who: "Équipe AUREN",
      note: TEAM,
    },
    faq: [
      { q: "Combien coûte le développement d’une application ?", a: "Il dépend du nombre d’écrans, des comptes utilisateurs, des paiements et des systèmes à relier. Demandez un devis qui détaille une première version limitée avant d’engager la suite." },
      { q: "Faut-il deux applications, une Android et une iPhone ?", a: "Pas forcément. Une application web installable fonctionne sur les deux, et certaines technologies permettent une seule base de code pour les deux stores." },
      { q: "Peut-on proposer l’application en darija ?", a: "Oui. Docteur Plante fonctionne en français, en darija, en arabe et en espagnol depuis le premier jour." },
    ],
    service: "apps-digital-products",
  },
  {
    slug: "automatisation-ia-pme-maroc",
    title: "Automatisation IA pour les PME au Maroc",
    metaTitle: "Automatisation IA pour les PME au Maroc : par où commencer",
    description:
      "Ce que l’intelligence artificielle et l’automatisation peuvent faire pour une PME marocaine : traiter les demandes, relancer, suivre les clients — et les limites à poser.",
    answer:
      "Pour une PME au Maroc, l’automatisation la plus utile n’est pas spectaculaire : chaque demande arrive au bon endroit, personne n’est oublié, les relances partent à temps, et vous savez d’où vient chaque client. L’intelligence artificielle aide à trier et à répondre, avec des limites claires sur ce qu’elle fait et ce qu’elle coûte.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Les entreprises utilisent-elles vraiment l’IA ?",
        body: [
          "Selon l’enquête 2025 de McKinsey, 88 % des répondants disent que leur organisation utilise l’IA dans au moins une fonction, contre 78 % un an plus tôt. Mais la plupart en sont encore au début : peu l’ont déployée à grande échelle.",
          "Pour une PME, c’est une bonne nouvelle : il n’est pas trop tard, et on peut commencer petit.",
        ],
        cite: [S.mckinsey],
      },
      {
        q: "Par où commencer ?",
        body: [
          "Par ce qui se perd aujourd’hui : les messages WhatsApp sans réponse, les demandes de devis oubliées, les clients qu’on ne relance pas. Les relier à un seul endroit, avec une personne responsable pour chacune, apporte souvent plus qu’un outil d’IA.",
          "Ensuite seulement, l’IA peut trier les demandes, préparer une réponse ou résumer un échange.",
        ],
        cite: [S.tagpet],
      },
      {
        q: "Quelles limites poser ?",
        body: [
          "Un plafond de coût. Pour Docteur Plante, l’assistant est facultatif et a une limite quotidienne stricte, pour que le coût ne puisse jamais s’emballer.",
          "Et une règle sur les données : rien de sensible stocké dans le téléphone de l’utilisateur, et un humain qui reste responsable des réponses importantes.",
        ],
        cite: [S.plante],
      },
    ],
    table: {
      caption: "Exemples d’automatisations utiles pour une PME",
      head: ["Problème", "Automatisation", "Ce que l’IA ajoute"],
      rows: [
        ["Demandes oubliées", "Toutes les demandes au même endroit, avec un responsable", "Tri par type et par urgence"],
        ["Pas de relance", "Rappel automatique après un délai", "Proposition de message de relance"],
        ["Origine des clients inconnue", "Chaque demande reliée à sa campagne", "—"],
        ["Questions répétées", "Réponses prêtes pour l’équipe", "Brouillon de réponse à valider"],
      ],
    },
    quote: {
      text: "La meilleure automatisation est celle qu’on ne remarque pas : la demande arrive, quelqu’un répond, rien ne se perd.",
      who: "Équipe AUREN",
      note: TEAM,
    },
    faq: [
      { q: "Faut-il un CRM ?", a: "Il faut au moins un endroit unique où chaque demande est enregistrée, avec qui s’en occupe et où elle en est. Cela peut commencer très simplement." },
      { q: "L’IA peut-elle répondre seule aux clients ?", a: "Pour des questions simples, elle peut préparer une réponse. Pour tout ce qui engage l’entreprise — un prix, un délai, une réclamation — un humain doit valider." },
      { q: "Combien coûte l’IA au quotidien ?", a: "Cela dépend de l’usage. Fixez un plafond dès le départ, comme pour Docteur Plante, pour que le coût reste prévisible." },
    ],
    service: "ai-automation-crm",
  },
  {
    slug: "optimisation-taux-de-conversion",
    title: "Optimisation du taux de conversion : le guide",
    metaTitle: "Optimisation du taux de conversion (CRO) : le guide",
    description:
      "Ce qu’est le taux de conversion, pourquoi les visiteurs repartent sans agir, et les changements simples qui transforment plus de visites en demandes et en ventes.",
    answer:
      "Le taux de conversion est la part des visiteurs qui font ce que vous attendez d’eux : appeler, écrire, réserver ou acheter. Pour l’améliorer, on retire ce qui freine — une page lente, un message flou, une commande trop longue — avant d’ajouter quoi que ce soit.",
    published: "2026-10-22",
    updated: "2026-10-22",
    sections: [
      {
        q: "Pourquoi les visiteurs repartent-ils sans agir ?",
        body: [
          "Parce qu’ils lisent peu. Jakob Nielsen a mesuré que, sur une page web moyenne, les utilisateurs ont le temps de lire au plus 28 % des mots, et plus probablement 20 %.",
          "Votre message principal doit donc tenir dans les premières lignes, et l’action à faire doit se voir sans chercher.",
        ],
        cite: [S.nngroup],
      },
      {
        q: "La vitesse change-t-elle vraiment les choses ?",
        body: [
          "Oui. Google considère une page comme bonne quand son plus grand élément s’affiche en 2,5 secondes au plus, qu’elle réagit en 200 millisecondes au plus et que la mise en page bouge très peu.",
          "Une page lente perd des visiteurs avant même qu’ils aient lu la première phrase.",
        ],
        cite: [S.webVitals],
      },
      {
        q: "Qu’est-ce qui fait abandonner un achat ?",
        body: [
          "Pour les boutiques en ligne, le Baymard Institute calcule un taux moyen d’abandon de panier de 70,22 %. Les raisons les plus citées : des frais supplémentaires trop élevés (40 %), un manque de confiance pour la carte (19 %), la création de compte obligatoire (18 %), une commande trop longue (17 %).",
        ],
        cite: [S.baymard],
      },
      {
        q: "Par quoi commencer ?",
        body: [
          "Une phrase d’accroche qui dit ce que vous faites et pour qui. Un seul bouton principal par page. Des preuves près du bouton : réalisations, photos réelles, avis s’ils existent. Un formulaire court, ou WhatsApp quand c’est là que vos clients répondent — comme pour PromoStore Alu, où la demande de devis part directement sur WhatsApp.",
        ],
        cite: [S.promostore],
      },
    ],
    table: {
      caption: "Les freins les plus courants et leur correction",
      head: ["Frein", "Correction"],
      rows: [
        ["Page lente sur téléphone", "Viser 2,5 s au plus pour le plus grand élément"],
        ["Message flou", "Dire en une phrase ce que vous faites et pour qui"],
        ["Plusieurs boutons qui se concurrencent", "Un seul bouton principal par page"],
        ["Frais découverts trop tard", "Afficher prix total et livraison tôt"],
        ["Formulaire trop long", "Garder l’essentiel, ou proposer WhatsApp"],
      ],
      cite: [S.webVitals, S.baymard],
    },
    quote: {
      text: "Sur une page web moyenne, les utilisateurs ont le temps de lire au plus 28 % des mots ; 20 % est plus probable.",
      who: "Jakob Nielsen, Nielsen Norman Group",
      note: "traduit de l’anglais",
      cite: S.nngroup,
    },
    faq: [
      { q: "Qu’est-ce qu’un bon taux de conversion ?", a: "Il n’existe pas de chiffre universel : il dépend du secteur, du prix et de l’origine des visiteurs. Le bon repère est votre propre taux, mois après mois, et ce qui le fait bouger." },
      { q: "Faut-il refaire tout le site ?", a: "Rarement. On commence par la page qui reçoit le plus de visites ou la plus coûteuse en publicité, on corrige ce qui freine, et on mesure." },
      { q: "Comment savoir ce qui freine ?", a: "En mesurant où les visiteurs s’arrêtent, et en regardant des enregistrements de visites anonymes. Les chiffres disent où ; les observations disent pourquoi." },
    ],
    service: "web-design-development",
  },
];

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g])) as Record<string, Guide>;

/** Guides that lead into a given capability page, newest first. */
export const guidesForService = (slug: string) => guides.filter((g) => g.service === slug);
/** Guides that lead into a given French search page. */
export const guidesForLanding = (slug: string) => guides.filter((g) => g.landing === slug);
