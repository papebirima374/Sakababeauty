import Link from "next/link";
import { nomMarque, type Produit } from "@/lib/catalogue";
import { formatPrix } from "@/lib/config";
import VisuelProduit from "./VisuelProduit";
import BoutonAjouter from "./BoutonAjouter";

// Le prix est affiché sur toutes les listes de produits (critère de recette C-03).
export default function CarteProduit({ produit }: { produit: Produit }) {
  const epuise = produit.stock <= 0;
  return (
    <article className="group flex flex-col">
      <Link href={`/produit/${produit.slug}`} className="relative block rounded-3xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_50px_-30px_rgba(20,16,11,0.55)]">
        <VisuelProduit produit={produit} />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {produit.nouveaute && (
            <span className="rounded-full bg-noir text-creme text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">Nouveau</span>
          )}
          {produit.prixBarre && (
            <span className="rounded-full bg-gradient-to-r from-or to-[#B0852A] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">Bon plan</span>
          )}
        </div>
        <span className="absolute top-3 right-3 rounded-full bg-creme/90 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 text-or">
          ✦ USA
        </span>
        {epuise && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 text-center text-xs font-semibold py-1.5 text-gris">
            Épuisé pour le moment
          </span>
        )}
      </Link>
      <div className="pt-4 px-1 flex-1 flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gris">{nomMarque(produit.marque)}</p>
        <Link href={`/produit/${produit.slug}`} className="mt-1 font-semibold leading-snug line-clamp-2 hover:text-or">
          {produit.nom}
        </Link>
        <p className="text-xs text-gris mt-1">
          {produit.contenance} · <span className="text-or">★</span> {produit.note.toFixed(1)} ({produit.avis})
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="prix text-lg font-bold">{formatPrix(produit.prix)}</span>
          {produit.prixBarre && (
            <span className="prix text-sm text-gris line-through">{formatPrix(produit.prixBarre)}</span>
          )}
        </p>
        {!epuise && produit.stock <= 5 && (
          <p className="text-xs font-semibold text-amber-700">Plus que {produit.stock} en stock</p>
        )}
        <div className="mt-auto pt-3">
          <BoutonAjouter produit={produit} compact />
        </div>
      </div>
    </article>
  );
}
