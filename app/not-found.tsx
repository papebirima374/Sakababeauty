import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="titre text-5xl">Page introuvable</h1>
      <p className="text-gris mt-3">Ce produit ou cette page n&apos;existe plus. Cherchez-le dans la boutique.</p>
      <Link href="/boutique" className="mt-6 inline-block rounded-full bg-or px-6 py-3 font-semibold text-white">Voir la boutique</Link>
    </div>
  );
}
