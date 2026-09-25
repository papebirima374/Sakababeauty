import Image from "next/image";
import Link from "next/link";
import { MARQUES, PRODUITS, UNIVERS, produitParSlug, type Produit } from "@/lib/catalogue";
import CarteProduit from "@/components/CarteProduit";

// Photo qui représente chaque univers (produits d'exemple du catalogue).
const IMAGE_UNIVERS: Record<string, string> = {
  "soin-visage": "cerave-nettoyant-hydratant-236ml",
  "soin-corps": "palmers-lait-beurre-cacao-400ml",
  cheveux: "shea-moisture-curl-smoothie-340g",
  maquillage: "maybelline-fit-me-fond-de-teint",
  parfums: "bath-body-works-brume-a-thousand-wishes-236ml",
  "homme-barbe": "shea-moisture-huile-barbe-96ml",
  enfants: "cantu-kids-soin-sans-rincage-283g",
};

// Produits mis en scène dans le bandeau d'accueil.
const VITRINE = [
  "mielle-huile-romarin-menthe-59ml",
  "cerave-creme-hydratante-340g",
  "shea-moisture-shampooing-jbco-384ml",
  "nyx-butter-gloss",
  "black-girl-sunscreen-spf30-88ml",
];
const PLACES_VITRINE = [
  "left-[30%] top-[2%] w-[40%] z-30",
  "left-[0%] top-[24%] w-[32%] z-20 -rotate-6",
  "right-[0%] top-[20%] w-[32%] z-20 rotate-6",
  "left-[12%] bottom-[0%] w-[29%] z-10 -rotate-3",
  "right-[12%] bottom-[2%] w-[29%] z-10 rotate-3",
];

function Separateur({ clair = false }: { clair?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${clair ? "text-or-clair" : "text-or"}`} aria-hidden>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
      <span className="text-xs">✦</span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

function Photo({ produit, sizes }: { produit?: Produit; sizes: string }) {
  if (!produit?.image) return null;
  return <Image src={produit.image} alt="" fill sizes={sizes} className="object-contain" />;
}

function Surtitre({ children, clair = false }: { children: React.ReactNode; clair?: boolean }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${clair ? "text-or-clair" : "text-or"}`}>{children}</p>
  );
}

export default function Accueil() {
  const meilleures = [...PRODUITS].sort((a, b) => b.ventes - a.ventes).slice(0, 8);
  const nouveautes = PRODUITS.filter((p) => p.nouveaute).slice(0, 4);
  const vitrine = VITRINE.map((s) => produitParSlug(s)).filter((p): p is Produit => Boolean(p));

  return (
    <>
      {/* Bandeau */}
      <section className="relative overflow-hidden bg-noir text-creme">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 75% 40%, rgba(197,151,53,0.28), transparent 70%), radial-gradient(40% 50% at 10% 0%, rgba(227,199,126,0.12), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <Surtitre clair>Importés des États-Unis · Dakar</Surtitre>
            <h1 className="titre text-5xl sm:text-6xl lg:text-7xl leading-[1.02] mt-5">
              La beauté authentique,
              <span className="block italic text-or-clair">avec le bon conseil.</span>
            </h1>
            <div className="mt-6"><Separateur clair /></div>
            <p className="mt-6 text-lg text-creme/75 max-w-md">
              Plus de 2 700 soins, maquillages et parfums 100 % authentiques. Et une équipe qui vous aide à choisir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/diagnostic"
                className="rounded-full bg-gradient-to-r from-or to-[#B0852A] px-7 py-3.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] transition hover:brightness-110 hover:-translate-y-0.5"
              >
                Trouver ma routine en 2 minutes
              </Link>
              <Link href="/boutique" className="rounded-full border border-creme/30 px-7 py-3.5 font-semibold transition hover:border-or-clair hover:text-or-clair">
                Voir la boutique
              </Link>
            </div>
          </div>

          <div className="relative h-[330px] sm:h-[430px]">
            <div className="absolute inset-8 rounded-full bg-or/15 blur-3xl" aria-hidden />
            {vitrine.map((p, i) => (
              <Link
                key={p.slug}
                href={`/produit/${p.slug}`}
                aria-label={p.nom}
                className={`absolute aspect-square rounded-3xl bg-white p-3 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)] ring-1 ring-or/25 transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:z-40 ${PLACES_VITRINE[i]}`}
              >
                <span className="relative block w-full h-full">
                  <Photo produit={p} sizes="220px" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative border-t border-creme/10">
          <ul className="mx-auto max-w-6xl px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              ["100 % authentiques", "Lot et péremption sur chaque fiche"],
              ["Le bon conseil", "Diagnostic en ligne ou en boutique"],
              ["Retrait à Mermoz", "Gratuit, on vous prévient sur WhatsApp"],
              ["Livraison", "Prix convenu directement avec le livreur"],
            ].map(([titre, texte]) => (
              <li key={titre} className="flex gap-3">
                <span className="text-or-clair">✦</span>
                <span>
                  <span className="block font-semibold">{titre}</span>
                  <span className="block text-creme/60 text-xs mt-0.5">{texte}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Univers */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <Surtitre>Nos univers</Surtitre>
          <h2 className="titre text-4xl md:text-5xl mt-2">Que cherchez-vous aujourd&apos;hui ?</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {UNIVERS.map((u) => (
            <Link key={u.slug} href={`/${u.slug}`} className="group rounded-3xl bg-creme p-3 sm:p-4 transition hover:bg-white hover:shadow-[0_20px_50px_-25px_rgba(20,16,11,0.4)]">
              <span className="relative block aspect-square rounded-2xl bg-white overflow-hidden">
                <span className="absolute inset-4 transition duration-500 group-hover:scale-105">
                  <Photo produit={produitParSlug(IMAGE_UNIVERS[u.slug])} sizes="(min-width: 768px) 25vw, 50vw" />
                </span>
              </span>
              <span className="block titre text-2xl mt-3 px-1">{u.nom}</span>
              <span className="block text-sm text-gris px-1">{u.accroche}</span>
            </Link>
          ))}
          <Link href="/diagnostic" className="relative overflow-hidden rounded-3xl bg-noir text-creme p-6 flex flex-col justify-end min-h-56 transition hover:-translate-y-0.5">
            <span className="absolute inset-0 opacity-80" style={{ background: "radial-gradient(70% 60% at 80% 10%, rgba(197,151,53,0.45), transparent 70%)" }} aria-hidden />
            <span className="relative text-or-clair text-2xl">✦</span>
            <span className="relative titre text-3xl mt-2">Je ne sais pas quoi choisir</span>
            <span className="relative text-sm text-creme/75 mt-1">Faites le diagnostic beauté →</span>
          </Link>
        </div>
      </section>

      {/* Meilleures ventes */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Surtitre>Les incontournables</Surtitre>
              <h2 className="titre text-4xl md:text-5xl mt-2">Les plus demandés</h2>
            </div>
            <Link href="/boutique" className="shrink-0 text-sm font-semibold text-or hover:text-noir">Tout voir →</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {meilleures.map((p) => <CarteProduit key={p.slug} produit={p} />)}
          </div>
        </div>
      </section>

      {/* Diagnostic */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Surtitre>Diagnostic beauté</Surtitre>
          <h2 className="titre text-4xl md:text-5xl mt-2">Votre routine, en 2 minutes.</h2>
          <p className="mt-4 text-gris text-lg">
            Le conseil de nos expertes, maintenant en ligne. Quelques questions sur votre peau ou vos cheveux, et nous
            composons votre routine pas à pas, dans votre budget.
          </p>
          <Link href="/diagnostic" className="mt-8 inline-block rounded-full bg-noir px-7 py-3.5 font-semibold text-white transition hover:bg-or">
            Commencer le diagnostic
          </Link>
        </div>
        <ol className="grid gap-3">
          {[
            ["Vous répondez", "Type de peau ou de cheveux, préoccupations, budget."],
            ["Nous composons", "Une routine matin et soir, étape par étape."],
            ["Vous choisissez", "Toute la routine en un geste, ou produit par produit."],
          ].map(([titre, texte], i) => (
            <li key={titre} className="flex gap-4 items-start rounded-2xl bg-white p-5 shadow-[0_15px_40px_-25px_rgba(20,16,11,0.45)]">
              <span className="titre shrink-0 w-11 h-11 rounded-full bg-gradient-to-b from-or-clair to-or text-white grid place-items-center text-xl">{i + 1}</span>
              <span>
                <span className="block font-semibold">{titre}</span>
                <span className="block text-sm text-gris">{texte}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Authenticité */}
      <section className="relative overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0" style={{ background: "radial-gradient(50% 80% at 0% 50%, rgba(197,151,53,0.25), transparent 70%)" }} aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <Surtitre clair>Notre engagement</Surtitre>
            <h2 className="titre text-5xl mt-3">Le vrai, <span className="italic text-or-clair">pas une copie.</span></h2>
            <p className="mt-4 text-creme/75 max-w-2xl">
              Chaque produit vient directement des États-Unis. Sur chaque fiche : l&apos;origine, la contenance, la date de
              péremption et, lorsqu&apos;il est connu, le numéro de lot. Vous savez exactement ce que vous achetez.
            </p>
          </div>
          <Link href="/authenticite" className="rounded-full border border-or-clair/60 px-7 py-3.5 font-semibold text-or-clair text-center transition hover:bg-or-clair hover:text-noir">
            Comment reconnaître un produit authentique
          </Link>
        </div>
      </section>

      {/* Nouveautés */}
      {nouveautes.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <Surtitre>Tout juste arrivés</Surtitre>
          <h2 className="titre text-4xl md:text-5xl mt-2">Nouveautés</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {nouveautes.map((p) => <CarteProduit key={p.slug} produit={p} />)}
          </div>
        </section>
      )}

      {/* Masterclass */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Link href="/masterclass" className="group relative block overflow-hidden rounded-[2rem] bg-noir text-creme p-8 md:p-12">
          <span className="absolute inset-0" style={{ background: "radial-gradient(60% 90% at 100% 0%, rgba(197,151,53,0.4), transparent 70%)" }} aria-hidden />
          <span className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <span>
              <Surtitre clair>Événement</Surtitre>
              <span className="block titre text-4xl md:text-5xl mt-2">Masterclass Sakaba Beauty</span>
              <span className="block mt-2 text-creme/75">Apprenez avec nos expertes. Inscription gratuite, places limitées.</span>
            </span>
            <span className="rounded-full bg-gradient-to-r from-or to-[#B0852A] px-7 py-3.5 font-semibold text-white text-center transition group-hover:brightness-110">
              Réserver ma place →
            </span>
          </span>
        </Link>
      </section>

      {/* Marques */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <Surtitre>Nos marques</Surtitre>
          <h2 className="titre text-4xl md:text-5xl mt-2">Les grandes marques américaines</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {MARQUES.map((m) => (
              <Link key={m.slug} href={`/marques/${m.slug}`} className="titre text-xl rounded-full bg-white px-6 py-3 shadow-[0_10px_30px_-20px_rgba(20,16,11,0.5)] transition hover:text-or">
                {m.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Club */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[2rem] p-[1.5px] bg-gradient-to-br from-or-clair via-or to-or-clair">
          <div className="rounded-[calc(2rem-1.5px)] bg-white px-6 py-12 md:p-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-or">Club SakaDIVA</p>
            <h2 className="titre text-4xl md:text-5xl mt-3">Chaque achat vous rapporte des points.</h2>
            <div className="mt-5 flex justify-center"><Separateur /></div>
            <p className="text-gris mt-5 max-w-xl mx-auto">
              En ligne comme en boutique : accès en avant-première aux nouveautés et cadeau d&apos;anniversaire.
            </p>
            <p className="mt-6 inline-block rounded-full bg-creme px-5 py-2 text-sm font-semibold">Bientôt disponible sur le site</p>
          </div>
        </div>
      </section>
    </>
  );
}
