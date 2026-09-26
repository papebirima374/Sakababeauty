// Remplit les ÉMULATEURS Firebase avec le catalogue d'exemple et deux comptes
// d'équipe. Refuse de tourner ailleurs que sur les émulateurs.
//
// 1) npx firebase-tools emulators:start --project demo-sakaba
// 2) npx tsx scripts/seed-emulateur.ts
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { PRODUITS, nomMarque } from "../lib/catalogue";
import { ean13Interne } from "../lib/codes-barres";

const PROJET = "demo-sakaba";

async function main() {
  initializeApp({ projectId: PROJET });
  const db = getFirestore();
  const auth = getAuth();

  const lot = db.batch();
  PRODUITS.forEach((p, i) => {
    lot.set(db.collection("produits").doc(p.slug), {
      nom: p.nom,
      marque: p.marque,
      marqueNom: nomMarque(p.marque),
      prix: p.prix,
      stock: p.stock,
      codeBarre: ean13Interne(i + 1),
      contenance: p.contenance,
      image: p.image ?? null,
      actif: true,
      majLe: FieldValue.serverTimestamp(),
    });
  });
  await lot.commit();
  console.log(`${PRODUITS.length} produits.`);

  const comptes = [
    { email: "directrice@test.sakaba", motDePasse: "sakaba-test", nom: "Directrice (test)", role: "directrice" },
    { email: "vendeuse@test.sakaba", motDePasse: "sakaba-test", nom: "Vendeuse 1 (test)", role: "vendeuse" },
  ];
  for (const c of comptes) {
    const u = await auth.getUserByEmail(c.email).catch(() => auth.createUser({ email: c.email, password: c.motDePasse, displayName: c.nom }));
    await db.collection("equipe").doc(u.uid).set({ nom: c.nom, role: c.role, actif: true, email: c.email });
    console.log(`Compte ${c.role} : ${c.email} / ${c.motDePasse}`);
  }
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
