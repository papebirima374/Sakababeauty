import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUITS, UNIVERS, universParSlug } from "@/lib/catalogue";
import ListeProduits from "@/components/ListeProduits";

// Adresses lisibles et stables : /soin-visage, /soin-visage/serums (§11.1).
export const dynamicParams = false;

export function generateStaticParams() {
  return UNIVERS.map((u) => ({ univers: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[univers]">): Promise<Metadata> {
  const u = universParSlug((await params).univers);
  if (!u) return {};
  return {
    title: `${u.nom} authentiques à Dakar`,
    description: `${u.accroche}. Produits 100 % authentiques importés des USA, prix affichés, livraison à Dakar.`,
    alternates: { canonical: `/${u.slug}` },
  };
}

export default async function PageUnivers({ params }: PageProps<"/[univers]">) {
  const u = universParSlug((await params).univers);
  if (!u) notFound();
  const produits = PRODUITS.filter((p) => p.univers === u.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-gris" aria-label="Fil d'Ariane">
        <Link href="/boutique" className="hover:text-or">Boutique</Link> / {u.nom}
      </nav>
      <h1 className="titre text-4xl md:text-5xl mt-2">{u.nom}</h1>
      <p className="text-gris mt-2">{u.accroche}</p>
      {u.categories.length > 1 && (
        <div className="mt-5 mb-8 flex gap-2 overflow-x-auto pb-1">
          {u.categories.map((c) => (
            <Link key={c.slug} href={`/${u.slug}/${c.slug}`} className="shrink-0 rounded-full border border-bordure px-4 py-2 text-sm font-semibold hover:border-or">
              {c.nom}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-6">
        <ListeProduits produits={produits} />
      </div>
    </div>
  );
}
