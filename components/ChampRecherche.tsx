"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { rechercher } from "@/lib/recherche";
import { nomMarque } from "@/lib/catalogue";
import { formatPrix } from "@/lib/config";
import VisuelProduit from "./VisuelProduit";

// Résultats instantanés dès la troisième lettre, avec photo, prix et disponibilité (§6.1).
export default function ChampRecherche({ autoFocus = false }: { autoFocus?: boolean }) {
  const [requete, setRequete] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();

  const resultats = useMemo(
    () => (requete.trim().length >= 3 ? rechercher(requete).slice(0, 6) : []),
    [requete],
  );

  function valider(e: React.FormEvent) {
    e.preventDefault();
    if (!requete.trim()) return;
    setOuvert(false);
    router.push(`/recherche?q=${encodeURIComponent(requete.trim())}`);
  }

  return (
    <form onSubmit={valider} className="relative" role="search">
      <input
        type="search"
        value={requete}
        autoFocus={autoFocus}
        onChange={(e) => {
          setRequete(e.target.value);
          setOuvert(true);
        }}
        onFocus={() => setOuvert(true)}
        onBlur={() => setTimeout(() => setOuvert(false), 150)}
        placeholder="Marque, produit ou besoin : « taches », « cerave »…"
        aria-label="Rechercher un produit"
        className="w-full rounded-full border border-bordure bg-creme px-5 py-2.5 text-base outline-none focus:border-or focus:bg-white"
      />
      {ouvert && requete.trim().length >= 3 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-bordure bg-white shadow-xl overflow-hidden z-50">
          {resultats.length === 0 ? (
            <p className="p-4 text-sm text-gris">
              Aucun produit trouvé pour « {requete} ». Essayez un besoin (« hydratation ») ou{" "}
              <Link href="/diagnostic" className="text-or font-semibold underline">
                faites le diagnostic
              </Link>
              .
            </p>
          ) : (
            <ul>
              {resultats.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/produit/${p.slug}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-creme"
                  >
                    <VisuelProduit produit={p} taille="mini" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs text-gris">{nomMarque(p.marque)}</span>
                      <span className="block text-sm font-semibold truncate">{p.nom}</span>
                    </span>
                    <span className="text-right">
                      <span className="prix block text-sm font-bold">{formatPrix(p.prix)}</span>
                      <span className={`block text-xs ${p.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                        {p.stock > 0 ? "En stock" : "Épuisé"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="submit"
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-or border-t border-bordure hover:bg-creme"
                >
                  Voir tous les résultats pour « {requete} » →
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
