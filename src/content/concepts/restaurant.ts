import { c } from "@/i18n/copy";
import { restaurantMedia } from "../media";
import type { RestaurantConcept } from "./types";

/**
 * 01 — Restaurant and hospitality.
 *
 * The layout this one gets is cinematic: a wide plate, a menu that reads like
 * a printed card, and a booking panel that sits on top of the photograph
 * rather than below it. A guest deciding where to eat is deciding on a
 * picture of the food, so the food is the largest thing on the page and the
 * booking is the second thing they can reach.
 */
export const restaurant: RestaurantConcept = {
  id: "restaurant",
  name: "Dar Naha",
  category: c(
    "Restaurant — menu, table booking, location",
    "Restaurant — carte, réservation, adresse",
    "المطعم — المينيو، حجز الطابلة، العنوان",
  ),
  promise: c(
    "A website where a guest sees the dishes, books a table and finds the door — without calling anybody.",
    "Un site où le client voit les plats, réserve une table et trouve la porte — sans appeler personne.",
    "موقع كيشوف فيه الزبون الماكلة، يحجز الطابلة، ويعرف فين الباب — بلا ما يعيط لحتى حد.",
  ),
  badge: c("Concept · demo", "Concept · démo", "كونسيب · ديمو"),
  palette: {
    bg: "#180f08",
    panel: "#21150c",
    ink: "#fbf3e8",
    soft: "#c2a68b",
    line: "rgba(251,243,232,0.16)",
    accent: "#e2913a",
    accentInk: "#1a0f05",
  },
  statement: c(
    "The food is the first thing on the screen, and booking a table is never more than one tap away.",
    "La nourriture est la première chose à l'écran, et réserver une table ne prend jamais plus d'un geste.",
    "الماكلة هي أول حاجة كتشوفها فالصفحة، وحجز الطابلة ما كياخد غير خطوة وحدة.",
  ),
  hero: restaurantMedia.hero,
  can: [
    c("See the dishes and what they cost", "Voir les plats et leur prix", "تشوف الماكلة وثمنها"),
    c("Book a table in two steps", "Réserver une table en deux étapes", "تحجز الطابلة بخطوتين"),
    c("Find the address, hours and parking", "Trouver l'adresse, les horaires et le parking", "تلقى العنوان وأوقات الخدمة والباركينغ"),
    c("Order ahead on the phone", "Commander à l'avance par téléphone", "تطلب مسبقاً على التيليفون"),
  ],
  menu: {
    image: restaurantMedia.platter,
    heading: c("The menu, on the page", "La carte, sur la page", "المينيو، فالصفحة"),
    items: [
      {
        name: c("Charred chicken, lemon and herbs", "Poulet grillé, citron et herbes", "دجاج مشوي، ليمون وأعشاب"),
        note: c("Warm bread and house pickles", "Pain chaud et pickles maison", "خبز ساخن ومخلل الدار"),
        price: "139",
        tag: c("Most ordered", "Le plus commandé", "كيتطلب بزاف"),
      },
      {
        name: c("Pizza margherita, wood oven", "Pizza margherita, four à bois", "بيتزا مارغريتا، فرن الحطب"),
        note: c("Tomato, mozzarella, basil, olive oil", "Tomate, mozzarella, basilic, huile d'olive", "طماطم، موزاريلا، ريحان، زيت زيتون"),
        price: "119",
      },
      {
        name: c("Creamy pasta with prawns", "Pâtes crémeuses aux crevettes", "باستا بالكريمة والروبيان"),
        note: c("Garlic, parsley, a little chilli", "Ail, persil, un peu de piment", "ثوم، بقدونس، شوية فلفل"),
        price: "129",
        tag: c("New", "Nouveau", "جديد"),
      },
      {
        name: c("Warm chocolate cake, ice cream", "Gâteau chocolat chaud, glace", "كيكة الشوكولا ساخنة، آيس كريم"),
        note: c("The one every table finishes with", "Celui que chaque table finit", "اللي كتسالي بيه كل طابلة"),
        price: "79",
      },
    ],
    link: c("See the full menu", "Voir la carte complète", "شوف المينيو كامل"),
  },
  reservation: {
    heading: c("Book a table", "Réserver une table", "احجز طابلة"),
    fields: [
      { label: c("Date", "Date", "النهار"), value: c("Friday 12 September", "Vendredi 12 septembre", "الجمعة 12 شتنبر") },
      { label: c("Time", "Heure", "الساعة"), value: c("8:00 pm", "20h00", "8:00 بالليل") },
      { label: c("Guests", "Personnes", "العدد"), value: c("4 people", "4 personnes", "4 ناس") },
    ],
    slots: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
    cta: c("Confirm the booking", "Confirmer la réservation", "أكّد الحجز"),
    note: c(
      "Two steps. The guest picks a time, the table is written down — nothing is paid online.",
      "Deux étapes. Le client choisit une heure, la table est notée — rien n'est payé en ligne.",
      "خطوتين. الزبون كيختار ساعة وكنسجلو الطابلة — كاين حتى حاجة كتخلص فيها.",
    ),
  },
  location: {
    image: restaurantMedia.room,
    heading: c("Finding the door", "Trouver la porte", "كاين الباب فين"),
    rows: [
      { label: c("Address", "Adresse", "العنوان"), value: c("12 rue des Consuls, Casablanca", "12 rue des Consuls, Casablanca", "12 شارع لكونسول، كازا") },
      { label: c("Kitchen", "Cuisine", "المطبخ"), value: c("Every day, 12:00 – 23:00", "Tous les jours, 12h00 – 23h00", "كل نهار، من 12 لـ 11 بالليل") },
      { label: c("Getting there", "S'y rendre", "كيف توصل"), value: c("Parking behind, 20 spaces", "Parking derrière, 20 places", "الباركينغ من ورا، 20 بلاصة") },
      { label: c("Groups", "Groupes", "المجموعات"), value: c("More than 8, call ahead", "Plus de 8, appelez d'avance", "فوق 8 ناس، عيط قبل") },
    ],
  },
  dishes: [
    restaurantMedia["dish-pasta"],
    restaurantMedia["dish-steak"],
    restaurantMedia["dish-pizza"],
    restaurantMedia["dish-dessert"],
  ],
  panels: [
    {
      id: "menu",
      index: "01",
      label: c("Menu", "Carte", "المينيو"),
      note: c("Dishes and prices written out — not a PDF to download", "Plats et prix écrits — pas un PDF à télécharger", "الماكلة والثمن مكتوبين — ماشي بي دي إف"),
    },
    {
      id: "booking",
      index: "02",
      label: c("Booking", "Réservation", "الحجز"),
      note: c("A date, a time, a number of people. Then it is written down.", "Une date, une heure, un nombre. Puis c'est noté.", "نهار، ساعة، شحال من ناس. ومن بعد كنسجلو."),
    },
    {
      id: "location",
      index: "03",
      label: c("Location", "Adresse", "العنوان"),
      note: c("Where it is, when it opens, where to park", "Où c'est, quand ça ouvre, où se garer", "فين كاين، إمتى كيبان، فين تباركي"),
    },
    {
      id: "mobile",
      index: "04",
      label: c("On a phone", "Sur un téléphone", "فالتيليفون"),
      note: c("The menu in the hand, one-handed, on mobile data", "La carte en main, à une main, en data mobile", "المينيو فاليد، بيد وحدة، بالديتا"),
      image: restaurantMedia.salad,
    },
  ],
};
