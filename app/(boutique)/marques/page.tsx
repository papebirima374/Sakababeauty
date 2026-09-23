import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BandeauPage from "@/components/BandeauPage";
import { MARQUES, PRODUITS } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Nos marques",
  description: "Toutes les marques américaines authentiques disponibles chez Sakaba Beauty à Dakar.",
};

export default function Marques() {
  return (
    <>
      <BandeauPage surtitre="Sakaba Beauty" titre="Nos marques" texte="Les grandes marques américaines, importées directement des États-Unis." />
      <div className="mx-auto max-w-6xl px-4 py-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...MARQUES].sort((a, b) => a.nom.localeCompare(b.nom)).map((m) => {
          const produits = PRODUITS.filter((p) => p.marque === m.slug);
          const photo = produits.find((p) => p.image)?.image;
          return (
            <Link key={m.slug} href={`/marques/${m.slug}`} className="group flex gap-4 items-center rounded-3xl bg-white p-4 ring-1 ring-bordure/70 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-28px_rgba(20,16,11,0.5)]">
              <span className="relative w-20 h-20 shrink-0 rounded-2xl bg-creme overflow-hidden">
                {photo && <Image src={photo} alt="" fill sizes="80px" className="object-contain p-2 transition duration-500 group-hover:scale-110" />}
              </span>
              <span className="min-w-0">
                <span className="block titre text-2xl">{m.nom}</span>
                <span className="block text-sm text-gris line-clamp-2">{m.histoire}</span>
                <span className="block text-sm font-semibold text-or mt-1">{produits.length} produit{produits.length > 1 ? "s" : ""} →</span>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
