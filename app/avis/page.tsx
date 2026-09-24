import type { Metadata } from "next";
import Image from "next/image";
import FormulaireAvis from "@/components/FormulaireAvis";

export const metadata: Metadata = {
  title: "Votre avis compte",
  description:
    "Partagez une suggestion, signalez un problème ou faites une réclamation. Votre avis aide Sakaba Beauty à améliorer ses services.",
  openGraph: {
    title: "Sakaba Beauty — Votre avis compte",
    description:
      "Partagez une suggestion, signalez un problème ou faites une réclamation. Votre avis aide Sakaba Beauty à améliorer ses services.",
  },
};

// Page autonome (sans le menu de la boutique) : c'est le lien envoyé aux clientes.
export default function PageAvis() {
  return (
    <main className="flex-1 bg-creme">
      <section className="relative overflow-hidden bg-noir text-creme">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(60% 55% at 50% 0%, rgba(197,151,53,0.35), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl px-4 pt-10 pb-24 sm:pt-14 text-center">
          <div className="mx-auto w-24 h-24 rounded-full p-[3px] bg-gradient-to-b from-or-clair to-or shadow-[0_0_40px_rgba(197,151,53,0.35)]">
            <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={96} height={96} className="w-full h-full rounded-full bg-white" priority />
          </div>
          <p className="mt-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-or-clair">Sakaba Beauty</p>
          <h1 className="titre text-5xl sm:text-6xl leading-[1.05] mt-3">Votre avis compte</h1>
          <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-or" aria-hidden>
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-or" />
            <span className="text-sm">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-or" />
          </div>
          <p className="mt-4 text-creme/80">
            Partagez une suggestion, signalez un problème ou faites une réclamation. Votre avis aide Sakaba Beauty à améliorer ses services.
          </p>
        </div>
      </section>
      <div className="relative mx-auto max-w-2xl px-4 -mt-14 pb-14">
        <FormulaireAvis />
        <footer className="mt-12 text-center">
          <p className="titre text-lg text-or">Sakaba Beauty</p>
          <p className="text-xs text-gris mt-1">La beauté authentique, avec le bon conseil · Mermoz Ancienne Piste, Dakar</p>
        </footer>
      </div>
    </main>
  );
}
