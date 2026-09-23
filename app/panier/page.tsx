"use client";

import Link from "next/link";
import { useState } from "react";
import { nomMarque } from "@/lib/catalogue";
import {
  MOYENS_PAIEMENT,
  PLAFOND_PAIEMENT_LIVRAISON,
  SEUIL_LIVRAISON_OFFERTE,
  ZONES_LIVRAISON,
  formatPrix,
  lienWhatsApp,
  type ZoneId,
} from "@/lib/config";
import { usePanier } from "@/lib/panier";
import VisuelProduit from "@/components/VisuelProduit";

type MoyenId = (typeof MOYENS_PAIEMENT)[number]["id"];

// Achat sans création de compte, frais de livraison annoncés avant le paiement (§9.3).
// Étape provisoire : la commande est transmise par WhatsApp en attendant le
// branchement de l'agrégateur de paiement (Wave, Orange Money, carte).
export default function Panier() {
  const { lignes, sousTotal, modifier, retirer } = usePanier();
  const [zone, setZone] = useState<ZoneId>("dakar");
  const [moyen, setMoyen] = useState<MoyenId>("wave");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  const zoneChoisie = ZONES_LIVRAISON.find((z) => z.id === zone)!;
  const livraisonOfferte = sousTotal >= SEUIL_LIVRAISON_OFFERTE;
  const frais = livraisonOfferte ? 0 : zoneChoisie.tarif;
  const total = sousTotal + frais;
  const reste = SEUIL_LIVRAISON_OFFERTE - sousTotal;
  const paiementLivraisonPossible = total <= PLAFOND_PAIEMENT_LIVRAISON && zone !== "regions";
  const moyenEffectif = moyen === "livraison" && !paiementLivraisonPossible ? "wave" : moyen;
  const complet = nom.trim() && telephone.trim() && (zone === "retrait" || adresse.trim());

  if (lignes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="titre text-4xl">Votre panier est vide</h1>
        <p className="text-gris mt-3">Trouvez vos produits en quelques secondes, ou laissez-nous composer votre routine.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/boutique" className="rounded-full border border-noir px-6 py-3 font-semibold">Voir la boutique</Link>
          <Link href="/diagnostic" className="rounded-full bg-or text-white px-6 py-3 font-semibold">Faire le diagnostic</Link>
        </div>
      </div>
    );
  }

  const message = [
    "Bonjour Sakaba Beauty, je souhaite commander :",
    ...lignes.map((l) => `• ${l.quantite} × ${nomMarque(l.produit.marque)} ${l.produit.nom} (${l.produit.contenance}) — ${formatPrix(l.quantite * l.produit.prix)}`),
    `Sous-total : ${formatPrix(sousTotal)}`,
    `${zoneChoisie.nom} : ${frais === 0 ? "gratuit" : formatPrix(frais)}`,
    `TOTAL : ${formatPrix(total)}`,
    `Paiement : ${MOYENS_PAIEMENT.find((m) => m.id === moyenEffectif)!.nom}`,
    `Nom : ${nom}`,
    `Téléphone : ${telephone}`,
    zone !== "retrait" ? `Adresse : ${adresse}` : "",
  ].filter(Boolean).join("\n");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="titre text-4xl md:text-5xl">Votre panier</h1>

      {/* Livraison offerte : montant restant (§9.2) */}
      <div className="mt-5 rounded-2xl bg-creme p-4">
        {livraisonOfferte ? (
          <p className="font-semibold text-green-800">✓ La livraison vous est offerte.</p>
        ) : (
          <p>
            Plus que <strong className="prix">{formatPrix(reste)}</strong> pour la livraison offerte.
          </p>
        )}
        <div className="mt-2 h-2 rounded-full bg-white overflow-hidden">
          <div className="h-full bg-or" style={{ width: `${Math.min(100, (sousTotal / SEUIL_LIVRAISON_OFFERTE) * 100)}%` }} />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-[1fr_380px] gap-10">
        <ul className="divide-y divide-bordure">
          {lignes.map((l) => (
            <li key={l.slug} className="py-4 flex gap-4">
              <Link href={`/produit/${l.slug}`} className="w-24 shrink-0">
                <VisuelProduit produit={l.produit} />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-gris">{nomMarque(l.produit.marque)}</p>
                <Link href={`/produit/${l.slug}`} className="font-semibold hover:text-or">{l.produit.nom}</Link>
                <p className="text-sm text-gris">{l.produit.contenance} · {formatPrix(l.produit.prix)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-bordure">
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

        <aside className="rounded-2xl border border-bordure p-5 h-fit space-y-5">
          <fieldset>
            <legend className="font-semibold mb-2">Livraison</legend>
            <div className="space-y-2">
              {ZONES_LIVRAISON.map((z) => (
                <label key={z.id} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer ${zone === z.id ? "border-or bg-creme" : "border-bordure"}`}>
                  <input type="radio" name="zone" checked={zone === z.id} onChange={() => setZone(z.id)} className="mt-1 accent-[#C59735]" />
                  <span className="flex-1 text-sm">
                    <span className="font-semibold block">{z.nom}</span>
                    <span className="text-gris">{z.delai}</span>
                  </span>
                  <span className="prix text-sm font-semibold">{z.tarif === 0 || livraisonOfferte ? "Gratuit" : formatPrix(z.tarif)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="font-semibold mb-2">Vos coordonnées <span className="font-normal text-gris text-sm">(sans créer de compte)</span></legend>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Prénom et nom" autoComplete="name" className="w-full rounded-xl border border-bordure px-4 py-3" />
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone (WhatsApp)" type="tel" autoComplete="tel" className="w-full rounded-xl border border-bordure px-4 py-3" />
            {zone !== "retrait" && (
              <textarea value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse de livraison, repère" rows={2} autoComplete="street-address" className="w-full rounded-xl border border-bordure px-4 py-3" />
            )}
          </fieldset>

          <fieldset>
            <legend className="font-semibold mb-2">Paiement</legend>
            <div className="space-y-2">
              {MOYENS_PAIEMENT.map((m) => {
                const indisponible = m.id === "livraison" && !paiementLivraisonPossible;
                return (
                  <label key={m.id} className={`flex items-start gap-3 rounded-xl border p-3 ${indisponible ? "opacity-50" : "cursor-pointer"} ${moyenEffectif === m.id ? "border-or bg-creme" : "border-bordure"}`}>
                    <input type="radio" name="moyen" disabled={indisponible} checked={moyenEffectif === m.id} onChange={() => setMoyen(m.id)} className="mt-1 accent-[#C59735]" />
                    <span className="text-sm">
                      <span className="font-semibold block">{m.nom}</span>
                      <span className="text-gris">
                        {indisponible ? `Non disponible en régions ni au-delà de ${formatPrix(PLAFOND_PAIEMENT_LIVRAISON)}` : m.detail}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <dl className="space-y-1 text-sm border-t border-bordure pt-4">
            <div className="flex justify-between"><dt>Sous-total</dt><dd className="prix">{formatPrix(sousTotal)}</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd className="prix">{frais === 0 ? "Gratuit" : formatPrix(frais)}</dd></div>
            <div className="flex justify-between text-lg font-bold pt-2"><dt>Total</dt><dd className="prix">{formatPrix(total)}</dd></div>
          </dl>

          <a
            href={complet ? lienWhatsApp(message) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!complet}
            className={`block text-center rounded-full py-3.5 font-semibold text-white ${complet ? "bg-or hover:bg-noir" : "bg-gris/40 pointer-events-none"}`}
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
  );
}
