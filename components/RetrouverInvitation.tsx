"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Après le paiement, la cliente retrouve elle-même sa carte d'invitation
// (téléphone + nom de famille), sans rien garder sur le téléphone.
export default function RetrouverInvitation() {
  const router = useRouter();
  const [telephone, setTelephone] = useState("");
  const [nom, setNom] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "inconnu" | "erreur">("saisie");

  async function chercher(e: React.FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    try {
      const rep = await fetch("/api/masterclass/billet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telephone, nom }),
      });
      const json = await rep.json();
      if (json.ok) return router.push(`/masterclass/billet/${json.code}`);
      setEtat(json.erreur === "inconnu" || json.erreur === "champs" ? "inconnu" : "erreur");
    } catch {
      setEtat("erreur");
    }
  }

  const champ = "w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3 outline-none focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15";
  return (
    <section id="invitation" className="mt-10 scroll-mt-6 rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-bordure/70">
      <h2 className="titre text-3xl text-center">Déjà payé ?</h2>
      <p className="text-gris text-center mt-1">Retrouvez et téléchargez votre carte d&apos;invitation.</p>
      <form onSubmit={chercher} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input value={telephone} onChange={(e) => setTelephone(e.target.value)} type="tel" inputMode="tel" placeholder="Votre téléphone" aria-label="Téléphone utilisé pour la réservation" className={champ} required />
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom de famille" aria-label="Nom de famille" className={champ} required />
        <button type="submit" disabled={etat === "envoi"} className="sm:col-span-2 rounded-full bg-noir text-white py-3.5 font-semibold hover:bg-or disabled:opacity-60">
          {etat === "envoi" ? "Recherche…" : "Retrouver mon invitation"}
        </button>
      </form>
      {etat === "inconnu" && (
        <p className="mt-3 text-sm text-red-800 text-center">Aucune réservation avec ce téléphone et ce nom. Vérifiez qu&apos;ils sont écrits comme lors de la réservation.</p>
      )}
      {etat === "erreur" && <p className="mt-3 text-sm text-red-800 text-center">La recherche n&apos;a pas abouti. Réessayez dans un instant.</p>}
    </section>
  );
}
