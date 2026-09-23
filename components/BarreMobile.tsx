"use client";

import Link from "next/link";
import { lienWhatsApp } from "@/lib/config";
import { usePanier } from "@/lib/panier";

// Barre fixe en bas sur mobile : Rechercher · Diagnostic · Panier · WhatsApp (§6.2).
export default function BarreMobile() {
  const { nombre } = usePanier();
  const classe = "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold";
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-noir text-creme grid grid-cols-4 border-t border-or/40">
      <Link href="/recherche" className={classe}>
        <span className="text-lg leading-none">⌕</span>Rechercher
      </Link>
      <Link href="/diagnostic" className={`${classe} text-or-clair`}>
        <span className="text-lg leading-none">✦</span>Diagnostic
      </Link>
      <Link href="/panier" className={classe}>
        <span className="prix text-sm leading-none rounded-full bg-or text-white min-w-5 h-5 px-1 grid place-items-center">
          {nombre}
        </span>
        Panier
      </Link>
      <a href={lienWhatsApp("Bonjour Sakaba Beauty, j'ai une question.")} target="_blank" rel="noopener noreferrer" className={classe}>
        <span className="text-lg leading-none">✆</span>WhatsApp
      </a>
    </nav>
  );
}
