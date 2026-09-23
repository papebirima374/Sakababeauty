import { PRODUITS, type Besoin, type Produit, type TypeCheveux, type TypePeau } from "./catalogue";

// Diagnostic beauté (cahier des charges §8).
// Les questions et les règles sont des DONNÉES, pas du code : elles seront
// modifiables par l'équipe depuis la plateforme de gestion. Celles-ci sont un
// point de départ, à remplacer par le savoir-faire de Sakaba (semaine 4).

export type Domaine = "peau" | "cheveux";
export type Budget = "essentiel" | "confort" | "complet";

export type Option = { valeur: string; libelle: string; aide?: string; alerte?: boolean };
export type Question = { id: string; titre: string; options: Option[]; multiple?: boolean };

export const QUESTIONS: Record<Domaine, Question[]> = {
  peau: [
    {
      id: "type",
      titre: "En fin de journée, votre peau est plutôt…",
      options: [
        { valeur: "grasse", libelle: "Brillante sur tout le visage", aide: "Peau grasse" },
        { valeur: "mixte", libelle: "Brillante sur le front et le nez seulement", aide: "Peau mixte" },
        { valeur: "seche", libelle: "Tiraillée, parfois avec des plaques", aide: "Peau sèche" },
        { valeur: "normale", libelle: "Confortable, sans excès", aide: "Peau normale" },
      ],
    },
    {
      id: "preoccupation",
      titre: "Ce que vous aimeriez améliorer en priorité",
      multiple: true,
      options: [
        { valeur: "taches", libelle: "Des taches, un teint irrégulier" },
        { valeur: "acne", libelle: "Des boutons, des imperfections" },
        { valeur: "pores", libelle: "Des pores visibles, la brillance" },
        { valeur: "hydratation", libelle: "Le manque d'hydratation" },
        { valeur: "eclat", libelle: "Un teint terne, sans éclat" },
      ],
    },
    {
      id: "sensibilite",
      titre: "Votre peau réagit-elle facilement (rougeurs, picotements) ?",
      options: [
        { valeur: "non", libelle: "Non, rarement" },
        { valeur: "oui", libelle: "Oui, elle est sensible" },
      ],
    },
    {
      id: "alerte",
      titre: "Avez-vous en ce moment l'un de ces signes ?",
      options: [
        { valeur: "non", libelle: "Non, aucun" },
        { valeur: "oui", libelle: "Plaies, boutons douloureux et profonds, lésions qui s'étendent ou démangent fortement", alerte: true },
      ],
    },
    {
      id: "budget",
      titre: "Quelle routine vous convient ?",
      options: [
        { valeur: "essentiel", libelle: "Essentielle", aide: "Les 3 gestes indispensables" },
        { valeur: "confort", libelle: "Confort", aide: "4 gestes, résultat plus complet" },
        { valeur: "complet", libelle: "Complète", aide: "La routine idéale, matin et soir" },
      ],
    },
  ],
  cheveux: [
    {
      id: "type",
      titre: "Vos cheveux naturels sont…",
      options: [
        { valeur: "crepus", libelle: "Crépus, en petits ressorts très serrés" },
        { valeur: "frises", libelle: "Frisés, en spirales" },
        { valeur: "boucles", libelle: "Bouclés, en boucles souples" },
      ],
    },
    {
      id: "preoccupation",
      titre: "Ce qui vous gêne le plus",
      multiple: true,
      options: [
        { valeur: "cheveux-secs", libelle: "Ils sont secs, rêches" },
        { valeur: "casse", libelle: "Ils cassent" },
        { valeur: "pousse", libelle: "Ils ne poussent pas, les tempes sont clairsemées" },
        { valeur: "definition", libelle: "Mes boucles manquent de définition" },
      ],
    },
    {
      id: "alerte",
      titre: "Avez-vous en ce moment l'un de ces signes ?",
      options: [
        { valeur: "non", libelle: "Non, aucun" },
        { valeur: "oui", libelle: "Plaques sans cheveux, cuir chevelu douloureux, croûtes ou fortes démangeaisons", alerte: true },
      ],
    },
    {
      id: "budget",
      titre: "Quelle routine vous convient ?",
      options: [
        { valeur: "essentiel", libelle: "Essentielle", aide: "Laver et nourrir" },
        { valeur: "confort", libelle: "Confort", aide: "Avec un soin fortifiant" },
        { valeur: "complet", libelle: "Complète", aide: "Tous les gestes" },
      ],
    },
  ],
};

type Etape = { nom: string; moment: string; categories: string[]; budgets: Budget[] };

const ETAPES: Record<Domaine, Etape[]> = {
  peau: [
    { nom: "Nettoyer", moment: "Matin et soir", categories: ["nettoyants"], budgets: ["essentiel", "confort", "complet"] },
    { nom: "Traiter", moment: "Soir (ou matin et soir)", categories: ["serums", "anti-taches"], budgets: ["essentiel", "confort", "complet"] },
    { nom: "Traiter — second actif", moment: "Matin", categories: ["serums", "anti-taches"], budgets: ["complet"] },
    { nom: "Hydrater", moment: "Matin et soir", categories: ["cremes"], budgets: ["confort", "complet"] },
    { nom: "Protéger", moment: "Matin, en dernier", categories: ["protections-solaires"], budgets: ["essentiel", "confort", "complet"] },
  ],
  cheveux: [
    { nom: "Laver", moment: "1 fois par semaine", categories: ["shampooings"], budgets: ["essentiel", "confort", "complet"] },
    { nom: "Nourrir", moment: "Après chaque lavage", categories: ["soins-sans-rincage"], budgets: ["essentiel", "confort", "complet"] },
    { nom: "Fortifier", moment: "2 à 3 fois par semaine", categories: ["huiles"], budgets: ["confort", "complet"] },
    { nom: "Coiffer", moment: "Selon vos coiffures", categories: ["soins-sans-rincage"], budgets: ["complet"] },
  ],
};

export type Reponses = Record<string, string[]>;
export type EtapeRoutine = { etape: string; moment: string; produit: Produit };

export function aUneAlerte(domaine: Domaine, reponses: Reponses) {
  return QUESTIONS[domaine].some((q) =>
    q.options.some((o) => o.alerte && reponses[q.id]?.includes(o.valeur)),
  );
}

export function construireRoutine(domaine: Domaine, reponses: Reponses): EtapeRoutine[] {
  const type = reponses.type?.[0];
  const besoins = (reponses.preoccupation ?? []) as Besoin[];
  const sensible = reponses.sensibilite?.[0] === "oui";
  const budget = (reponses.budget?.[0] ?? "essentiel") as Budget;
  const dejaPris = new Set<string>();

  function score(p: Produit) {
    let s = 0;
    s += p.besoins.filter((b) => besoins.includes(b)).length * 3;
    if (domaine === "peau" && type && p.peau?.includes(type as TypePeau)) s += 2;
    if (domaine === "cheveux" && type && p.cheveux?.includes(type as TypeCheveux)) s += 2;
    if (sensible && p.peau?.includes("sensible")) s += 2;
    if (p.stock > 0) s += 1;
    return s + p.ventes / 10000;
  }

  const routine: EtapeRoutine[] = [];
  for (const etape of ETAPES[domaine]) {
    if (!etape.budgets.includes(budget)) continue;
    const candidats = PRODUITS.filter(
      (p) => etape.categories.includes(p.categorie) && !dejaPris.has(p.slug) && p.stock > 0,
    ).sort((a, b) => score(b) - score(a));
    const choix = candidats[0];
    if (!choix) continue;
    dejaPris.add(choix.slug);
    routine.push({ etape: etape.nom, moment: etape.moment, produit: choix });
  }
  return routine;
}
