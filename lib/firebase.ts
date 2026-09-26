"use client";

// Connexion à la base Firebase de Sakaba, côté navigateur.
// - En local : NEXT_PUBLIC_FIREBASE_EMULATEUR=1 → émulateurs (projet demo-sakaba),
//   rien ne part sur internet.
// - En ligne : les NEXT_PUBLIC_FIREBASE_* du vrai projet (clés publiques par
//   conception ; la sécurité vient de firestore.rules).
// Le cache local permet à la caisse de continuer à vendre sans internet :
// les ventes partent dès le retour du réseau.
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

import { CONFIG, EMULATEUR, FIREBASE_CONFIGURE } from "./firebase-config";

export { FIREBASE_CONFIGURE };

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function firebase() {
  if (!FIREBASE_CONFIGURE) throw new Error("Firebase n'est pas configuré.");
  if (!app) {
    app = getApps()[0] ?? initializeApp(CONFIG);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
    if (EMULATEUR) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
  }
  return { app, auth: auth!, db: db! };
}
