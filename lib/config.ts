// Réglages de la boutique. Les valeurs marquées « À CONFIRMER » sont des exemples
// en attendant les informations de Sakaba Beauty (cahier des charges, §25.1).

export const BOUTIQUE = {
  nom: "Sakaba Beauty",
  slogan: "La beauté authentique, avec le bon conseil",
  adresse: "Mermoz Ancienne Piste, à côté de la Case des Tout-Petits, Dakar",
  // Numéros donnés par Birima le 24/09/2026.
  telephones: [
    { affiche: "78 588 54 54", lien: "tel:+221785885454" },
    { affiche: "78 303 24 24", lien: "tel:+221783032424" },
  ],
  // Itinéraire vers le repère donné par la boutique (Case des Tout-Petits de Mermoz).
  itineraire: "https://www.google.com/maps/search/?api=1&query=Case+des+Tout-Petits+Mermoz+Ancienne+Piste+Dakar",
  instagram: "https://www.instagram.com/sakababeauty/",
  // Numéro WhatsApp de la boutique, format international sans « + » (ex. 221770000000).
  // 78 588 54 54, confirmé par Birima le 25/09/2026.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_BOUTIQUE || "221785885454",
};

// Le site n'est indexé par Google que si cette variable vaut « production ».
// Les aperçus de test restent invisibles des moteurs (erreur relevée au §1.2).
export const EST_PRODUCTION = process.env.NEXT_PUBLIC_SITE_ENV === "production";

// Adresse utilisée dans les aperçus de liens (WhatsApp, Facebook…). Sans réglage,
// on prend l'adresse Vercel du projet : sakababeauty.com est encore l'ancien site.
export const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://sakababeauty-nu.vercel.app");

// Réception de la commande. Décision de Sakaba (25/09/2026) : pas de tarif de
// livraison fixé par le site, la cliente convient du prix directement avec le livreur.
export const MODES_RECEPTION = [
  {
    id: "retrait",
    nom: "Retrait à la boutique de Mermoz",
    detail: "Gratuit. On vous prévient sur WhatsApp quand c'est prêt.",
  },
  {
    id: "livraison",
    nom: "Livraison",
    detail: "Le livreur vous appelle : le prix et l'heure se règlent directement avec lui.",
  },
] as const;

export type ModeReception = (typeof MODES_RECEPTION)[number]["id"];

// Paiement à la livraison : plafond (cahier des charges §9.1).
export const PLAFOND_PAIEMENT_LIVRAISON = 75000;

export const MOYENS_PAIEMENT = [
  { id: "wave", nom: "Wave", detail: "Paiement sur votre téléphone" },
  { id: "orange-money", nom: "Orange Money", detail: "Confirmation automatique" },
  { id: "carte", nom: "Carte bancaire", detail: "Visa, Mastercard — idéal depuis l'étranger" },
  { id: "livraison", nom: "Paiement à la livraison", detail: "En espèces ou Wave à la réception" },
] as const;

export function lienWhatsApp(message: string) {
  const texte = encodeURIComponent(message);
  return BOUTIQUE.whatsapp
    ? `https://wa.me/${BOUTIQUE.whatsapp}?text=${texte}`
    : `https://wa.me/?text=${texte}`;
}

export function formatPrix(montant: number) {
  return `${new Intl.NumberFormat("fr-FR").format(montant).replace(/ | /g, " ")} F`;
}
