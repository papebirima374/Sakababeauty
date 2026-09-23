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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (etat === "inscrit") {
    return (
      <div className="rounded-3xl bg-white border-2 border-or-clair p-8 text-center">
        <p className="text-5xl text-or">✦</p>
        <h2 className="titre text-4xl mt-3">Inscription enregistrée</h2>
        <p className="mt-3">Merci {prenom} ! Votre place est réservée.</p>
        <dl className="mt-6 inline-grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left">
          <dt className="text-gris">Événement</dt><dd className="font-semibold">{evenement.titre}</dd>
          {evenement.date && (<><dt className="text-gris">Date</dt><dd className="font-semibold first-letter:uppercase">{evenement.date}</dd></>)}
          {evenement.heure && (<><dt className="text-gris">Heure</dt><dd className="font-semibold">{evenement.heure}</dd></>)}
          {evenement.lieu && (<><dt className="text-gris">Lieu</dt><dd className="font-semibold">{evenement.lieu}</dd></>)}
        </dl>
        <p className="text-sm text-gris mt-6">Faites une capture d&apos;écran de cette page pour la garder.</p>
      </div>
    );
  }

  if (etat === "complet" || etat === "ferme") {
    return (
      <div className="rounded-3xl bg-white border border-bordure p-8 text-center">
        <h2 className="titre text-3xl">{etat === "complet" ? "C'est complet !" : "Les inscriptions sont closes"}</h2>
        <p className="text-gris mt-3">
          {etat === "complet"
            ? "Toutes les places viennent d'être réservées. Suivez @sakababeauty sur Instagram pour les prochaines dates."
            : "Merci de votre intérêt. Suivez @sakababeauty sur Instagram pour les prochaines dates."}
        </p>
      </div>
    );
  }

  const champ = "w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-or";
  const erreur = (ok: boolean | string) => (tente && !ok ? "border-red-700" : "border-bordure");

  return (
    <form onSubmit={envoyer} className="rounded-3xl bg-white border border-bordure p-5 sm:p-8 space-y-4" noValidate>
      <h2 className="titre text-3xl">Je réserve ma place</h2>
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
              className={`rounded-full border px-5 py-2 text-sm ${cliente === o ? "bg-noir text-white border-noir" : "border-bordure hover:border-or"}`}>
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

      <button type="submit" disabled={etat === "envoi"} className="w-full rounded-full bg-or py-4 text-lg font-semibold text-white hover:bg-noir disabled:bg-gris/50">
        {etat === "envoi" ? "Inscription en cours…" : "Je m'inscris"}
      </button>
      <p className="text-xs text-gris text-center">
        Inscription gratuite. Vos coordonnées servent uniquement à l&apos;organisation de l&apos;événement.
      </p>
    </form>
  );
}
