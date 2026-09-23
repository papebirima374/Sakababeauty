import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BESOINS,
  PRODUITS,
  TYPES_CHEVEUX,
  TYPES_PEAU,
  nomMarque,
  produitParSlug,
  produitsDeLaRoutine,
  universParSlug,
} from "@/lib/catalogue";
import { URL_SITE, formatPrix, lienWhatsApp } from "@/lib/config";
import VisuelProduit from "@/components/VisuelProduit";
import BoutonAjouter from "@/components/BoutonAjouter";
import CarteProduit from "@/components/CarteProduit";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const p = produitParSlug((await params).slug);
  if (!p) return {};
  const titre = `${nomMarque(p.marque)} ${p.nom} ${p.contenance}`;
  // Aperçu soigné quand le lien est partagé sur WhatsApp (§11.1).
  return {
    title: titre,
    description: `${p.accroche} ${formatPrix(p.prix)} — authentique, importé des USA. ${p.stock > 0 ? "En stock" : "Épuisé"} chez Sakaba Beauty, Dakar.`,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: { title: `${titre} — ${formatPrix(p.prix)}`, description: p.accroche, type: "website" },
  };
}

export default async function FicheProduit({ params }: PageProps<"/produit/[slug]">) {
  const p = produitParSlug((await params).slug);
  if (!p) notFound();
  const u = universParSlug(p.univers);
  const categorie = u?.categories.find((c) => c.slug === p.categorie);
  const routine = produitsDeLaRoutine(p);
  const epuise = p.stock <= 0;

  // Données structurées Product : prix, disponibilité et note dans Google (§11.1).
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${nomMarque(p.marque)} ${p.nom}`,
    brand: { "@type": "Brand", name: nomMarque(p.marque) },
    description: p.description,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.note, reviewCount: p.avis },
    offers: {
      "@type": "Offer",
      url: `${URL_SITE}/produit/${p.slug}`,
      priceCurrency: "XOF",
      price: p.prix,
      availability: epuise ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c") }} />
      <nav className="text-sm text-gris mb-6" aria-label="Fil d'Ariane">
        <Link href="/boutique" className="hover:text-or">Boutique</Link>
        {u && <> / <Link href={`/${u.slug}`} className="hover:text-or">{u.nom}</Link></>}
        {u && categorie && <> / <Link href={`/${u.slug}/${categorie.slug}`} className="hover:text-or">{categorie.nom}</Link></>}
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <VisuelProduit produit={p} taille="grand" />

        <div>
          <Link href={`/marques/${p.marque}`} className="text-sm uppercase tracking-wider text-gris hover:text-or">
            {nomMarque(p.marque)}
          </Link>
          <h1 className="titre text-4xl md:text-5xl leading-tight mt-1">{p.nom}</h1>
          <p className="text-gris mt-2">
            {p.contenance} · ★ {p.note.toFixed(1)} ({p.avis} avis)
          </p>
          <p className="mt-2 text-lg">{p.accroche}</p>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="prix text-3xl font-bold">{formatPrix(p.prix)}</span>
            {p.prixBarre && <span className="prix text-lg text-gris line-through">{formatPrix(p.prixBarre)}</span>}
          </p>
          <p className={`mt-1 font-semibold ${epuise ? "text-red-700" : p.stock <= 5 ? "text-amber-700" : "text-green-700"}`}>
            {epuise ? "Épuisé pour le moment" : p.stock <= 5 ? `Plus que ${p.stock} en stock` : "En stock"}
            {!epuise && <span className="text-gris font-normal"> · Livré à Dakar sous 24 h, ou retrait à Mermoz</span>}
          </p>

          <div className="mt-6">
            <BoutonAjouter produit={p} />
          </div>

          {/* Preuve d'authenticité (§7.1) */}
          <div className="mt-6 rounded-2xl border border-or-clair bg-creme p-5">
            <p className="font-semibold flex items-center gap-2">
              <span className="rounded-full bg-or text-white text-xs px-2.5 py-1">✦ Importé des USA</span>
              Produit authentique
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-gris">Origine</dt><dd className="font-semibold">États-Unis</dd>
              <dt className="text-gris">Contenance</dt><dd className="font-semibold">{p.contenance}</dd>
              <dt className="text-gris">Péremption</dt><dd className="font-semibold">{p.peremption}</dd>
              {p.lot && (<><dt className="text-gris">Lot</dt><dd className="font-semibold">{p.lot}</dd></>)}
            </dl>
            <Link href="/authenticite" className="mt-3 inline-block text-sm font-semibold text-or underline">
              D&apos;où viennent nos produits ?
            </Link>
          </div>

          <a
            href={lienWhatsApp(`Bonjour, une question sur « ${nomMarque(p.marque)} ${p.nom} » (${formatPrix(p.prix)}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-center rounded-full border border-bordure py-3 font-semibold hover:border-or"
          >
            Une question ? Écrivez-nous sur WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-8">
          <div>
            <h2 className="titre text-3xl">À quoi sert-il ?</h2>
            <p className="mt-3 leading-relaxed">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.peau?.map((t) => <span key={t} className="rounded-full bg-creme px-3 py-1 text-sm">Peau {TYPES_PEAU[t].toLowerCase()}</span>)}
              {p.cheveux?.map((t) => <span key={t} className="rounded-full bg-creme px-3 py-1 text-sm">Cheveux {TYPES_CHEVEUX[t].toLowerCase()}</span>)}
              {p.besoins.map((b) => <span key={b} className="rounded-full bg-creme px-3 py-1 text-sm">{BESOINS[b]}</span>)}
            </div>
          </div>
          <div>
            <h2 className="titre text-3xl">Comment l&apos;utiliser</h2>
            <p className="mt-3 leading-relaxed">{p.utilisation}</p>
          </div>
          {p.actifs.length > 0 && (
            <div>
              <h2 className="titre text-3xl">Actifs principaux</h2>
              <p className="mt-3">{p.actifs.join(" · ")}</p>
              <p className="mt-1 text-sm text-gris">La liste INCI complète sera reprise lors de la migration du catalogue.</p>
            </div>
          )}
        </section>
        <aside className="rounded-2xl bg-noir text-creme p-6 h-fit">
          <p className="titre text-2xl text-or-clair">Pas sûre que ce soit pour vous ?</p>
          <p className="text-sm text-creme/80 mt-2">Répondez à quelques questions : nous vous proposons une routine complète adaptée à votre peau ou vos cheveux.</p>
          <Link href="/diagnostic" className="mt-4 block text-center rounded-full bg-or py-3 font-semibold text-white">
            Faire le diagnostic
          </Link>
        </aside>
      </div>

      {routine.length > 0 && (
        <section className="mt-14">
          <h2 className="titre text-3xl">Complétez la routine</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {routine.map((r) => <CarteProduit key={r.slug} produit={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
