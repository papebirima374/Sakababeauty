import type { Metadata } from "next";
import Link from "next/link";

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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-or">Notre engagement</p>
      <h1 className="titre text-5xl mt-3 leading-tight">Le vrai, pas une copie.</h1>
      <p className="mt-5 text-lg text-gris">
        Un cosmétique contrefait n&apos;est pas seulement décevant : sa composition est inconnue, et il peut irriter ou abîmer
        la peau. C&apos;est pourquoi nous importons nous-mêmes, directement des États-Unis.
      </p>

      <h2 className="titre text-3xl mt-12">Le chemin d&apos;un produit jusqu&apos;à vous</h2>
      <ol className="mt-6 space-y-4">
        {etapes.map(([titre, texte], i) => (
          <li key={titre} className="flex gap-4">
            <span className="prix shrink-0 w-9 h-9 rounded-full bg-or text-white grid place-items-center font-bold">{i + 1}</span>
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
          <div key={titre} className="rounded-2xl border border-bordure p-5">
            <p className="font-semibold">{titre}</p>
            <p className="text-sm text-gris mt-1">{texte}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-noir text-creme p-6">
        <p className="titre text-2xl text-or-clair">Un doute sur un produit ?</p>
        <p className="text-creme/80 mt-2">Passez à la boutique de Mermoz : nous vous montrons le produit, son lot et sa date.</p>
        <Link href="/boutique" className="mt-4 inline-block rounded-full bg-or px-6 py-3 font-semibold text-white">Voir la boutique</Link>
      </div>
    </div>
  );
}
