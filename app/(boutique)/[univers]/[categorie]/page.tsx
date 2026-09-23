import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUITS, UNIVERS, universParSlug } from "@/lib/catalogue";
import ListeProduits from "@/components/ListeProduits";

export const dynamicParams = false;

export function generateStaticParams() {
  return UNIVERS.flatMap((u) => u.categories.map((c) => ({ univers: u.slug, categorie: c.slug })));
}

async function trouver(params: PageProps<"/[univers]/[categorie]">["params"]) {
  const { univers, categorie } = await params;
  const u = universParSlug(univers);
  const c = u?.categories.find((x) => x.slug === categorie);
  return u && c ? { u, c } : null;
}

export async function generateMetadata({ params }: PageProps<"/[univers]/[categorie]">): Promise<Metadata> {
  const t = await trouver(params);
  if (!t) return {};
  return {
    title: `${t.c.nom} — ${t.u.nom}`,
    description: `${t.c.nom} authentiques importés des USA chez Sakaba Beauty, Dakar. Prix et stock affichés.`,
    alternates: { canonical: `/${t.u.slug}/${t.c.slug}` },
  };
}

export default async function PageCategorie({ params }: PageProps<"/[univers]/[categorie]">) {
  const t = await trouver(params);
  if (!t) notFound();
  const { u, c } = t;
  const produits = PRODUITS.filter((p) => p.univers === u.slug && p.categorie === c.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-gris" aria-label="Fil d'Ariane">
        <Link href="/boutique" className="hover:text-or">Boutique</Link> /{" "}
        <Link href={`/${u.slug}`} className="hover:text-or">{u.nom}</Link> / {c.nom}
      </nav>
      <h1 className="titre text-4xl md:text-5xl mt-2 mb-8">{c.nom}</h1>
      <ListeProduits produits={produits} />
    </div>
  );
}
