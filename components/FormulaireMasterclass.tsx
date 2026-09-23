"use client";

import { useState } from "react";

type Resume = { titre: string; date: string; heure: string; lieu: string; restantes: number };
type Etat = "saisie" | "envoi" | "inscrit" | "complet" | "ferme" | "deja" | "erreur";

const MESSAGES: Partial<Record<Etat, string>> = {
  deja: "Ce numéro est déjà inscrit. Votre place est bien réservée : inutile de vous réinscrire.",
  erreur: "L'inscription n'a pas abouti. Vérifiez votre connexion internet puis réessayez.",
};

export default function FormulaireMasterclass({ evenement }: { evenement: Resume }) {
  const [etat, setEtat] = useState<Etat>("saisie");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [cliente, setCliente] = useState("");
  const [attentes, setAttentes] = useState("");
  const [site, setSite] = useState(""); // piège anti-robots
  const [tente, setTente] = useState(false);

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
        body: JSON.stringify({ prenom, nom, telephone, email, cliente, attentes, site }),
      });
      const json = await rep.json();
      if (json.ok) setEtat("inscrit");
      else if (json.erreur === "complet") setEtat("complet");
      else if (json.erreur === "ferme") setEtat("ferme");
      else if (json.erreur === "deja") setEtat("deja");
      else setEtat("erreur");
    } catch {
      setEtat("erreur");
    }
    requestAnimationFrame(() => document.getElementById("inscription")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  if (etat === "inscrit") {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-3xl shadow-[0_10px_30px_-8px_rgba(197,151,53,0.7)]">✓</div>
        <h2 className="titre text-4xl mt-4">Votre place est réservée</h2>
        <p className="text-gris mt-2">Merci {prenom} ! Nous avons hâte de vous accueillir.</p>

        {/* Billet */}
        <div className="relative mt-8 text-left rounded-3xl bg-noir text-creme overflow-hidden shadow-[0_25px_60px_-25px_rgba(20,16,11,0.6)]">
          <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(70% 60% at 100% 0%, rgba(197,151,53,0.35), transparent 70%)" }} aria-hidden />
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
          </dl>
        </div>
        <p className="text-sm text-gris mt-5">📸 Faites une capture d&apos;écran de votre invitation pour la garder.</p>
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
        <p className="text-sm text-gris mt-1">1 minute · gratuit</p>
      </div>
      {MESSAGES[etat] && (
        <p className={`rounded-xl p-4 text-sm ${etat === "deja" ? "bg-creme" : "border-2 border-red-700 bg-red-50"}`}>{MESSAGES[etat]}</p>
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

      <label className="block">
        <span className="text-sm font-semibold">Email <span className="font-normal text-gris">(facultatif)</span></span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className={`${champ} mt-1 border-bordure`} />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">Êtes-vous déjà client(e) de Sakaba Beauty ?</legend>
        <div className="mt-2 flex gap-2">
          {["Oui", "Non"].map((o) => (
            <button key={o} type="button" aria-pressed={cliente === o} onClick={() => setCliente(cliente === o ? "" : o)}
              className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition ${cliente === o ? "bg-noir text-white border-noir" : "border-bordure bg-creme/60 hover:border-or"}`}>
              {o}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Qu&apos;aimeriez-vous apprendre ? <span className="font-normal text-gris">(facultatif)</span></span>
        <textarea value={attentes} onChange={(e) => setAttentes(e.target.value)} rows={3} className={`${champ} mt-1 border-bordure`} />
      </label>

      <input value={site} onChange={(e) => setSite(e.target.value)} name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <button type="submit" disabled={etat === "envoi"} className="w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
        {etat === "envoi" ? "Inscription en cours…" : "Je m'inscris"}
      </button>
      <p className="text-xs text-gris text-center">
        Inscription gratuite. Vos coordonnées servent uniquement à l&apos;organisation de l&apos;événement.
      </p>
    </form>
  );
}
