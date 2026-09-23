import type { Metadata } from "next";
import Link from "next/link";
import { PRODUITS, UNIVERS } from "@/lib/catalogue";
import ListeProduits from "@/components/ListeProduits";

export const metadata: Metadata = {
  title: "Toute la boutique",
  description: "Tous les soins, maquillages et parfums authentiques de Sakaba Beauty, avec prix et disponibilité.",
};

export default function Boutique() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="titre text-4xl md:text-5xl">Toute la boutique</h1>
      <div className="mt-4 mb-8 flex gap-2 overflow-x-auto pb-1">
        {UNIVERS.map((u) => (
          <Link key={u.slug} href={`/${u.slug}`} className="shrink-0 rounded-full border border-bordure px-4 py-2 text-sm font-semibold hover:border-or">
            {u.nom}
          </Link>
        ))}
      </div>
      <ListeProduits produits={PRODUITS} />
    </div>
  );
}
