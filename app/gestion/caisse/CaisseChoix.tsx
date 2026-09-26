"use client";

import { FIREBASE_CONFIGURE } from "@/lib/firebase-config";
import { GardeEquipe } from "@/lib/equipe";
import CaisseDemo from "./CaisseDemo";
import CaisseFirebase from "./CaisseFirebase";

// Vraie caisse si la base est branchée (connexion obligatoire), sinon démonstration.
export default function CaisseChoix() {
  if (!FIREBASE_CONFIGURE) return <CaisseDemo />;
  return <GardeEquipe>{(m) => <CaisseFirebase membre={m} />}</GardeEquipe>;
}
