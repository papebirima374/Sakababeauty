import type { Metadata } from "next";
import BandeauPage from "@/components/BandeauPage";
import { BOUTIQUE, MOYENS_PAIEMENT, SEUIL_LIVRAISON_OFFERTE, ZONES_LIVRAISON, formatPrix } from "@/lib/config";

export const metadata: Metadata = {
  title: "Livraison, retrait et paiement",
  description: "Zones, tarifs et délais de livraison Sakaba Beauty à Dakar et dans les régions. Retrait gratuit à Mermoz. Wave, Orange Money, carte, paiement à la livraison.",
};

export default function Livraison() {
  return (
    <>
    <BandeauPage
      surtitre="Livraison et paiement"
      titre="Livraison et retrait"
      texte={<>Livraison offerte dès <strong className="prix text-or-clair">{formatPrix(SEUIL_LIVRAISON_OFFERTE)}</strong> d&apos;achat. Suivi de votre commande par WhatsApp à chaque étape.</>}
    />
    <div className="mx-auto max-w-3xl px-4 py-12">
      <table className="w-full text-left rounded-3xl overflow-hidden bg-creme">
        <thead>
          <tr className="border-b border-bordure text-sm text-gris">
            <th className="py-3 px-4">Zone</th><th className="py-3 px-4">Délai</th><th className="py-3 px-4 text-right">Tarif</th>
          </tr>
        </thead>
        <tbody>
          {ZONES_LIVRAISON.map((z) => (
            <tr key={z.id} className="border-b border-bordure">
              <td className="py-3 px-4 font-semibold">{z.nom}</td>
              <td className="py-3 px-4 text-sm text-gris">{z.delai}</td>
              <td className="py-3 px-4 text-right prix font-semibold">{z.tarif === 0 ? "Gratuit" : formatPrix(z.tarif)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
