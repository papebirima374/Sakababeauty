"use client";

import Link from "next/link";
import { useState } from "react";
import { nomMarque } from "@/lib/catalogue";
import {
  MODES_RECEPTION,
  MOYENS_PAIEMENT,
  PLAFOND_PAIEMENT_LIVRAISON,
  formatPrix,
  lienWhatsApp,
  type ModeReception,
} from "@/lib/config";
import { usePanier } from "@/lib/panier";
import VisuelProduit from "@/components/VisuelProduit";
import BandeauPage from "@/components/BandeauPage";

type MoyenId = (typeof MOYENS_PAIEMENT)[number]["id"];

// Achat sans création de compte. Livraison : la cliente règle le prix
// directement avec le livreur (décision de Sakaba), le site n'ajoute aucun frais.
// Étape provisoire : la commande est transmise par WhatsApp en attendant le
// branchement de l'agrégateur de paiement (Wave, Orange Money, carte).
export default function Panier() {
  const { lignes, sousTotal, modifier, retirer } = usePanier();
  const [zone, setZone] = useState<ModeReception>("livraison");
  const [moyen, setMoyen] = useState<MoyenId>("wave");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  const zoneChoisie = MODES_RECEPTION.find((z) => z.id === zone)!;
  const total = sousTotal;
  const paiementLivraisonPossible = total <= PLAFOND_PAIEMENT_LIVRAISON;
  const moyenEffectif = moyen === "livraison" && !paiementLivraisonPossible ? "wave" : moyen;
  const complet = nom.trim() && telephone.trim() && (zone === "retrait" || adresse.trim());

  if (lignes.length === 0) {
    return (
      <>
        <BandeauPage surtitre="Votre panier" titre="Votre panier est vide" texte="Trouvez vos produits en quelques secondes, ou laissez-nous composer votre routine.">
          <div className="flex flex-wrap gap-3">
            <Link href="/boutique" className="rounded-full border border-creme/30 px-6 py-3 font-semibold transition hover:border-or-clair hover:text-or-clair">Voir la boutique</Link>
            <Link href="/diagnostic" className="rounded-full bg-gradient-to-r from-or to-[#B0852A] text-white px-6 py-3 font-semibold">Faire le diagnostic</Link>
          </div>
        </BandeauPage>
        <div className="h-24" />
      </>
    );
  }

  const message = [
    "Bonjour Sakaba Beauty, je souhaite commander :",
    ...lignes.map((l) => `• ${l.quantite} × ${nomMarque(l.produit.marque)} ${l.produit.nom} (${l.produit.contenance}) — ${formatPrix(l.quantite * l.produit.prix)}`),
    `TOTAL produits : ${formatPrix(total)}`,
    `Réception : ${zoneChoisie.nom}${zone === "livraison" ? " (prix à convenir avec le livreur)" : ""}`,
    `Paiement : ${MOYENS_PAIEMENT.find((m) => m.id === moyenEffectif)!.nom}`,
    `Nom : ${nom}`,
    `Téléphone : ${telephone}`,
    zone !== "retrait" ? `Adresse de livraison : ${adresse}` : "",
  ].filter(Boolean).join("\n");

  return (
    <>
    <BandeauPage
      surtitre="Votre panier"
      titre={<>Votre panier <span className="italic text-or-clair">({lignes.reduce((t, l) => t + l.quantite, 0)})</span></>}
      texte="Sans créer de compte · Paiement Wave, Orange Money, carte ou à la livraison."
    />
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-creme p-5 flex gap-3 items-start">
        <span className="text-or text-xl leading-none" aria-hidden>✦</span>
        <p className="text-sm">
          <strong>Livraison :</strong> après votre commande, le livreur vous appelle. Vous convenez directement avec lui
          du prix, de l&apos;heure et du lieu. Ou retirez gratuitement à la boutique de Mermoz.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-[1fr_380px] gap-10">
        <ul className="space-y-3">
          {lignes.map((l) => (
            <li key={l.slug} className="group flex gap-4 rounded-3xl bg-white p-4 ring-1 ring-bordure/70">
              <Link href={`/produit/${l.slug}`} className="w-20 sm:w-24 shrink-0">
                <VisuelProduit produit={l.produit} taille="vignette" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gris">{nomMarque(l.produit.marque)}</p>
                <Link href={`/produit/${l.slug}`} className="font-semibold hover:text-or">{l.produit.nom}</Link>
                <p className="text-sm text-gris">{l.produit.contenance} · {formatPrix(l.produit.prix)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full bg-creme">
                    <button type="button" onClick={() => modifier(l.slug, l.quantite - 1)} className="w-9 h-9" aria-label="Retirer un">−</button>
                    <span className="prix w-6 text-center">{l.quantite}</span>
                    <button type="button" onClick={() => modifier(l.slug, l.quantite + 1)} className="w-9 h-9" aria-label="Ajouter un" disabled={l.quantite >= l.produit.stock}>+</button>
                  </div>
                  <button type="button" onClick={() => retirer(l.slug)} className="text-sm text-gris underline">Retirer</button>
                </div>
              </div>
              <p className="prix font-bold">{formatPrix(l.quantite * l.produit.prix)}</p>
            </li>
          ))}
        </ul>

        <aside className="relative rounded-3xl bg-white p-6 h-fit space-y-6 shadow-[0_25px_70px_-30px_rgba(20,16,11,0.45)] overflow-hidden md:sticky md:top-36">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-or-clair via-or to-or-clair" aria-hidden />
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or mb-2">Réception</legend>
            <div className="space-y-2">
              {MODES_RECEPTION.map((z) => (
                <label key={z.id} className={`flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition ${zone === z.id ? "border-or bg-creme" : "border-bordure hover:border-or/50"}`}>
                  <input type="radio" name="zone" checked={zone === z.id} onChange={() => setZone(z.id)} className="mt-1 accent-[#C59735]" />
                  <span className="flex-1 text-sm">
                    <span className="font-semibold block">{z.nom}</span>
                    <span className="text-gris">{z.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or mb-2">Vos coordonnées <span className="normal-case tracking-normal font-normal text-gris">(sans créer de compte)</span></legend>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Prénom et nom" autoComplete="name" className="w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3 outline-none transition focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15" />
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone (WhatsApp)" type="tel" autoComplete="tel" className="w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3 outline-none transition focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15" />
            {zone !== "retrait" && (
              <textarea value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse de livraison, repère" rows={2} autoComplete="street-address" className="w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3 outline-none transition focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15" />
            )}
          </fieldset>

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-or mb-2">Paiement</legend>
            <div className="space-y-2">
              {MOYENS_PAIEMENT.map((m) => {
                const indisponible = m.id === "livraison" && !paiementLivraisonPossible;
                return (
                  <label key={m.id} className={`flex items-start gap-3 rounded-2xl border p-3 transition ${indisponible ? "opacity-50" : "cursor-pointer"} ${moyenEffectif === m.id ? "border-or bg-creme" : "border-bordure hover:border-or/50"}`}>
                    <input type="radio" name="moyen" disabled={indisponible} checked={moyenEffectif === m.id} onChange={() => setMoyen(m.id)} className="mt-1 accent-[#C59735]" />
                    <span className="text-sm">
                      <span className="font-semibold block">{m.nom}</span>
                      <span className="text-gris">
                        {indisponible ? `Non disponible au-delà de ${formatPrix(PLAFOND_PAIEMENT_LIVRAISON)}` : m.detail}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <dl className="space-y-1 text-sm border-t border-bordure pt-4">
            <div className="flex justify-between"><dt>Livraison</dt><dd className="text-gris">{zone === "retrait" ? "Gratuit" : "À régler au livreur"}</dd></div>
            <div className="flex justify-between items-baseline pt-2"><dt className="titre text-2xl">Total produits</dt><dd className="prix titre text-3xl font-semibold">{formatPrix(total)}</dd></div>
          </dl>

          <a
            href={complet ? lienWhatsApp(message) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!complet}
            className={`block text-center rounded-full py-4 font-semibold text-white transition ${complet ? "bg-gradient-to-r from-or to-[#B0852A] shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] hover:brightness-110" : "bg-gris/40 pointer-events-none"}`}
          >
            Valider ma commande
          </a>
          <p className="text-xs text-gris text-center">
            Version de test : la commande est envoyée par WhatsApp. Le paiement Wave, Orange Money et carte sera branché à l&apos;étape suivante.
          </p>
          <p className="text-xs text-gris text-center">✦ Produits authentiques · Contact humain sur WhatsApp</p>
        </aside>
      </div>
    </div>
    </>
  );
}
