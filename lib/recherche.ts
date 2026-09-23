import {
  BESOINS,
  PRODUITS,
  nomMarque,
  universParSlug,
  type Besoin,
  type Produit,
} from "./catalogue";

// Recherche tolérante aux fautes (« nivéa », « cerave », « shea mositure »).
// Provisoire : sur 2 700 références, elle sera confiée à Typesense ou Meilisearch
// (cahier des charges §18). La logique d'affichage, elle, ne changera pas.

export function normaliser(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

// Ce que la clientèle tape réellement, ramené aux besoins du catalogue.
const SYNONYMES: Record<string, Besoin[]> = {
  tache: ["taches"],
  taches: ["taches"],
  hyperpigmentation: ["taches"],
  eclaircissant: ["taches", "eclat"],
  acne: ["acne"],
  bouton: ["acne"],
  boutons: ["acne"],
  imperfection: ["acne"],
  imperfections: ["acne"],
  pores: ["pores"],
  hydratation: ["hydratation"],
  hydratant: ["hydratation"],
  seche: ["hydratation", "cheveux-secs"],
  secs: ["cheveux-secs"],
  eclat: ["eclat"],
  soleil: ["protection-solaire"],
  solaire: ["protection-solaire"],
  spf: ["protection-solaire"],
  casse: ["casse"],
  pousse: ["pousse"],
  chute: ["pousse", "casse"],
  boucles: ["definition"],
  vergeture: ["vergetures"],
  vergetures: ["vergetures"],
  levres: ["levres"],
  gloss: ["levres"],
  parfum: ["parfum"],
  barbe: ["barbe"],
  fond: ["teint"],
  teint: ["teint"],
};

function distance(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  let prec = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cour = [i];
    for (let j = 1; j <= n; j++) {
      cour[j] = Math.min(
        prec[j] + 1,
        cour[j - 1] + 1,
        prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prec = cour;
  }
  return prec[n];
}

function motProche(mot: string, cible: string) {
  if (cible.startsWith(mot) || mot.startsWith(cible)) return true;
  const tolerance = mot.length <= 4 ? 0 : mot.length <= 7 ? 1 : 2;
  return distance(mot, cible) <= tolerance;
}

function texteIndexe(p: Produit) {
  return normaliser(
    [
      p.nom,
      nomMarque(p.marque),
      p.marque,
      universParSlug(p.univers)?.nom ?? "",
      p.categorie,
      p.accroche,
      ...p.actifs,
      ...p.besoins.map((b) => BESOINS[b]),
    ].join(" "),
  );
}

const INDEX = PRODUITS.map((p) => ({ produit: p, mots: texteIndexe(p).split(" ") }));

export function rechercher(requete: string): Produit[] {
  const mots = normaliser(requete).split(" ").filter((m) => m.length >= 2);
  if (mots.length === 0) return [];

  const besoinsVises = new Set<Besoin>();
  for (const mot of mots) {
    for (const [cle, besoins] of Object.entries(SYNONYMES)) {
      if (motProche(mot, cle)) besoins.forEach((b) => besoinsVises.add(b));
    }
  }

  const resultats = INDEX.map(({ produit, mots: motsProduit }) => {
    let score = 0;
    for (const mot of mots) {
      if (motsProduit.some((m) => m === mot)) score += 3;
      else if (motsProduit.some((m) => motProche(mot, m))) score += 2;
    }
    if (produit.besoins.some((b) => besoinsVises.has(b))) score += 2;
    return { produit, score };
  })
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score || b.produit.ventes - a.produit.ventes);

  // Écarter les résultats nettement moins pertinents que le meilleur.
  const meilleur = resultats[0]?.score ?? 0;
  return resultats.filter((r) => r.score >= meilleur * 0.6).map((r) => r.produit);
}
