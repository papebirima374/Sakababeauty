"use client";

import { useEffect, useState } from "react";
import { formatPrix } from "@/lib/format";
import { lienWhatsApp } from "@/lib/config";

type Resume = { titre: string; date: string; heure: string; lieu: string; restantes: number };
type Etat = "saisie" | "envoi" | "wave" | "inscrit" | "complet" | "ferme" | "deja" | "erreur";

const MESSAGES: Partial<Record<Etat, string>> = {
  erreur: "L'inscription n'a pas abouti. Vérifiez votre connexion internet puis réessayez.",
};

// Les deux gestes après l'inscription : payer par Wave, puis envoyer la preuve.
function Paiement({ prix, montant, lienPaiement, nomComplet, telephone, titre }: { prix: number; montant: number; lienPaiement: string; nomComplet: string; telephone: string; titre: string }) {
  const message = `Bonjour Sakaba Beauty, je viens de payer ma place pour la ${titre}.\nNom : ${nomComplet}\nTéléphone : ${telephone}\n(capture du paiement Wave ci-jointe)`;
  return (
    <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-[0_20px_60px_-25px_rgba(20,16,11,0.35)] ring-2 ring-or/40">
      <p className="font-semibold text-lg">Paiement pas encore fait ? Payez avec Wave</p>
      <a href={lienPaiement} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-full bg-[#1DC8FF] py-4 text-lg font-semibold text-[#0B1B33] hover:brightness-105">
        Payer {formatPrix(prix)} avec Wave
      </a>
      <p className="text-xs text-gris mt-2">
        + {formatPrix(montant - prix)} de frais Wave, soit <span className="prix">{formatPrix(montant)}</span>, déjà rempli.
      </p>
      <p className="text-sm text-gris mt-5">
        Après le paiement :{" "}
        <a href={lienWhatsApp(message)} target="_blank" rel="noopener noreferrer" className="font-semibold text-noir underline hover:text-or">
          envoyez la capture sur WhatsApp
        </a>
      </p>
    </div>
  );
}

// Petit bouton pour inviter une amie : ouvre WhatsApp avec un message prêt.
function BoutonInviter({ evenement }: { evenement: Resume }) {
  function inviter() {
    const quand = [evenement.date && `le ${evenement.date}`, evenement.heure && `à ${evenement.heure}`].filter(Boolean).join(" ");
    const texte = `Je viens de réserver ma place pour la masterclass ${evenement.titre} de Sakaba Beauty${quand ? `, ${quand}` : ""} ✨ Réserve la tienne ici : ${window.location.origin}/masterclass`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texte)}`, "_blank", "noopener");
  }
  return (
    <button type="button" onClick={inviter} className="mt-4 inline-flex items-center gap-2 rounded-full border border-bordure bg-white px-4 py-2 text-sm font-semibold hover:border-or">
      <span aria-hidden>✉</span> Inviter une amie sur WhatsApp
    </button>
  );
}

export default function FormulaireMasterclass({ evenement, prix, montantWave, lienPaiement }: { evenement: Resume; prix: number; montantWave: number; lienPaiement: string }) {
  const [etat, setEtat] = useState<Etat>("saisie");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [site, setSite] = useState(""); // piège anti-robots
  const [tente, setTente] = useState(false);

  // La réservation est gardée sur le téléphone : au retour de Wave, la cliente
  // retrouve son invitation au lieu d'un formulaire vide.
  const cle = `masterclass:${evenement.titre}|${evenement.date}`;
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const r = JSON.parse(localStorage.getItem(cle) ?? "null");
        if (r?.prenom) {
          setPrenom(r.prenom);
          setNom(r.nom ?? "");
          setTelephone(r.telephone ?? "");
          setEtat("inscrit");
        }
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [cle]);
  function memoriser() {
    try {
      localStorage.setItem(cle, JSON.stringify({ prenom, nom, telephone }));
    } catch {}
  }
  function oublier() {
    try {
      localStorage.removeItem(cle);
    } catch {}
    setPrenom("");
    setNom("");
    setTelephone("");
    setTente(false);
    setEtat("saisie");
  }

  const telOk = telephone.replace(/\D/g, "").length >= 9;
  const valide = prenom.trim() && nom.trim() && telOk;

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setTente(true);
    if (!valide) return;
    setEtat("envoi");
    try {
      const rep = await fetch("/api/masterclass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, telephone, site }),
      });
      const json = await rep.json();
      if (json.ok) {
        // Réservation enregistrée : on part directement sur Wave pour payer.
        memoriser();
        setEtat("wave");
        window.location.href = lienPaiement;
        return;
      }
      if (json.erreur === "complet") setEtat("complet");
      else if (json.erreur === "ferme") setEtat("ferme");
      else if (json.erreur === "deja") {
        memoriser();
        setEtat("deja");
      } else setEtat("erreur");
    } catch {
      setEtat("erreur");
    }
    requestAnimationFrame(() => document.getElementById("inscription")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const paiement = (
    <Paiement prix={prix} montant={montantWave} lienPaiement={lienPaiement} nomComplet={`${prenom} ${nom}`.trim()} telephone={telephone} titre={evenement.titre} />
  );

  if (etat === "wave") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-25px_rgba(20,16,11,0.35)]">
        <p className="titre text-3xl">Ouverture de Wave…</p>
        <p className="text-gris mt-2">Si Wave ne s&apos;ouvre pas, appuyez ici :</p>
        <a href={lienPaiement} className="mt-4 block rounded-full bg-[#1DC8FF] py-4 text-lg font-semibold text-[#0B1B33]">Payer avec Wave</a>
      </div>
    );
  }

  if (etat === "deja") {
    return (
      <div className="text-center">
        <p className="text-or text-3xl">✦</p>
        <h2 className="titre text-3xl mt-2">Vous êtes déjà inscrit(e)</h2>
        <p className="text-gris mt-2">Ce numéro a déjà réservé une place : inutile de vous réinscrire. Si vous n&apos;avez pas encore payé, c&apos;est ici :</p>
        {paiement}
        <BoutonInviter evenement={evenement} />
      </div>
    );
  }

  if (etat === "inscrit") {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-3xl shadow-[0_10px_30px_-8px_rgba(var(--or-rgb),0.7)]">✓</div>
        <h2 className="titre text-4xl mt-4">Votre place est réservée</h2>
        <p className="text-gris mt-2">Merci {prenom} ! Votre place est confirmée dès réception du paiement.</p>
        {paiement}
        <BoutonInviter evenement={evenement} />

        {/* Billet */}
        <div className="relative mt-8 text-left rounded-3xl bg-noir text-creme overflow-hidden shadow-[0_25px_60px_-25px_rgba(20,16,11,0.6)]">
          <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(70% 60% at 100% 0%, rgba(var(--or-rgb),0.35), transparent 70%)" }} aria-hidden />
          <div className="relative p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-or-clair">Invitation · Sakaba Beauty</p>
            <p className="titre text-3xl sm:text-4xl mt-2">{evenement.titre}</p>
            <p className="mt-4 text-sm text-creme/60">Au nom de</p>
            <p className="text-xl font-semibold">{prenom} {nom}</p>
          </div>
          <div className="relative flex items-center" aria-hidden>
            <span className="w-6 h-6 -ml-3 rounded-full bg-creme" />
            <span className="flex-1 border-t-2 border-dashed border-creme/25" />
            <span className="w-6 h-6 -mr-3 rounded-full bg-creme" />
          </div>
          <dl className="relative grid grid-cols-2 gap-4 p-6 sm:p-8 text-sm">
            {evenement.date && (<div className="col-span-2 sm:col-span-1"><dt className="text-creme/60">Date</dt><dd className="font-semibold first-letter:uppercase">{evenement.date}</dd></div>)}
            {evenement.heure && (<div><dt className="text-creme/60">Heure</dt><dd className="font-semibold">{evenement.heure}</dd></div>)}
            {evenement.lieu && (<div className="col-span-2"><dt className="text-creme/60">Lieu</dt><dd className="font-semibold">{evenement.lieu}</dd></div>)}
            <div className="col-span-2"><dt className="text-creme/60">Participation</dt><dd className="font-semibold"><span className="prix">{formatPrix(prix)}</span> · confirmée à réception du paiement Wave<span className="block text-xs font-normal text-creme/55">+ {formatPrix(montantWave - prix)} de frais Wave</span></dd></div>
          </dl>
        </div>
        <p className="text-sm text-gris mt-5">📸 Faites une capture d&apos;écran de votre invitation pour la garder.</p>
        <button type="button" onClick={oublier} className="mt-3 text-xs text-gris underline hover:text-or">
          Réserver pour une autre personne
        </button>
      </div>
    );
  }

  if (etat === "complet" || etat === "ferme") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-25px_rgba(20,16,11,0.35)]">
        <p className="text-or text-3xl">✦</p>
        <h2 className="titre text-3xl mt-2">{etat === "complet" ? "C'est complet !" : "Les inscriptions sont closes"}</h2>
        <p className="text-gris mt-3">
          {etat === "complet"
            ? "Toutes les places viennent d'être réservées. Suivez @sakababeauty sur Instagram pour les prochaines dates."
            : "Merci de votre intérêt. Suivez @sakababeauty sur Instagram pour les prochaines dates."}
        </p>
      </div>
    );
  }

  const champ = "w-full rounded-2xl border bg-creme/60 px-4 py-3.5 outline-none transition focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15";
  const erreur = (ok: boolean | string) => (tente && !ok ? "border-red-700" : "border-bordure");

  return (
    <form onSubmit={envoyer} className="relative rounded-3xl bg-white p-6 sm:p-10 space-y-5 shadow-[0_25px_70px_-30px_rgba(20,16,11,0.45)] overflow-hidden" noValidate>
      <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-or-clair via-or to-or-clair" aria-hidden />
      <div className="text-center">
        <h2 className="titre text-4xl">Je réserve ma place</h2>
        <p className="text-sm text-gris mt-1">30 secondes · paiement par Wave</p>
      </div>
      {MESSAGES[etat] && (
        <p className="rounded-xl p-4 text-sm border-2 border-red-700 bg-red-50">{MESSAGES[etat]}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold">Prénom *</span>
          <input value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" className={`${champ} mt-1 ${erreur(prenom.trim())}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Nom *</span>
          <input value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" className={`${champ} mt-1 ${erreur(nom.trim())}`} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Téléphone (WhatsApp) *</span>
        <input value={telephone} onChange={(e) => setTelephone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="77 123 45 67" className={`${champ} mt-1 ${erreur(telOk)}`} />
        {tente && !telOk && <span className="text-sm text-red-700">Numéro incomplet.</span>}
      </label>

      <input value={site} onChange={(e) => setSite(e.target.value)} name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <button type="submit" disabled={etat === "envoi"} className="w-full rounded-full bg-gradient-to-r from-or to-(--or-fonce) py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(var(--or-rgb),0.8)] transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
        {etat === "envoi" ? "Réservation en cours…" : "Confirmer ma place et payer avec Wave"}
      </button>
      <p className="text-xs text-gris text-center">
        Vous êtes dirigée vers Wave pour payer {formatPrix(prix)} (+ {formatPrix(montantWave - prix)} de frais). Votre place est confirmée dès réception du paiement. Vos coordonnées servent uniquement à l&apos;organisation de l&apos;événement.
      </p>
    </form>
  );
}
