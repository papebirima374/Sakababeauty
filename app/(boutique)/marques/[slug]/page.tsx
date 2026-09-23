import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARQUES, PRODUITS, marqueParSlug } from "@/lib/catalogue";
import BandeauPage from "@/components/BandeauPage";
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
    <>
      <BandeauPage ariane={[{ href: "/marques", nom: "Marques" }, { nom: m.nom }]} surtitre="Marque" titre={m.nom} texte={m.histoire} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ListeProduits produits={PRODUITS.filter((p) => p.marque === m.slug)} />
      </div>
    </>
  );
}
