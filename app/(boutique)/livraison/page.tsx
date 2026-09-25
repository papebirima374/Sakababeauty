import type { Metadata } from "next";
import BandeauPage from "@/components/BandeauPage";
import { BOUTIQUE, MODES_RECEPTION, MOYENS_PAIEMENT } from "@/lib/config";

export const metadata: Metadata = {
  title: "Livraison, retrait et paiement",
  description: "Livraison Sakaba Beauty : le prix se règle directement avec le livreur. Retrait gratuit à Mermoz. Wave, Orange Money, carte, paiement à la livraison.",
};

export default function Livraison() {
  return (
    <>
    <BandeauPage
      surtitre="Livraison et paiement"
      titre="Livraison et retrait"
      texte="Vous parlez directement avec le livreur : c'est vous qui convenez avec lui du prix, de l'heure et du lieu."
    />
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ul className="grid sm:grid-cols-2 gap-3">
        {MODES_RECEPTION.map((m) => (
          <li key={m.id} className="rounded-3xl bg-creme p-5">
            <p className="font-semibold">{m.nom}</p>
            <p className="text-sm text-gris mt-1">{m.detail}</p>
          </li>
        ))}
      </ul>

      <h2 className="titre text-3xl mt-12">Comment ça se passe</h2>
      <ol className="mt-4 space-y-3">
        {[
          "Vous validez votre panier : la commande arrive chez Sakaba sur WhatsApp.",
          "Sakaba confirme la commande et la prépare.",
          "Le livreur vous appelle. Vous convenez ensemble du prix de la course, de l'heure et du lieu.",
          "Vous recevez vos produits et réglez la course directement au livreur.",
        ].map((t, i) => (
          <li key={t} className="flex gap-3 items-start">
            <span className="prix shrink-0 w-7 h-7 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-sm">{i + 1}</span>
            <span className="pt-0.5">{t}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-gris">Boutique : {BOUTIQUE.adresse}.</p>

      <h2 className="titre text-3xl mt-12">Moyens de paiement</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3">
        {MOYENS_PAIEMENT.map((m) => (
          <li key={m.id} className="rounded-3xl bg-creme p-5">
            <p className="font-semibold">{m.nom}</p>
            <p className="text-sm text-gris">{m.detail}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
