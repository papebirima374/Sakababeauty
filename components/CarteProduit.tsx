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
      <Link href={`/produit/${produit.slug}`} className="relative block">
        <VisuelProduit produit={produit} />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {produit.nouveaute && (
            <span className="rounded-full bg-noir text-creme text-[11px] font-semibold px-2.5 py-1">Nouveau</span>
          )}
          {produit.prixBarre && (
            <span className="rounded-full bg-or text-white text-[11px] font-semibold px-2.5 py-1">Bon plan</span>
          )}
        </div>
        <span className="absolute top-2 right-2 rounded-full bg-white/90 text-[11px] font-semibold px-2.5 py-1 text-or">
          ✦ USA
        </span>
      </Link>
      <div className="pt-3 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-wider text-gris">{nomMarque(produit.marque)}</p>
        <Link href={`/produit/${produit.slug}`} className="font-semibold leading-snug hover:text-or">
          {produit.nom}
        </Link>
        <p className="text-xs text-gris mt-0.5">
          {produit.contenance} · ★ {produit.note.toFixed(1)} ({produit.avis})
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="prix text-lg font-bold">{formatPrix(produit.prix)}</span>
          {produit.prixBarre && (
            <span className="prix text-sm text-gris line-through">{formatPrix(produit.prixBarre)}</span>
          )}
        </p>
        <p className={`text-xs font-semibold ${epuise ? "text-red-700" : produit.stock <= 5 ? "text-amber-700" : "text-green-700"}`}>
          {epuise ? "Épuisé — alerte de retour possible" : produit.stock <= 5 ? `Plus que ${produit.stock} en stock` : "En stock"}
        </p>
        <div className="mt-auto pt-3">
          <BoutonAjouter produit={produit} compact />
        </div>
      </div>
    </article>
  );
}
