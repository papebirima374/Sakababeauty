// Informations fixes de la masterclass en cours, affichées sur /masterclass.
// La date, l'heure, le lieu et les places viennent du Google Sheet (onglet
// « Réglages ») ; le prix, le lien Wave et le programme sont ici.
// Masterclass du 24 octobre 2026 (informations données par Birima le 01/10/2026).
export const MASTERCLASS = {
  theme: "Acné & hyperpigmentation",
  prix: 20000,
  // Lien de paiement Wave de Sakaba (public par nature : on le donne aux clientes).
  // Le montant est déjà rempli dans le lien (donné par Birima le 02/10/2026).
  montantWave: 20200,
  lienPaiement: "https://pay.wave.com/m/M_pOEPO7UxwCJr/c/sn/?amount=20200",
  programme: [
    "Comprendre l'acné et les taches",
    "Découvrir une routine adaptée",
    "Échanger et poser vos questions",
    "Rafraîchissements et collations",
    "Des cadeaux pour chaque participante, et beaucoup d'autres surprises",
  ],
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// Instant du début, à partir des textes du Google Sheet (« samedi 24 octobre
// 2026 », « 16h00 »). Dakar est à l'heure UTC toute l'année. null si illisible.
export function debutEvenement(date: string, heure: string): number | null {
  const d = date.toLowerCase().match(/(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/);
  if (!d) return null;
  const mois = MOIS.indexOf(d[2]);
  if (mois < 0) return null;
  const h = heure.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/);
  return Date.UTC(Number(d[3]), mois, Number(d[1]), h ? Number(h[1]) : 0, h?.[2] ? Number(h[2]) : 0);
}
