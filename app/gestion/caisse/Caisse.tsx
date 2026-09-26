"use client";

import { useMemo, useRef, useState } from "react";
import { formatPrix } from "@/lib/config";

// Écran de caisse de comptoir : lecture de codes-barres (une douchette USB se
// comporte comme un clavier), pavé numérique, remise, rendu de monnaie, ticket
// imprimable et clôture. Il ne sait pas d'où viennent les produits : la
// démonstration (CaisseDemo) ou la vraie base (CaisseFirebase) les lui donnent.

export type Article = { id: string; nom: string; marqueNom: string; prix: number; stock: number; codeBarre: string };
export const PAIEMENTS = ["Espèces", "Wave", "Orange Money", "Carte"] as const;
export type Paiement = (typeof PAIEMENTS)[number];
export type Ligne = { id: string; nom: string; marqueNom: string; codeBarre: string; prix: number; quantite: number; remise: number };
export type Vente = {
  numero: string;
  lignes: Ligne[];
  total: number;
  paiement: Paiement;
  recu: number;
  heure: string;
  vendeuse: string;
  telephone: string;
  enAttente?: boolean; // pas encore arrivée sur le serveur (hors connexion)
};
type Mode = "quantite" | "remise" | "recu";

const sansAccents = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export const montantLigne = (l: Ligne) => Math.round((l.quantite * l.prix * (100 - l.remise)) / 100);
const numeroWhatsApp = (tel: string) => {
  const c = tel.replace(/\D/g, "");
  return c.length === 9 ? `221${c}` : c;
};
// Numéro de ticket unique même hors connexion : date + 4 caractères au hasard.
function nouveauNumero() {
  const d = new Intl.DateTimeFormat("fr-CA", { year: "2-digit", month: "2-digit", day: "2-digit", timeZone: "Africa/Dakar" }).format(new Date()).replace(/-/g, "");
  return `${d}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default function EcranCaisse({
  articles,
  ventes,
  enregistrer,
  vendeuses,
  vendeuseFixe,
  erreur,
}: {
  articles: Article[];
  ventes: Vente[];
  enregistrer: (v: Vente) => void;
  vendeuses?: string[];
  vendeuseFixe?: string;
  erreur?: string;
}) {
  const stocks = useMemo(() => Object.fromEntries(articles.map((a) => [a.id, a.stock])) as Record<string, number>, [articles]);
  const parCode = useMemo(() => new Map(articles.map((a) => [a.codeBarre, a])), [articles]);
  const [saisie, setSaisie] = useState("");
  const [ticket, setTicket] = useState<Ligne[]>([]);
  const [selection, setSelection] = useState(0);
  const [pave, setPave] = useState("");
  const [recu, setRecu] = useState(0);
  const [paiement, setPaiement] = useState<Paiement>("Espèces");
  const [telephone, setTelephone] = useState("");
  const [vendeuseChoisie, setVendeuse] = useState(vendeuses?.[0] ?? "");
  const vendeuse = vendeuseFixe ?? vendeuseChoisie;
  const [message, setMessage] = useState<{ texte: string; erreur?: boolean } | null>(null);
  const [derniere, setDerniere] = useState<Vente | null>(null);
  const [cloture, setCloture] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  const total = ticket.reduce((t, l) => t + montantLigne(l), 0);
  const nbArticles = ticket.reduce((t, l) => t + l.quantite, 0);
  const rendu = paiement === "Espèces" ? recu - total : 0;
  const peutValider = ticket.length > 0 && (paiement !== "Espèces" || recu >= total);

  const suggestions = useMemo(() => {
    const q = sansAccents(saisie.trim());
    if (!q || /^\d+$/.test(q)) return [];
    return articles.filter((a) => sansAccents(`${a.marqueNom} ${a.nom}`).includes(q)).slice(0, 6);
  }, [saisie, articles]);

  function annoncer(texte: string, erreur = false) {
    setMessage({ texte, erreur });
  }

  function ajouter(a: Article) {
    const deja = ticket.find((l) => l.id === a.id)?.quantite ?? 0;
    if (deja + 1 > stocks[a.id]) {
      annoncer(`${a.nom} : plus de stock (${stocks[a.id]}).`, true);
      return;
    }
    const i = ticket.findIndex((l) => l.id === a.id);
    if (i >= 0) {
      setTicket(ticket.map((l, j) => (j === i ? { ...l, quantite: l.quantite + 1 } : l)));
      setSelection(i);
    } else {
      setTicket([...ticket, { id: a.id, nom: a.nom, marqueNom: a.marqueNom, codeBarre: a.codeBarre, prix: a.prix, quantite: 1, remise: 0 }]);
      setSelection(ticket.length);
    }
    annoncer(`${a.marqueNom} ${a.nom} · ${formatPrix(a.prix)}`);
    setSaisie("");
    champ.current?.focus();
  }

  function valider(e: React.FormEvent) {
    e.preventDefault();
    const s = saisie.trim();
    if (!s) return;
    const a = parCode.get(s.replace(/\s/g, ""));
    if (a) return ajouter(a);
    if (suggestions.length === 1) return ajouter(suggestions[0]);
    annoncer(/^\d+$/.test(s) ? `Code ${s} inconnu.` : "Choisissez l'article dans la liste.", true);
  }

  function scannerDemo() {
    const dispo = articles.filter((a) => stocks[a.id] > 0);
    if (!dispo.length) return;
    ajouter(dispo[Math.floor(Math.random() * dispo.length)]);
  }

  function touche(t: string) {
    if (t === "C") return setPave("");
    if (t === "←") return setPave((p) => p.slice(0, -1));
    setPave((p) => (p + t).replace(/^0+(?=\d)/, "").slice(0, 9));
  }

  function appliquer(mode: Mode) {
    const n = Number(pave || "0");
    const l = ticket[selection];
    if (mode === "recu") {
      setRecu(n);
      setPaiement("Espèces");
    } else if (!l) {
      annoncer("Sélectionnez d'abord une ligne du ticket.", true);
      return;
    } else if (mode === "quantite") {
      if (n === 0) {
        setTicket((t) => t.filter((_, i) => i !== selection));
        setSelection(0);
      } else if (n > stocks[l.id]) {
        annoncer(`Stock insuffisant : ${stocks[l.id]} disponible(s).`, true);
        return;
      } else setTicket((t) => t.map((x, i) => (i === selection ? { ...x, quantite: n } : x)));
    } else {
      setTicket((t) => t.map((x, i) => (i === selection ? { ...x, remise: Math.min(n, 50) } : x)));
      if (n > 50) annoncer("Remise limitée à 50 % dans la démo.", true);
    }
    setPave("");
  }

  function encaisser() {
    if (!peutValider) return;
    const v: Vente = {
      numero: nouveauNumero(),
      lignes: ticket,
      total,
      paiement,
      recu: paiement === "Espèces" ? recu : total,
      heure: new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Dakar" }).format(new Date()),
      vendeuse,
      telephone: telephone.trim(),
    };
    enregistrer(v);
    setDerniere(v);
    setTicket([]);
    setRecu(0);
    setPave("");
    setTelephone("");
    setPaiement("Espèces");
    setMessage(null);
  }

  // ——— Ticket de caisse (80 mm, imprimable) ———
  if (derniere) {
    const texte = [
      `SAKABA BEAUTY — Ticket n° ${derniere.numero} (${derniere.heure})`,
      ...derniere.lignes.map((l) => `${l.quantite} × ${l.marqueNom} ${l.nom}${l.remise ? ` (-${l.remise} %)` : ""} : ${formatPrix(montantLigne(l))}`),
      `TOTAL : ${formatPrix(derniere.total)} — ${derniere.paiement}`,
      "Merci pour votre visite à Mermoz !",
    ].join("\n");
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 grid md:grid-cols-[320px_1fr] gap-6 items-start print:block print:p-0">
        <div id="ticket-caisse" className="bg-white text-black font-mono text-[12px] leading-snug p-5 shadow-[0_25px_60px_-30px_rgba(20,16,11,0.5)] print:shadow-none print:p-0 print:w-[72mm]">
          <p className="text-center font-bold text-sm">SAKABA BEAUTY</p>
          <p className="text-center">Mermoz Ancienne Piste, Dakar</p>
          <p className="text-center">78 588 54 54 · 78 303 24 24</p>
          <p className="mt-2 border-t border-dashed border-black pt-2">Ticket n° {derniere.numero}</p>
          <p>{derniere.heure} · {derniere.vendeuse}</p>
          <div className="mt-2 border-t border-dashed border-black pt-2 space-y-1.5">
            {derniere.lignes.map((l) => (
              <div key={l.codeBarre}>
                <p>{l.marqueNom} {l.nom}</p>
                <p className="flex justify-between">
                  <span>{l.quantite} × {formatPrix(l.prix)}{l.remise ? ` −${l.remise} %` : ""}</span>
                  <span>{formatPrix(montantLigne(l))}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 border-t border-dashed border-black pt-2 flex justify-between font-bold text-sm"><span>TOTAL</span><span>{formatPrix(derniere.total)}</span></p>
          <p className="flex justify-between"><span>{derniere.paiement}</span><span>{formatPrix(derniere.recu)}</span></p>
          {derniere.paiement === "Espèces" && <p className="flex justify-between"><span>Rendu</span><span>{formatPrix(derniere.recu - derniere.total)}</span></p>}
          <p className="mt-3 text-center">Produits 100 % authentiques</p>
          <p className="text-center">Merci et à bientôt !</p>
          <p className="mt-2 text-center text-[10px]">TICKET DE DÉMONSTRATION</p>
        </div>
        <div className="space-y-3 print:hidden">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-bordure/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or">Vente enregistrée</p>
            <p className="prix titre text-5xl font-semibold mt-1">{formatPrix(derniere.total)}</p>
            {derniere.paiement === "Espèces" && (
              <p className="mt-2 text-lg">Monnaie à rendre : <strong className="prix">{formatPrix(derniere.recu - derniere.total)}</strong></p>
            )}
            <ul className="mt-4 text-sm text-gris space-y-1">
              {derniere.lignes.map((l) => (
                <li key={l.codeBarre}>
                  {l.nom} : stock {stocks[l.id] + l.quantite} → <strong className="text-noir">{stocks[l.id]}</strong>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gris mt-2">Même stock pour la boutique et le site.</p>
          </div>
          <button type="button" onClick={() => window.print()} className="w-full rounded-full bg-noir text-white py-3.5 font-semibold hover:bg-or">
            Imprimer le ticket
          </button>
          {derniere.telephone && (
            <a
              href={`https://wa.me/${numeroWhatsApp(derniere.telephone)}?text=${encodeURIComponent(texte)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center rounded-full border border-bordure bg-white py-3.5 font-semibold hover:border-or"
            >
              Envoyer le ticket sur WhatsApp
            </a>
          )}
          <button
            type="button"
            autoFocus
            onClick={() => { setDerniere(null); setTimeout(() => champ.current?.focus(), 0); }}
            className="w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] text-white py-4 text-lg font-semibold hover:brightness-110"
          >
            Nouvelle vente
          </button>
        </div>
      </div>
    );
  }

  // ——— Clôture de caisse ———
  if (cloture) {
    const parMode = PAIEMENTS.map((m) => ({ m, n: ventes.filter((v) => v.paiement === m).length, t: ventes.filter((v) => v.paiement === m).reduce((s, v) => s + v.total, 0) }));
    const totalJour = ventes.reduce((s, v) => s + v.total, 0);
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-bordure/70">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or">Clôture de caisse</p>
          <p className="prix titre text-5xl font-semibold mt-1">{formatPrix(totalJour)}</p>
          <p className="text-gris">{ventes.length} ticket{ventes.length > 1 ? "s" : ""}{ventes.length ? ` · panier moyen ${formatPrix(Math.round(totalJour / ventes.length))}` : ""}</p>
          {ventes.some((v) => v.enAttente) && (
            <p className="mt-3 rounded-2xl bg-amber-50 ring-1 ring-amber-300 p-3 text-sm text-amber-900">
              ! {ventes.filter((v) => v.enAttente).length} vente(s) pas encore envoyée(s) : pas de connexion. Elles partiront toutes seules au retour d&apos;internet.
            </p>
          )}
          <table className="mt-5 w-full text-sm">
            <tbody>
              {parMode.map((x) => (
                <tr key={x.m} className="border-b border-bordure/70">
                  <td className="py-2.5 font-semibold">{x.m}</td>
                  <td className="py-2.5 text-gris text-right">{x.n} ticket{x.n > 1 ? "s" : ""}</td>
                  <td className="py-2.5 prix font-semibold text-right">{formatPrix(x.t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm rounded-2xl bg-creme p-4">
            Espèces attendues dans le tiroir : <strong className="prix">{formatPrix(parMode[0].t)}</strong> (plus le fond de caisse).
            À comparer avec le comptage réel.
          </p>
          <button type="button" onClick={() => setCloture(false)} className="mt-5 w-full rounded-full bg-noir text-white py-3.5 font-semibold hover:bg-or">
            Retour à la caisse
          </button>
        </div>
      </div>
    );
  }

  // ——— Écran de vente ———
  const bouton = "rounded-xl font-semibold transition active:scale-95";
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 grid lg:grid-cols-[1fr_400px] gap-4 items-start">
      <section className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {vendeuseFixe ? (
            <span className="rounded-xl bg-white ring-1 ring-bordure px-3 py-2 font-semibold">{vendeuseFixe}</span>
          ) : (
            <select value={vendeuse} onChange={(e) => setVendeuse(e.target.value)} className="rounded-xl border border-bordure bg-white px-3 py-2 font-semibold" aria-label="Vendeuse">
              {(vendeuses ?? []).map((v) => <option key={v}>{v}</option>)}
            </select>
          )}
          <span className="text-gris">Caisse 1 · {ventes.length} ticket{ventes.length > 1 ? "s" : ""} aujourd&apos;hui</span>
          <span className="flex-1" />
          <button type="button" onClick={() => setCloture(true)} className="rounded-xl border border-bordure bg-white px-3 py-2 font-semibold hover:border-or">
            Clôture ({ventes.length})
          </button>
        </div>

        <form onSubmit={valider} className="relative">
          <div className="flex gap-2">
            <input
              ref={champ}
              autoFocus
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Scanner un code-barres, ou taper un nom…"
              className="flex-1 min-w-0 rounded-2xl border-2 border-or/60 bg-white px-4 py-3.5 text-lg outline-none focus:border-or focus:ring-4 focus:ring-or/15"
              aria-label="Code-barres ou nom du produit"
            />
            <button type="button" onClick={scannerDemo} className="shrink-0 rounded-2xl bg-noir text-white px-4 font-semibold hover:bg-or" title="Simule le bip d'une douchette">
              ▥ Scan démo
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 rounded-2xl bg-white shadow-xl ring-1 ring-bordure overflow-hidden">
              {suggestions.map((a) => (
                <li key={a.codeBarre}>
                  <button type="button" onClick={() => ajouter(a)} className="w-full text-left px-4 py-2.5 hover:bg-creme flex justify-between gap-3">
                    <span className="truncate"><span className="text-gris">{a.marqueNom}</span> {a.nom}</span>
                    <span className="prix shrink-0 font-semibold">{formatPrix(a.prix)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
        <p className={`min-h-6 text-sm ${message?.erreur ? "text-red-800 font-semibold" : "text-gris"}`} role="status">
          {message?.texte ?? "Prête. Scannez un article."}
        </p>
        {erreur && <p className="rounded-xl bg-red-50 ring-1 ring-red-300 p-3 text-sm text-red-900">{erreur}</p>}

        <div className="rounded-2xl bg-white ring-1 ring-bordure/70 overflow-hidden">
          <div className="grid grid-cols-[1fr_3rem_5.5rem_6rem] sm:grid-cols-[8.5rem_1fr_3.5rem_6rem_7rem] gap-2 px-3 py-2 bg-noir text-creme text-xs font-semibold uppercase tracking-wider">
            <span className="hidden sm:block">Code</span><span>Article</span><span className="text-right">Qté</span><span className="text-right">P.U.</span><span className="text-right">Montant</span>
          </div>
          {ticket.length === 0 ? (
            <p className="px-4 py-10 text-center text-gris">Ticket vide</p>
          ) : (
            <ul>
              {ticket.map((l, i) => (
                <li key={l.codeBarre}>
                  <button
                    type="button"
                    onClick={() => setSelection(i)}
                    className={`w-full text-left grid grid-cols-[1fr_3rem_5.5rem_6rem] sm:grid-cols-[8.5rem_1fr_3.5rem_6rem_7rem] gap-2 px-3 py-2.5 border-b border-bordure/60 text-sm ${i === selection ? "bg-or/15" : "hover:bg-creme"}`}
                  >
                    <span className="hidden sm:block prix text-xs text-gris pt-0.5">{l.codeBarre}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{l.nom}</span>
                      <span className="block text-xs text-gris">{l.marqueNom}{l.remise ? <strong className="text-or"> · remise {l.remise} %</strong> : ""}</span>
                    </span>
                    <span className="prix text-right font-semibold">{l.quantite}</span>
                    <span className="prix text-right">{formatPrix(l.prix)}</span>
                    <span className="prix text-right font-semibold">{formatPrix(montantLigne(l))}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="rounded-2xl bg-white ring-1 ring-bordure/70 p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Codes-barres de démonstration</summary>
          <p className="text-xs text-gris mt-1">À taper dans le champ ci-dessus (ou à scanner une fois imprimés).</p>
          <ul className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1">
            {articles.map((a) => (
              <li key={a.codeBarre} className="flex justify-between gap-2">
                <span className="truncate">{a.nom}</span>
                <span className="prix text-gris shrink-0">{a.codeBarre} · <span className={stocks[a.id] ? "" : "text-red-800"}>st. {stocks[a.id]}</span></span>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <aside className="space-y-3 lg:sticky lg:top-3">
        <div className="rounded-2xl bg-noir text-creme p-4 ring-1 ring-or/40">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-creme/60">
            <span>{nbArticles} article{nbArticles > 1 ? "s" : ""}</span><span>Total</span>
          </div>
          <p className="prix text-right text-5xl font-semibold text-or-clair mt-1">{formatPrix(total)}</p>
          {paiement === "Espèces" && recu > 0 && (
            <div className="mt-2 pt-2 border-t border-creme/15 text-sm flex justify-between">
              <span>Reçu {formatPrix(recu)}</span>
              <span className={rendu < 0 ? "text-red-300 font-semibold" : "text-green-300 font-semibold"}>
                {rendu < 0 ? `Manque ${formatPrix(-rendu)}` : `À rendre ${formatPrix(rendu)}`}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-bordure/70 p-3">
          <p className="prix text-right text-2xl font-semibold rounded-xl bg-creme px-3 py-2 min-h-12">{pave || "0"}</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {["7", "8", "9", "C", "4", "5", "6", "←", "1", "2", "3", "00"].map((t) => (
              <button key={t} type="button" onClick={() => touche(t)} className={`${bouton} py-3 text-lg ${t === "C" ? "bg-red-50 text-red-900" : t === "←" || t === "00" ? "bg-creme" : "bg-creme/60 ring-1 ring-bordure"}`}>
                {t}
              </button>
            ))}
            <button type="button" onClick={() => touche("0")} className={`${bouton} py-3 text-lg bg-creme/60 ring-1 ring-bordure col-span-2`}>0</button>
            <button type="button" onClick={() => appliquer("quantite")} className={`${bouton} py-3 text-sm bg-noir text-white`}>Qté</button>
            <button type="button" onClick={() => appliquer("remise")} className={`${bouton} py-3 text-sm bg-noir text-white`}>Remise %</button>
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <button type="button" onClick={() => appliquer("recu")} className={`${bouton} py-3 bg-or/15 text-noir ring-1 ring-or/50`}>
              Montant reçu (espèces)
            </button>
            <button type="button" disabled={!total} onClick={() => { setRecu(total); setPaiement("Espèces"); }} className={`${bouton} px-4 py-3 bg-creme ring-1 ring-bordure disabled:opacity-40`}>
              Compte juste
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-bordure/70 p-3 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {PAIEMENTS.map((m) => (
              <button key={m} type="button" aria-pressed={paiement === m} onClick={() => setPaiement(m)} className={`${bouton} py-2.5 text-xs sm:text-sm ${paiement === m ? "bg-noir text-white" : "bg-creme"}`}>
                {m}
              </button>
            ))}
          </div>
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            type="tel"
            placeholder="Téléphone cliente (ticket WhatsApp, fidélité)"
            className="w-full rounded-xl border border-bordure bg-creme/60 px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-or"
          />
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button type="button" disabled={!ticket.length} onClick={() => { setTicket([]); setRecu(0); setMessage(null); }} className={`${bouton} px-4 py-4 bg-creme disabled:opacity-40`}>
              Annuler
            </button>
            <button
              type="button"
              disabled={!peutValider}
              onClick={encaisser}
              className={`${bouton} py-4 text-lg text-white bg-gradient-to-r from-or to-[#B0852A] shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] disabled:opacity-40 disabled:shadow-none`}
            >
              {paiement === "Espèces" && ticket.length > 0 && recu < total ? "Saisir le montant reçu" : "Encaisser"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
