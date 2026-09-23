// Catalogue de démonstration. Les produits, prix et stocks ci-dessous sont des
// EXEMPLES pour tester le site : ils seront remplacés par l'export des 2 700
// références de WooCommerce (cahier des charges §19), puis servis par Firestore.

export type Univers = {
  slug: string;
  nom: string;
  accroche: string;
  categories: { slug: string; nom: string }[];
};

export const UNIVERS: Univers[] = [
  {
    slug: "soin-visage",
    nom: "Soin du visage",
    accroche: "Nettoyants, sérums, crèmes et protections solaires",
    categories: [
      { slug: "nettoyants", nom: "Nettoyants" },
      { slug: "serums", nom: "Sérums" },
      { slug: "cremes", nom: "Crèmes" },
      { slug: "protections-solaires", nom: "Protections solaires" },
      { slug: "anti-taches", nom: "Anti-taches" },
    ],
  },
  {
    slug: "soin-corps",
    nom: "Soin du corps",
    accroche: "Laits, beurres et huiles pour une peau nourrie",
    categories: [{ slug: "laits-corps", nom: "Laits et crèmes" }],
  },
  {
    slug: "cheveux",
    nom: "Cheveux",
    accroche: "Soins pour cheveux crépus, bouclés et frisés",
    categories: [
      { slug: "shampooings", nom: "Shampooings" },
      { slug: "soins-sans-rincage", nom: "Soins sans rinçage" },
      { slug: "huiles", nom: "Huiles" },
    ],
  },
  {
    slug: "maquillage",
    nom: "Maquillage",
    accroche: "Teint, lèvres et regard",
    categories: [
      { slug: "teint", nom: "Teint" },
      { slug: "levres", nom: "Lèvres" },
    ],
  },
  {
    slug: "parfums",
    nom: "Parfums",
    accroche: "Brumes et eaux parfumées originales",
    categories: [{ slug: "brumes", nom: "Brumes parfumées" }],
  },
  {
    slug: "homme-barbe",
    nom: "Homme & barbe",
    accroche: "Soins de la barbe et du visage",
    categories: [{ slug: "barbe", nom: "Barbe" }],
  },
  {
    slug: "enfants",
    nom: "Enfants",
    accroche: "Des soins doux pour les plus jeunes",
    categories: [{ slug: "cheveux-enfants", nom: "Cheveux" }],
  },
];

export const TYPES_PEAU = {
  grasse: "Grasse",
  mixte: "Mixte",
  seche: "Sèche",
  normale: "Normale",
  sensible: "Sensible",
} as const;

export const TYPES_CHEVEUX = {
  crepus: "Crépus",
  boucles: "Bouclés",
  frises: "Frisés",
  secs: "Secs",
  abimes: "Abîmés",
} as const;

export const BESOINS = {
  taches: "Taches",
  acne: "Imperfections",
  hydratation: "Hydratation",
  eclat: "Éclat",
  pores: "Pores",
  "protection-solaire": "Protection solaire",
  "cheveux-secs": "Cheveux secs",
  casse: "Casse",
  pousse: "Pousse",
  definition: "Définition des boucles",
  nutrition: "Nutrition du corps",
  vergetures: "Vergetures",
  teint: "Teint",
  levres: "Lèvres",
  parfum: "Parfum",
  barbe: "Barbe",
} as const;

export type TypePeau = keyof typeof TYPES_PEAU;
export type TypeCheveux = keyof typeof TYPES_CHEVEUX;
export type Besoin = keyof typeof BESOINS;

export type Produit = {
  slug: string;
  nom: string;
  marque: string; // slug de la marque
  univers: string;
  categorie: string;
  prix: number;
  prixBarre?: number;
  stock: number;
  contenance: string;
  peau?: TypePeau[];
  cheveux?: TypeCheveux[];
  besoins: Besoin[];
  accroche: string;
  description: string;
  utilisation: string;
  actifs: string[];
  peremption: string; // mois/année, exemple
  lot?: string;
  routine: string[]; // produits qui s'utilisent avec celui-ci
  nouveaute?: boolean;
  ventes: number; // sert au tri « meilleures ventes »
  note: number;
  avis: number;
  teinte?: string; // couleur du visuel provisoire
  image?: string; // photo dans public/produits/, ex. "/produits/cerave-nettoyant.webp"
};

export type Marque = { slug: string; nom: string; histoire: string };

export const MARQUES: Marque[] = [
  { slug: "cerave", nom: "CeraVe", histoire: "Marque américaine développée avec des dermatologues, connue pour ses soins aux céramides qui respectent la barrière de la peau." },
  { slug: "the-ordinary", nom: "The Ordinary", histoire: "Des actifs clairement dosés, sans artifice, pour composer sa routine pièce par pièce." },
  { slug: "neutrogena", nom: "Neutrogena", histoire: "Une référence des soins du quotidien aux États-Unis depuis des décennies." },
  { slug: "palmers", nom: "Palmer's", histoire: "Le beurre de cacao et de karité au service des peaux qui ont besoin d'être nourries." },
  { slug: "black-girl-sunscreen", nom: "Black Girl Sunscreen", histoire: "Des protections solaires pensées pour ne laisser aucun voile blanc sur les peaux foncées." },
  { slug: "shea-moisture", nom: "SheaMoisture", histoire: "Des soins au beurre de karité pour les cheveux texturés et les peaux sèches." },
  { slug: "mielle", nom: "Mielle", histoire: "Soins capillaires pour cheveux naturels, célèbres pour leur huile au romarin et à la menthe." },
  { slug: "cantu", nom: "Cantu", histoire: "Des soins au karité accessibles pour cheveux bouclés, frisés et crépus, pour toute la famille." },
  { slug: "nyx", nom: "NYX Professional Makeup", histoire: "Un maquillage aux couleurs généreuses, adopté par les maquilleuses du monde entier." },
  { slug: "maybelline", nom: "Maybelline New York", histoire: "Le teint et le regard, avec des nuances pour toutes les carnations." },
  { slug: "bath-body-works", nom: "Bath & Body Works", histoire: "Des brumes et soins parfumés aux senteurs qui durent." },
];

export const PRODUITS: Produit[] = [
  {
    slug: "cerave-nettoyant-hydratant-236ml",
    nom: "Nettoyant hydratant",
    marque: "cerave",
    univers: "soin-visage",
    categorie: "nettoyants",
    prix: 11500,
    stock: 24,
    contenance: "236 ml",
    peau: ["seche", "normale", "sensible"],
    besoins: ["hydratation"],
    accroche: "Nettoie sans tirer ni dessécher.",
    description: "Un nettoyant crème non moussant qui retire les impuretés et le maquillage léger tout en respectant la barrière de la peau. Pour les peaux normales à sèches, y compris sensibles.",
    utilisation: "Matin et soir, sur peau humide. Masser doucement, puis rincer à l'eau tiède.",
    actifs: ["Céramides", "Acide hyaluronique"],
    peremption: "08/2028",
    lot: "Exemple : 5241A",
    routine: ["the-ordinary-acide-hyaluronique-30ml", "cerave-creme-hydratante-340g", "black-girl-sunscreen-spf30-88ml"],
    ventes: 940,
    note: 4.8,
    avis: 126,
    teinte: "#DCE8EE",
  },
  {
    slug: "cerave-creme-hydratante-340g",
    nom: "Crème hydratante",
    marque: "cerave",
    univers: "soin-visage",
    categorie: "cremes",
    prix: 14500,
    stock: 15,
    contenance: "340 g",
    peau: ["seche", "normale", "sensible"],
    besoins: ["hydratation"],
    accroche: "Hydrate 24 h, visage et corps.",
    description: "Une crème riche et non grasse pour le visage et le corps, qui aide à restaurer la barrière protectrice de la peau.",
    utilisation: "Appliquer généreusement sur le visage et le corps, matin et soir.",
    actifs: ["Céramides", "Acide hyaluronique"],
    peremption: "03/2028",
    routine: ["cerave-nettoyant-hydratant-236ml", "black-girl-sunscreen-spf30-88ml"],
    ventes: 870,
    note: 4.9,
    avis: 98,
    teinte: "#E4EEF2",
  },
  {
    slug: "the-ordinary-niacinamide-zinc-30ml",
    nom: "Niacinamide 10 % + Zinc 1 %",
    marque: "the-ordinary",
    univers: "soin-visage",
    categorie: "serums",
    prix: 9000,
    stock: 31,
    contenance: "30 ml",
    peau: ["grasse", "mixte"],
    besoins: ["acne", "pores", "taches"],
    accroche: "Pores resserrés, teint plus uniforme.",
    description: "Un sérum léger qui aide à réguler l'aspect brillant, à affiner le grain de peau et à uniformiser le teint.",
    utilisation: "Quelques gouttes matin et/ou soir sur peau propre, avant la crème.",
    actifs: ["Niacinamide", "Zinc PCA"],
    peremption: "11/2027",
    routine: ["neutrogena-hydro-boost-gel-50ml", "black-girl-sunscreen-spf30-88ml"],
    nouveaute: false,
    ventes: 1120,
    note: 4.7,
    avis: 211,
    teinte: "#EFEDE8",
  },
  {
    slug: "the-ordinary-acide-hyaluronique-30ml",
    nom: "Acide hyaluronique 2 % + B5",
    marque: "the-ordinary",
    univers: "soin-visage",
    categorie: "serums",
    prix: 9500,
    stock: 18,
    contenance: "30 ml",
    peau: ["seche", "normale", "mixte", "sensible"],
    besoins: ["hydratation", "eclat"],
    accroche: "Une peau repulpée et désaltérée.",
    description: "Un sérum hydratant qui aide la peau à retenir l'eau pour un aspect plus lisse et plus frais.",
    utilisation: "Quelques gouttes sur peau légèrement humide, matin et soir, avant la crème.",
    actifs: ["Acide hyaluronique", "Vitamine B5"],
    peremption: "01/2028",
    routine: ["cerave-nettoyant-hydratant-236ml", "cerave-creme-hydratante-340g"],
    ventes: 760,
    note: 4.6,
    avis: 84,
    teinte: "#EAF0EC",
  },
  {
    slug: "neutrogena-hydro-boost-gel-50ml",
    nom: "Hydro Boost gel-crème",
    marque: "neutrogena",
    univers: "soin-visage",
    categorie: "cremes",
    prix: 13000,
    stock: 0,
    contenance: "50 ml",
    peau: ["grasse", "mixte", "normale"],
    besoins: ["hydratation"],
    accroche: "L'hydratation sans effet gras.",
    description: "Un gel-crème frais qui hydrate intensément et pénètre vite, idéal sous le climat de Dakar.",
    utilisation: "Matin et soir sur peau propre.",
    actifs: ["Acide hyaluronique"],
    peremption: "06/2027",
    routine: ["the-ordinary-niacinamide-zinc-30ml", "black-girl-sunscreen-spf30-88ml"],
    ventes: 640,
    note: 4.6,
    avis: 73,
    teinte: "#DDE6F4",
  },
  {
    slug: "palmers-serum-anti-taches-30ml",
    nom: "Skin Success sérum anti-taches",
    marque: "palmers",
    univers: "soin-visage",
    categorie: "anti-taches",
    prix: 8500,
    stock: 12,
    contenance: "30 ml",
    peau: ["normale", "mixte", "grasse", "seche"],
    besoins: ["taches", "eclat"],
    accroche: "Pour un teint plus uniforme, sans agresser.",
    description: "Un sérum qui aide à atténuer l'apparence des taches brunes et à unifier le teint. Toujours associer à une protection solaire le matin.",
    utilisation: "Le soir sur peau propre, en évitant le contour des yeux. Protection solaire indispensable le lendemain.",
    actifs: ["Niacinamide", "Vitamine C"],
    peremption: "09/2027",
    routine: ["cerave-nettoyant-hydratant-236ml", "black-girl-sunscreen-spf30-88ml"],
    nouveaute: true,
    ventes: 510,
    note: 4.4,
    avis: 57,
    teinte: "#F3E6D8",
  },
  {
    slug: "black-girl-sunscreen-spf30-88ml",
    nom: "Protection solaire SPF 30",
    marque: "black-girl-sunscreen",
    univers: "soin-visage",
    categorie: "protections-solaires",
    prix: 12500,
    stock: 9,
    contenance: "88 ml",
    peau: ["normale", "mixte", "seche", "grasse"],
    besoins: ["protection-solaire", "taches"],
    accroche: "Zéro trace blanche sur peau foncée.",
    description: "Une protection solaire hydratante et invisible. L'étape indispensable de toute routine anti-taches.",
    utilisation: "Chaque matin en dernière étape, 15 minutes avant l'exposition. Renouveler dans la journée.",
    actifs: ["Filtres solaires", "Avocat", "Jojoba"],
    peremption: "04/2027",
    routine: ["palmers-serum-anti-taches-30ml", "cerave-creme-hydratante-340g"],
    nouveaute: true,
    ventes: 690,
    note: 4.8,
    avis: 102,
    teinte: "#F6E7C8",
  },
  {
    slug: "palmers-lait-beurre-cacao-400ml",
    nom: "Lait au beurre de cacao",
    marque: "palmers",
    univers: "soin-corps",
    categorie: "laits-corps",
    prix: 6500,
    stock: 40,
    contenance: "400 ml",
    peau: ["seche", "normale"],
    besoins: ["nutrition", "vergetures"],
    accroche: "Une peau nourrie et douce toute la journée.",
    description: "Le lait corps emblématique au beurre de cacao et à la vitamine E, pour les peaux sèches.",
    utilisation: "Appliquer sur tout le corps après la douche.",
    actifs: ["Beurre de cacao", "Vitamine E"],
    peremption: "12/2027",
    routine: [],
    ventes: 820,
    note: 4.7,
    avis: 143,
    teinte: "#EAD7C3",
  },
  {
    slug: "shea-moisture-curl-smoothie-340g",
    nom: "Curl Enhancing Smoothie",
    marque: "shea-moisture",
    univers: "cheveux",
    categorie: "soins-sans-rincage",
    prix: 10500,
    stock: 20,
    contenance: "340 g",
    cheveux: ["boucles", "frises", "crepus"],
    besoins: ["definition", "cheveux-secs"],
    accroche: "Des boucles définies et sans frisottis.",
    description: "Une crème coiffante au beurre de karité et à l'huile de coco qui définit les boucles et limite les frisottis.",
    utilisation: "Sur cheveux propres et humides, mèche par mèche. Laisser sécher à l'air libre.",
    actifs: ["Beurre de karité", "Huile de coco"],
    peremption: "05/2028",
    routine: ["shea-moisture-shampooing-jbco-384ml", "mielle-huile-romarin-menthe-59ml"],
    ventes: 780,
    note: 4.7,
    avis: 119,
    teinte: "#F1E3CF",
  },
  {
    slug: "shea-moisture-shampooing-jbco-384ml",
    nom: "Shampooing fortifiant à l'huile de ricin noir",
    marque: "shea-moisture",
    univers: "cheveux",
    categorie: "shampooings",
    prix: 10000,
    stock: 14,
    contenance: "384 ml",
    cheveux: ["crepus", "abimes", "secs"],
    besoins: ["casse", "cheveux-secs"],
    accroche: "Nettoie en douceur les cheveux fragilisés.",
    description: "Un shampooing qui nettoie sans assécher et aide à renforcer les cheveux sujets à la casse.",
    utilisation: "Masser sur cheveux mouillés, rincer. Suivre avec un soin sans rinçage.",
    actifs: ["Huile de ricin noir", "Beurre de karité"],
    peremption: "02/2028",
    routine: ["shea-moisture-curl-smoothie-340g", "cantu-creme-sans-rincage-453g"],
    ventes: 560,
    note: 4.6,
    avis: 66,
    teinte: "#E6DCCF",
  },
  {
    slug: "mielle-huile-romarin-menthe-59ml",
    nom: "Huile romarin & menthe",
    marque: "mielle",
    univers: "cheveux",
    categorie: "huiles",
    prix: 8000,
    stock: 3,
    contenance: "59 ml",
    cheveux: ["crepus", "boucles", "frises", "secs", "abimes"],
    besoins: ["pousse", "casse"],
    accroche: "Le rituel du cuir chevelu le plus demandé.",
    description: "Une huile fortifiante pour le cuir chevelu et les pointes, enrichie en biotine.",
    utilisation: "Quelques gouttes sur le cuir chevelu, masser 2 à 3 fois par semaine.",
    actifs: ["Romarin", "Menthe", "Biotine"],
    peremption: "10/2027",
    routine: ["shea-moisture-shampooing-jbco-384ml", "shea-moisture-curl-smoothie-340g"],
    ventes: 1250,
    note: 4.8,
    avis: 264,
    teinte: "#E4ECDA",
  },
  {
    slug: "cantu-creme-sans-rincage-453g",
    nom: "Crème réparatrice sans rinçage",
    marque: "cantu",
    univers: "cheveux",
    categorie: "soins-sans-rincage",
    prix: 7000,
    prixBarre: 8000,
    stock: 27,
    contenance: "453 g",
    cheveux: ["crepus", "secs", "abimes"],
    besoins: ["cheveux-secs", "casse"],
    accroche: "Nutrition intense pour cheveux secs.",
    description: "Le soin sans rinçage au karité qui démêle, nourrit et protège les cheveux secs et abîmés.",
    utilisation: "Sur cheveux humides ou secs, des longueurs aux pointes.",
    actifs: ["Beurre de karité"],
    peremption: "07/2028",
    routine: ["shea-moisture-shampooing-jbco-384ml", "mielle-huile-romarin-menthe-59ml"],
    ventes: 900,
    note: 4.5,
    avis: 150,
    teinte: "#F2E9D8",
  },
  {
    slug: "nyx-butter-gloss",
    nom: "Butter Gloss",
    marque: "nyx",
    univers: "maquillage",
    categorie: "levres",
    prix: 4500,
    stock: 35,
    contenance: "8 ml",
    besoins: ["levres"],
    accroche: "La brillance fondante, sans effet collant.",
    description: "Un gloss crémeux et confortable, disponible en plusieurs teintes.",
    utilisation: "Appliquer seul ou sur un crayon à lèvres.",
    actifs: [],
    peremption: "06/2028",
    routine: [],
    nouveaute: true,
    ventes: 610,
    note: 4.6,
    avis: 88,
    teinte: "#F2D7D5",
  },
  {
    slug: "maybelline-fit-me-fond-de-teint",
    nom: "Fit Me fond de teint mat",
    marque: "maybelline",
    univers: "maquillage",
    categorie: "teint",
    prix: 7500,
    stock: 16,
    contenance: "30 ml",
    peau: ["grasse", "mixte"],
    besoins: ["teint"],
    accroche: "Un fini naturel et mat, des nuances pour les peaux foncées.",
    description: "Un fond de teint qui unifie et matifie, décliné en nombreuses teintes.",
    utilisation: "Appliquer du centre du visage vers l'extérieur, au pinceau ou à l'éponge.",
    actifs: [],
    peremption: "02/2028",
    routine: [],
    ventes: 480,
    note: 4.3,
    avis: 61,
    teinte: "#D8B99A",
  },
  {
    slug: "bath-body-works-brume-a-thousand-wishes-236ml",
    nom: "Brume parfumée A Thousand Wishes",
    marque: "bath-body-works",
    univers: "parfums",
    categorie: "brumes",
    prix: 12000,
    stock: 8,
    contenance: "236 ml",
    besoins: ["parfum"],
    accroche: "Notes pétillantes et florales.",
    description: "Une brume parfumée pour le corps aux notes de champagne rosé, de pivoine et d'ambre.",
    utilisation: "Vaporiser sur la peau et les vêtements.",
    actifs: [],
    peremption: "12/2028",
    routine: [],
    ventes: 530,
    note: 4.7,
    avis: 77,
    teinte: "#F4DDE6",
  },
  {
    slug: "shea-moisture-huile-barbe-96ml",
    nom: "Huile pour barbe",
    marque: "shea-moisture",
    univers: "homme-barbe",
    categorie: "barbe",
    prix: 9500,
    stock: 6,
    contenance: "96 ml",
    besoins: ["barbe"],
    accroche: "Une barbe douce, sans démangeaisons.",
    description: "Une huile légère qui assouplit la barbe et apaise la peau en dessous.",
    utilisation: "Quelques gouttes chaque jour, masser jusqu'à la peau.",
    actifs: ["Beurre de karité", "Huile d'argan"],
    peremption: "03/2028",
    routine: [],
    ventes: 300,
    note: 4.5,
    avis: 34,
    teinte: "#E3D6C3",
  },
  {
    slug: "cantu-kids-soin-sans-rincage-283g",
    nom: "Soin sans rinçage enfants",
    marque: "cantu",
    univers: "enfants",
    categorie: "cheveux-enfants",
    prix: 6500,
    stock: 11,
    contenance: "283 g",
    cheveux: ["crepus", "boucles", "frises"],
    besoins: ["cheveux-secs", "definition"],
    accroche: "Démêlage facile, sans larmes.",
    description: "Un soin doux formulé pour les cheveux texturés des enfants.",
    utilisation: "Sur cheveux humides, démêler au peigne à dents larges.",
    actifs: ["Beurre de karité", "Huile de coco"],
    peremption: "08/2028",
    routine: [],
    ventes: 270,
    note: 4.8,
    avis: 29,
    teinte: "#E6EEE0",
  },
];

export function produitParSlug(slug: string) {
  return PRODUITS.find((p) => p.slug === slug);
}

export function marqueParSlug(slug: string) {
  return MARQUES.find((m) => m.slug === slug);
}

export function universParSlug(slug: string) {
  return UNIVERS.find((u) => u.slug === slug);
}

export function nomMarque(slug: string) {
  return marqueParSlug(slug)?.nom ?? slug;
}

export function produitsDeLaRoutine(produit: Produit) {
  return produit.routine
    .map((s) => produitParSlug(s))
    .filter((p): p is Produit => Boolean(p));
}
