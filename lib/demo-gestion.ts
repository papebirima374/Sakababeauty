// Données de DÉMONSTRATION de l'espace gestion : commandes, ventes et avis
// inventés pour montrer à Sakaba ce que l'outil affichera. Les stocks et les
// produits viennent du catalogue d'exemple. Rien ici n'est une vraie vente.
import { PRODUITS, type Produit } from "./catalogue";

// Générateur pseudo-aléatoire à graine fixe : les mêmes chiffres à chaque visite.
function hasard(graine: number) {
  let x = graine;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

export type StatutCommande = "nouvelle" | "preparation" | "livraison" | "livree";

export const STATUTS: Record<StatutCommande, { nom: string; icone: string; classe: string }> = {
  nouvelle: { nom: "Nouvelle", icone: "●", classe: "bg-amber-50 text-amber-900 ring-amber-300" },
  preparation: { nom: "À préparer", icone: "◐", classe: "bg-sky-50 text-sky-900 ring-sky-300" },
  livraison: { nom: "En livraison", icone: "➜", classe: "bg-violet-50 text-violet-900 ring-violet-300" },
  livree: { nom: "Livrée", icone: "✓", classe: "bg-green-50 text-green-900 ring-green-300" },
};

export type Commande = {
  numero: string;
  cliente: string;
  heure: string;
  zone: string;
  paiement: string;
  lignes: { produit: Produit; quantite: number }[];
  total: number;
  statut: StatutCommande;
};

const PRENOMS = ["Aïssatou D.", "Fatou N.", "Mariama S.", "Khady F.", "Awa G.", "Ndèye B.", "Coumba T.", "Astou M."];
const ZONES = ["Retrait à Mermoz", "Livraison · Dakar", "Livraison · Pikine", "Livraison · Thiès"];
const PAIEMENTS = ["Wave", "Orange Money", "Carte bancaire", "À la livraison"];
const ORDRE: StatutCommande[] = ["nouvelle", "nouvelle", "preparation", "preparation", "livraison", "livree", "livree", "livree"];

export function commandesDuJour(): Commande[] {
  const r = hasard(2026);
  const disponibles = PRODUITS.filter((p) => p.stock > 0);
  return ORDRE.map((statut, i) => {
    const nb = 1 + Math.floor(r() * 3);
    const lignes = Array.from({ length: nb }, () => ({
      produit: disponibles[Math.floor(r() * disponibles.length)],
      quantite: 1 + Math.floor(r() * 2),
    }));
    const zone = ZONES[Math.floor(r() * ZONES.length)];
    return {
      numero: `SKB-${1048 - i}`,
      cliente: PRENOMS[i],
      heure: `${String(17 - i).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}`,
      zone,
      paiement: PAIEMENTS[Math.floor(r() * PAIEMENTS.length)],
      lignes,
      total: lignes.reduce((t, l) => t + l.quantite * l.produit.prix, 0),
      statut,
    };
  });
}

// Ventes des 7 derniers jours (le dernier = aujourd'hui).
export function ventesSemaine(aujourdhui: Date) {
  const r = hasard(7);
  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(aujourdhui);
    d.setDate(d.getDate() - (6 - i));
    const weekend = d.getDay() === 6 || d.getDay() === 0;
    const montant = Math.round((180000 + r() * 160000 + (weekend ? 90000 : 0)) / 500) * 500;
    return {
      jour: new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "Africa/Dakar" }).format(d).replace(".", ""),
      date: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Africa/Dakar" }).format(d),
      montant,
      commandes: Math.round(montant / 21000),
    };
  });
  return jours;
}

export function stocksASurveiller() {
  return [...PRODUITS].filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);
}

export function meilleuresVentes() {
  return [...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 5);
}

export const AVIS_DEMO = [
  { objet: "Suggestion", message: "Ce serait bien d'avoir la gamme Mielle complète en boutique.", quand: "Il y a 2 h", recontact: false },
  { objet: "Problème rencontré", message: "Le flacon reçu avait le bouchon un peu abîmé.", quand: "Hier", recontact: true },
  { objet: "Réclamation", message: "Livraison arrivée avec un jour de retard à Pikine.", quand: "Il y a 3 jours", recontact: true },
];
