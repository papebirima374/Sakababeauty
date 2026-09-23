import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MARQUES, PRODUITS, marqueParSlug } from "@/lib/catalogue";
import ListeProduits from "@/components/ListeProduits";

export const dynamicParams = false;

export function generateStaticParams() {
  return MARQUES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/marques/[slug]">): Promise<Metadata> {
  const m = marqueParSlug((await params).slug);
  if (!m) return {};
  return {
    title: `${m.nom} Dakar — produits authentiques`,
    description: `${m.nom} authentique, importé des USA. ${m.histoire} Disponible chez Sakaba Beauty, Mermoz.`,
    alternates: { canonical: `/marques/${m.slug}` },
  };
}

export default async function PageMarque({ params }: PageProps<"/marques/[slug]">) {
  const m = marqueParSlug((await params).slug);
  if (!m) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-gris" aria-label="Fil d'Ariane">
        <Link href="/marques" className="hover:text-or">Marques</Link> / {m.nom}
      </nav>
      <h1 className="titre text-4xl md:text-5xl mt-2">{m.nom}</h1>
      <p className="text-gris mt-3 max-w-2xl mb-8">{m.histoire}</p>
      <ListeProduits produits={PRODUITS.filter((p) => p.marque === m.slug)} />
    </div>
  );
}
