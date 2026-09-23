import type { Metadata } from "next";
import Link from "next/link";
import { PRODUITS, UNIVERS } from "@/lib/catalogue";
import BandeauPage from "@/components/BandeauPage";
import ListeProduits from "@/components/ListeProduits";

export const metadata: Metadata = {
  title: "Toute la boutique",
  description: "Tous les soins, maquillages et parfums authentiques de Sakaba Beauty, avec prix et disponibilité.",
};

export default function Boutique() {
  return (
    <>
      <BandeauPage surtitre="Sakaba Beauty" titre="Toute la boutique" texte="Soins, maquillage et parfums 100 % authentiques, importés des États-Unis.">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {UNIVERS.map((u) => (
            <Link key={u.slug} href={`/${u.slug}`} className="shrink-0 rounded-full border border-creme/25 px-4 py-2 text-sm font-semibold text-creme/90 transition hover:border-or-clair hover:text-or-clair">
              {u.nom}
            </Link>
          ))}
        </div>
      </BandeauPage>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ListeProduits produits={PRODUITS} />
      </div>
    </>
  );
}
