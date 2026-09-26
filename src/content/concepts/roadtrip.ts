import { c } from "@/i18n/copy";
import { roadtripMedia } from "../media";
import type { RoadtripConcept } from "./types";

/**
 * 04 — Morocco car rental.
 *
 * The layout is a booking desk over a landscape, because that is the order a
 * traveller thinks in: where am I driving, what does it cost, what do I have
 * to leave behind. Everything a Moroccan hire desk actually has to explain —
 * the deposit, what the insurance covers, whether the mileage is limited —
 * is on the page in plain language, in French and Darija, before anybody is
 * asked for a card.
 *
 * This is deliberately not a global car-booking template with a Moroccan
 * photograph behind it. The routes are named, the deposit is quoted in
 * dirhams, the road surfaces are described, and WhatsApp is a first-class
 * contact rather than a footer link.
 */
export const roadtrip: RoadtripConcept = {
  id: "roadtrip",
  name: "Tizi",
  category: c(
    "Car rental — booking, deposit, insurance",
    "Location de voiture — réservation, dépôt, assurance",
    "كراء الطوموبيل — الحجز، الضمان، التأمين",
  ),
  promise: c(
    "A car hire desk that works on a phone in the mountains, in French, Darija and English, with the deposit and the insurance explained before anyone signs.",
    "Une location qui marche sur un téléphone dans les montagnes, en français, en darija et en anglais, dépôt et assurance expliqués avant de signer.",
    "خدمة كراء طوموبيل خدّامة على التيليفون فالجبل، بالفرنسية والدارجة والإنجليزية، والضمان والتأمين كيتشرح قبل ما يوقّع حد.",
  ),
  badge: c("Concept · demo", "Concept · démo", "كونسيب · ديمو"),
  palette: {
    bg: "#150e08",
    panel: "#1f150c",
    ink: "#f9ecdd",
    soft: "#c6a888",
    line: "rgba(249,236,221,0.16)",
    accent: "#e0a052",
    accentInk: "#1a1006",
  },
  statement: c(
    "A mountain road, a deposit people understand, and a number they can actually call when the car stops.",
    "Une route de montagne, un dépôt qu'on comprend, et un numéro qu'on peut appeler quand la voiture s'arrête.",
    "طريق فالجبل، ضمان كنفهمو، ورقم تقدر تعيطو فاش الطوموبيل يوقف.",
  ),
  hero: roadtripMedia.landscape,
  can: [
    c("See the price before the deposit", "Voir le prix avant le dépôt", "تشوف الثمن قبل الضمان"),
    c("Read what the insurance covers", "Lire ce que couvre l'assurance", "تقرا شنو كغطي التأمين"),
    c("Collect in Marrakech, Casa or at the airport", "Départ Marrakech, Casa ou aéroport", "التسلم فمراكش ولا كازا ولا المطار"),
    c("Ask on WhatsApp, in Darija", "Demander sur WhatsApp, en darija", "سول فواتساب، بالدارجة"),
  ],
  booking: {
    heading: c("Book the car", "Réserver la voiture", "احجز الطوموبيل"),
    fields: [
      { label: c("Collect", "Départ", "التسلم"), value: c("Marrakech airport, 10:00", "Aéroport Marrakech, 10h00", "مطار مراكش، 10:00") },
      { label: c("Return", "Retour", "الرجوع"), value: c("Casablanca, 6 days later", "Casablanca, 6 jours plus tard", "كازا، من بعد 6 أيام") },
      { label: c("Licence", "Permis", "الرخصة"), value: c("Held two years or more", "Depuis deux ans ou plus", "عندك من جوج سنين ولا أكثر") },
    ],
    categories: [
      {
        name: c("City car", "Voiture de ville", "سيارة المدينة"),
        spec: c("5 seats · manual · 1.6", "5 places · manuel · 1.6", "5 بلاصات · مانيوال · 1.6"),
        price: "290",
        note: c("Cheapest. City streets and parking", "La moins chère. Ville et parkings", "الأرخص. شوارع المدينة والباركينغ"),
      },
      {
        name: c("Compact SUV", "SUV compact", "SUV صغير"),
        spec: c("5 seats · automatic · 2.0", "5 places · automatique · 2.0", "5 بلاصة · أوتوماتيك · 2.0"),
        price: "620",
        note: c("For the Atlas and the desert", "Pour l'Atlas et le désert", "للأطلس والصحراء"),
      },
      {
        name: c("Seven-seat SUV", "SUV sept places", "SUV سبع بلاصات"),
        spec: c("7 seats · automatic · 3.0", "7 places · automatique · 3.0", "7 بلاصة · أوتوماتيك · 3.0"),
        price: "980",
        note: c("For a family or a group", "Pour une famille ou un groupe", "لعائلة ولا لمجموعة"),
      },
    ],
    cta: c("Reserve", "Réserver", "احجز"),
    note: c(
      "The deposit is a fixed number, printed on the page, taken when the car is collected — not taken now.",
      "Le dépôt est un montant fixe, affiché sur la page, versé à la prise en charge — pas maintenant.",
      "الضمان رقم ثابت كيبان فالصفحة، وكيتخلص وقت التسليم — ماشي دابا.",
    ),
    whatsapp: c("Ask on WhatsApp", "Demander sur WhatsApp", "سول فواتساب"),
  },
  coverage: [
    { image: roadtripMedia.valley, name: c("High Atlas", "Haut Atlas", "الأطلس الكبير"), note: c("Tizi n'Tichka, two hours from Marrakech", "Tizi n'Tichka, deux heures de Marrakech", "تيزي ن تيشكا، جوج سوايع من مراكش") },
    { image: roadtripMedia.road, name: c("Dades and Todra", "Dades et Todra", "دادس وتودرا"), note: c("The gorge road, surfaced all year", "La route des gorges, goudronnée toute l'année", "طريق الوادي، مسفل طول العام") },
    { image: roadtripMedia.dusk, name: c("Erg Chigaga", "Erg Chigaga", "إرغ شيقاغة"), note: c("Where the road ends and the sand starts", "Là où la route s'arrête", "فين كيسالي الطريق") },
    { image: roadtripMedia.tea, name: c("Aït Benhaddou", "Aït Benhaddou", "عين بن حدّو"), note: c("A stop, and a glass of mint tea", "Une halte, et un thé à la menthe", "وقفة، و كأس أتاي بالنعناع") },
  ],
  reassurance: [
    { label: c("Deposit", "Dépôt", "الضمان"), value: c("2,500 MAD — shown before you sign", "2 500 MAD — affiché avant signature", "2500 درهم — كيبان قبل التوقيع") },
    { label: c("Insurance", "Assurance", "التأمين"), value: c("Basic included; full cover 90 MAD a day", "Base incluse ; couverture complète 90 MAD/jour", "أساسي مضمون؛ كامل 90 درهم فالنهار") },
    { label: c("Mileage", "Kilométrage", "الكيلومترات"), value: c("Unlimited on every car", "Illimité sur toutes les voitures", "بلا حد فكل السيارات") },
    { label: c("Roadside help", "Assistance", "المساعدة"), value: c("A number that answers, day and night", "Un numéro qui répond, jour et nuit", "رقم كيجاوب، ليل ونهار") },
  ],
  panels: [
    {
      id: "booking",
      index: "01",
      label: c("Booking", "Réservation", "الحجز"),
      note: c("Collection, return, category and price on one screen", "Départ, retour, catégorie et prix sur un écran", "التسلم، الرجوع، النوع والثمن فشي شاشة وحدة"),
    },
    {
      id: "insurance",
      index: "02",
      label: c("Deposit and insurance", "Dépôt et assurance", "الضمان والتأمين"),
      note: c("Both amounts in plain language, before the signature", "Les deux montants en clair, avant la signature", "بجوج الأرقام بالكلام الواضح، قبل التوقيع"),
    },
    {
      id: "routes",
      index: "03",
      label: c("Where people drive", "Où l'on conduit", "فين كيسوقو الناس"),
      note: c("The roads this car is actually for", "Les routes pour lesquelles c'est fait", "الطرق اللي هاد السيارة مصايب عليها"),
    },
    {
      id: "contact",
      index: "04",
      label: c("Asking a person", "Demander à quelqu'un", "سول شي واحد"),
      note: c("WhatsApp, in Darija, answered by the depot itself", "WhatsApp, en darija, répondu par le dépôt", "واتساب، بالدارجة، كيجاوب من الفرع"),
    },
  ],
};
