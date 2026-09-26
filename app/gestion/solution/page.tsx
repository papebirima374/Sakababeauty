import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Le site et Odoo, synchronisés",
  robots: { index: false, follow: false },
};

// Proposition à la directrice : Sakaba garde Odoo (caisse, stock, comptabilité)
// et le site se branche dessus. Odoo est le logiciel cité par Birima le
// 26/09/2026 (à confirmer : édition, hébergement, accès à l'API).
const MODULES_GAUCHE = [
  { icone: "▥", nom: "Caisse Odoo en boutique", texte: "Rien ne change pour les vendeuses : même caisse, mêmes habitudes." },
  { icone: "⌂", nom: "Site Sakaba", texte: "Catalogue, diagnostic beauté, commandes en ligne." },
  { icone: "◔", nom: "Tableau de bord", texte: "Boutique et site réunis sur le téléphone de la directrice." },
];
const MODULES_DROITE = [
  { icone: "✆", nom: "WhatsApp", texte: "Confirmation de commande, mise en relation avec le livreur." },
  { icone: "✦", nom: "Fidélité SakaDIVA", texte: "Les mêmes points en boutique et en ligne, sur le même numéro." },
  { icone: "▤", nom: "Comptabilité", texte: "Les ventes du site arrivent dans Odoo avec celles de la boutique." },
];

const AVANT = [
  "Le stock d'Odoo et celui du site sont séparés.",
  "Un produit vendu en boutique peut rester « disponible » en ligne.",
  "Les commandes du site doivent être ressaisies à la main.",
];
const APRES = [
  "Le site lit les prix et le stock directement dans Odoo.",
  "Un article vendu à la caisse disparaît aussitôt du site.",
  "Chaque commande en ligne entre dans Odoo toute seule.",
];

export default function Solution() {
  const carte = "rounded-3xl bg-white p-6 ring-1 ring-bordure/70 shadow-[0_18px_50px_-32px_rgba(20,16,11,0.45)]";
  const carteModule = (m: (typeof MODULES_GAUCHE)[number], inverse: boolean) => (
    <li key={m.nom} className={`rounded-2xl bg-creme p-4 flex gap-3 ${inverse ? "md:flex-row-reverse md:text-right" : ""}`}>
      <span className="shrink-0 w-10 h-10 rounded-full grid place-items-center bg-noir text-or-clair text-lg" aria-hidden>{m.icone}</span>
      <span><span className="block font-semibold">{m.nom}</span><span className="block text-sm text-gris">{m.texte}</span></span>
    </li>
  );
  return (
    <main className="flex-1 bg-creme min-h-screen">
      <header className="relative overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0" style={{ background: "radial-gradient(55% 90% at 50% 0%, rgba(197,151,53,0.38), transparent 70%)" }} aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-14 text-center">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={72} height={72} className="mx-auto rounded-full bg-white" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-or-clair">Proposition pour Sakaba Beauty</p>
          <h1 className="titre text-4xl sm:text-6xl leading-[1.05] mt-3 text-balance">Le site et Odoo, synchronisés</h1>
          <p className="mt-4 max-w-2xl mx-auto text-creme/80 md:text-lg">
            Vous gardez Odoo pour la caisse, le stock et la comptabilité. Le site se branche dessus : un seul stock,
            toujours juste, en boutique comme en ligne.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <section className="grid md:grid-cols-2 gap-4">
          <div className={carte}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gris">Sans liaison</p>
            <ul className="mt-4 space-y-3">
              {AVANT.map((t) => (
                <li key={t} className="flex gap-3"><span className="text-red-800 font-bold" aria-hidden>✕</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className={`${carte} ring-2 ring-or/60`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or">Avec la liaison Odoo</p>
            <ul className="mt-4 space-y-3">
              {APRES.map((t) => (
                <li key={t} className="flex gap-3"><span className="text-green-800 font-bold" aria-hidden>✓</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className={carte}>
          <h2 className="titre text-3xl sm:text-4xl text-center">Odoo au centre, tout le reste branché dessus</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center">
            <ul className="space-y-3">{MODULES_GAUCHE.map((m) => carteModule(m, true))}</ul>
            <div className="mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-full p-[3px] bg-gradient-to-b from-or-clair to-or shadow-[0_0_60px_rgba(197,151,53,0.45)] order-first md:order-none">
              <div className="w-full h-full rounded-full bg-noir text-creme grid place-items-center text-center p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-or-clair">Au centre</p>
                  <p className="titre text-3xl sm:text-4xl leading-tight mt-1">Odoo</p>
                  <p className="text-[11px] text-creme/70 mt-1">stock · prix · clientes · ventes</p>
                </div>
              </div>
            </div>
            <ul className="space-y-3">{MODULES_DROITE.map((m) => carteModule(m, false))}</ul>
          </div>
        </section>

        <section className="rounded-3xl bg-noir text-creme p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 90% at 100% 0%, rgba(197,151,53,0.3), transparent 70%)" }} aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Synchronisation</p>
            <h2 className="titre text-3xl sm:text-4xl mt-2">Le même chiffre partout</h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                ["Stock toujours juste", "Le site se met à jour à partir d'Odoo en continu : un article épuisé en boutique ne peut plus être commandé en ligne."],
                ["Commandes automatiques", "Une commande du site crée la vente dans Odoo et réserve le stock. Plus de ressaisie."],
                ["Une seule saisie", "Prix, nouveaux produits, promotions : on les change dans Odoo, le site suit."],
                ["Rien ne change en caisse", "Les vendeuses gardent la caisse Odoo qu'elles connaissent, même en cas de coupure internet."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <p className="font-semibold text-or-clair">{t}</p>
                  <p className="text-sm text-creme/80 mt-1">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={carte}>
          <h2 className="titre text-3xl sm:text-4xl">Les étapes</h2>
          <p className="text-gris mt-1">Sans fermer la boutique, sans toucher à la caisse.</p>
          <ol className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["Vérification", "Quelle version d'Odoo, où elle est hébergée, et ouverture d'un accès sécurisé pour le site."],
              ["Catalogue", "Les produits, prix et stocks d'Odoo s'affichent sur le site, avec les photos et les conseils."],
              ["Commandes", "Les commandes du site entrent dans Odoo et baissent le stock."],
              ["Essai et mise en ligne", "Quelques jours de test avec de vraies ventes, puis ouverture au public."],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-creme p-4">
                <span className="prix w-8 h-8 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-sm font-semibold">{i + 1}</span>
                <p className="font-semibold mt-3">{t}</p>
                <p className="text-sm text-gris mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid sm:grid-cols-2 gap-3">
          {[
            ["/", "Voir le site", "La boutique en ligne"],
            ["/gestion", "Voir le tableau de bord", "Boutique et site réunis"],
          ].map(([href, t, d]) => (
            <Link key={href} href={href} className="group rounded-3xl bg-white p-5 ring-1 ring-bordure/70 hover:ring-or transition">
              <p className="font-semibold group-hover:text-or">{t} →</p>
              <p className="text-sm text-gris">{d}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
