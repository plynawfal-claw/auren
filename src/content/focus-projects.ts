import { c, type Copy } from "@/i18n/copy";

export type FocusProject = {
  title: Copy;
  alt: Copy;
  src: string;
  width: number;
  height: number;
  type: "concept";
};

/** Original dimensions verified with sips. Supplied references, not client commissions. */
export const focusProjects: readonly FocusProject[] = [
  { title: c("Coffee & pastry", "Café & pâtisserie", "قهوة وحلويات"), alt: c("Coffee shop concept with green cups and pastry collections", "Concept de café avec tasses vertes et sélection de pâtisseries", "تصوّر لموقع قهوة بكيسان خضرين وحلويات"), src: "/work/refs/IMG_7383.JPG", width: 736, height: 1104, type: "concept" },
  { title: c("At the table", "À table", "على الطابلة"), alt: c("Restaurant concept with dishes, menu and reservations", "Concept de restaurant avec plats, menu et réservation", "تصوّر لموقع مطعم بالمينيو والحجز"), src: "/work/refs/IMG_7384.JPG", width: 736, height: 1040, type: "concept" },
  { title: c("Burger house", "Maison du burger", "دار البرݣر"), alt: c("Dark burger restaurant concept with a full ordering menu", "Concept de restaurant de burgers sombre avec menu complet", "تصوّر غامق لمطعم البرݣر بمينيو كامل"), src: "/work/refs/IMG_7385.JPG", width: 583, height: 1200, type: "concept" },
  { title: c("Morocco, on the road", "Le Maroc, en route", "المغرب فالطريق"), alt: c("Moroccan car rental visual with mountain road and sunset", "Visuel de location de voiture au Maroc, route de montagne au coucher du soleil", "تصوّر لكراء الطوموبيلات فالمغرب بطريق جبلية والغروب"), src: "/work/refs/IMG_7386.JPG", width: 1024, height: 1536, type: "concept" },
  { title: c("Modern essentials", "L’essentiel contemporain", "ستايل اليوم"), alt: c("Fashion shop concept with clothing and accessory collections", "Concept de boutique de mode avec collections de vêtements et accessoires", "تصوّر لمتجر ديال الموضة بالملابس والإكسسوارات"), src: "/work/refs/IMG_7387.JPG", width: 941, height: 1672, type: "concept" },
  { title: c("Spaces to live", "Des espaces à vivre", "بلايص للعيش"), alt: c("Home showroom concept with complete furniture and room collections", "Concept de showroom avec collections complètes de meubles et d’intérieurs", "تصوّر لشوروم بموبيليا وديكورات للدار"), src: "/work/refs/IMG_7391.JPG", width: 941, height: 1672, type: "concept" },
  { title: c("The fitting room", "La cabine d’essayage", "بلاصة التجريب"), alt: c("Virtual fitting concept with a model and clothing selection", "Concept d’essayage virtuel avec mannequin et sélection de vêtements", "تصوّر لتجريب الملابس أونلاين"), src: "/work/refs/IMG_7392.JPG", width: 735, height: 553, type: "concept" },
];
