/**
 * French and Darija for the capability pages.
 *
 * `services.ts` stays the English source and the shape every consumer reads;
 * this file carries the two other languages beside it, one object per page.
 * `ServiceText` is derived from `Service`, so the compiler names any field a
 * translation is missing, and `localizeService` refuses to mix languages on a
 * page by falling back per page, never per string.
 *
 * French is written for Moroccan business owners (vous, plain register).
 * Darija is written in Arabic script in the voice the homepage already uses —
 * everyday Moroccan phrasing, not Modern Standard Arabic.
 * NEEDS NATIVE REVIEW before the Darija pages are relied on commercially.
 *
 * The plain-language rule holds in every language: the English deliverables
 * still carry a few internal terms ("Production front end", "Conversions
 * API"); the translations say what the client actually receives instead.
 */
import type { Locale } from "@/i18n/config";
import type { Practice, PracticeId } from "./practices";
import type { Service } from "./services";

export type ServiceText = Pick<
  Service,
  "title" | "metaTitle" | "definition" | "takeaways" | "sections" | "deliverables" | "faq"
>;

type Translations = Record<Exclude<Locale, "en">, Record<string, ServiceText>>;

export const serviceTranslations: Translations = {
  fr: {
    "web-design-development": {
      title: "Création de sites web",
      metaTitle: "Création de sites web et développement",
      definition:
        "La création d’un site web réunit le message, le design et le site lui-même, pour que vos visiteurs comprennent votre activité et passent à l’étape suivante.",
      takeaways: [
        "Les textes, le design et le développement avancent ensemble : le site final forme un tout.",
        "Les pages doivent se charger vite, se lire facilement sur téléphone et rester accessibles au plus grand nombre.",
        "Un bon site rend l’étape suivante évidente : une demande, une réservation ou un achat.",
      ],
      sections: [
        {
          heading: "Un site avec un objectif clair",
          body: [
            "Nous partons de ce que vos visiteurs doivent savoir : ce que vous proposez, pourquoi c’est utile et ce qu’ils doivent faire ensuite. Ces réponses structurent les pages avant les détails visuels.",
            "L’identité visuelle est ensuite fixée par écrit — typographie, couleurs, images et mouvement — pour que chaque page appartienne à la même entreprise. Nous construisons pour de vrais téléphones et de vraies connexions, pas seulement pour un écran d’ordinateur parfait.",
            "Votre équipe peut mettre à jour les contenus importants simplement, et les titres de pages comme les liens sont pensés dès le départ pour que le site soit trouvé et facile à entretenir.",
          ],
        },
        {
          heading: "Comment nous le réalisons",
          body: [
            "Nous commençons par comprendre votre activité et vos clients. Nous fixons ensuite une direction, construisons les pages et vérifions comment les gens les utilisent.",
            "Nous vous montrons des sections terminées au fil du projet : vous jugez le vrai site, pas une image figée qu’il faut imaginer.",
          ],
        },
      ],
      deliverables: [
        "Direction artistique écrite",
        "Charte d’interface et éléments réutilisables",
        "Le site en ligne, rapide sur téléphone",
        "Organisation des pages et des contenus",
        "Titres, descriptions et données pour les moteurs de recherche",
        "Suivi des visites et des demandes",
        "Vérification de la vitesse et de l’accessibilité",
      ],
      faq: [
        {
          q: "Combien de temps faut-il pour créer un site ?",
          a: "Un site vitrine ciblé prend généralement de quatre à huit semaines, du premier échange à la mise en ligne. Une boutique en ligne ou une application avec comptes, paiements et espace d’administration demande plus de temps, et le calendrier est fixé une fois le périmètre écrit plutôt que deviné au départ.",
        },
        {
          q: "Pouvez-vous reprendre un site existant ?",
          a: "Oui. La première étape sur un site existant est un audit : technologies, dépendances, ce qui mérite d’être conservé. Refaire ce qui fonctionne simplement parce que c’est inconnu coûte sans rien rapporter : nous gardons ce qui est bon et ne remplaçons que ce qui freine le site.",
        },
        {
          q: "Qui rédige les textes ?",
          a: "Nous, sauf si vous préférez le faire. Les textes sont traités comme une matière de design et rédigés en même temps que la mise en page, car des mots choisis après coup finissent souvent coincés dans un espace qui n’a pas été pensé pour eux.",
        },
      ],
    },
    "apps-digital-products": {
      title: "Applications et produits digitaux",
      metaTitle: "Développement d’applications et de produits digitaux",
      definition:
        "Le développement d’applications transforme une idée utile en un outil que les gens comprennent, sur lequel ils comptent et qu’ils réutilisent.",
      takeaways: [
        "La tâche principale doit rester simple à accomplir, même avec une connexion instable.",
        "Ne demandez de créer un compte que lorsque cela apporte un avantage clair.",
        "Prévoyez la confidentialité, les coûts de fonctionnement et le support avant le lancement.",
      ],
      sections: [
        {
          heading: "Utile dès la première visite",
          body: [
            "Docteur Plante permet d’identifier une plante, de tenir un journal et de consulter un calendrier d’entretien sans se connecter. Ces fonctions continuent de marcher quand le téléphone perd le réseau ; un compte ajoute la sauvegarde entre appareils.",
            "Cet ordre garde le produit centré sur l’aide apportée avant de demander un engagement.",
          ],
        },
        {
          heading: "Conçu pour durer",
          body: [
            "Quand une fonction coûte quelque chose à chaque utilisation, nous fixons des limites et une solution de repli dès le départ. Le produit reste fiable et la facture de fonctionnement reste prévisible.",
          ],
        },
      ],
      deliverables: [
        "Conception du produit et des écrans",
        "Application web installable sur téléphone",
        "Fonctionnement hors connexion et synchronisation",
        "Connexion aux services externes",
        "Comptes facultatifs",
        "Plafonds d’usage et de coûts",
        "Interface en plusieurs langues",
      ],
      faq: [
        {
          q: "Application native ou web ?",
          a: "Le web d’abord, dans presque tous les cas. Une application web s’installe sur l’écran d’accueil, fonctionne hors connexion et se met à jour sans passer par la validation d’un store. Le natif devient le bon choix quand il faut un accès au matériel qu’un navigateur ne permet pas.",
        },
        {
          q: "Pouvez-vous ajouter de l’IA à un produit existant ?",
          a: "Généralement oui, et la première question est de savoir si elle rapporte plus qu’elle ne coûte. Un assistant facultatif, limité et désactivé par défaut est une fonctionnalité ; un assistant sans lequel le produit ne fonctionne plus est une dépendance et une facture permanente.",
        },
      ],
    },
    "creative-branding": {
      title: "Création et identité de marque",
      metaTitle: "Identité de marque et création publicitaire",
      definition:
        "La création et l’identité de marque donnent à une entreprise une image et une voix reconnaissables, puis les portent sur son site, ses photos, ses vidéos et ses campagnes.",
      takeaways: [
        "Une direction visuelle écrite garde chaque création reconnaissable comme la vôtre.",
        "L’identité la plus forte naît de ce qui distingue réellement l’entreprise.",
        "Une publicité et la page qu’elle ouvre doivent sembler venir de la même entreprise.",
      ],
      sections: [
        {
          heading: "Une seule direction sur tous les canaux",
          body: [
            "Pour TagPet, nous avons fixé les matières, la lumière, la photographie et les règles d’écriture avant de produire la campagne. Chaque image et chaque publicité partaient ainsi de la même direction.",
            "Nous avons aussi contrôlé le travail au regard de ces règles. Les images avec un texte erroné ou un numéro de téléphone visible ont été écartées avant toute diffusion.",
          ],
        },
        {
          heading: "Une image qui appartient à l’entreprise",
          body: [
            "Les signes de PromoStore Alu reprennent les formes des profilés et des assemblages en aluminium utilisés dans l’atelier. L’identité est ainsi liée au métier plutôt qu’à une mode passagère.",
          ],
        },
      ],
      deliverables: [
        "Logo et ses déclinaisons",
        "Guide de style visuel",
        "Direction artistique photo et vidéo",
        "Créations de campagne",
        "Vidéos verticales pour les réseaux sociaux",
        "Affiches et visuels fixes",
        "Registre des créations produites",
      ],
      faq: [
        {
          q: "Utilisez-vous l’IA pour créer des visuels ?",
          a: "Quand c’est le bon outil, et toujours dans le cadre d’un guide de style écrit, avec une personne qui valide chaque image. Tout est consigné : modèle, consigne, coût annoncé face au coût réel et raison de chaque refus. Rien ne sort avec un filigrane visible, un logo déformé ou des données personnelles réelles à l’image.",
        },
        {
          q: "Pouvez-vous partir d’une marque existante ?",
          a: "Oui. Si la marque a des codes qui méritent d’être gardés, nous les prolongeons avec méthode plutôt que de créer à côté un second système concurrent.",
        },
      ],
    },
    seo: {
      title: "Référencement naturel et recherche IA",
      metaTitle: "Référencement SEO et visibilité dans les réponses IA",
      definition:
        "Le référencement aide les bonnes personnes à trouver une entreprise dans les résultats de recherche et dans les réponses qu’elles lisent en ligne.",
      takeaways: [
        "Une page doit répondre clairement à une vraie question de client, avec les mots que les gens utilisent.",
        "Les moteurs de recherche ont besoin de pages lisibles, avec des titres clairs et des liens entre les sujets proches.",
        "Des informations réelles sur l’entreprise et des profils publics cohérents aident à reconnaître qui est derrière un site.",
      ],
      sections: [
        {
          heading: "Dire clairement ce que vous proposez",
          body: [
            "Les gens découvrent désormais les entreprises à la fois dans les résultats de recherche et dans les réponses des assistants IA. Dans les deux cas, les promesses vagues sont inutilisables. Nous écrivons des pages qui disent simplement ce que vous faites, à qui cela s’adresse et ce qu’il faut savoir avant de vous contacter.",
            "Chaque service important a sa propre page utile. Les pages liées renvoient les unes vers les autres, pour qu’un visiteur continue d’apprendre sans relancer une recherche.",
          ],
        },
        {
          heading: "Un site facile à trouver et à comprendre",
          body: [
            "Nous donnons à chaque page un titre et une description utiles, rendons le site simple à parcourir et vérifions que les moteurs de recherche voient la bonne version de chaque page. Les informations sur l’entreprise, les services et les questions fréquentes sont organisées de façon cohérente en coulisses.",
          ],
        },
      ],
      deliverables: [
        "Audit technique du site",
        "Titres, descriptions et versions de référence des pages",
        "Informations structurées sur l’entreprise",
        "Plan du site pour les moteurs de recherche",
        "Contenus faciles à citer par les assistants IA",
        "Plan de liens entre les pages",
        "Plan de contenus par sujet",
      ],
      faq: [
        {
          q: "En combien de temps le SEO donne-t-il des résultats ?",
          a: "Les corrections techniques peuvent faire bouger les choses en quelques semaines. Gagner de l’autorité sur des recherches concurrentielles prend des mois, et quiconque promet une position à une date donnée devine. Ce qui peut être promis, c’est le travail : l’audit, l’architecture, les données structurées et le plan de contenus.",
        },
        {
          q: "Qu’est-ce que le GEO ?",
          a: "C’est le travail qui rend votre entreprise plus facile à comprendre et à citer pour les assistants IA. Des explications claires, des informations réelles sur l’entreprise et des pages faciles à lire y contribuent. Personne ne peut garantir une citation.",
        },
        {
          q: "Créez-vous une page par ville pour le référencement local ?",
          a: "Seulement quand il y a un contenu réellement différent à y mettre. Multiplier des pages presque identiques pour vingt villes est une pratique que les moteurs de recherche pénalisent depuis des années et que les assistants IA ignorent complètement.",
        },
      ],
    },
    "google-ads": {
      title: "Google Ads",
      metaTitle: "Gestion de campagnes Google Ads",
      definition:
        "Google Ads place une entreprise devant les personnes qui cherchent déjà ce qu’elle propose.",
      takeaways: [
        "La page qui s’ouvre après une annonce compte autant que l’annonce elle-même.",
        "Définissez ce qu’est une demande ou une commande utile avant de dépenser le premier budget.",
        "Pour la vente en paiement à la livraison, une commande confirmée en dit plus qu’un formulaire envoyé.",
      ],
      sections: [
        {
          heading: "Offrir une bonne destination à chaque clic",
          body: [
            "Une annonce peut attirer la bonne personne et la perdre sur une page lente ou confuse. Nous regardons la page, l’offre et l’étape suivante avant d’augmenter le budget.",
          ],
        },
        {
          heading: "Compter ce qui s’est vraiment passé",
          body: [
            "Quand les clients paient à la livraison, une demande de commande n’est qu’un début. Nous séparons les demandes des commandes confirmées pour que les rapports reflètent l’activité plus honnêtement.",
          ],
        },
      ],
      deliverables: [
        "Structure du compte et création des campagnes",
        "Recherche des mots-clés et des intentions",
        "Rédaction des annonces",
        "Suivi des conversions",
        "Cohérence entre annonces et pages d’arrivée",
        "Rapports",
      ],
      faq: [
        {
          q: "Quel budget prévoir pour commencer ?",
          a: "De quoi obtenir des signaux exploitables en un mois, au coût par clic de votre marché, qui varie selon le secteur et les recherches. Nous le calculons à partir des chiffres réels avant de proposer un montant, plutôt que d’annoncer un chiffre rond.",
        },
        {
          q: "Prenez-vous un pourcentage du budget publicitaire ?",
          a: "Le prix est fixé pour chaque mission. Un pourcentage du budget pousse à dépenser davantage, ce qui n’est pas toujours le bon conseil.",
        },
      ],
    },
    "meta-ads": {
      title: "Meta Ads",
      metaTitle: "Publicité Meta Ads — Facebook et Instagram",
      definition:
        "Meta Ads amène une entreprise vers les gens sur Facebook et Instagram, avec des images, des vidéos et des messages qui donnent envie de s’arrêter.",
      takeaways: [
        "Montrez plusieurs idées vraiment différentes, puis apprenez à laquelle les gens réagissent.",
        "Gardez les publicités et la page qu’elles ouvrent dans le même univers visuel et verbal.",
        "Regardez tout le parcours, de la première vue jusqu’à la demande ou l’achat.",
      ],
      sections: [
        {
          heading: "Plus d’une raison de s’intéresser",
          body: [
            "Pour TagPet, nous avons réalisé plusieurs vidéos et images à partir d’une même direction visuelle. Chacune testait une accroche ou une raison différente de s’arrêter, tout en ressemblant à la même marque que la boutique.",
            "Nous gardons une trace de ce qui a été testé et de la raison pour laquelle une création a été écartée ou modifiée. La série suivante progresse ainsi pour une raison précise.",
          ],
        },
        {
          heading: "Voir où l’intérêt devient une action",
          body: [
            "Nous regardons au-delà des vues et des clics. Voir où les gens quittent la boutique ou le formulaire nous aide à améliorer l’expérience au lieu de deviner quelle publicité changer.",
          ],
        },
      ],
      deliverables: [
        "Stratégie créative et accroches",
        "Production de vidéos verticales",
        "Visuels fixes et affiches",
        "Structure des campagnes et audiences",
        "Mesure des ventes depuis Facebook et Instagram",
        "Rapports sur tout le parcours",
      ],
      faq: [
        {
          q: "Combien de créations faut-il tester ?",
          a: "Plusieurs angles distincts plutôt que plusieurs versions d’un seul. Changer une légende n’est pas un test ; changer la raison pour laquelle quelqu’un devrait s’intéresser, si.",
        },
        {
          q: "Pouvez-vous produire les vidéos en plus de gérer les publicités ?",
          a: "Oui — c’est l’organisation habituelle, et c’est pourquoi la création et la page d’arrivée restent cohérentes. Toute la bibliothèque publicitaire de TagPet a été produite en interne.",
        },
      ],
    },
    "ai-automation-crm": {
      title: "Suivi client et automatisation",
      metaTitle: "Automatisation IA, CRM et suivi des demandes",
      definition:
        "Le suivi client et l’automatisation aident une entreprise à répondre aux demandes, à suivre les conversations et à gérer les tâches répétitives sans perdre le contact humain.",
      takeaways: [
        "Un visiteur ne doit voir un message de confirmation qu’une fois sa demande arrivée dans une boîte réellement suivie.",
        "Gardez l’origine d’une demande avec la conversation, pour savoir ce qui a amené le client.",
        "Laissez le logiciel gérer le travail répétitif et gardez les décisions importantes pour une personne.",
      ],
      sections: [
        {
          heading: "Que chaque demande compte",
          body: [
            "Nous relions votre formulaire à l’endroit que votre équipe consulte vraiment. Si cette destination est indisponible, le visiteur voit une erreur claire et peut réessayer ; le site ne prétend jamais avoir reçu un message qu’il ne peut pas transmettre.",
            "La demande peut indiquer d’où venait le visiteur, pour vous montrer quelles pages et quelles campagnes apportent des conversations utiles.",
          ],
        },
        {
          heading: "Relancer au bon moment",
          body: [
            "Les nouvelles demandes peuvent arriver chez la bonne personne selon le besoin du client. Des rappels aident l’équipe à répondre à temps, avec un point clair où les messages automatiques s’arrêtent.",
            "Si vos clients préfèrent WhatsApp, nous l’intégrons à la conversation au lieu d’ajouter un simple bouton isolé sur la page.",
          ],
        },
      ],
      deliverables: [
        "Formulaire fiable relié à votre boîte de réception",
        "Fiches clients dans un outil que votre équipe utilise",
        "Suivi de l’origine des demandes",
        "Un responsable clair pour chaque demande",
        "Parcours WhatsApp",
        "Rappels de relance",
        "Rapports simples",
      ],
      faq: [
        {
          q: "Quel CRM choisir ?",
          a: "Celui que votre équipe utilisera vraiment. Nous regardons comment arrivent les demandes et qui doit y répondre avant de recommander un outil.",
        },
        {
          q: "Chaque tâche a-t-elle besoin d’IA ?",
          a: "Non. Une règle simple est souvent plus rapide et plus fiable. L’IA peut aider à trier une demande rédigée librement ; les décisions de prix et les réponses sensibles restent confiées à une personne.",
        },
      ],
    },
  },

  ar: {
    "web-design-development": {
      title: "تصميم وتطوير المواقع",
      metaTitle: "تصميم وتطوير المواقع الإلكترونية",
      definition:
        "تصميم وتطوير الموقع كيجمع الرسالة، التصميم والموقع الخدام، باش الزوّار يفهمو البيزنس ديالك ويديرو الخطوة الجاية.",
      takeaways: [
        "الكلام، التصميم والبرمجة كيتخدمو مع بعض، باش الموقع يطلع خدمة وحدة متناسقة.",
        "الصفحات خاصها تتحل بالزربة، تتقرا مزيان فالتلفون، ويقدر يستعملها أكبر عدد ديال الناس.",
        "الموقع النافع كيبيّن الخطوة الجاية بوضوح: طلب، حجز ولا شرا.",
      ],
      sections: [
        {
          heading: "موقع عندو هدف واضح",
          body: [
            "كنبداو من داكشي اللي خاص الزوّار يعرفوه: شنو كتقدّم، علاش مهم، وشنو خاصهم يديرو من بعد. هاد الأجوبة هي اللي كتشكّل الصفحات قبل التفاصيل ديال الشكل.",
            "من بعد كنكتبو الهوية البصرية — الخط، الألوان، الصور والحركة — باش كل صفحة تبان من نفس البيزنس. كنبنيو للتلفونات الحقيقية والكونيكسيون الحقيقية، ماشي غير لشاشة ديال الكمبيوتر.",
            "الفريق ديالك كيقدر يبدّل المحتوى المهم بسهولة، والعناوين والروابط كنخططو ليهم من اللول باش الموقع يتلقى ويبقى ساهل فالصيانة.",
          ],
        },
        {
          heading: "كيفاش كنصاوبوه",
          body: [
            "اللول كنفهمو البيزنس والكليان ديالو. من بعد كنتافقو على اتجاه، كنبنيو الصفحات وكنشوفو كيفاش الناس كيستعملوها.",
            "كنوريوك أجزاء كاملة وحنا خدامين، باش تحكم على الموقع الحقيقي ماشي على تصويرة خاصك تتخيّلها.",
          ],
        },
      ],
      deliverables: [
        "اتجاه فني مكتوب",
        "دليل الواجهة والعناصر اللي كتعاود تستعمل",
        "الموقع أونلاين، زربان فالتلفون",
        "تنظيم الصفحات والمحتوى",
        "عناوين ووصف ومعلومات لمحركات البحث",
        "تتبّع الزيارات والطلبات",
        "فحص السرعة وسهولة الاستعمال",
      ],
      faq: [
        {
          q: "شحال كياخد الموقع ديال الوقت؟",
          a: "موقع تعريفي مركّز غالباً كياخد من أربعة حتى لتمنيا ديال السيمانات، من أول هضرة حتى لإطلاقه. متجر أونلاين ولا تطبيق فيه حسابات، خلاص ولوحة إدارة كياخد أكثر، والمدة كنحدّدوها ملي كيتكتب شنو غادي يتدار، ماشي بالتخمين من اللول.",
        },
        {
          q: "واش كتخدمو على موقع موجود؟",
          a: "إيه. أول خطوة فموقع موجود هي الفحص: التقنيات المستعملة، شنو كيعتامد عليه، وشنو يستاهل يبقى. نعاودو نبنيو حاجة خدامة غير حيت ما عرفناهاش خسارة بلا فايدة، لهذا كنخليو المزيان وكنبدّلو غير اللي معطّل الموقع.",
        },
        {
          q: "شكون كيكتب النصوص؟",
          a: "حنا، إلا ما بغيتيش تكتبها نتا. النص عندنا جزء من التصميم، وكنكتبوه مع الترتيب ديال الصفحة، حيت الكلام اللي كيتختار من بعد كيتزرّ غالباً فبلاصة ما تصاوباتش ليه.",
        },
      ],
    },
    "apps-digital-products": {
      title: "التطبيقات والمنتجات الرقمية",
      metaTitle: "تطوير التطبيقات والمنتجات الرقمية",
      definition:
        "تطوير التطبيقات كيحوّل فكرة نافعة لأداة الناس كيفهموها، كيعوّلو عليها وكيرجعو ليها.",
      takeaways: [
        "المهمة الأساسية خاصها تبقى ساهلة، حتى إلا كان الكونيكسيون ضعيف.",
        "ما تطلبش من الناس يديرو حساب حتى يكون عندهم فيه فايدة واضحة.",
        "خطّط للخصوصية، لمصاريف التشغيل وللدعم قبل ما يتطلق المنتج.",
      ],
      sections: [
        {
          heading: "نافع من أول زيارة",
          body: [
            "Docteur Plante كيخليك تعرف النبتة، تكتب اليوميات ديالها وتشوف كالاندريي ديال العناية بلا ما تدخل لحساب. هاد الحوايج كيبقاو خدامين حتى ملي التلفون كيطيح ليه الريزو؛ والحساب كيزيد غير الحفظ بين الأجهزة.",
            "هاد الترتيب كيخلي المنتج مركّز على أنه يعاون الشخص قبل ما يطلب منو يلتازم.",
          ],
        },
        {
          heading: "مصاوب باش يبقى خدام",
          body: [
            "إلا كانت شي ميزة كتكلّف فلوس كل مرة كتستعمل، كنحطّو ليها حدود وحل بديل من اللول. هكا المنتج كيبقى موثوق والفاتورة ديال التشغيل كتبقى معروفة.",
          ],
        },
      ],
      deliverables: [
        "تصميم المنتج والشاشات",
        "تطبيق ويب كيتثبّت فالتلفون",
        "خدمة بلا كونيكسيون ومزامنة",
        "الربط مع خدمات خارجية",
        "حسابات اختيارية",
        "حدود للاستعمال والمصاريف",
        "واجهة بزاف ديال اللغات",
      ],
      faq: [
        {
          q: "تطبيق native ولا ويب؟",
          a: "الويب هو اللول، تقريباً ديما. تطبيق الويب كيتثبّت فالشاشة الرئيسية، كيخدم بلا كونيكسيون، وكيتحدّث بلا ما يتسنّى الموافقة ديال الستور. الـ native كيولّي هو الاختيار الصحيح ملي كتحتاج حاجة فالجهاز ما يوصلش ليها المتصفح.",
        },
        {
          q: "واش تقدرو تزيدو الذكاء الاصطناعي لمنتج موجود؟",
          a: "غالباً إيه، وأول سؤال هو واش غادي يرجّع أكثر من داكشي اللي كيكلّف. مساعد اختياري، محدود ومطفي من الأصل هو ميزة؛ أما إلا ولّى المنتج ما يخدمش بلاه، راه ولّى اعتماد وفاتورة ديما.",
        },
      ],
    },
    "creative-branding": {
      title: "الإبداع والهوية ديال الماركة",
      metaTitle: "الهوية البصرية والإبداع الإعلاني",
      definition:
        "الإبداع والهوية كيعطيو للبيزنس شكل وصوت كيتعرفو، ومن بعد كيدّيوهم للموقع، للتصاور، للفيديوهات وللحملات.",
      takeaways: [
        "اتجاه بصري مكتوب كيخلي كل خدمة تبان ديالك.",
        "أقوى هوية كتخرج من داكشي اللي كيميّز البيزنس بصح.",
        "الإعلان والصفحة اللي كيحلّ خاصهم يبانو من نفس الشركة.",
      ],
      sections: [
        {
          heading: "اتجاه واحد فكل القنوات",
          body: [
            "لـ TagPet، حدّدنا المواد، الضو، التصوير وقواعد الكتابة قبل ما نصاوبو الحملة. هكا كل تصويرة وكل إعلان خرجو من نفس الاتجاه.",
            "وراجعنا الخدمة على حساب هاد القواعد. التصاور اللي فيهم كتابة غالطة ولا نمرة تيليفون باينة تحيّدو قبل ما يوصلو للعموم.",
          ],
        },
        {
          heading: "شكل كينتامي للبيزنس",
          body: [
            "العلامات ديال PromoStore Alu واخدة الأشكال ديالها من البروفيلات والتركيبات ديال الألومنيوم اللي كتستعمل فالأتوليي. هكا الهوية مربوطة بالحرفة ماشي بموضة غادي تدوز.",
          ],
        },
      ],
      deliverables: [
        "اللوغو والنسخ ديالو",
        "دليل الستيل البصري",
        "اتجاه فني للتصوير والفيديو",
        "إبداعات الحملات",
        "فيديوهات عمودية للسوشيال ميديا",
        "أفيشات وتصاور ثابتة",
        "سجل ديال الإبداعات المنتجة",
      ],
      faq: [
        {
          q: "واش كتستعملو الذكاء الاصطناعي فالتصاور؟",
          a: "ملي كيكون هو الأداة المناسبة، وديما تحت دليل ستيل مكتوب وشخص كيوافق على كل تصويرة. كلشي كيتسجّل: الموديل، الطلب، التكلفة المتوقعة مقابل الحقيقية، وسبب كل رفض. حتى حاجة ما كتخرج إلا كان فيها ووترمارك باين، لوغو مخربق ولا معلومات شخصية حقيقية.",
        },
        {
          q: "واش تقدرو تخدمو من ماركة موجودة؟",
          a: "إيه. إلا كانت الماركة عندها قواعد تستاهل تبقى، كنكمّلوها بطريقة منظمة بلاصة ما نصاوبو نظام ثاني كينافسها.",
        },
      ],
    },
    seo: {
      title: "السيو والبحث بالذكاء الاصطناعي",
      metaTitle: "السيو والظهور فأجوبة الذكاء الاصطناعي",
      definition:
        "السيو كيعاون الناس المناسبين يلقاو البيزنس ديالك فنتائج البحث وفالأجوبة اللي كيقراو أونلاين.",
      takeaways: [
        "الصفحة خاصها تجاوب بوضوح على سؤال حقيقي ديال الكليان، بالكلمات اللي كيستعملو الناس.",
        "محركات البحث محتاجة صفحات كتتقرا، بعناوين واضحة وروابط بين المواضيع القريبة.",
        "المعلومات الحقيقية على البيزنس والبروفيلات العمومية المتناسقة كيعاونو الناس يعرفو شكون ورا الموقع.",
      ],
      sections: [
        {
          heading: "قول بوضوح شنو كتقدّم",
          body: [
            "دابا الناس كيكتاشفو البيزنسات فنتائج البحث وفالأجوبة ديال الذكاء الاصطناعي. وفجوج، الكلام الغامض ما كينفعش. كنكتبو صفحات كتقول ببساطة شنو كتدير، لمن، وشنو خاص الواحد يعرف قبل ما يتواصل معاك.",
            "كل خدمة مهمة عندها الصفحة ديالها. والصفحات المرتبطة كيوصلو لبعضهم، باش الزائر يكمّل يتعلم بلا ما يعاود يقلّب.",
          ],
        },
        {
          heading: "موقع ساهل يتلقى ويتفهم",
          body: [
            "كنعطيو لكل صفحة عنوان ووصف نافعين، كنخليو الموقع ساهل فالتنقل، وكنتأكدو أن محركات البحث كتشوف النسخة الصحيحة ديال كل صفحة. المعلومات على البيزنس، الخدمات والأسئلة المتكررة كتنظّم بطريقة متناسقة من اللور.",
          ],
        },
      ],
      deliverables: [
        "فحص تقني للموقع",
        "عناوين، أوصاف والنسخة المرجعية ديال كل صفحة",
        "معلومات منظمة على البيزنس",
        "خريطة الموقع لمحركات البحث",
        "محتوى ساهل يتقتبس من طرف الذكاء الاصطناعي",
        "خطة الروابط بين الصفحات",
        "خطة المحتوى حسب المواضيع",
      ],
      faq: [
        {
          q: "شحال كياخد السيو باش تبان النتائج؟",
          a: "الإصلاحات التقنية تقدر تحرّك الأمور فشي سيمانات. أما بناء الثقة على كلمات فيها منافسة كياخد شهور، وأي واحد كيوعدك ببلاصة فتاريخ محدد راه كيخمّن. اللي يقدر يتوعد بيه هو الخدمة: الفحص، التنظيم، المعلومات المنظمة وخطة المحتوى.",
        },
        {
          q: "شنو هو GEO؟",
          a: "هو الخدمة اللي كتخلي البيزنس ديالك ساهل يتفهم ويتذكر من طرف أدوات الذكاء الاصطناعي. الشرح الواضح، المعلومات الحقيقية والصفحات اللي كتتقرا بسهولة كيعاونو. حتى واحد ما يقدر يضمن أنه يتذكر.",
        },
        {
          q: "واش كتصاوبو صفحة لكل مدينة فالسيو المحلي؟",
          a: "غير إلا كان محتوى مختلف بصح يتحط فيها. تصاوب صفحات شبه متطابقة لعشرين مدينة حاجة كتعاقب عليها محركات البحث من سنين، وأدوات الذكاء الاصطناعي ما كتعطيهاش حتى قيمة.",
        },
      ],
    },
    "google-ads": {
      title: "Google Ads",
      metaTitle: "تسيير حملات Google Ads",
      definition:
        "Google Ads كيحط البيزنس ديالك قدام الناس اللي ديجا كيقلبو على داكشي اللي كتقدّم.",
      takeaways: [
        "الصفحة اللي كتحل من بعد الإعلان مهمة بحال الإعلان براسو.",
        "حدّد شنو هو الطلب ولا الكوموند النافعة قبل ما تصرف أول ميزانية.",
        "فالبيع بالخلاص عند التوصيل، الكوموند المأكدة كتقول أكثر من فورمولير تصيفط.",
      ],
      sections: [
        {
          heading: "عطي لكل كليك بلاصة مزيانة يوصل ليها",
          body: [
            "الإعلان يقدر يجيب الشخص المناسب ويضيّعو فصفحة بطيئة ولا مخربقة. كنشوفو الصفحة، العرض والخطوة الجاية قبل ما نزيدو فالميزانية.",
          ],
        },
        {
          heading: "حسب داكشي اللي وقع بصح",
          body: [
            "ملي الكليان كيخلصو عند التوصيل، طلب الكوموند غير البداية. كنفرّقو بين الطلبات والكوموندات المأكدة باش التقارير تعكس البيزنس بصراحة أكثر.",
          ],
        },
      ],
      deliverables: [
        "تنظيم الحساب وإنشاء الحملات",
        "البحث على الكلمات ونية البحث",
        "كتابة الإعلانات",
        "تتبّع النتائج",
        "توافق الإعلانات مع الصفحات",
        "تقارير",
      ],
      faq: [
        {
          q: "شحال ديال الميزانية معقولة للبداية؟",
          a: "قد ما يكفي باش تجمع إشارات فشهر، على حساب ثمن الكليك فالسوق ديالك، اللي كيتبدّل حسب القطاع والكلمات. كنحسبوه من الأرقام الحقيقية قبل ما نقترحو مبلغ، ماشي كنعطيو رقم مدوّر.",
        },
        {
          q: "واش كتاخدو نسبة من ميزانية الإعلانات؟",
          a: "الثمن كيتفاهم عليه فكل خدمة. النسبة من الميزانية كتدفع لصرف أكثر، وهادشي ماشي ديما هو النصيحة الصحيحة.",
        },
      ],
    },
    "meta-ads": {
      title: "Meta Ads",
      metaTitle: "إعلانات Meta Ads — فيسبوك وإنستغرام",
      definition:
        "Meta Ads كيوصّل البيزنس ديالك للناس ففيسبوك وإنستغرام، بتصاور، فيديوهات ورسائل كتخلي الواحد يوقف يشوف.",
      takeaways: [
        "ورّي بزاف ديال الأفكار المختلفة بصح، ومن بعد تعلّم شنو اللي عجب الناس.",
        "خلّي الإعلانات والصفحة اللي كيحلّو فنفس العالم ديال الشكل والكلام.",
        "شوف الطريق كامل، من أول مشاهدة حتى للطلب ولا الشرا.",
      ],
      sections: [
        {
          heading: "أكثر من سبب واحد باش تهتم",
          body: [
            "لـ TagPet، صاوبنا بزاف ديال الفيديوهات والتصاور من نفس الاتجاه البصري. كل وحدة جرّبات بداية ولا سبب مختلف باش الواحد يوقف، وفنفس الوقت كتبان من نفس الماركة ديال المتجر.",
            "كنسجّلو شنو تجرّب وعلاش شي خدمة تحيّدات ولا تبدّلات. هكا الدفعة الجاية كتحسّن على أساس واضح.",
          ],
        },
        {
          heading: "شوف فين الاهتمام كيولّي فعل",
          body: [
            "كنشوفو أبعد من المشاهدات والكليكات. نعرفو فين الناس كيخرجو من المتجر ولا الفورمولير كيعاونا نحسّنو التجربة بلاصة ما نخمّنو شمن إعلان نبدّلو.",
          ],
        },
      ],
      deliverables: [
        "استراتيجية إبداعية وبدايات قوية",
        "إنتاج فيديوهات عمودية",
        "تصاور ثابتة وأفيشات",
        "تنظيم الحملات والجمهور",
        "قياس المبيعات اللي جاية من فيسبوك وإنستغرام",
        "تقارير على الطريق كامل",
      ],
      faq: [
        {
          q: "شحال ديال الإبداعات خاص نجرّبو؟",
          a: "بزاف ديال الزوايا المختلفة، ماشي بزاف ديال النسخ من وحدة. تبدّل الكابشن ماشي تجربة؛ تبدّل السبب اللي يخلي الواحد يهتم، هادي هي التجربة.",
        },
        {
          q: "واش تقدرو تصوّرو الفيديوهات وتسيّرو الإعلانات؟",
          a: "إيه — وهادي هي الطريقة العادية، وهادشي علاش الإبداع والصفحة كيبقاو متناسقين. المكتبة كاملة ديال الإعلانات ديال TagPet تصاوبات عندنا.",
        },
      ],
    },
    "ai-automation-crm": {
      title: "المتابعة ديال الكليان والأتمتة",
      metaTitle: "الأتمتة بالذكاء الاصطناعي، CRM وتوجيه الطلبات",
      definition:
        "المتابعة والأتمتة كيعاونو البيزنس يجاوب على الطلبات، يتبّع المحادثات ويدير الخدمات اللي كتعاود بلا ما يضيّع اللمسة الإنسانية.",
      takeaways: [
        "الزائر ما خاصوش يشوف رسالة النجاح حتى يوصل الطلب ديالو لبواط ديال الرسائل خدامة بصح.",
        "خلّي المصدر ديال الطلب مع المحادثة، باش تعرف شنو اللي جاب الكليان.",
        "خلّي البرنامج يدير الخدمة اللي كتعاود، والقرارات المهمة تبقى عند شخص.",
      ],
      sections: [
        {
          heading: "خلّي كل طلب يتحسب",
          body: [
            "كنربطو الفورمولير ديالك بالبلاصة اللي الفريق ديالك كيشوفها بصح. إلا كانت ما خدامةش، الزائر كيشوف خطأ واضح ويقدر يعاود؛ الموقع عمرو ما كيقول بلي توصّل برسالة ما يقدرش يوصّلها.",
            "الطلب يقدر يبيّن منين جا الزائر، باش تشوف شمن صفحات وحملات كتجيب محادثات نافعة.",
          ],
        },
        {
          heading: "تابع فالوقت المناسب",
          body: [
            "الطلبات الجديدة تقدر توصل للشخص المناسب حسب داكشي اللي محتاج الكليان. التذكيرات كتعاون الفريق يجاوب فالوقت، مع نقطة واضحة فين كيحبسو الرسائل الأوتوماتيكية.",
            "إلا كانو الكليان ديالك كيفضّلو واتساب، كنخليوه جزء من المحادثة بلاصة ما نزيدو بوطونة بوحدها فالصفحة.",
          ],
        },
      ],
      deliverables: [
        "فورمولير موثوق مربوط بالبواط ديالك",
        "بطائق الكليان فأداة كيستعملها الفريق ديالك",
        "تتبّع مصدر الطلبات",
        "مسؤول واضح على كل طلب",
        "طريقة خدمة بواتساب",
        "تذكيرات المتابعة",
        "تقارير بسيطة",
      ],
      faq: [
        {
          q: "شمن CRM خاصنا نستعملو؟",
          a: "اللي غادي يستعملو الفريق ديالك بصح. كنشوفو كيفاش كيوصلو الطلبات وشكون خاصو يجاوب قبل ما ننصحو بشي أداة.",
        },
        {
          q: "واش كل خدمة محتاجة الذكاء الاصطناعي؟",
          a: "لا. قاعدة بسيطة غالباً أزرب وأضمن. الذكاء الاصطناعي يقدر يعاون فترتيب طلب مكتوب بحرية؛ أما قرارات الثمن والأجوبة الحساسة كتبقى عند شخص.",
        },
      ],
    },
  },
};

/** The four practice labels and definitions shown on the services index. */
export const practiceTranslations: Record<
  Exclude<Locale, "en">,
  Record<PracticeId, Pick<Practice, "label" | "definition">>
> = {
  fr: {
    experiences: {
      label: "Expériences digitales",
      definition:
        "Sites web, boutiques en ligne, pages d’atterrissage et applications, rapides et conçus pour convertir.",
    },
    creative: {
      label: "Création et marque",
      definition:
        "L’identité de marque et les campagnes qui la portent — logo, direction artistique, vidéo et créations publicitaires.",
    },
    growth: {
      label: "Croissance",
      definition:
        "Ce qui amène les clients — visibilité dans la recherche, publicité en ligne, parcours d’achat et la mesure qui montre ce qui a marché.",
    },
    systems: {
      label: "Systèmes intelligents",
      definition:
        "Ce qui se passe après l’arrivée d’une demande — CRM, attribution, automatisation et outils internes qui font tourner l’entreprise sans alourdir l’équipe.",
    },
  },
  ar: {
    experiences: {
      label: "التجارب الرقمية",
      definition: "مواقع، متاجر أونلاين، صفحات هبوط وتطبيقات، زربانين ومصاوبين باش يبيعو.",
    },
    creative: {
      label: "الإبداع والماركة",
      definition:
        "الهوية ديال الماركة والحملات اللي كتحملها — اللوغو، الاتجاه الفني، الفيديو والإبداع الإعلاني.",
    },
    growth: {
      label: "النمو",
      definition:
        "داكشي اللي كيجيب الكليان — الظهور فالبحث، الإعلانات، مسار الشرا والقياس اللي كيبيّن شنو اللي نفع.",
    },
    systems: {
      label: "الأنظمة الذكية",
      definition:
        "شنو كيوقع من بعد ما يوصل الطلب — CRM، التوجيه، الأتمتة والأدوات الداخلية اللي كتخلي البيزنس يخدم بلا ما تزيد فالفريق.",
    },
  },
};

/**
 * A service in one language. Falls back to English for the whole page, never
 * per field, so a page can never read as a mix of two languages.
 */
export function localizeService(service: Service, locale: string): Service {
  if (locale !== "fr" && locale !== "ar") return service;
  const text = serviceTranslations[locale][service.slug];
  return text ? { ...service, ...text } : service;
}

export function localizePractice(practice: Practice, locale: string): Practice {
  if (locale !== "fr" && locale !== "ar") return practice;
  return { ...practice, ...practiceTranslations[locale][practice.id] };
}
