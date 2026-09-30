import { c } from "@/i18n/copy";

/** Optimized assets retain the composition of the supplied originals. */
export const editorialImages = {
  systems: [
    { src: "/visuals/01-customer.webp", alt: c("A customer types on a phone at a café table", "Un client écrit sur son téléphone à une table de café", "زبون كيكتب فالتليفون ديالو فطابلة ديال القهوة") },
    { src: "/visuals/02-understands.webp", alt: c("A message takes shape as a customer types on a phone", "Un message prend forme pendant qu’un client écrit sur son téléphone", "رسالة كتوضح والزبون كيكتب فالتليفون") },
    { src: "/visuals/03-decides.webp", alt: c("A customer message connects to shopping, location and timing", "Un message client relie achat, lieu et moment", "رسالة ديال زبون كتربط الشراء والبلاصة والوقت") },
    { src: "/visuals/04-action.webp", alt: c("A phone message triggers a receipt at a café counter", "Un message sur téléphone déclenche un reçu au comptoir d’un café", "رسالة فالتليفون كتخرج وصل فكونتوار القهوة") },
    { src: "/visuals/05-follow-up.webp", alt: c("A follow-up message connects to a date on a calendar", "Un message de suivi rejoint une date sur le calendrier", "رسالة المتابعة كتوصل لموعد فالكالوندي") },
    { src: "/visuals/06-result.webp", alt: c("A café order is handed to its customer after a connected exchange", "Une commande de café est remise au client après un échange connecté", "طلبية ديال القهوة كتتسلم للزبون من بعد تواصل مربوط") },
  ],
  process: {
    src: "/visuals/07-how-we-work.webp",
    alt: c(
      "Sketches, a laptop and a phone on a studio worktable",
      "Des croquis, un ordinateur et un téléphone sur la table de travail du studio",
      "سكيصات وأورديناتور وتليفون فوق طابلة الخدمة فالستوديو",
    ),
  },
} as const;
