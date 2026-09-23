"use client";

import Link from "next/link";
import { useState } from "react";
import { nomMarque } from "@/lib/catalogue";
import { formatPrix, lienWhatsApp } from "@/lib/config";
import { QUESTIONS, aUneAlerte, construireRoutine, type Domaine, type Reponses } from "@/lib/diagnostic";
import { usePanier } from "@/lib/panier";
import VisuelProduit from "@/components/VisuelProduit";

export default function Diagnostic() {
  const [domaine, setDomaine] = useState<Domaine | null>(null);
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Reponses>({});
  const [ajoute, setAjoute] = useState(false);
  const { ajouter } = usePanier();

  function recommencer() {
    setDomaine(null);
    setEtape(0);
    setReponses({});
    setAjoute(false);
  }

  if (!domaine) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or">Diagnostic beauté · 2 minutes</p>
        <h1 className="titre text-5xl mt-3 leading-tight">Trouvons ensemble la routine qu&apos;il vous faut.</h1>
        <p className="text-gris mt-4 text-lg">
          Quelques questions simples, et nous vous proposons une routine pas à pas avec des produits authentiques.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {(["peau", "cheveux"] as Domaine[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomaine(d)}
              className="rounded-2xl border-2 border-bordure p-6 text-left hover:border-or hover:bg-creme"
            >
              <span className="titre text-3xl">{d === "peau" ? "Ma peau" : "Mes cheveux"}</span>
              <span className="block text-gris mt-1">
                {d === "peau" ? "Taches, imperfections, hydratation, éclat" : "Sécheresse, casse, pousse, boucles"}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-8 text-sm text-gris">
          Ce diagnostic recommande des produits cosmétiques. Il ne remplace pas l&apos;avis d&apos;un médecin ou d&apos;un dermatologue.
        </p>
      </div>
    );
  }

  const questions = QUESTIONS[domaine];
  const termine = etape >= questions.length;

  if (!termine) {
    const q = questions[etape];
    const choisies = reponses[q.id] ?? [];
    const choisir = (valeur: string) => {
      if (q.multiple) {
        setReponses((r) => {
          const actuelles = r[q.id] ?? [];
          return { ...r, [q.id]: actuelles.includes(valeur) ? actuelles.filter((v) => v !== valeur) : [...actuelles, valeur] };
        });
      } else {
        setReponses((r) => ({ ...r, [q.id]: [valeur] }));
        setEtape((e) => e + 1);
      }
    };

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-between text-sm text-gris">
          <button type="button" onClick={() => (etape === 0 ? recommencer() : setEtape(etape - 1))} className="underline">
            ← Retour
          </button>
          <span className="prix">Question {etape + 1} sur {questions.length}</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-creme overflow-hidden">
          <div className="h-full bg-or transition-all" style={{ width: `${((etape + 1) / questions.length) * 100}%` }} />
        </div>
        <h1 className="titre text-4xl mt-8">{q.titre}</h1>
        {q.multiple && <p className="text-gris mt-1">Plusieurs réponses possibles.</p>}
        <div className="mt-6 space-y-3">
          {q.options.map((o) => {
            const actif = choisies.includes(o.valeur);
            return (
              <button
                key={o.valeur}
                type="button"
                onClick={() => choisir(o.valeur)}
                aria-pressed={actif}
                className={`w-full text-left rounded-2xl border-2 p-4 ${actif ? "border-or bg-creme" : "border-bordure hover:border-or"}`}
              >
                <span className="font-semibold">{o.libelle}</span>
                {o.aide && <span className="block text-sm text-gris">{o.aide}</span>}
              </button>
            );
          })}
        </div>
        {q.multiple && (
          <button
            type="button"
            disabled={choisies.length === 0}
            onClick={() => setEtape(etape + 1)}
            className="mt-6 w-full rounded-full bg-or py-3.5 font-semibold text-white disabled:bg-gris/40"
          >
            Continuer
          </button>
        )}
      </div>
    );
  }

  const alerte = aUneAlerte(domaine, reponses);
  const routine = construireRoutine(domaine, reponses);
  const total = routine.reduce((t, e) => t + e.produit.prix, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or">Votre résultat</p>
      <h1 className="titre text-5xl mt-3">Votre routine {domaine === "peau" ? "peau" : "cheveux"}</h1>

      {alerte && (
        <div className="mt-6 rounded-2xl border-2 border-amber-600 bg-amber-50 p-5">
          <p className="font-semibold">Nous vous conseillons de consulter un dermatologue.</p>
          <p className="text-sm mt-1">
            Les signes que vous décrivez méritent l&apos;avis d&apos;un médecin avant tout nouveau soin. Les produits ci-dessous
            sont des cosmétiques : ils ne soignent pas une affection de la peau ou du cuir chevelu.
          </p>
        </div>
      )}

      <ol className="mt-8 space-y-4">
        {routine.map((e, i) => (
          <li key={e.produit.slug} className="flex gap-4 items-center rounded-2xl border border-bordure p-4">
            <span className="prix shrink-0 w-8 h-8 rounded-full bg-noir text-creme grid place-items-center font-bold text-sm">{i + 1}</span>
            <Link href={`/produit/${e.produit.slug}`} className="w-14 sm:w-20 shrink-0">
              <VisuelProduit produit={e.produit} />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-or">{e.etape} · <span className="text-gris font-normal">{e.moment}</span></p>
              <Link href={`/produit/${e.produit.slug}`} className="font-semibold hover:text-or">
                {nomMarque(e.produit.marque)} — {e.produit.nom}
              </Link>
              <p className="text-sm text-gris">{e.produit.accroche}</p>
            </div>
            <p className="prix font-bold">{formatPrix(e.produit.prix)}</p>
          </li>
        ))}
      </ol>

      {routine.length > 0 && (
        <div className="mt-6 rounded-2xl bg-creme p-5 flex flex-wrap items-center justify-between gap-4">
          <p>
            Routine complète : <strong className="prix text-xl">{formatPrix(total)}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              routine.forEach((e) => ajouter(e.produit.slug));
              setAjoute(true);
            }}
            className={`rounded-full px-6 py-3 font-semibold text-white ${ajoute ? "bg-noir" : "bg-or hover:bg-noir"}`}
          >
            {ajoute ? "✓ Routine ajoutée au panier" : "Ajouter toute la routine au panier"}
          </button>
        </div>
      )}
      {ajoute && (
        <Link href="/panier" className="mt-3 block text-right font-semibold text-or">Voir mon panier →</Link>
      )}

      <div className="mt-10 rounded-2xl bg-noir text-creme p-6">
        <p className="titre text-2xl text-or-clair">Envie d&apos;un avis en personne ?</p>
        <p className="text-creme/80 mt-2">Notre équipe réalise une analyse de peau et de cheveux à la boutique de Mermoz.</p>
        <a
          href={lienWhatsApp(`Bonjour, je souhaite prendre rendez-vous pour une analyse ${domaine === "peau" ? "de peau" : "des cheveux"} à Mermoz.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-or px-6 py-3 font-semibold text-white"
        >
          Prendre rendez-vous sur WhatsApp
        </a>
      </div>

      <button type="button" onClick={recommencer} className="mt-8 text-sm text-gris underline">Refaire le diagnostic</button>
    </div>
  );
}
