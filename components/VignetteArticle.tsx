import Image from "next/image";
import type { ArticleGestion } from "@/lib/articles-gestion";

// Petite image carrée d'un article : sa photo, ou les initiales de la marque.
export default function VignetteArticle({ article }: { article: ArticleGestion }) {
  if (article.image)
    return (
      <span className="relative block w-full aspect-square rounded-xl bg-white ring-1 ring-bordure/70 overflow-hidden">
        <Image src={article.image} alt="" fill sizes="64px" className="object-contain p-1" />
      </span>
    );
  const initiales = article.marqueNom.split(/\s+/).map((m) => m[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="grid w-full aspect-square place-items-center rounded-xl bg-or/10 ring-1 ring-or/25 text-or font-bold text-sm" aria-hidden>
      {initiales}
    </span>
  );
}
