"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BESOINS,
  MARQUES,
  PRODUITS,
  TYPES_CHEVEUX,
  TYPES_PEAU,
  type Besoin,
  type Produit,
  type TypeCheveux,
  type TypePeau,
} from "@/lib/catalogue";
import CarteProduit from "./CarteProduit";

const TRIS = {
  pertinence: "Pertinence",
  ventes: "Meilleures ventes",
  nouveautes: "Nouveautés",
  "prix-croissant": "Prix croissant",
  "prix-decroissant": "Prix décroissant",
  notes: "Mieux notés",
} as const;
type Tri = keyof typeof TRIS;

const BUDGETS = [
  { id: "moins-7500", nom: "Moins de 7 500 F", min: 0, max: 7499 },
  { id: "7500-12000", nom: "7 500 à 12 000 F", min: 7500, max: 12000 },
  { id: "plus-12000", nom: "Plus de 12 000 F", min: 12001, max: Infinity },
];

type Filtres = {
  marques: string[];
  peau: TypePeau[];
  cheveux: TypeCheveux[];
  besoins: Besoin[];
  budget: string | null;
  enStock: boolean;
  nouveautes: boolean;
};

const VIDE: Filtres = { marques: [], peau: [], cheveux: [], besoins: [], budget: null, enStock: false, nouveautes: false };

function correspond(p: Produit, f: Filtres) {
  if (f.marques.length && !f.marques.includes(p.marque)) return false;
  if (f.peau.length && !f.peau.some((t) => p.peau?.includes(t))) return false;
  if (f.cheveux.length && !f.cheveux.some((t) => p.cheveux?.includes(t))) return false;
  if (f.besoins.length && !f.besoins.some((b) => p.besoins.includes(b))) return false;
  if (f.budget) {
    const b = BUDGETS.find((x) => x.id === f.budget);
    if (b && (p.prix < b.min || p.prix > b.max)) return false;
  }
  if (f.enStock && p.stock <= 0) return false;
  if (f.nouveautes && !p.nouveaute) return false;
  return true;
}

function trier(liste: Produit[], tri: Tri) {
  const copie = [...liste];
  switch (tri) {
    case "ventes":
      return copie.sort((a, b) => b.ventes - a.ventes);
    case "nouveautes":
      return copie.sort((a, b) => Number(b.nouveaute ?? false) - Number(a.nouveaute ?? false));
    case "prix-croissant":
      return copie.sort((a, b) => a.prix - b.prix);
    case "prix-decroissant":
      return copie.sort((a, b) => b.prix - a.prix);
    case "notes":
      return copie.sort((a, b) => b.note - a.note);
    default:
      return copie;
  }
}

export default function ListeProduits({ produits }: { produits: Produit[] }) {
  const [filtres, setFiltres] = useState<Filtres>(VIDE);
  const [tri, setTri] = useState<Tri>("pertinence");
  const [panneauOuvert, setPanneauOuvert] = useState(false);

  const resultats = useMemo(
    () => trier(produits.filter((p) => correspond(p, filtres)), tri),
    [produits, filtres, tri],
  );

  // N'afficher que les options utiles à cette liste.
  const marquesPresentes = MARQUES.filter((m) => produits.some((p) => p.marque === m.slug));
  const peauxPresentes = (Object.keys(TYPES_PEAU) as TypePeau[]).filter((t) => produits.some((p) => p.peau?.includes(t)));
  const cheveuxPresents = (Object.keys(TYPES_CHEVEUX) as TypeCheveux[]).filter((t) => produits.some((p) => p.cheveux?.includes(t)));
  const besoinsPresents = (Object.keys(BESOINS) as Besoin[]).filter((b) => produits.some((p) => p.besoins.includes(b)));

  function basculer<K extends "marques" | "peau" | "cheveux" | "besoins">(cle: K, valeur: Filtres[K][number]) {
    setFiltres((f) => {
      const liste = f[cle] as string[];
      const nouvelle = liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];
      return { ...f, [cle]: nouvelle };
    });
  }

  const nbFiltres =
    filtres.marques.length + filtres.peau.length + filtres.cheveux.length + filtres.besoins.length +
    (filtres.budget ? 1 : 0) + (filtres.enStock ? 1 : 0) + (filtres.nouveautes ? 1 : 0);

  const groupe = (titre: string, contenu: React.ReactNode) => (
    <fieldset className="border-b border-bordure pb-4 mb-4">
      <legend className="font-semibold text-sm mb-2">{titre}</legend>
      <div className="flex flex-wrap gap-2">{contenu}</div>
    </fieldset>
  );

  const puce = (actif: boolean, libelle: string, action: () => void, cle: string) => (
    <button
      key={cle}
      type="button"
      onClick={action}
      aria-pressed={actif}
      className={`rounded-full border px-3 py-1.5 text-sm ${actif ? "bg-noir text-white border-noir" : "border-bordure hover:border-or"}`}
    >
      {libelle}
    </button>
  );

  const panneau = (
    <div>
      {besoinsPresents.length > 0 &&
        groupe("Besoin", besoinsPresents.map((b) => puce(filtres.besoins.includes(b), BESOINS[b], () => basculer("besoins", b), b)))}
      {peauxPresentes.length > 0 &&
        groupe("Type de peau", peauxPresentes.map((t) => puce(filtres.peau.includes(t), TYPES_PEAU[t], () => basculer("peau", t), t)))}
      {cheveuxPresents.length > 0 &&
        groupe("Type de cheveux", cheveuxPresents.map((t) => puce(filtres.cheveux.includes(t), TYPES_CHEVEUX[t], () => basculer("cheveux", t), t)))}
      {groupe("Marque", marquesPresentes.map((m) => puce(filtres.marques.includes(m.slug), m.nom, () => basculer("marques", m.slug), m.slug)))}
      {groupe(
        "Budget",
        BUDGETS.map((b) =>
          puce(filtres.budget === b.id, b.nom, () => setFiltres((f) => ({ ...f, budget: f.budget === b.id ? null : b.id })), b.id),
        ),
      )}
      {groupe("Disponibilité", [
        puce(filtres.enStock, "En stock", () => setFiltres((f) => ({ ...f, enStock: !f.enStock })), "stock"),
        puce(filtres.nouveautes, "Nouveautés", () => setFiltres((f) => ({ ...f, nouveautes: !f.nouveautes })), "nouv"),
      ])}
      {nbFiltres > 0 && (
        <button type="button" onClick={() => setFiltres(VIDE)} className="text-sm font-semibold text-or underline">
          Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
      <aside className="hidden md:block">{panneau}</aside>

      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-sm text-gris" aria-live="polite">
            <strong className="text-noir prix">{resultats.length}</strong> produit{resultats.length > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanneauOuvert((o) => !o)}
              className="md:hidden rounded-full border border-bordure px-4 py-2 text-sm font-semibold"
            >
              Filtrer{nbFiltres > 0 ? ` (${nbFiltres})` : ""}
            </button>
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as Tri)}
              aria-label="Trier"
              className="rounded-full border border-bordure bg-white px-3 py-2 text-sm"
            >
              {(Object.keys(TRIS) as Tri[]).map((t) => (
                <option key={t} value={t}>{TRIS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        {panneauOuvert && (
          <div className="md:hidden mb-6 rounded-2xl border border-bordure p-4 bg-creme">
            {panneau}
            <button type="button" onClick={() => setPanneauOuvert(false)} className="mt-2 w-full rounded-full bg-noir text-white py-2.5 font-semibold">
              Voir les {resultats.length} produits
            </button>
          </div>
        )}

        {resultats.length === 0 ? (
          <div className="rounded-2xl bg-creme p-8 text-center">
            <p className="titre text-2xl">Aucun produit ne correspond à tous ces critères.</p>
            <p className="text-gris mt-2">Retirez un filtre, ou laissez-nous vous conseiller.</p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <button type="button" onClick={() => setFiltres(VIDE)} className="rounded-full border border-noir px-5 py-2.5 font-semibold">
                Effacer les filtres
              </button>
              <Link href="/diagnostic" className="rounded-full bg-or text-white px-5 py-2.5 font-semibold">
                Faire le diagnostic beauté
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {[...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 4).map((p) => (
                <CarteProduit key={p.slug} produit={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {resultats.map((p) => (
              <CarteProduit key={p.slug} produit={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
