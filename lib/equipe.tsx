"use client";

// Qui est connecté dans l'espace gestion, et avec quel rôle.
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { firebase } from "./firebase";
import { FIREBASE_CONFIGURE } from "./firebase-config";

export type Role = "directrice" | "vendeuse";
export type Membre = { uid: string; nom: string; role: Role; email: string };

type Etat =
  | { etat: "chargement" }
  | { etat: "deconnecte" }
  | { etat: "refuse"; user: User }
  | { etat: "ok"; membre: Membre };

export function useEquipe(): Etat {
  const [etat, setEtat] = useState<Etat>({ etat: "chargement" });
  useEffect(() => {
    if (!FIREBASE_CONFIGURE) return;
    const { auth, db } = firebase();
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return setEtat({ etat: "deconnecte" });
      try {
        const fiche = await getDoc(doc(db, "equipe", user.uid));
        const d = fiche.data();
        if (!d || d.actif !== true) return setEtat({ etat: "refuse", user });
        setEtat({ etat: "ok", membre: { uid: user.uid, nom: d.nom, role: d.role, email: user.email ?? "" } });
      } catch {
        setEtat({ etat: "refuse", user });
      }
    });
  }, []);
  return etat;
}

export function deconnexion() {
  return signOut(firebase().auth);
}

// Affiche la page seulement pour un membre actif de l'équipe.
export function GardeEquipe({ children, roles }: { children: (m: Membre) => React.ReactNode; roles?: Role[] }) {
  const e = useEquipe();
  const boite = (contenu: React.ReactNode) => (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-8 ring-1 ring-bordure/70">{contenu}</div>
    </div>
  );
  if (e.etat === "chargement") return boite(<p className="text-gris">Chargement…</p>);
  if (e.etat === "deconnecte")
    return boite(
      <>
        <p className="titre text-3xl">Espace réservé à l&apos;équipe</p>
        <Link href="/gestion/connexion" className="mt-5 inline-block rounded-full bg-noir text-white px-6 py-3 font-semibold hover:bg-or">
          Se connecter
        </Link>
      </>,
    );
  if (e.etat === "refuse" || (roles && !roles.includes(e.membre.role)))
    return boite(
      <>
        <p className="titre text-3xl">Accès refusé</p>
        <p className="text-gris mt-2">Ce compte n&apos;a pas accès à cette page. Demandez à la directrice.</p>
        <button type="button" onClick={deconnexion} className="mt-5 rounded-full border border-bordure px-6 py-3 font-semibold hover:border-or">
          Changer de compte
        </button>
      </>,
    );
  return <>{children(e.membre)}</>;
}
