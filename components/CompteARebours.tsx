"use client";

import { useEffect, useState } from "react";

// Compte à rebours jusqu'au début de l'événement (heure de Dakar = UTC).
// Rien n'est affiché avant le premier calcul dans le navigateur, pour éviter
// un écart entre l'heure du serveur et celle du téléphone.
export default function CompteARebours({ debut }: { debut: number }) {
  const [maintenant, setMaintenant] = useState<number | null>(null);

  useEffect(() => {
    const tic = () => setMaintenant(Date.now());
    const premier = setTimeout(tic, 0);
    const minuterie = setInterval(tic, 1000);
    return () => {
      clearTimeout(premier);
      clearInterval(minuterie);
    };
  }, []);

  if (maintenant === null) return <div className="h-[92px]" aria-hidden />;
  const reste = debut - maintenant;
  if (reste <= -4 * 3600_000) return null; // l'événement est passé
  if (reste <= 0)
    return <p className="titre text-2xl text-or-clair">C&apos;est maintenant !</p>;

  const s = Math.floor(reste / 1000);
  const cases = [
    [Math.floor(s / 86400), "jours"],
    [Math.floor((s % 86400) / 3600), "heures"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "sec"],
  ] as const;

  return (
    <div role="timer" aria-label={`Début dans ${cases[0][0]} jours et ${cases[1][0]} heures`}>
      <p className="text-[11px] uppercase tracking-[0.3em] text-creme/60">Début dans</p>
      <div className="mt-2 flex justify-center gap-2 sm:gap-3">
        {cases.map(([n, libelle]) => (
          <div key={libelle} className="w-16 sm:w-20 rounded-2xl bg-white/5 ring-1 ring-or/40 py-2.5">
            <p className="prix font-semibold text-2xl sm:text-3xl text-or-clair leading-none">{String(n).padStart(2, "0")}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-creme/60">{libelle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
