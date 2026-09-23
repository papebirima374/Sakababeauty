import type { Metadata } from "next";
import Image from "next/image";
import FormulaireAvis from "@/components/FormulaireAvis";

export const metadata: Metadata = {
  title: "Votre avis compte",
  description: "Dites-nous ce qui vous plaît et ce que nous pouvons améliorer chez Sakaba Beauty. 2 minutes.",
  openGraph: {
    title: "Sakaba Beauty — Votre avis compte",
    description: "2 minutes pour nous dire ce qui vous plaît et ce que nous pouvons améliorer.",
    images: ["/logo-sakaba.png"],
  },
};

// Page autonome (sans le menu de la boutique) : c'est le lien envoyé aux clientes.
export default function PageAvis() {
  return (
    <main className="flex-1 bg-creme">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="text-center">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={96} height={96} className="mx-auto rounded-full bg-white" priority />
          <h1 className="titre text-4xl sm:text-5xl mt-4">Votre avis compte</h1>
          <p className="text-gris mt-3">
            Dites-nous ce qui vous plaît et ce que nous pouvons améliorer à la boutique. Cela prend 2 minutes.
          </p>
        </header>
        <div className="mt-8">
          <FormulaireAvis />
        </div>
        <p className="mt-10 text-center text-xs text-gris">Sakaba Beauty · Mermoz Ancienne Piste, Dakar</p>
      </div>
    </main>
  );
}
