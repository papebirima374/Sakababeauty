import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FIREBASE_CONFIGURE } from "@/lib/firebase-config";
import CaisseChoix from "./CaisseChoix";

export const metadata: Metadata = {
  title: "Caisse boutique (démonstration)",
  robots: { index: false, follow: false },
};

export default function PageCaisse() {
  return (
    <main className="flex-1 bg-creme min-h-screen print:bg-white">
      <header className="bg-noir text-creme print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={44} height={44} className="rounded-full bg-white" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-or-clair">Caisse · Mermoz</p>
            <h1 className="titre text-2xl sm:text-3xl leading-tight">Vente sur place</h1>
          </div>
          <Link href="/gestion" className="rounded-full border border-creme/30 px-4 py-2 text-sm font-semibold hover:border-or-clair hover:text-or-clair">
            <span className="sm:hidden">← Retour</span><span className="hidden sm:inline">Tableau de bord</span>
          </Link>
        </div>
      </header>
      {!FIREBASE_CONFIGURE && (
      <div className="bg-or/15 border-b border-or/30 print:hidden">
        <p className="mx-auto max-w-6xl px-4 py-2.5 text-sm">
          <strong>Démonstration.</strong> Rien n&apos;est enregistré : essayez librement. Fonctionne avec une douchette
          (lecteur de codes-barres) et une imprimante de tickets. Chaque vente retire le produit du stock unique, partagé
          avec le site.
        </p>
      </div>
      )}
      <CaisseChoix />
    </main>
  );
}
