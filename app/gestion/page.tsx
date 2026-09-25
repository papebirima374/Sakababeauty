import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import VisuelProduit from "@/components/VisuelProduit";
import { nomMarque } from "@/lib/catalogue";
import { formatPrix } from "@/lib/config";
import { AVIS_DEMO, STATUTS, commandesDuJour, meilleuresVentes, stocksASurveiller, ventesSemaine } from "@/lib/demo-gestion";

export const metadata: Metadata = {
  title: "Espace gestion (démonstration)",
  robots: { index: false, follow: false },
};

// La date du jour change : la page est calculée à chaque visite.
export const dynamic = "force-dynamic";

const OR_BARRE = "#A67C1F"; // or foncé : contraste suffisant sur fond clair

export default function Gestion() {
  const maintenant = new Date();
  const jours = ventesSemaine(maintenant);
  const commandes = commandesDuJour();
  const stocks = stocksASurveiller();
  const top = meilleuresVentes();

  const caJour = commandes.reduce((t, c) => t + c.total, 0);
  jours[6] = { ...jours[6], montant: caJour, commandes: commandes.length };
  const caSemaine = jours.reduce((t, j) => t + j.montant, 0);
  const maxJour = Math.max(...jours.map((j) => j.montant));
  const aTraiter = commandes.filter((c) => c.statut === "nouvelle" || c.statut === "preparation").length;
  const maxVentes = top[0].ventes;
  const dateDuJour = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Dakar" }).format(maintenant);

  const carte = "min-w-0 rounded-3xl bg-white p-5 sm:p-6 ring-1 ring-bordure/70 shadow-[0_18px_50px_-32px_rgba(20,16,11,0.45)]";
  const titreCarte = "font-semibold text-lg";

  return (
    <main className="flex-1 bg-creme min-h-screen">
      <header className="relative overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0" style={{ background: "radial-gradient(45% 100% at 90% 0%, rgba(197,151,53,0.32), transparent 70%)" }} aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-6 flex items-center gap-4 flex-wrap">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={52} height={52} className="rounded-full bg-white" />
          <div className="flex-1 min-w-48">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Espace gestion</p>
            <h1 className="titre text-3xl sm:text-4xl leading-tight">Bonjour, voici votre journée</h1>
            <p className="text-sm text-creme/70 first-letter:uppercase">{dateDuJour}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/gestion/caisse" className="rounded-full bg-gradient-to-r from-or to-[#B0852A] px-5 py-2 text-sm font-semibold text-white hover:brightness-110">
              Caisse boutique
            </Link>
            <Link href="/" className="rounded-full border border-creme/30 px-5 py-2 text-sm font-semibold hover:border-or-clair hover:text-or-clair">
              Voir la boutique
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-or/15 border-b border-or/30">
        <p className="mx-auto max-w-6xl px-4 py-2.5 text-sm">
          <strong>Démonstration.</strong> Les commandes, ventes et avis ci-dessous sont des exemples : ils montrent ce que
          l&apos;espace affichera avec les vraies données de la boutique.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-5">
        {/* Chiffres clés */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-label="Chiffres du jour">
          {[
            { titre: "Ventes du jour", valeur: formatPrix(caJour), detail: `${commandes.length} commandes` },
            { titre: "À traiter", valeur: String(aTraiter), detail: "commandes à préparer" },
            { titre: "Panier moyen", valeur: formatPrix(Math.round(caJour / commandes.length / 100) * 100), detail: "aujourd'hui" },
            { titre: "Ventes sur 7 jours", valeur: formatPrix(caSemaine), detail: `${jours.reduce((t, j) => t + j.commandes, 0)} commandes` },
          ].map((k) => (
            <div key={k.titre} className={carte}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gris">{k.titre}</p>
              <p className="prix titre text-[1.6rem] leading-tight sm:text-4xl font-semibold mt-2 whitespace-nowrap">{k.valeur}</p>
              <p className="text-sm text-gris mt-1">{k.detail}</p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* Ventes des 7 derniers jours */}
          <section className={carte}>
            <h2 className={titreCarte}>Ventes des 7 derniers jours</h2>
            <p className="text-sm text-gris">Montant encaissé par jour, en francs CFA</p>
            <div className="mt-6 h-52 flex items-end gap-2 sm:gap-3 border-b border-bordure" role="img" aria-label="Diagramme des ventes des 7 derniers jours">
              {jours.map((j, i) => {
                const auj = i === 6;
                const afficher = auj || j.montant === maxJour;
                return (
                  <div key={i} className="group relative flex-1 h-full flex flex-col justify-end items-center">
                    {afficher && <span className="prix text-[11px] font-semibold text-noir mb-1 whitespace-nowrap">{Math.round(j.montant / 1000)} k</span>}
                    <div
                      className={`w-full max-w-12 rounded-t transition ${auj ? "" : "opacity-55 group-hover:opacity-100"}`}
                      style={{ height: `${(j.montant / maxJour) * 85}%`, background: OR_BARRE }}
                    />
                    <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block rounded-xl bg-noir text-creme text-xs px-3 py-2 whitespace-nowrap shadow-lg">
                      <p className="font-semibold">{j.date}</p>
                      <p className="prix">{formatPrix(j.montant)} · {j.commandes} commandes</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 sm:gap-3 mt-2">
              {jours.map((j, i) => (
                <p key={i} className={`flex-1 text-center text-xs capitalize ${i === 6 ? "font-semibold text-noir" : "text-gris"}`}>
                  {i === 6 ? "Auj." : j.jour}
                </p>
              ))}
            </div>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-gris hover:text-or">Voir le tableau</summary>
              <table className="mt-2 w-full">
                <tbody>
                  {jours.map((j, i) => (
                    <tr key={i} className="border-b border-bordure/60">
                      <td className="py-1.5">{j.date}</td>
                      <td className="py-1.5 text-right prix">{j.commandes} cmd</td>
                      <td className="py-1.5 text-right prix font-semibold">{formatPrix(j.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </section>

          {/* Stocks */}
          <section className={carte}>
            <h2 className={titreCarte}>Stocks à surveiller</h2>
            <p className="text-sm text-gris">Produits à 10 unités ou moins</p>
            <ul className="mt-4 space-y-2.5">
              {stocks.map((p) => {
                const epuise = p.stock === 0;
                return (
                  <li key={p.slug} className="flex items-center gap-3">
                    <div className="w-11 shrink-0"><VisuelProduit produit={p} taille="vignette" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.nom}</p>
                      <p className="text-xs text-gris">{nomMarque(p.marque)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${epuise ? "bg-red-50 text-red-900 ring-red-300" : "bg-amber-50 text-amber-900 ring-amber-300"}`}>
                      {epuise ? "✕ Épuisé" : `! ${p.stock} restants`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Commandes */}
        <section className={carte}>
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className={titreCarte}>Commandes du jour</h2>
              <p className="text-sm text-gris">Les plus récentes en premier</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(STATUTS) as (keyof typeof STATUTS)[]).map((s) => (
                <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUTS[s].classe}`}>
                  {STATUTS[s].icone} {STATUTS[s].nom} · {commandes.filter((c) => c.statut === s).length}
                </span>
              ))}
            </div>
          </div>
          <ul className="mt-4 divide-y divide-bordure/70">
            {commandes.map((c) => (
              <li key={c.numero} className="py-3 grid grid-cols-[1fr_auto] sm:grid-cols-[7rem_1fr_auto_auto] gap-x-4 gap-y-1 items-center">
                <div className="sm:order-none">
                  <p className="prix font-semibold">{c.numero}</p>
                  <p className="text-xs text-gris">{c.heure}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 order-3 sm:order-none min-w-0">
                  <p className="font-semibold">{c.cliente}</p>
                  <p className="text-xs text-gris truncate">
                    {c.lignes.map((l) => `${l.quantite} × ${l.produit.nom}`).join(" · ")}
                  </p>
                  <p className="text-xs text-gris">{c.zone} · {c.paiement}</p>
                </div>
                <p className="prix font-semibold text-right order-2 sm:order-none">{formatPrix(c.total)}</p>
                <span className={`hidden sm:inline-block rounded-full px-2.5 py-1 text-xs font-semibold ring-1 whitespace-nowrap ${STATUTS[c.statut].classe}`}>
                  {STATUTS[c.statut].icone} {STATUTS[c.statut].nom}
                </span>
                <span className={`sm:hidden order-4 justify-self-start rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUTS[c.statut].classe}`}>
                  {STATUTS[c.statut].icone} {STATUTS[c.statut].nom}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Meilleures ventes */}
          <section className={carte}>
            <h2 className={titreCarte}>Meilleures ventes</h2>
            <p className="text-sm text-gris">Nombre de ventes depuis le début</p>
            <ol className="mt-4 space-y-3">
              {top.map((p, i) => (
                <li key={p.slug}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate"><span className="text-gris mr-1.5">{i + 1}.</span>{nomMarque(p.marque)} · {p.nom}</span>
                    <span className="prix font-semibold shrink-0">{p.ventes}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-creme overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(p.ventes / maxVentes) * 100}%`, background: OR_BARRE }} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Avis */}
          <section className={carte}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className={titreCarte}>Derniers avis clients</h2>
              <Link href="/avis" className="text-sm text-or font-semibold hover:underline">Formulaire</Link>
            </div>
            <p className="text-sm text-gris">Reçus par le formulaire « Votre avis compte »</p>
            <ul className="mt-4 space-y-3">
              {AVIS_DEMO.map((a) => (
                <li key={a.message} className="rounded-2xl bg-creme p-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-or">{a.objet}</span>
                    <span className="text-gris">{a.quand}</span>
                  </div>
                  <p className="text-sm mt-1.5">{a.message}</p>
                  {a.recontact && <p className="text-xs text-gris mt-1.5">↩ Souhaite être recontactée</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Ce que l'espace permettra */}
        <section className="rounded-3xl bg-noir text-creme p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 90% at 100% 100%, rgba(197,151,53,0.28), transparent 70%)" }} aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Dans la version complète</p>
            <h2 className="titre text-3xl mt-2">Tout gérer depuis votre téléphone</h2>
            <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {[
                "Changer un prix ou un stock en deux gestes",
                "Valider une commande et prévenir la cliente sur WhatsApp",
                "Être alertée quand un produit va manquer",
                "Suivre les paiements Wave et Orange Money",
                "Lire et répondre aux avis clients",
                "Voir les inscrites de la masterclass",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 rounded-2xl bg-white/5 ring-1 ring-white/10 p-3.5">
                  <span className="text-or-clair" aria-hidden>✦</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
