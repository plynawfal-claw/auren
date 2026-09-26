import { c } from "@/i18n/copy";
import { fashionMedia } from "../media";
import type { FashionConcept } from "./types";

/**
 * 02 — Fashion e-commerce.
 *
 * The layout is editorial and layered: a tall figure holds one side of the
 * screen, the product floats over the seam, and the bag sits in the corner at
 * the size a bag actually occupies. Nothing here shouts a discount. Price is
 * set quietly under a name, because the label being shown is the thing that
 * makes somebody buy.
 */
export const fashion: FashionConcept = {
  id: "fashion",
  name: "Sable",
  category: c(
    "Fashion — collections, product pages, bag",
    "Mode — collections, fiches produit, panier",
    "الملابس — الكولكسيون، صفحة المنتج، السلة",
  ),
  promise: c(
    "A clothing shop that reads like a lookbook and still lets somebody buy a coat before they leave.",
    "Une boutique qui se lit comme un lookbook et permet quand même d'acheter un manteau avant de partir.",
    "متجر ديال اللباس كيتقرا بحال الكتالوج، والزبون يقدر يشري كوت قبل ما يمشي.",
  ),
  badge: c("Concept · demo", "Concept · démo", "كونسيب · ديمو"),
  palette: {
    bg: "#15120f",
    panel: "#1e1a16",
    ink: "#f6f1ea",
    soft: "#b8aca0",
    line: "rgba(246,241,234,0.15)",
    accent: "#c8ab86",
    accentInk: "#17120c",
  },
  statement: c(
    "The collection is the page. Price sits quietly underneath and never shouts.",
    "La collection est la page. Le prix se pose dessous, sans jamais crier.",
    "الكولكسيون هو الصفحة. والثمن كيجي من تحتها بهدوء، ماشي بالصراخ.",
  ),
  hero: fashionMedia.model,
  can: [
    c("Walk the season, not a grid", "Parcourir la saison, pas une grille", "تهضر الموسم كامل، ماشي شبكة ديال الصور"),
    c("See the fabric, the fit and the size", "Voir la matière, la coupe et la taille", "تشوف القماش والقَصّة والمقاس"),
    c("Try a look on before ordering", "Essayer un look avant de commander", "تجرب اللوك قبل ما تطلب"),
    c("Pay online, or pay the courier", "Payer en ligne, ou payer le livreur", "تخلص عبر النت، ولا لل سيف"),
  ],
  look: {
    image: fashionMedia["model-full"],
    heading: c("One look, properly explained", "Un look, bien expliqué", "لوك واحد، مشروح مزيان"),
    body: c(
      "The coat, the knit and the bag are shown together, the way they are actually worn. Sizes sit under the name, the fabric is named, and the bag is always one tap away.",
      "Le manteau, la maille et le sac sont montrés ensemble, comme ils se portent vraiment. Les tailles sous le nom, la matière nommée, le panier toujours à un geste.",
      "الكوت، الطقم والساك كيتبانو مع بعضين، بحال ما كيتلبسو فالحقيق. المقاس تحت الاسم، والقماش كيتسمى، والسلة ديما على بعد خطوة.",
    ),
    price: "129",
    cta: c("Add to bag", "Ajouter au panier", "زيد للسلة"),
  },
  bag: {
    items: [
      { name: c("Wool blend coat", "Manteau mélange laine", "كوت صوف"), price: "129" },
      { name: c("Ribbed knit, sand", "Maille côtelée, sable", "تريكو مضلّع"), price: "69" },
      { name: c("Leather shoulder bag", "Sac d'épaule en cuir", "ساك كتف ديال الجلد"), price: "159" },
    ],
    total: c("Delivery calculated at the next step", "Livraison calculée à l'étape suivante", "التوصيل كيتحسب فالخطوة الجاية"),
    cta: c("Continue to payment", "Passer au paiement", "كمّل للدفع"),
    note: c(
      "Pay online, or pay the courier when it arrives. Both are offered because both are normal here.",
      "Paiement en ligne, ou au livreur à l'arrivée. Les deux sont proposés parce que les deux sont normaux ici.",
      "كتخلص عبر النت، ولا كتخلص لل سيف ملي كيوصل. بجوج عاديين هنا.",
    ),
  },
  strip: [
    fashionMedia["insp-a"],
    fashionMedia["insp-b"],
    fashionMedia["insp-c"],
    fashionMedia["insp-d"],
    fashionMedia["insp-e"],
    fashionMedia["insp-f"],
  ],
  fitting: {
    image: fashionMedia.tryon,
    heading: c("Try it on, without the queue", "Essayer, sans la file d'attente", "جرّب، بلا ما تقف فالطابور"),
    body: c(
      "A fitting room in the browser: pick a garment, see it on, keep the sizes you own. A convenience, not an effect — the size you are is the size you get.",
      "Un cabine d'essayage dans le navigateur : choisissez une pièce, voyez-la portée, gardez vos tailles. Une commodité, pas un effet.",
      "محل تجربة فالنت: غتار القطعة، شوفها عليك، وسجل المقاسات ديالك. ساهل، ماشي زين بريال.",
    ),
    points: [
      c("Choose the fit, not a guess", "Choisissez la coupe, pas une devinette", "ختار القَصّة، ماشي التخمين"),
      c("Your sizes, remembered", "Vos tailles, mémorisées", "المقاسات ديالك، محفوظة"),
      c("Return it if it is wrong", "Retournez si ça ne va pas", "رجّعها إلا ما عجباتكش"),
    ],
  },
  panels: [
    {
      id: "storefront",
      index: "01",
      label: c("Storefront", "Vitrine", "الواجهة"),
      note: c("The season opens the page, at full size", "La saison ouvre la page, en grand", "الموسم كيبان فالصفحة، بالحجم كامل"),
    },
    {
      id: "product",
      index: "02",
      label: c("Product", "Fiche produit", "المنتج"),
      note: c("Fabric, size and price, in that order", "Matière, taille et prix, dans cet ordre", "القماش، المقاس والثمن، بهاد الترتيب"),
    },
    {
      id: "fitting",
      index: "03",
      label: c("Fitting", "Essayage", "التجربة"),
      note: c("See the garment on before you order it", "Voir la pièce portée avant de commander", "شوف القطعة عليك قبل ما تطلبها"),
    },
    {
      id: "bag",
      index: "04",
      label: c("Bag and payment", "Panier et paiement", "السلة والدفع"),
      note: c("Pay online, or pay the courier at the door", "En ligne, ou au livreur à la porte", "عبر النت، ولا لل سيف فالباب"),
    },
  ],
};
