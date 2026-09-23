"use client";

import { useState } from "react";
import type { Produit } from "@/lib/catalogue";
import { lienWhatsApp } from "@/lib/config";
import { usePanier } from "@/lib/panier";

export default function BoutonAjouter({ produit, compact = false }: { produit: Produit; compact?: boolean }) {
  const { ajouter } = usePanier();
  const [ajoute, setAjoute] = useState(false);
  const taille = compact ? "py-2 text-sm" : "py-3.5 text-base";

  if (produit.stock <= 0) {
    // En attendant la liste de réapprovisionnement (G-11), la demande passe par WhatsApp.
    return (
      <a
        href={lienWhatsApp(`Bonjour, pouvez-vous me prévenir quand « ${produit.nom} » sera de nouveau disponible ?`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full text-center rounded-full border border-noir font-semibold hover:bg-noir hover:text-white ${taille}`}
      >
        Me prévenir du retour
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        ajouter(produit.slug);
        setAjoute(true);
        setTimeout(() => setAjoute(false), 1600);
      }}
      className={`w-full rounded-full font-semibold text-white transition ${
        ajoute
          ? "bg-green-800"
          : compact
            ? "bg-noir hover:bg-or"
            : "bg-gradient-to-r from-or to-[#B0852A] shadow-[0_12px_30px_-12px_rgba(197,151,53,0.8)] hover:brightness-110"
      } ${taille}`}
    >
      {ajoute ? "✓ Ajouté au panier" : "Ajouter au panier"}
    </button>
  );
}
