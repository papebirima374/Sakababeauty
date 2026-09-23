import type { Metadata } from "next";
import Link from "next/link";
import { MARQUES, PRODUITS } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Nos marques",
  description: "Toutes les marques américaines authentiques disponibles chez Sakaba Beauty à Dakar.",
};

export default function Marques() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="titre text-4xl md:text-5xl">Nos marques</h1>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...MARQUES].sort((a, b) => a.nom.localeCompare(b.nom)).map((m) => {
          const nb = PRODUITS.filter((p) => p.marque === m.slug).length;
          return (
            <Link key={m.slug} href={`/marques/${m.slug}`} className="rounded-2xl border border-bordure p-5 hover:border-or hover:bg-creme">
              <p className="titre text-2xl">{m.nom}</p>
              <p className="text-sm text-gris mt-1 line-clamp-2">{m.histoire}</p>
              <p className="text-sm font-semibold text-or mt-3">{nb} produit{nb > 1 ? "s" : ""} →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
