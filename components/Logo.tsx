import Image from "next/image";
import { BOUTIQUE_ACTIVE } from "@/lib/boutique";

// Logo de la boutique active : son image, ou un monogramme si elle n'en a pas encore.
export default function Logo({ taille, className = "" }: { taille: number; className?: string }) {
  const b = BOUTIQUE_ACTIVE;
  if ("image" in b.logo)
    return <Image src={b.logo.image} alt={b.nom} width={taille} height={taille} className={`rounded-full bg-white ${className}`} />;
  return (
    <span
      role="img"
      aria-label={b.nom}
      style={{ width: taille, height: taille, fontSize: taille * 0.4 }}
      className={`inline-grid shrink-0 place-items-center rounded-full bg-white text-noir titre font-semibold ring-2 ring-or ${className}`}
    >
      {b.logo.initiales}
    </span>
  );
}
