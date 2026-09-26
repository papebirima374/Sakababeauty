"use client";

import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebase } from "@/lib/firebase";
import { deconnexion, type Membre } from "@/lib/equipe";
import EcranCaisse, { type Article, type Paiement, type Vente } from "./Caisse";

// Caisse branchée sur la vraie base. Une vente = un seul envoi groupé :
//   1 document dans « ventes », le stock de chaque produit baissé avec
//   increment() et une ligne dans « mouvements » par produit.
// Ce groupe fonctionne aussi SANS internet : il est gardé sur l'appareil et
// part tout seul au retour du réseau (la vente s'affiche « en attente »).

const jourDakar = () =>
  new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Africa/Dakar" }).format(new Date());

export default function CaisseFirebase({ membre }: { membre: Membre }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [erreur, setErreur] = useState("");
  const [enLigne, setEnLigne] = useState(true);

  useEffect(() => {
    const { db } = firebase();
    const arretProduits = onSnapshot(
      query(collection(db, "produits"), where("actif", "==", true)),
      (snap) =>
        setArticles(
          snap.docs
            .map((d) => {
              const x = d.data();
              return { id: d.id, nom: x.nom, marqueNom: x.marqueNom, prix: x.prix, stock: x.stock, codeBarre: x.codeBarre } as Article;
            })
            .sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
        ),
      () => setErreur("Impossible de lire les produits."),
    );
    const arretVentes = onSnapshot(
      query(collection(db, "ventes"), where("jour", "==", jourDakar()), where("canal", "==", "boutique")),
      { includeMetadataChanges: true },
      (snap) =>
        setVentes(
          snap.docs
            .map((d) => {
              const x = d.data();
              return {
                numero: x.numero,
                lignes: x.lignes,
                total: x.total,
                paiement: x.paiement as Paiement,
                recu: x.recu,
                heure: x.heure,
                vendeuse: x.vendeuse?.nom ?? "",
                telephone: x.telephone ?? "",
                enAttente: d.metadata.hasPendingWrites,
                _t: x.creeLeLocal ?? 0,
              };
            })
            .sort((a, b) => b._t - a._t),
        ),
      () => setErreur("Impossible de lire les ventes du jour."),
    );
    const maj = () => setEnLigne(navigator.onLine);
    maj();
    window.addEventListener("online", maj);
    window.addEventListener("offline", maj);
    return () => {
      arretProduits();
      arretVentes();
      window.removeEventListener("online", maj);
      window.removeEventListener("offline", maj);
    };
  }, []);

  function enregistrer(v: Vente) {
    const { db } = firebase();
    const lot = writeBatch(db);
    const refVente = doc(collection(db, "ventes"));
    const jour = jourDakar();
    lot.set(refVente, {
      canal: "boutique",
      numero: v.numero,
      jour,
      heure: v.heure,
      lignes: v.lignes,
      total: v.total,
      paiement: v.paiement,
      recu: v.recu,
      telephone: v.telephone || null,
      vendeuse: { uid: membre.uid, nom: membre.nom },
      statut: "payee",
      creeLe: serverTimestamp(),
      creeLeLocal: Date.now(),
    });
    for (const l of v.lignes) {
      lot.update(doc(db, "produits", l.id), { stock: increment(-l.quantite), majLe: serverTimestamp() });
      lot.set(doc(collection(db, "mouvements")), {
        produit: l.id,
        delta: -l.quantite,
        motif: "vente boutique",
        vente: refVente.id,
        par: membre.uid,
        jour,
        le: serverTimestamp(),
      });
    }
    // Pas d'« await » : hors connexion, l'envoi attend le réseau sans bloquer la caisse.
    lot.commit().catch(() => setErreur(`La vente ${v.numero} a été refusée par le serveur. Prévenez la directrice.`));
  }

  return (
    <>
      <div className={`print:hidden ${enLigne ? "bg-green-50 text-green-900" : "bg-amber-50 text-amber-900"} border-b border-bordure`}>
        <div className="mx-auto max-w-7xl px-4 py-2 text-sm flex items-center gap-3 flex-wrap">
          <span className="font-semibold">{enLigne ? "● En ligne" : "● Hors connexion : les ventes sont gardées et partiront au retour d'internet"}</span>
          <span className="flex-1" />
          <span className="text-gris">{membre.nom}</span>
          <button type="button" onClick={deconnexion} className="underline hover:text-or">Se déconnecter</button>
        </div>
      </div>
      <EcranCaisse articles={articles} ventes={ventes} enregistrer={enregistrer} vendeuseFixe={membre.nom} erreur={erreur} />
    </>
  );
}
