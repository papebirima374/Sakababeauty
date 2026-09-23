"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { produitParSlug, type Produit } from "./catalogue";

// Panier conservé dans le navigateur entre deux visites.
// Plus tard : rattaché au compte pour suivre la cliente d'un appareil à l'autre (§9.3).

type Ligne = { slug: string; quantite: number };
type LigneComplete = Ligne & { produit: Produit };

type Panier = {
  lignes: LigneComplete[];
  nombre: number;
  sousTotal: number;
  ajouter: (slug: string, quantite?: number) => void;
  modifier: (slug: string, quantite: number) => void;
  retirer: (slug: string) => void;
  vider: () => void;
};

const CLE = "sakaba-panier";
const Contexte = createContext<Panier | null>(null);

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au démarrage
      if (brut) setLignes(JSON.parse(brut));
    } catch {}
    setCharge(true);
  }, []);

  useEffect(() => {
    if (!charge) return;
    try {
      localStorage.setItem(CLE, JSON.stringify(lignes));
    } catch {}
  }, [lignes, charge]);

  const valeur = useMemo<Panier>(() => {
    const completes = lignes
      .map((l) => ({ ...l, produit: produitParSlug(l.slug) }))
      .filter((l): l is LigneComplete => Boolean(l.produit));
    return {
      lignes: completes,
      nombre: completes.reduce((t, l) => t + l.quantite, 0),
      sousTotal: completes.reduce((t, l) => t + l.quantite * l.produit.prix, 0),
      ajouter: (slug, quantite = 1) =>
        setLignes((prec) => {
          const stock = produitParSlug(slug)?.stock ?? 0;
          const existante = prec.find((l) => l.slug === slug);
          if (existante)
            return prec.map((l) =>
              l.slug === slug ? { ...l, quantite: Math.min(stock, l.quantite + quantite) } : l,
            );
          return [...prec, { slug, quantite: Math.min(stock, quantite) }];
        }),
      modifier: (slug, quantite) =>
        setLignes((prec) =>
          quantite <= 0
            ? prec.filter((l) => l.slug !== slug)
            : prec.map((l) =>
                l.slug === slug
                  ? { ...l, quantite: Math.min(produitParSlug(slug)?.stock ?? 0, quantite) }
                  : l,
              ),
        ),
      retirer: (slug) => setLignes((prec) => prec.filter((l) => l.slug !== slug)),
      vider: () => setLignes([]),
    };
  }, [lignes]);

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function usePanier() {
  const panier = useContext(Contexte);
  if (!panier) throw new Error("usePanier doit être utilisé dans PanierProvider");
  return panier;
}
