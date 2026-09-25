import type { Metadata } from "next";
import Link from "next/link";
import BandeauPage from "@/components/BandeauPage";
import { BOUTIQUE, lienWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nous trouver · Contact",
  description: `Boutique Sakaba Beauty : ${BOUTIQUE.adresse}. Appelez-nous, écrivez-nous sur WhatsApp ou passez nous voir.`,
};

// Horaires d'ouverture : À CONFIRMER avec Sakaba (non affichés en attendant).
export default function Contact() {
  const carte = "rounded-3xl bg-white p-6 ring-1 ring-bordure/70 shadow-[0_18px_50px_-30px_rgba(20,16,11,0.4)]";
  const legende = "text-[11px] font-semibold uppercase tracking-[0.2em] text-or";
  return (
    <>
      <BandeauPage
        surtitre="Nous trouver"
        titre={<>La boutique <span className="italic text-or-clair">à Mermoz</span></>}
        texte="Venez sentir, toucher et demander conseil. Ou écrivez-nous : une conseillère vous répond."
      />
      <div className="mx-auto max-w-5xl px-4 py-12 grid gap-5 md:grid-cols-2">
        <div className={`${carte} md:row-span-2 flex flex-col`}>
          <p className={legende}>Adresse</p>
          <p className="titre text-3xl mt-2 leading-tight">Mermoz Ancienne Piste</p>
          <p className="text-gris mt-1">À côté de la Case des Tout-Petits, Dakar</p>
          <div className="mt-6 flex-1 min-h-40 rounded-2xl bg-noir text-creme relative overflow-hidden grid place-items-center p-6 text-center">
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(60% 70% at 50% 30%, rgba(197,151,53,0.35), transparent 70%)" }}
              aria-hidden
            />
            <div className="relative">
              <p className="text-4xl text-or-clair" aria-hidden>⌖</p>
              <p className="text-sm text-creme/80 mt-2">Repère : la Case des Tout-Petits de Mermoz</p>
            </div>
          </div>
          <a
            href={BOUTIQUE.itineraire}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block text-center rounded-full bg-gradient-to-r from-or to-[#B0852A] text-white py-3.5 font-semibold shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] hover:brightness-110"
          >
            Itinéraire sur Google Maps
          </a>
          <p className="text-xs text-gris mt-2 text-center">Retrait gratuit de vos commandes à la boutique.</p>
        </div>

        <div className={carte}>
          <p className={legende}>Téléphone</p>
          <ul className="mt-3 space-y-2">
            {BOUTIQUE.telephones.map((t) => (
              <li key={t.lien}>
                <a href={t.lien} className="flex items-center justify-between rounded-2xl bg-creme px-4 py-3 hover:ring-2 hover:ring-or/40">
                  <span className="prix text-xl font-semibold">{t.affiche}</span>
                  <span className="text-sm font-semibold text-or">Appeler</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={carte}>
          <p className={legende}>Écrire</p>
          <div className="mt-3 grid gap-2">
            <a
              href={lienWhatsApp("Bonjour Sakaba Beauty, j'ai une question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-noir text-white text-center py-3 font-semibold hover:bg-or"
            >
              Nous écrire sur WhatsApp
            </a>
            <a
              href={BOUTIQUE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-bordure text-center py-3 font-semibold hover:border-or"
            >
              Instagram @sakababeauty
            </a>
            <Link href="/avis" className="text-center text-sm text-gris underline hover:text-or mt-1">
              Une suggestion, un problème, une réclamation ? Donnez votre avis
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
