"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nomMarque } from "@/lib/catalogue";
import { formatPrix, lienWhatsApp } from "@/lib/config";
import { QUESTIONS, aUneAlerte, construireRoutine, type Domaine, type Reponses } from "@/lib/diagnostic";
import { usePanier } from "@/lib/panier";
import VisuelProduit from "@/components/VisuelProduit";

const HALO = "radial-gradient(50% 90% at 85% 0%, rgba(197,151,53,0.32), transparent 70%), radial-gradient(35% 60% at 0% 100%, rgba(227,199,126,0.10), transparent 70%)";

function Bandeau({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-noir text-creme">
      <div className="absolute inset-0" style={{ background: HALO }} aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 pt-10 pb-24 md:pt-14 text-center">{children}</div>
    </section>
  );
}

const DOMAINES: { id: Domaine; titre: string; texte: string; photo: string }[] = [
  { id: "peau", titre: "Ma peau", texte: "Taches, imperfections, hydratation, éclat", photo: "/produits/cerave-nettoyant-hydratant-236ml.jpg" },
  { id: "cheveux", titre: "Mes cheveux", texte: "Sécheresse, casse, pousse, boucles", photo: "/produits/mielle-huile-romarin-menthe-59ml.jpg" },
];

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

  // Accueil du diagnostic
  if (!domaine) {
    return (
      <>
        <Bandeau>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Diagnostic beauté · 2 minutes</p>
          <h1 className="titre text-5xl sm:text-6xl leading-[1.05] mt-3">
            Trouvons ensemble <span className="italic text-or-clair">votre routine.</span>
          </h1>
          <p className="mt-4 text-creme/75 text-lg max-w-xl mx-auto">
            Quelques questions simples, et nous vous proposons une routine pas à pas avec des produits authentiques.
          </p>
        </Bandeau>
        <div className="relative mx-auto max-w-3xl px-4 -mt-14 pb-14">
          <div className="grid sm:grid-cols-2 gap-4">
            {DOMAINES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDomaine(d.id)}
                className="group rounded-3xl bg-white p-5 text-left shadow-[0_20px_50px_-28px_rgba(20,16,11,0.55)] ring-1 ring-bordure/60 transition hover:-translate-y-1 hover:ring-or"
              >
                <span className="relative block aspect-[4/3] rounded-2xl bg-creme overflow-hidden">
                  <Image src={d.photo} alt="" fill sizes="(min-width: 640px) 45vw, 90vw" className="object-contain p-6 transition duration-500 group-hover:scale-105" />
                </span>
                <span className="mt-4 flex items-center justify-between gap-3">
                  <span>
                    <span className="block titre text-3xl">{d.titre}</span>
                    <span className="block text-sm text-gris">{d.texte}</span>
                  </span>
                  <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-noir text-white transition group-hover:bg-or">→</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gris">
            Ce diagnostic recommande des produits cosmétiques. Il ne remplace pas l&apos;avis d&apos;un médecin ou d&apos;un dermatologue.
          </p>
        </div>
      </>
    );
  }

  const questions = QUESTIONS[domaine];
  const termine = etape >= questions.length;

  // Questions
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
      <div className="bg-creme min-h-[70vh]">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="flex items-center justify-between text-sm text-gris">
            <button type="button" onClick={() => (etape === 0 ? recommencer() : setEtape(etape - 1))} className="hover:text-noir">
              ← Retour
            </button>
            <span className="prix">
              <span className="font-semibold text-noir">{etape + 1}</span> / {questions.length}
            </span>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {questions.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= etape ? "bg-gradient-to-r from-or-clair to-or" : "bg-white"}`} />
            ))}
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-or">
            {domaine === "peau" ? "Votre peau" : "Vos cheveux"}
          </p>
          <h1 className="titre text-4xl sm:text-5xl mt-2 leading-tight">{q.titre}</h1>
          {q.multiple && <p className="text-gris mt-2">Plusieurs réponses possibles.</p>}

          <div className="mt-7 space-y-3">
            {q.options.map((o) => {
              const actif = choisies.includes(o.valeur);
              return (
                <button
                  key={o.valeur}
                  type="button"
                  onClick={() => choisir(o.valeur)}
                  aria-pressed={actif}
                  className={`w-full flex items-center gap-4 text-left rounded-2xl bg-white p-4 sm:p-5 transition shadow-[0_12px_35px_-25px_rgba(20,16,11,0.5)] ring-2 ${actif ? "ring-or" : "ring-transparent hover:ring-or/40"}`}
                >
                  <span className={`grid place-items-center w-6 h-6 shrink-0 rounded-full border-2 transition ${actif ? "bg-or border-or text-white" : "border-bordure"}`}>
                    {actif && <span className="text-xs">✓</span>}
                  </span>
                  <span>
                    <span className="block font-semibold">{o.libelle}</span>
                    {o.aide && <span className="block text-sm text-gris">{o.aide}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          {q.multiple && (
            <button
              type="button"
              disabled={choisies.length === 0}
              onClick={() => setEtape(etape + 1)}
              className="mt-7 w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
            >
              Continuer
            </button>
          )}
        </div>
      </div>
    );
  }

  // Résultat
  const alerte = aUneAlerte(domaine, reponses);
  const routine = construireRoutine(domaine, reponses);
  const total = routine.reduce((t, e) => t + e.produit.prix, 0);

  return (
    <>
      <Bandeau>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Votre résultat</p>
        <h1 className="titre text-5xl sm:text-6xl leading-[1.05] mt-3">
          Votre routine <span className="italic text-or-clair">{domaine === "peau" ? "peau" : "cheveux"}</span>
        </h1>
        <p className="mt-4 text-creme/75">
          {routine.length} étape{routine.length > 1 ? "s" : ""}, choisie{routine.length > 1 ? "s" : ""} pour vous parmi nos produits authentiques.
        </p>
      </Bandeau>

      <div className="relative mx-auto max-w-3xl px-4 -mt-14 pb-14">
        {alerte && (
          <div className="mb-5 rounded-3xl border-2 border-amber-600 bg-amber-50 p-5">
            <p className="font-semibold">Nous vous conseillons de consulter un dermatologue.</p>
            <p className="text-sm mt-1">
              Les signes que vous décrivez méritent l&apos;avis d&apos;un médecin avant tout nouveau soin. Les produits ci-dessous
              sont des cosmétiques : ils ne soignent pas une affection de la peau ou du cuir chevelu.
            </p>
          </div>
        )}

        <ol className="rounded-3xl bg-white p-3 sm:p-4 shadow-[0_25px_70px_-30px_rgba(20,16,11,0.5)] divide-y divide-bordure/70">
          {routine.map((e, i) => (
            <li key={e.produit.slug} className="group flex gap-3 sm:gap-4 items-center p-2 sm:p-3">
              <Link href={`/produit/${e.produit.slug}`} className="relative w-16 sm:w-20 shrink-0">
                <VisuelProduit produit={e.produit} taille="vignette" />
                <span className="titre absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-b from-or-clair to-or text-white grid place-items-center text-base shadow">{i + 1}</span>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-or">
                  {e.etape} <span className="text-gris font-normal normal-case tracking-normal">· {e.moment}</span>
                </p>
                <Link href={`/produit/${e.produit.slug}`} className="block font-semibold leading-snug hover:text-or">
                  <span className="text-gris font-normal">{nomMarque(e.produit.marque)}</span> {e.produit.nom}
                </Link>
                <p className="text-sm text-gris hidden sm:block">{e.produit.accroche}</p>
              </div>
              <p className="prix font-bold shrink-0 text-sm sm:text-base">{formatPrix(e.produit.prix)}</p>
            </li>
          ))}
        </ol>

        {routine.length > 0 && (
          <div className="mt-5 relative overflow-hidden rounded-3xl bg-noir text-creme p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(60% 100% at 100% 0%, rgba(197,151,53,0.35), transparent 70%)" }} aria-hidden />
            <p className="relative">
              <span className="block text-xs uppercase tracking-[0.25em] text-or-clair">Routine complète</span>
              <span className="prix titre text-4xl">{formatPrix(total)}</span>
            </p>
            <div className="relative flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  routine.forEach((e) => ajouter(e.produit.slug));
                  setAjoute(true);
                }}
                className={`rounded-full px-6 py-3.5 font-semibold text-white transition ${ajoute ? "bg-green-800" : "bg-gradient-to-r from-or to-[#B0852A] shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] hover:brightness-110"}`}
              >
                {ajoute ? "✓ Routine ajoutée au panier" : "Ajouter toute la routine"}
              </button>
              {ajoute && <Link href="/panier" className="text-sm font-semibold text-or-clair">Voir mon panier →</Link>}
            </div>
          </div>
        )}

        <div className="mt-5 rounded-3xl bg-creme p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="titre text-2xl">Envie d&apos;un avis en personne ?</p>
            <p className="text-gris mt-1">Notre équipe réalise une analyse de peau et de cheveux à la boutique de Mermoz.</p>
          </div>
          <a
            href={lienWhatsApp(`Bonjour, je souhaite prendre rendez-vous pour une analyse ${domaine === "peau" ? "de peau" : "des cheveux"} à Mermoz.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-noir px-6 py-3 font-semibold text-white text-center transition hover:bg-or"
          >
            Prendre rendez-vous
          </a>
        </div>

        <button type="button" onClick={recommencer} className="mt-8 block mx-auto text-sm text-gris underline hover:text-noir">
          Refaire le diagnostic
        </button>
      </div>
    </>
  );
}
