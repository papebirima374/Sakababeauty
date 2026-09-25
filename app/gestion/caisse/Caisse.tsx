"use client";

import { useMemo, useState } from "react";
import VisuelProduit from "@/components/VisuelProduit";
import { PRODUITS, nomMarque, type Produit } from "@/lib/catalogue";
import { formatPrix } from "@/lib/config";

// Caisse de DÉMONSTRATION : les ventes et les stocks ne sont gardés que dans la
// page (rien n'est enregistré). Elle montre comment une vente en boutique
// mettra à jour le même stock que le site.
const PAIEMENTS = ["Espèces", "Wave", "Orange Money", "Carte"] as const;
type Paiement = (typeof PAIEMENTS)[number];

type Ligne = { produit: Produit; quantite: number };
type Recu = { numero: number; lignes: Ligne[]; total: number; paiement: Paiement; telephone: string; heure: string };

function sansAccents(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function numeroWhatsApp(tel: string) {
  const chiffres = tel.replace(/\D/g, "");
  return chiffres.length === 9 ? `221${chiffres}` : chiffres;
}

export default function Caisse() {
  const [stocks, setStocks] = useState<Record<string, number>>(() => Object.fromEntries(PRODUITS.map((p) => [p.slug, p.stock])));
  const [recherche, setRecherche] = useState("");
  const [ticket, setTicket] = useState<Ligne[]>([]);
  const [paiement, setPaiement] = useState<Paiement>("Espèces");
  const [telephone, setTelephone] = useState("");
  const [recu, setRecu] = useState<Recu | null>(null);
  const [ventes, setVentes] = useState<Recu[]>([]);

  const liste = useMemo(() => {
    const q = sansAccents(recherche.trim());
    return PRODUITS.filter((p) => !q || sansAccents(`${nomMarque(p.marque)} ${p.nom}`).includes(q));
  }, [recherche]);

  const total = ticket.reduce((t, l) => t + l.quantite * l.produit.prix, 0);
  const articles = ticket.reduce((t, l) => t + l.quantite, 0);

  function ajouter(p: Produit) {
    setTicket((t) => {
      const l = t.find((x) => x.produit.slug === p.slug);
      if (l) return t.map((x) => (x === l ? { ...x, quantite: Math.min(x.quantite + 1, stocks[p.slug]) } : x));
      return [...t, { produit: p, quantite: 1 }];
    });
  }

  function modifier(slug: string, quantite: number) {
    setTicket((t) => (quantite <= 0 ? t.filter((x) => x.produit.slug !== slug) : t.map((x) => (x.produit.slug === slug ? { ...x, quantite: Math.min(quantite, stocks[slug]) } : x))));
  }

  function encaisser() {
    const r: Recu = {
      numero: 301 + ventes.length,
      lignes: ticket,
      total,
      paiement,
      telephone: telephone.trim(),
      heure: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Dakar" }).format(new Date()),
    };
    setStocks((s) => {
      const n = { ...s };
      for (const l of ticket) n[l.produit.slug] -= l.quantite;
      return n;
    });
    setVentes((v) => [r, ...v]);
    setRecu(r);
  }

  function nouvelleVente() {
    setTicket([]);
    setTelephone("");
    setPaiement("Espèces");
    setRecu(null);
    setRecherche("");
  }

  const caJour = ventes.reduce((t, v) => t + v.total, 0);

  if (recu) {
    const texte = [
      `Sakaba Beauty — reçu n° B-${recu.numero} (${recu.heure})`,
      ...recu.lignes.map((l) => `• ${l.quantite} × ${nomMarque(l.produit.marque)} ${l.produit.nom} — ${formatPrix(l.quantite * l.produit.prix)}`),
      `Total : ${formatPrix(recu.total)} (${recu.paiement})`,
      "Merci pour votre visite à Mermoz !",
    ].join("\n");
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_25px_70px_-30px_rgba(20,16,11,0.45)] text-center">
          <div className="mx-auto w-16 h-16 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-3xl">✓</div>
          <h2 className="titre text-4xl mt-4">Vente enregistrée</h2>
          <p className="prix titre text-5xl font-semibold mt-3">{formatPrix(recu.total)}</p>
          <p className="text-gris mt-1">Reçu n° B-{recu.numero} · {recu.paiement} · {recu.heure}</p>
          <ul className="mt-6 text-left text-sm divide-y divide-bordure/70 rounded-2xl bg-creme px-4">
            {recu.lignes.map((l) => (
              <li key={l.produit.slug} className="py-2.5 flex justify-between gap-3">
                <span>{l.quantite} × {l.produit.nom}</span>
                <span className="text-gris whitespace-nowrap">stock {stocks[l.produit.slug] + l.quantite} → <strong className="text-noir">{stocks[l.produit.slug]}</strong></span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gris mt-2">Le stock du site est mis à jour en même temps.</p>
          <div className="mt-6 grid gap-2">
            {recu.telephone && (
              <a
                href={`https://wa.me/${numeroWhatsApp(recu.telephone)}?text=${encodeURIComponent(texte)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-noir text-white py-3.5 font-semibold hover:bg-or"
              >
                Envoyer le reçu sur WhatsApp
              </a>
            )}
            <button type="button" onClick={nouvelleVente} className="rounded-full bg-gradient-to-r from-or to-[#B0852A] text-white py-3.5 font-semibold hover:brightness-110">
              Nouvelle vente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-28 lg:pb-6 grid lg:grid-cols-[1fr_380px] gap-5 items-start">
      {ticket.length > 0 && (
        <a href="#ticket" className="lg:hidden fixed bottom-4 inset-x-4 z-30 flex items-center justify-between rounded-full bg-noir text-creme px-6 py-4 shadow-2xl ring-1 ring-or/40">
          <span className="font-semibold">Ticket · {articles} article{articles > 1 ? "s" : ""}</span>
          <span className="prix font-semibold text-or-clair">{formatPrix(total)} ↓</span>
        </a>
      )}
      <section className="min-w-0">
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Chercher un produit ou une marque…"
          className="w-full rounded-2xl border border-bordure bg-white px-4 py-3.5 outline-none focus:border-or focus:ring-4 focus:ring-or/15"
        />
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {liste.map((p) => {
            const stock = stocks[p.slug];
            const dansTicket = ticket.find((l) => l.produit.slug === p.slug)?.quantite ?? 0;
            const plein = stock === 0 || dansTicket >= stock;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  disabled={plein}
                  onClick={() => ajouter(p)}
                  className={`w-full text-left rounded-2xl bg-white p-2.5 ring-1 transition ${dansTicket ? "ring-2 ring-or" : "ring-bordure/70 hover:ring-or/60"} disabled:opacity-45`}
                >
                  <VisuelProduit produit={p} taille="vignette" />
                  <p className="text-[10px] uppercase tracking-wider text-gris mt-2">{nomMarque(p.marque)}</p>
                  <p className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5em]">{p.nom}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="prix text-sm font-semibold">{formatPrix(p.prix)}</span>
                    <span className={`text-[11px] ${stock === 0 ? "text-red-800 font-semibold" : stock <= 10 ? "text-amber-800 font-semibold" : "text-gris"}`}>
                      {stock === 0 ? "Épuisé" : `Stock ${stock}`}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside id="ticket" className="scroll-mt-4 rounded-3xl bg-white shadow-[0_25px_70px_-30px_rgba(20,16,11,0.45)] overflow-hidden lg:sticky lg:top-4">
        <div className="bg-noir text-creme px-5 py-4 flex items-baseline justify-between">
          <h2 className="titre text-2xl">Ticket</h2>
          <span className="text-sm text-creme/70">{articles} article{articles > 1 ? "s" : ""}</span>
        </div>
        <div className="p-5 space-y-5">
          {ticket.length === 0 ? (
            <p className="text-sm text-gris text-center py-6">Touchez un produit pour l&apos;ajouter.</p>
          ) : (
            <ul className="divide-y divide-bordure/70">
              {ticket.map((l) => (
                <li key={l.produit.slug} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{l.produit.nom}</p>
                    <p className="prix text-xs text-gris">{formatPrix(l.produit.prix)}</p>
                  </div>
                  <div className="flex items-center rounded-full bg-creme">
                    <button type="button" onClick={() => modifier(l.produit.slug, l.quantite - 1)} className="w-8 h-8" aria-label="Retirer un">−</button>
                    <span className="prix w-5 text-center text-sm">{l.quantite}</span>
                    <button type="button" onClick={() => modifier(l.produit.slug, l.quantite + 1)} className="w-8 h-8" aria-label="Ajouter un">+</button>
                  </div>
                  <p className="prix text-sm font-semibold w-20 text-right">{formatPrix(l.quantite * l.produit.prix)}</p>
                </li>
              ))}
            </ul>
          )}

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or mb-2">Paiement</legend>
            <div className="grid grid-cols-2 gap-2">
              {PAIEMENTS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={paiement === m}
                  onClick={() => setPaiement(m)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold ${paiement === m ? "bg-noir text-white border-noir" : "border-bordure hover:border-or"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or">Téléphone de la cliente</span>
            <span className="text-xs text-gris"> (facultatif : reçu WhatsApp, points fidélité)</span>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              type="tel"
              placeholder="77 000 00 00"
              className="mt-2 w-full rounded-xl border border-bordure bg-creme/60 px-4 py-3 outline-none focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15"
            />
          </label>

          <div className="flex items-baseline justify-between border-t border-bordure pt-4">
            <span className="titre text-2xl">Total</span>
            <span className="prix titre text-4xl font-semibold">{formatPrix(total)}</span>
          </div>
          <button
            type="button"
            disabled={ticket.length === 0}
            onClick={encaisser}
            className="w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
          >
            Encaisser
          </button>
        </div>
        <div className="border-t border-bordure bg-creme px-5 py-3 text-sm flex justify-between">
          <span className="text-gris">Ventes en boutique (cette session)</span>
          <span className="prix font-semibold">{ventes.length} · {formatPrix(caJour)}</span>
        </div>
      </aside>
    </div>
  );
}
