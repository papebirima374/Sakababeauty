// Articles utilisés par l'espace gestion (caisse et tableau de bord de
// démonstration), selon la boutique active. Prix, stocks et ventes : EXEMPLES.
import { PRODUITS, nomMarque } from "./catalogue";

export type ArticleGestion = {
  id: string;
  nom: string;
  marqueNom: string;
  categorie: string;
  prix: number;
  stock: number;
  ventes: number;
  image?: string;
};

// Américain Store : produits vus sur son TikTok @boutiquepacha (28/09/2026).
// Seuls Cetaphil (8 000 F) et la crème mains (7 000 F) ont un prix annoncé en
// vidéo ; les autres prix, les stocks et les ventes sont inventés pour la démo.
const a = (id: string, marqueNom: string, nom: string, categorie: string, prix: number, stock: number, ventes: number): ArticleGestion => ({
  id, nom, marqueNom, categorie, prix, stock, ventes,
});
const PACHA: ArticleGestion[] = [
  a("garnier-body-uree", "Garnier", "Body Urée lait-crème", "Soins", 6500, 18, 140),
  a("mixa-urea-cica", "Mixa", "Crème Urea Cica Repair+", "Soins", 7500, 12, 165),
  a("mixa-baume-cica", "Mixa", "Baume Cica+", "Soins", 5500, 4, 98),
  a("evoluderm-serum-vitc", "Evoluderm", "Sérum vitamine C", "Soins", 6000, 9, 187),
  a("evoluderm-lait-vitc", "Evoluderm", "Lait corps vitamine C", "Soins", 6500, 15, 120),
  a("cetaphil-nettoyant", "Cetaphil", "Nettoyant doux", "Soins", 8000, 22, 210),
  a("vaseline-savon", "Vaseline", "Savon Healthy Bright (lot de 3)", "Soins", 3500, 30, 176),
  a("nzsc-savon-kojic", "New Zealand Skin Clinic", "Savon acide kojique & curcuma", "Soins", 4000, 0, 88),
  a("creme-mains", "Hand Cream", "Crème mains", "Soins", 7000, 14, 64),
  a("vital-proteins-collagene", "Vital Proteins", "Collagène peptides", "Compléments", 18000, 6, 57),
  a("mivolis-vitc", "Mivolis", "Vitamine C effervescente", "Compléments", 2500, 40, 132),
  a("mivolis-b12", "Mivolis", "Vitamine B12 effervescente", "Compléments", 2500, 25, 71),
  a("mivolis-fer", "Mivolis", "Fer + vitamine C effervescent", "Compléments", 2500, 3, 49),
  a("baskets-camel-40", "Mode", "Baskets cuir camel · P.40", "Chaussures", 20000, 2, 23),
  a("tshirt-los-angeles", "Mode", "T-shirt Los Angeles turquoise · M", "Vêtements", 7000, 8, 41),
  a("cargo-beige", "Mode", "Pantalon cargo beige · 38", "Vêtements", 15000, 5, 19),
  a("jean-short", "Mode", "Short en jean · 36", "Vêtements", 10000, 7, 27),
  a("sac-dos-camel", "Mode", "Sac à dos matelassé camel", "Sacs", 18000, 4, 33),
];

// Condition sur la variable elle-même : la construction ne garde qu'une liste.
export const ARTICLES_GESTION: ArticleGestion[] =
  process.env.NEXT_PUBLIC_BOUTIQUE === "pacha"
    ? PACHA
    : PRODUITS.map((p) => ({
  id: p.slug,
  nom: p.nom,
  marqueNom: nomMarque(p.marque),
  categorie: p.univers,
  prix: p.prix,
  stock: p.stock,
  ventes: p.ventes,
  image: p.image,
}));
