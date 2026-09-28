// Fiche d'identité de chaque boutique cliente de la plateforme.
// La boutique affichée est choisie par la variable NEXT_PUBLIC_BOUTIQUE
// (un projet Vercel par boutique, tous branchés sur ce même code).
// Tout ce qui change d'une boutique à l'autre doit être ici, pas dans les pages.

export type Couleurs = {
  accent: string; // boutons, titres dorés (ex-« or »)
  accentRgb: string; // même couleur en « r,g,b » pour les halos transparents
  accentClair: string; // texte d'accent sur fond sombre
  accentFonce: string; // fin des dégradés de boutons
  barre: string; // barres des graphiques (contraste suffisant sur fond clair)
  sombre: string; // fonds sombres (ex-« noir »)
  clair: string; // fonds clairs (ex-« crème »)
};

export type Boutique = {
  id: string;
  nom: string;
  surnom: string; // en majuscules sur le ticket de caisse
  slogan: string;
  adresse: string;
  quartier: string; // « Mermoz », « Yoff Tonghor »…
  telephones: { affiche: string; lien: string }[];
  horaires?: string;
  reseaux: { nom: string; url: string; libelle: string }[];
  logo: { image: string } | { initiales: string };
  apercu: string; // image 1200×630 des aperçus de liens (WhatsApp…)
  icone: string; // icône de l'onglet
  description: string; // texte des aperçus de liens
  couleurs: Couleurs;
  prefixeCommande: string;
  siteEnLigne: boolean; // false : seule la partie gestion est montrée
  avisExemples: { objet: string; message: string; quand: string; recontact: boolean }[];
};

const SAKABA: Boutique = {
  id: "sakaba",
  nom: "Sakaba Beauty",
  surnom: "SAKABA BEAUTY",
  slogan: "La beauté authentique, avec le bon conseil",
  adresse: "Mermoz Ancienne Piste, à côté de la Case des Tout-Petits, Dakar",
  quartier: "Mermoz",
  telephones: [
    { affiche: "78 588 54 54", lien: "tel:+221785885454" },
    { affiche: "78 303 24 24", lien: "tel:+221783032424" },
  ],
  reseaux: [{ nom: "Instagram", url: "https://www.instagram.com/sakababeauty/", libelle: "@sakababeauty" }],
  logo: { image: "/logo-sakaba.png" },
  apercu: "/boutiques/sakaba/apercu.jpg",
  icone: "/boutiques/sakaba/icone.png",
  description:
    "Soins du visage, cheveux, maquillage et parfums 100 % authentiques, importés des États-Unis. Boutique à Mermoz, livraison à Dakar et dans les régions. Paiement Wave et Orange Money.",
  couleurs: {
    accent: "#C59735",
    accentRgb: "197,151,53",
    accentClair: "#E3C77E",
    accentFonce: "#B0852A",
    barre: "#A67C1F",
    sombre: "#14100B",
    clair: "#FCF9F3",
  },
  prefixeCommande: "SKB",
  siteEnLigne: true,
  avisExemples: [
    { objet: "Suggestion", message: "Ce serait bien d'avoir la gamme Mielle complète en boutique.", quand: "Il y a 2 h", recontact: false },
    { objet: "Problème rencontré", message: "Le flacon reçu avait le bouchon un peu abîmé.", quand: "Hier", recontact: true },
    { objet: "Réclamation", message: "Livraison arrivée avec un jour de retard à Pikine.", quand: "Il y a 3 jours", recontact: true },
  ],
};

// Américain Store by Marie Pacha (Yoff Tonghor) : prospect, démo du 28/09/2026.
// Informations reprises de son compte TikTok public @boutiquepacha.
const PACHA: Boutique = {
  id: "pacha",
  nom: "Américain Store",
  surnom: "AMÉRICAIN STORE",
  slogan: "by Marie Pacha",
  adresse: "Yoff Tonghor, Dakar",
  quartier: "Yoff Tonghor",
  telephones: [
    { affiche: "77 496 59 19", lien: "tel:+221774965919" },
    { affiche: "78 797 25 35", lien: "tel:+221787972535" },
  ],
  horaires: "Tous les jours de 10 h à 20 h",
  reseaux: [{ nom: "TikTok", url: "https://www.tiktok.com/@boutiquepacha", libelle: "@boutiquepacha" }],
  logo: { initiales: "AS" },
  apercu: "/boutiques/pacha/apercu.jpg",
  icone: "/boutiques/pacha/icone.png",
  description: "Caisse, stock et tableau de bord pour Américain Store by Marie Pacha, Yoff Tonghor.",
  couleurs: {
    accent: "#C2255C",
    accentRgb: "194,37,92",
    accentClair: "#F7A1C0",
    accentFonce: "#9C1C4A",
    barre: "#C2255C",
    sombre: "#0E1A2B",
    clair: "#FFF7FA",
  },
  prefixeCommande: "AS",
  siteEnLigne: false,
  avisExemples: [
    { objet: "Suggestion", message: "Ce serait bien d'avoir plus de pointures en baskets.", quand: "Il y a 2 h", recontact: false },
    { objet: "Problème rencontré", message: "Commande passée pendant le live, je n'ai pas eu de confirmation.", quand: "Hier", recontact: true },
    { objet: "Suggestion", message: "Pouvez-vous refaire un live sur les sérums vitamine C ?", quand: "Il y a 3 jours", recontact: false },
  ],
};

// Écrit sous forme de condition simple pour que la construction ne garde QUE la
// fiche de la boutique choisie (aucune trace des autres clientes dans le site).
export const BOUTIQUE_ACTIVE: Boutique = process.env.NEXT_PUBLIC_BOUTIQUE === "pacha" ? PACHA : SAKABA;

// Variables CSS posées sur <html> : toutes les couleurs du site en découlent.
export function variablesCouleurs(c: Couleurs): Record<string, string> {
  return {
    "--or": c.accent,
    "--or-rgb": c.accentRgb,
    "--or-clair": c.accentClair,
    "--or-fonce": c.accentFonce,
    "--or-barre": c.barre,
    "--noir": c.sombre,
    "--creme": c.clair,
  };
}
