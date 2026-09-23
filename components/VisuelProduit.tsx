import Image from "next/image";
import { nomMarque, type Produit } from "@/lib/catalogue";

// Visuel provisoire en attendant les vraies photos (protocole photo, §5.2) :
// fond uni clair, cadrage constant, nom de la marque.
export default function VisuelProduit({
  produit,
  taille = "carte",
}: {
  produit: Produit;
  taille?: "mini" | "carte" | "grand";
}) {
  const fond = produit.teinte ?? "#F3EEE6";
  const alt = `${nomMarque(produit.marque)} ${produit.nom} ${produit.contenance}`;

  // Vraie photo : fond blanc uni, produit entier visible, cadrage constant.
  if (produit.image) {
    if (taille === "mini") {
      return (
        <span className="relative w-12 h-12 rounded-lg bg-white border border-bordure overflow-hidden shrink-0" aria-hidden>
          <Image src={produit.image} alt="" fill sizes="48px" className="object-contain p-1" />
        </span>
      );
    }
    return (
      <div className="relative w-full aspect-square rounded-3xl bg-white ring-1 ring-bordure/70 overflow-hidden">
        <Image
          src={produit.image}
          alt={alt}
          fill
          sizes={taille === "grand" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className={`object-contain transition duration-500 group-hover:scale-105 ${taille === "grand" ? "p-5 sm:p-8" : "p-6"}`}
          priority={taille === "grand"}
        />
      </div>
    );
  }

  if (taille === "mini") {
    return (
      <span
        className="w-12 h-12 rounded-lg grid place-items-center overflow-hidden break-all text-[9px] font-bold text-noir/70 shrink-0 text-center leading-tight p-1"
        style={{ background: fond }}
        aria-hidden
      >
        {nomMarque(produit.marque).split(" ")[0]}
      </span>
    );
  }
  return (
    <div
      className={`relative w-full aspect-square rounded-2xl grid place-items-center overflow-hidden ${taille === "grand" ? "p-10" : "p-5"}`}
      style={{ background: fond }}
      role="img"
      aria-label={alt}
    >
      <div className="w-2/5 h-3/5 rounded-xl bg-white/80 shadow-md flex flex-col items-center justify-center text-center px-2">
        <span className={`titre ${taille === "grand" ? "text-2xl" : "text-base"} leading-tight`}>
          {nomMarque(produit.marque)}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-widest text-gris">{produit.contenance}</span>
      </div>
      <span className="absolute bottom-2 right-3 text-[10px] text-noir/40">Photo à venir</span>
    </div>
  );
}
