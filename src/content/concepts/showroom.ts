import { c } from "@/i18n/copy";
import { showroomMedia } from "../media";
import type { ShowroomConcept } from "./types";

/**
 * 03 — Showroom, furniture, interiors.
 *
 * The layout is a stage, not a grid. One room fills the frame; the panels
 * around it are what that room is *about* — the collections, the materials,
 * the gallery, the enquiry — and they change as the visitor scrolls. The
 * previous version of this section was four empty cream cards, which told a
 * furniture business nothing except that the studio had not photographed the
 * work yet.
 */
export const showroom: ShowroomConcept = {
  id: "showroom",
  name: "Terra",
  category: c(
    "Furniture and interiors — collections, materials, visit",
    "Mobilier et intérieurs — collections, matières, visite",
    "الأثاث والداخل — الكولكسيون، الخامات، الزيارة",
  ),
  promise: c(
    "A digital showroom: the customer walks the rooms, understands the materials and asks about a piece before they ever drive to yours.",
    "Un showroom numérique : le client parcourt les pièces, comprend les matières et pose sa question avant même de venir.",
    "شوروم رقمي: الزبون كيدور فالغرف، كيفهم الخامات، وكيطرح السؤال قبل ما يجي عندك.",
  ),
  badge: c("Concept · demo", "Concept · démo", "كونسيب · ديمو"),
  palette: {
    bg: "#14100b",
    panel: "#1d1811",
    ink: "#f6efe4",
    soft: "#b6a68f",
    line: "rgba(246,239,228,0.15)",
    accent: "#c07a4c",
    accentInk: "#150e07",
  },
  statement: c(
    "Furniture is bought with the hand. The website has to replace the first half of that conversation, not all of it.",
    "On achète un meuble avec la main. Le site doit remplacer la première moitié de la conversation, pas toute.",
    "الناس كيشريو باليد. الموقع خاصو يعوّض النصف الأول من هاد الحوار، ماشي كامل.",
  ),
  hero: showroomMedia.hero,
  can: [
    c("See each room as it is delivered", "Voir chaque pièce comme elle est livrée", "تشوف كل غرفة بحال كيف كتتسلم"),
    c("Read the materials before asking", "Lire les matières avant de demander", "تقرا الخامات قبل ما تسول"),
    c("Compare pieces side by side", "Comparer les pièces côte à côte", "تقارن بين القطع جنبا لجنب"),
    c("Book a visit to the showroom", "Réserver une visite du showroom", "تحجز زيارة للشوروم"),
  ],
  rooms: [
    { image: showroomMedia.living, name: c("Living room", "Salon", "الصالة"), note: c("Sofas, low tables, light", "Canapés, tables basses, lumière", "كنب، طاولات صغار، الضو") },
    { image: showroomMedia.bedroom, name: c("Bedroom", "Chambre", "الغرفة"), note: c("Beds, bedside, linen", "Lits, chevets, linge", "سراير، طاولات، الشراشف") },
    { image: showroomMedia.dining, name: c("Dining", "Salle à manger", "الصالون"), note: c("Tables, chairs, pendants", "Tables, chaises, suspensions", "طاولات، كراسي، لامات") },
    { image: showroomMedia.office, name: c("Home office", "Bureau", "المكتب"), note: c("Desks, storage, task light", "Bureaux, rangement, lumière", "مكاتب، تخبزين، ضو الخدمة") },
    { image: showroomMedia.outdoor, name: c("Outdoor", "Extérieur", "البرا"), note: c("Terrace and garden pieces", "Terrasse et jardin", "التراس والجردة") },
  ],
  materials: [
    { hex: "#8a6a4b", name: c("Oiled oak", "Chêne huilé", "خشب بلوط مدهون"), note: c("Warms up over two years", "Se patine en deux ans", "كيتلون مع السنين") },
    { hex: "#cfc3b2", name: c("Cream bouclé", "Bouclé crème", "بوكليه"), note: c("Removable cover, stain resistant", "Housse déhoussable, antitache", "كيتبدل، كيقاوم الوسخ") },
    { hex: "#4a4a46", name: c("Blackened steel", "Acier noirci", "حديد مصقول"), note: c("Powder coated, five year finish", "Laqué, finition cinq ans", "مطلي، كيدوم خمس سنين") },
    { hex: "#b0743f", name: c("Terracotta", "Terre cuite", "طين أحمر"), note: c("Unglazed and matte", "Non émaillé, mat", "بلا طلاء، مطفي") },
  ],
  pieces: [
    { image: showroomMedia.chair, name: c("Sable lounge chair", "Fauteuil Sable", "كرسي Sable"), price: "649" },
    { image: showroomMedia.vase, name: c("Arlo ceramic vase", "Vase en céramique Arlo", "جرار سيراميك Arlo"), price: "49" },
    { image: showroomMedia.lamp, name: c("Milo pendant lamp", "Suspension Milo", "لاَمبا معلّقة Milo"), price: "129" },
    { image: showroomMedia.cabinet, name: c("Rhea storage cabinet", "Meuble de rangement Rhea", "كونسول Rhea"), price: "899" },
    { image: showroomMedia.cushion, name: c("Linen cushion cover", "Housse de coussin en lin", "غبار ديال الكتان"), price: "39" },
  ],
  inquiry: {
    heading: c("Ask about a piece", "Poser une question", "سول على قطعة"),
    fields: [
      { label: c("Piece", "Pièce", "القطعة"), value: c("Sable lounge chair", "Fauteuil Sable", "كرسي Sable") },
      { label: c("When", "Quand", "إمتى"), value: c("Within two weeks", "Sous deux semaines", "خلال جوج أسابيع") },
    ],
    cta: c("Send the enquiry", "Envoyer la demande", "صيفط الطلب"),
    note: c(
      "The visitor leaves with a name, a piece and a date. The showroom replies with a price, a fabric and a delivery date.",
      "Le visiteur repart avec un nom, une pièce et une date. Le showroom répond avec un prix, un tissu et une date de livraison.",
      "الزبون كيمشي بسومة و قطعة و تاريخ. الشوروم كيجاوب بثمن و قماش و تاريخ التسليم.",
    ),
  },
  gallery: [
    showroomMedia["gallery-a"],
    showroomMedia["gallery-b"],
    showroomMedia["gallery-c"],
    showroomMedia["gallery-d"],
    showroomMedia["gallery-e"],
  ],
  panels: [
    {
      id: "rooms",
      index: "01",
      label: c("Rooms", "Pièces", "الغرف"),
      note: c("Shop by the room you are actually redoing", "Par la pièce que vous refaites", "دخلات للغرفة اللي كتصلح"),
    },
    {
      id: "materials",
      index: "02",
      label: c("Materials", "Matières", "الخامات"),
      note: c("Named and swatched, because that is the conversation", "Nommées et échantillonnées, car c'est le sujet", "مسماة و بمثال، حيت هادي هي الحوار"),
    },
    {
      id: "gallery",
      index: "03",
      label: c("Gallery", "Galerie", "الغاليري"),
      note: c("The showroom, room by room, before you drive over", "Le showroom, pièce par pièce, avant de venir", "الشوروم، غرفة بغرفة، قبل ما تجي"),
    },
    {
      id: "inquiry",
      index: "04",
      label: c("Enquiry", "Demande", "الطلب"),
      note: c("One question, answered by the person who knows the piece", "Une question, répondue par la personne qui connaît", "سؤال واحد، كيجاوب ليه لي ك يعرف"),
    },
  ],
};
