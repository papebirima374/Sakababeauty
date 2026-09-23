import type { Metadata } from "next";
import Link from "next/link";
import { PRODUITS } from "@/lib/catalogue";
import { rechercher } from "@/lib/recherche";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="md:hidden mb-6">
        <ChampRecherche autoFocus={!requete} />
      </div>
      {!requete ? (
        <>
          <h1 className="titre text-4xl">Que cherchez-vous ?</h1>
          <p className="text-gris mt-2">Une marque, un produit, ou simplement votre besoin.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["taches", "acné", "cheveux secs", "vergetures", "cerave", "shea moisture", "protection solaire"].map((s) => (
              <Link key={s} href={`/recherche?q=${encodeURIComponent(s)}`} className="rounded-full border border-bordure px-4 py-2 text-sm hover:border-or">
                {s}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="titre text-4xl mb-8">Résultats pour « {requete} »</h1>
          {resultats.length > 0 ? (
            <ListeProduits produits={resultats} />
          ) : (
            // Jamais de page vide (§6.1).
            <div className="rounded-2xl bg-creme p-8">
              <p className="titre text-2xl">Nous n&apos;avons pas trouvé « {requete} ».</p>
              <p className="text-gris mt-2">
                Vérifiez l&apos;orthographe, essayez un besoin, ou{" "}
                <Link href="/diagnostic" className="text-or font-semibold underline">laissez-nous vous conseiller</Link>.
              </p>
              <h2 className="titre text-2xl mt-8">Les plus demandés</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 4).map((p) => (
                  <CarteProduit key={p.slug} produit={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
