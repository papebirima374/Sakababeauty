"use client";

import { useState } from "react";
import { PRODUITS, nomMarque } from "@/lib/catalogue";
import { ean13Interne } from "@/lib/codes-barres";
import EcranCaisse, { type Article, type Vente } from "./Caisse";

// Caisse de DÉMONSTRATION : produits du catalogue d'exemple, rien n'est enregistré.
const ARTICLES: Article[] = PRODUITS.map((p, i) => ({
  id: p.slug,
  nom: p.nom,
  marqueNom: nomMarque(p.marque),
  prix: p.prix,
  stock: p.stock,
  codeBarre: ean13Interne(i + 1),
}));

export default function CaisseDemo() {
  const [articles, setArticles] = useState(ARTICLES);
  const [ventes, setVentes] = useState<Vente[]>([]);
  function enregistrer(v: Vente) {
    setArticles((a) => a.map((x) => ({ ...x, stock: x.stock - v.lignes.filter((l) => l.id === x.id).reduce((t, l) => t + l.quantite, 0) })));
    setVentes((x) => [v, ...x]);
  }
  return <EcranCaisse articles={articles} ventes={ventes} enregistrer={enregistrer} vendeuses={["Vendeuse 1", "Vendeuse 2", "Vendeuse 3"]} />;
}
