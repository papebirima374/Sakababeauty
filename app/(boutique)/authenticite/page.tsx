import type { Metadata } from "next";
import Link from "next/link";
import BandeauPage from "@/components/BandeauPage";

export const metadata: Metadata = {
  title: "Notre engagement d'authenticité",
  description: "D'où viennent les produits Sakaba Beauty, comment ils sont acheminés des États-Unis, et comment reconnaître un cosmétique contrefait.",
};

// Texte de départ, à relire et compléter avec Sakaba Beauty (chaîne d'import réelle).
export default function Authenticite() {
  const etapes = [
    ["Achat aux États-Unis", "Nos produits sont achetés auprès de distributeurs et enseignes américains, jamais sur le marché parallèle."],
    ["Acheminement", "Ils voyagent jusqu'à Dakar dans nos propres envois, dédouanés, puis sont contrôlés à la réception."],
    ["Contrôle en boutique", "Chaque arrivage est vérifié : emballage, sceau, numéro de lot et date de péremption."],
    ["Sur le site", "Ces informations figurent sur la fiche de chaque produit, pour que vous puissiez les vérifier."],
  ];
  const reperes = [
    ["Le numéro de lot", "Il est imprimé ou gravé sur le flacon et sur la boîte, et les deux doivent correspondre."],
    ["L'étiquette", "Texte net, sans faute d'orthographe, couleurs identiques au produit d'origine."],
    ["Le sceau", "Opercule ou film de protection intact à l'ouverture."],
    ["Le prix", "Un prix très inférieur au marché est souvent le premier signe d'une copie."],
  ];
  return (
    <>
    <BandeauPage
      surtitre="Notre engagement"
      titre={<>Le vrai, <span className="italic text-or-clair">pas une copie.</span></>}
      texte="Un cosmétique contrefait n'est pas seulement décevant : sa composition est inconnue, et il peut irriter ou abîmer la peau. C'est pourquoi nous importons nous-mêmes, directement des États-Unis."
    />
    <div className="mx-auto max-w-3xl px-4 py-4">

      <h2 className="titre text-3xl mt-12">Le chemin d&apos;un produit jusqu&apos;à vous</h2>
      <ol className="mt-6 space-y-4">
        {etapes.map(([titre, texte], i) => (
          <li key={titre} className="flex gap-4">
            <span className="titre shrink-0 w-10 h-10 rounded-full bg-gradient-to-b from-or-clair to-or text-white grid place-items-center text-xl">{i + 1}</span>
            <div>
              <p className="font-semibold">{titre}</p>
              <p className="text-gris">{texte}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="titre text-3xl mt-12">Comment reconnaître un produit authentique</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {reperes.map(([titre, texte]) => (
          <div key={titre} className="rounded-3xl bg-creme p-5">
            <p className="font-semibold">{titre}</p>
            <p className="text-sm text-gris mt-1">{texte}</p>
          </div>
        ))}
      </div>

      <div className="my-12 relative overflow-hidden rounded-3xl bg-noir text-creme p-8">
        <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(60% 100% at 100% 0%, rgba(197,151,53,0.35), transparent 70%)" }} aria-hidden />
        <p className="relative titre text-3xl text-or-clair">Un doute sur un produit ?</p>
        <p className="relative text-creme/80 mt-2">Passez à la boutique de Mermoz : nous vous montrons le produit, son lot et sa date.</p>
        <Link href="/boutique" className="relative mt-5 inline-block rounded-full bg-gradient-to-r from-or to-[#B0852A] px-6 py-3 font-semibold text-white">Voir la boutique</Link>
      </div>
    </div>
    </>
  );
}
