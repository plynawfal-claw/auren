import { c } from "@/i18n/copy";
import { cafeMedia } from "../media";
import type { CafeConcept } from "./types";

/**
 * 05 — Coffee shop.
 *
 * The quietest of the five, and the smallest: one cup, one signature, the
 * things baked this morning, the hours, and the two doors. A café has almost
 * nothing to sell online, which is precisely why the site has to be
 * effortless — the whole page fits on one screen at a phone's width, and
 * everything a regular needs (when are you open, where are you) is above the
 * fold.
 */
export const cafe: CafeConcept = {
  id: "cafe",
  name: "Lahmar",
  category: c(
    "Coffee shop — signature, opening hours, addresses",
    "Café — signature, horaires, adresses",
    "القهوة — المميز، أوقات الخدمة، العناوين",
  ),
  promise: c(
    "A one-screen website: what the coffee is, what is baked today, and at what hour the door opens.",
    "Un site d'une seule page : le café, ce qui est cuit aujourd'hui, et l'heure où la porte s'ouvre.",
    "موقع ديال شاشة وحدة: شنو القهوة، شنو مخبز اليوم، و فين كتفتح الباب.",
  ),
  badge: c("Concept · demo", "Concept · démo", "كونسيب · ديمو"),
  palette: {
    bg: "#160f0b",
    panel: "#1f1611",
    ink: "#f7ede1",
    soft: "#c0a48d",
    line: "rgba(247,237,225,0.15)",
    accent: "#d3a05c",
    accentInk: "#180f08",
  },
  statement: c(
    "Nothing is for sale online. So the only job of the page is to tell you the coffee, the hour, and the door.",
    "Rien ne se vend en ligne. Le seul travail de la page : le café, l'heure, et la porte.",
    "حتى حاجة ما كتتباعش عبر النت. الخدمة ديال الصفحة وحدها: القهوة، الساعة، والباب.",
  ),
  hero: cafeMedia.cup,
  can: [
    c("See the signature before the visit", "Voir le café signature avant la visite", "تشوف المميز قبل ما تجي"),
    c("Know what came out of the oven this morning", "Savoir ce qui est sorti du four ce matin", "تعرف شنو خرج من الفرن اليوم الصبح"),
    c("Read today's hours", "Lire les horaires du jour", "تشوف أوقات الخدمة اليوم"),
    c("Find either door", "Trouver l'une des deux adresses", "لقى وحدة من البوابين"),
  ],
  signature: {
    image: cafeMedia.brew,
    name: c("Slow coffee, ground the day before", "Café lent, moulu la veille", "قهوة بطيئة، مطحونة فاللي فات"),
    note: c(
      "Ground the evening before, brewed without pressure, poured small and often. Nothing about it is fast.",
      "Moulu la veille, infusé sans pression, servi petit et souvent. Rien n'est rapide.",
      "كنطحن من بالليل، وكنسّخّو بلا ضغط، وكيتقدم صغير وكثير. كاين حتى حاجة سريعة فيه.",
    ),
    rows: [
      { label: c("Origin", "Origine", "الأصل"), value: c("Single farm, Rhamna", "Ferme unique, Rhamna", "فرع واحد، الرحامنة") },
      { label: c("Roast", "Torréfaction", "التحميص"), value: c("Medium, roasted in-house", "Moyen, torréfié sur place", "وسط، كيتحمص فالدار") },
      { label: c("Served", "Servi", "كيفاش كيتقدم"), value: c("Small cup, refilled for free", "Petit verre, remplissage gratuit", "كاس صغير، كيتعمر مجانا") },
    ],
  },
  pastries: [
    {
      image: cafeMedia["pastry-berry"],
      name: c("Almond and raspberry", "Amande et framboise", "لوز و توت"),
      note: c("Baked at six", "Cuit à six heures", "كيخبز فالساعة ستة"),
      price: "22",
    },
    {
      image: cafeMedia["pastry-choc"],
      name: c("Dark chocolate twist", "Noeud chocolat noir", "غرابولا ديال الشوكولا"),
      note: c("Out at eight", "Sorti à huit heures", "كيخرج فالثمن"),
      price: "18",
    },
    {
      image: cafeMedia["pastry-green"],
      name: c("Mint and orange", "Menthe et orange", "نعناس و برتقال"),
      note: c("For the first coffee", "Pour le premier café", "للقهوة اللولا"),
      price: "20",
    },
  ],
  hours: [
    { day: c("Monday to Thursday", "Lundi au jeudi", "من الاثنين الخميس"), open: "07:30 – 19:00" },
    { day: c("Friday", "Vendredi", "الجمعة"), open: "07:30 – 21:00" },
    { day: c("Saturday", "Samedi", "السبت"), open: "08:00 – 21:00" },
    { day: c("Sunday", "Dimanche", "الأحد"), open: "08:00 – 16:00" },
  ],
  places: [
    { name: c("Rue Tarik Ibn Ziad", "Rue Tarik Ibn Ziad", "شارع طارق بن زياد"), address: c("Gueliz, Casablanca", "Gueliz, Casablanca", "گليز، كازا") },
    { name: c("Rue des Okkas", "Rue des Okkas", "شارع العكاس"), address: c("Agadir centre", "Centre d'Agadir", "وسط أكادير") },
  ],
  panels: [
    {
      id: "signature",
      index: "01",
      label: c("The coffee", "Le café", "القهوة"),
      note: c("One signature, explained, not a range of eleven", "Une signature, expliquée, pas une gamme de onze", "واحد مميز، مشروح، ماشي واحد وعشرين"),
    },
    {
      id: "bakery",
      index: "02",
      label: c("This morning", "Ce matin", "اليوم الصبح"),
      note: c("What came out of the oven today", "Ce qui est sorti du four aujourd'hui", "شنو خرج من الفرن اليوم"),
    },
    {
      id: "hours",
      index: "03",
      label: c("Hours", "Horaires", "الساعات"),
      note: c("Every day, written out, no guessing", "Chaque jour, écrit, sans deviner", "كل نهار مكتوب، بلا تخمين"),
    },
    {
      id: "places",
      index: "04",
      label: c("The two doors", "Les deux portes", "البوابين"),
      note: c("Casablanca and Agadir, with the street", "Casablanca et Agadir, avec la rue", "كازا و أكادير، بالشارع"),
    },
  ],
};
