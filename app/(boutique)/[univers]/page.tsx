import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUITS, UNIVERS, universParSlug } from "@/lib/catalogue";
import BandeauPage from "@/components/BandeauPage";
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
    <>
      <BandeauPage ariane={[{ href: "/boutique", nom: "Boutique" }, { nom: u.nom }]} titre={u.nom} texte={u.accroche}>
        {u.categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {u.categories.map((c) => (
              <Link key={c.slug} href={`/${u.slug}/${c.slug}`} className="shrink-0 rounded-full border border-creme/25 px-4 py-2 text-sm font-semibold text-creme/90 transition hover:border-or-clair hover:text-or-clair">
                {c.nom}
              </Link>
            ))}
          </div>
        )}
      </BandeauPage>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ListeProduits produits={produits} />
      </div>
    </>
  );
}
