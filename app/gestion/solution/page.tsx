import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Link from "next/link";
import { BOUTIQUE_ACTIVE as B } from "@/lib/boutique";

export const metadata: Metadata = {
  title: "Une seule solution pour toute la boutique",
  robots: { index: false, follow: false },
};

// Page de présentation de la solution unifiée (caisse + stock + gestion, et le
// site si la boutique en a un), à montrer au gérant. Aucune donnée réelle.
// Deux cas : Sakaba a déjà un logiciel (Odoo) ; les autres partent de zéro.
const SAKABA = B.id === "sakaba";

const MODULES = [
  { icone: "▥", nom: "Caisse boutique", texte: "Douchette, ticket imprimé ou WhatsApp, rendu de monnaie, clôture du soir." },
  SAKABA
    ? { icone: "⌂", nom: "Site internet", texte: `Commandes en ligne, retrait à ${B.quartier} ou livraison.` }
    : { icone: "◉", nom: "Lives TikTok", texte: "Chaque commande du live notée en un geste, le produit est réservé." },
  { icone: "◔", nom: "Tableau de bord", texte: "Ventes, commandes et alertes sur le téléphone de la gérante." },
  { icone: "✆", nom: "WhatsApp", texte: "Confirmation de commande, reçu, mise en relation avec le livreur." },
  { icone: "✦", nom: SAKABA ? "Fidélité SakaDIVA" : "Fidélité clientes", texte: "Les points s'ajoutent à chaque achat, sur le numéro de la cliente." },
  { icone: "▤", nom: "Comptabilité", texte: "Export Excel des ventes par jour, par vendeuse et par moyen de paiement." },
];

const AVANT = SAKABA
  ? [
      "Les produits sont saisis deux fois : dans le logiciel et sur le site.",
      "Un produit vendu en boutique reste « disponible » sur le site.",
      "Les chiffres de la boutique et du site sont dans deux outils séparés.",
    ]
  : [
      "Les ventes se notent à la main, ou pas du tout.",
      "On découvre qu'un produit est épuisé quand une cliente le demande.",
      "Les commandes des lives TikTok se perdent dans les messages.",
    ];

const APRES = SAKABA
  ? [
      "Un produit est saisi une seule fois, avec son code-barres.",
      "Une vente, en boutique ou en ligne, met le stock à jour partout en une seconde.",
      "Un seul tableau de bord pour toutes les ventes.",
    ]
  : [
      "Chaque vente est enregistrée en quelques secondes, avec son ticket.",
      "Le stock se met à jour tout seul, avec une alerte avant la rupture.",
      "Les ventes du jour sur votre téléphone, même quand vous n'êtes pas à la boutique.",
    ];

const ETAPES = SAKABA
  ? [
      ["Récupération", "Export des articles, codes-barres, prix, stocks et clientes depuis le logiciel actuel (Odoo sait tout exporter en Excel)."],
      ["Import", "Tout est chargé dans la nouvelle base. Les codes-barres existants sont conservés."],
      ["Essai en parallèle", "Quelques jours avec les deux outils, pour vérifier que les chiffres sont identiques."],
      ["Bascule", "Un inventaire, puis la nouvelle caisse et le site prennent le relais."],
    ]
  : [
      ["Visite", "On passe à la boutique : produits, rayons, façon de vendre, matériel déjà présent."],
      ["Saisie des articles", "Chaque produit avec son prix et son code-barres (celui de l'emballage, ou une étiquette imprimée)."],
      ["Installation", "Caisse, douchette, imprimante de tickets, et une formation de l'équipe sur place."],
      ["Premiers jours", "On reste disponible pour les questions, et le premier inventaire se fait ensemble."],
    ];

export default function Solution() {
  const carte = "rounded-3xl bg-white p-6 ring-1 ring-bordure/70 shadow-[0_18px_50px_-32px_rgba(20,16,11,0.45)]";
  return (
    <main className="flex-1 bg-creme min-h-screen">
      <header className="relative overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0" style={{ background: "radial-gradient(55% 90% at 50% 0%, rgba(var(--or-rgb),0.38), transparent 70%)" }} aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-14 text-center">
          <div className="flex justify-center"><Logo taille={72} /></div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-or-clair">Proposition pour {B.nom}</p>
          <h1 className="titre text-4xl sm:text-6xl leading-[1.05] mt-3 text-balance">Une seule solution pour toute la boutique</h1>
          <p className="mt-4 max-w-2xl mx-auto text-creme/80 md:text-lg">
            {SAKABA
              ? "La caisse, le site internet, le stock et la gestion réunis dans un même outil. Un seul stock, toujours juste."
              : "La caisse, le stock, les commandes des lives et le suivi des ventes réunis dans un même outil, fait pour votre boutique."}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        {/* Avant / après */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className={carte}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gris">{SAKABA ? "Aujourd'hui : deux outils séparés" : "Aujourd'hui"}</p>
            <ul className="mt-4 space-y-3">
              {AVANT.map((t) => (
                <li key={t} className="flex gap-3"><span className="text-red-800 font-bold" aria-hidden>✕</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className={`${carte} ring-2 ring-or/60`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or">Avec la nouvelle solution</p>
            <ul className="mt-4 space-y-3">
              {APRES.map((t) => (
                <li key={t} className="flex gap-3"><span className="text-green-800 font-bold" aria-hidden>✓</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Schéma */}
        <section className={carte}>
          <h2 className="titre text-3xl sm:text-4xl text-center">Tout est relié au même stock</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center">
            <ul className="space-y-3">
              {MODULES.slice(0, 3).map((m) => (
                <li key={m.nom} className="rounded-2xl bg-creme p-4 flex gap-3 md:flex-row-reverse md:text-right">
                  <span className="shrink-0 w-10 h-10 rounded-full grid place-items-center bg-noir text-or-clair text-lg" aria-hidden>{m.icone}</span>
                  <span><span className="block font-semibold">{m.nom}</span><span className="block text-sm text-gris">{m.texte}</span></span>
                </li>
              ))}
            </ul>
            <div className="mx-auto w-44 h-44 sm:w-52 sm:h-52 rounded-full p-[3px] bg-gradient-to-b from-or-clair to-or shadow-[0_0_60px_rgba(var(--or-rgb),0.45)] order-first md:order-none">
              <div className="w-full h-full rounded-full bg-noir text-creme grid place-items-center text-center p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-or-clair">Au centre</p>
                  <p className="titre text-2xl sm:text-3xl leading-tight mt-1">Stock et catalogue uniques</p>
                  <p className="text-[11px] text-creme/60 mt-1">mis à jour en direct</p>
                </div>
              </div>
            </div>
            <ul className="space-y-3">
              {MODULES.slice(3).map((m) => (
                <li key={m.nom} className="rounded-2xl bg-creme p-4 flex gap-3">
                  <span className="shrink-0 w-10 h-10 rounded-full grid place-items-center bg-noir text-or-clair text-lg" aria-hidden>{m.icone}</span>
                  <span><span className="block font-semibold">{m.nom}</span><span className="block text-sm text-gris">{m.texte}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Synchronisation */}
        <section className="rounded-3xl bg-noir text-creme p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 90% at 100% 0%, rgba(var(--or-rgb),0.3), transparent 70%)" }} aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Synchronisation</p>
            <h2 className="titre text-3xl sm:text-4xl mt-2">Le même chiffre partout, au même moment</h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                SAKABA
                  ? ["En direct", "Un article vendu à la caisse disparaît du site dans la seconde. Plus de produit vendu deux fois."]
                  : ["En direct", "Un article vendu en boutique ou réservé pendant un live est retiré du stock aussitôt. Plus de produit vendu deux fois."],
                ["Même sans internet", "Si la connexion coupe, la caisse continue de vendre. Tout se met à jour dès le retour du réseau."],
                SAKABA
                  ? ["Une seule saisie", "Prix, photo, stock : on modifie une fois, c'est à jour à la caisse et sur le site."]
                  : ["Sur tous les appareils", "Caisse, tablette, téléphone de la gérante : tout le monde voit le même stock au même moment."],
                ["Tout est tracé", "Chaque vente et chaque mouvement de stock : qui, quand, combien. Idéal pour les inventaires."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <p className="font-semibold text-or-clair">{t}</p>
                  <p className="text-sm text-creme/80 mt-1">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Passage */}
        <section className={carte}>
          <h2 className="titre text-3xl sm:text-4xl">{SAKABA ? "Passer du logiciel actuel à la nouvelle solution" : "Comment on démarre"}</h2>
          <p className="text-gris mt-1">Sans fermer la boutique.</p>
          <ol className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ETAPES.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-creme p-4">
                <span className="prix w-8 h-8 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-sm font-semibold">{i + 1}</span>
                <p className="font-semibold mt-3">{t}</p>
                <p className="text-sm text-gris mt-1">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm rounded-2xl ring-1 ring-bordure p-4">
            <strong>Matériel :</strong> un ordinateur ou une tablette par caisse, une douchette (lecteur de codes-barres),
            une imprimante de tickets 80 mm et un tiroir-caisse. Le matériel déjà présent en boutique peut souvent être gardé.
          </p>
        </section>

        {/* Démos */}
        <section className={`grid gap-3 ${B.siteEnLigne ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {[
            ["/gestion/caisse", "Essayer la caisse", "Scanner, encaisser, imprimer"],
            ["/gestion", "Voir le tableau de bord", "La journée en un coup d'œil"],
            ...(B.siteEnLigne ? [["/", "Voir le site", "La boutique en ligne"]] : []),
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
