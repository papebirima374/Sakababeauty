"use client";

import Image from "next/image";
import Link from "next/link";
import { usePanier } from "@/lib/panier";
import ChampRecherche from "./ChampRecherche";

// Menu à 6 entrées maximum (cahier des charges §6.2).
const MENU = [
  { href: "/soin-visage", nom: "Visage" },
  { href: "/cheveux", nom: "Cheveux" },
  { href: "/soin-corps", nom: "Corps" },
  { href: "/maquillage", nom: "Maquillage" },
  { href: "/marques", nom: "Marques" },
  { href: "/diagnostic", nom: "Diagnostic beauté" },
];

export default function Entete() {
  const { nombre } = usePanier();
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-bordure">
      <div className="bg-noir text-creme text-xs sm:text-sm text-center py-2 px-4">
        <span className="text-or-clair">✦</span> 100 % authentiques, importés des USA · Retrait gratuit à Mermoz
      </div>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Accueil Sakaba Beauty">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={52} height={52} priority />
        </Link>
        <div className="flex-1">
          <ChampRecherche />
        </div>
        <Link
          href="/panier"
          className="hidden md:flex items-center gap-2 rounded-full border border-bordure px-4 py-2 font-semibold hover:border-or"
        >
          Panier
          <span className="prix rounded-full bg-or text-white text-xs min-w-6 h-6 px-1.5 grid place-items-center">
            {nombre}
          </span>
        </Link>
      </div>
      <nav className="hidden md:block border-t border-bordure">
        <ul className="mx-auto max-w-6xl px-4 flex gap-8 py-2.5 text-sm font-semibold">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className={m.href === "/diagnostic" ? "text-or hover:text-noir" : "hover:text-or"}
              >
                {m.nom}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="md:hidden border-t border-bordure overflow-x-auto">
        <ul className="flex gap-5 px-4 py-2 text-sm font-semibold whitespace-nowrap">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link href={m.href}>{m.nom}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
