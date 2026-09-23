import Link from "next/link";
import { MARQUES, PRODUITS, UNIVERS } from "@/lib/catalogue";
import { BOUTIQUE, SEUIL_LIVRAISON_OFFERTE, formatPrix } from "@/lib/config";
import CarteProduit from "@/components/CarteProduit";

export default function Accueil() {
  const meilleures = [...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 8);
  const nouveautes = PRODUITS.filter((p) => p.nouveaute).slice(0, 4);

  return (
    <>
      {/* Promesse */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or">Importés des États-Unis · Dakar</p>
            <h1 className="titre text-5xl md:text-6xl leading-[1.05] mt-4">{BOUTIQUE.slogan}.</h1>
            <p className="mt-5 text-lg text-gris max-w-md">
              Plus de 2 700 soins, maquillages et parfums 100 % authentiques. Et une équipe qui vous aide à choisir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/diagnostic" className="rounded-full bg-or px-7 py-3.5 font-semibold text-white hover:bg-noir">
                Trouver ma routine en 2 minutes
              </Link>
              <Link href="/boutique" className="rounded-full border border-noir px-7 py-3.5 font-semibold hover:bg-noir hover:text-white">
                Voir la boutique
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["✦", "100 % authentiques", "Import direct des USA, lot et péremption sur chaque fiche."],
              ["◎", "Le bon conseil", "Diagnostic peau et cheveux en ligne ou en boutique."],
              ["⌂", "Retrait à Mermoz", "Gratuit, prêt en 2 heures."],
              ["₣", "Wave & Orange Money", `Livraison offerte dès ${formatPrix(SEUIL_LIVRAISON_OFFERTE)}.`],
            ].map(([icone, titre, texte]) => (
              <div key={titre} className="rounded-2xl bg-white p-5 border border-bordure">
                <span className="text-or text-2xl">{icone}</span>
                <p className="font-semibold mt-2">{titre}</p>
                <p className="text-sm text-gris mt-1">{texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Univers */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="titre text-3xl md:text-4xl">Par univers</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {UNIVERS.map((u) => (
            <Link key={u.slug} href={`/${u.slug}`} className="rounded-2xl border border-bordure p-5 hover:border-or hover:bg-creme">
              <p className="titre text-xl">{u.nom}</p>
              <p className="text-sm text-gris mt-1">{u.accroche}</p>
            </Link>
          ))}
          <Link href="/diagnostic" className="rounded-2xl bg-noir text-creme p-5 hover:bg-or">
            <p className="titre text-xl text-or-clair">Je ne sais pas quoi choisir</p>
            <p className="text-sm text-creme/80 mt-1">Faites le diagnostic beauté →</p>
          </Link>
        </div>
      </section>

      {/* Meilleures ventes */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="titre text-3xl md:text-4xl">Les plus demandés</h2>
          <Link href="/boutique" className="text-sm font-semibold text-or">Tout voir →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {meilleures.map((p) => <CarteProduit key={p.slug} produit={p} />)}
        </div>
      </section>

      {/* Authenticité */}
      <section className="bg-noir text-creme">
        <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or-clair">Notre engagement</p>
            <h2 className="titre text-4xl mt-3">Le vrai, pas une copie.</h2>
            <p className="mt-4 text-creme/80 max-w-2xl">
              Chaque produit vient directement des États-Unis. Sur chaque fiche : l&apos;origine, la contenance, la date de
              péremption et, lorsqu&apos;il est connu, le numéro de lot. Vous savez exactement ce que vous achetez.
            </p>
          </div>
          <Link href="/authenticite" className="rounded-full bg-or px-7 py-3.5 font-semibold text-white hover:bg-or-clair hover:text-noir text-center">
            Comment reconnaître un produit authentique
          </Link>
        </div>
      </section>

      {/* Nouveautés */}
      {nouveautes.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="titre text-3xl md:text-4xl">Nouveautés</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {nouveautes.map((p) => <CarteProduit key={p.slug} produit={p} />)}
          </div>
        </section>
      )}

      {/* Marques */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="titre text-3xl md:text-4xl">Nos marques</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {MARQUES.map((m) => (
              <Link key={m.slug} href={`/marques/${m.slug}`} className="rounded-full bg-white border border-bordure px-5 py-2.5 font-semibold hover:border-or">
                {m.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Club */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border-2 border-or-clair p-8 md:p-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or">Club SakaDIVA</p>
          <h2 className="titre text-4xl mt-3">Chaque achat vous rapporte des points.</h2>
          <p className="text-gris mt-3 max-w-xl mx-auto">
            En ligne comme en boutique. Livraison offerte, accès en avant-première aux nouveautés et cadeau d&apos;anniversaire.
          </p>
          <p className="mt-5 inline-block rounded-full bg-creme px-5 py-2 text-sm font-semibold">Bientôt disponible sur le site</p>
        </div>
      </section>
    </>
  );
}
