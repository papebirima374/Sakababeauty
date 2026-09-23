import type { Metadata } from "next";
import Link from "next/link";
import { PRODUITS } from "@/lib/catalogue";
import { rechercher } from "@/lib/recherche";
import BandeauPage from "@/components/BandeauPage";
import ChampRecherche from "@/components/ChampRecherche";
import ListeProduits from "@/components/ListeProduits";
import CarteProduit from "@/components/CarteProduit";

export const metadata: Metadata = {
  title: "Recherche",
  robots: { index: false },
};

export default async function Recherche({ searchParams }: PageProps<"/recherche">) {
  const q = (await searchParams).q;
  const requete = typeof q === "string" ? q.trim() : "";
  const resultats = requete ? rechercher(requete) : [];
  const suggestions = ["taches", "acné", "cheveux secs", "vergetures", "cerave", "shea moisture", "protection solaire"];

  return (
    <>
      <BandeauPage
        surtitre="Recherche"
        titre={requete ? <>Résultats pour <span className="italic text-or-clair">« {requete} »</span></> : "Que cherchez-vous ?"}
        texte={requete ? `${resultats.length} produit${resultats.length > 1 ? "s" : ""} trouvé${resultats.length > 1 ? "s" : ""}` : "Une marque, un produit, ou simplement votre besoin."}
      >
        <div className="md:hidden mb-4 text-noir">
          <ChampRecherche autoFocus={!requete} />
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Link key={s} href={`/recherche?q=${encodeURIComponent(s)}`} className="rounded-full border border-creme/25 px-4 py-2 text-sm text-creme/90 transition hover:border-or-clair hover:text-or-clair">
              {s}
            </Link>
          ))}
        </div>
      </BandeauPage>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {requete && resultats.length > 0 && <ListeProduits produits={resultats} />}
        {requete && resultats.length === 0 && (
          // Jamais de page vide (§6.1).
          <div className="rounded-3xl bg-creme p-8 text-center">
            <p className="titre text-3xl">Nous n&apos;avons pas trouvé « {requete} ».</p>
            <p className="text-gris mt-2">
              Vérifiez l&apos;orthographe, essayez un besoin, ou{" "}
              <Link href="/diagnostic" className="text-or font-semibold underline">laissez-nous vous conseiller</Link>.
            </p>
          </div>
        )}
        {(!requete || resultats.length === 0) && (
          <section className={requete ? "mt-12" : ""}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or">Les incontournables</p>
            <h2 className="titre text-4xl mt-2">Les plus demandés</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {[...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 8).map((p) => (
                <CarteProduit key={p.slug} produit={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
