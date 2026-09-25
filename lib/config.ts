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
  // À CONFIRMER : laissé vide, le bouton ouvre WhatsApp sans destinataire.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_BOUTIQUE ?? "",
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

// À CONFIRMER (semaine 5) : zones, tarifs et délais de livraison.
export const ZONES_LIVRAISON = [
  { id: "retrait", nom: "Retrait en boutique à Mermoz", tarif: 0, delai: "Prête en 2 h" },
  { id: "dakar", nom: "Dakar centre", tarif: 1500, delai: "Livrée le jour même ou le lendemain" },
  { id: "banlieue", nom: "Banlieue (Pikine, Guédiawaye, Rufisque…)", tarif: 2500, delai: "24 à 48 h" },
  { id: "regions", nom: "Régions", tarif: 4000, delai: "2 à 4 jours" },
] as const;

export type ZoneId = (typeof ZONES_LIVRAISON)[number]["id"];

// À CONFIRMER : seuil de livraison offerte.
export const SEUIL_LIVRAISON_OFFERTE = 30000;

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
