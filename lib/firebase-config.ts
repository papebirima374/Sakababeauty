// Réglages Firebase lisibles côté serveur comme côté navigateur.
export const EMULATEUR = process.env.NEXT_PUBLIC_FIREBASE_EMULATEUR === "1";

export const CONFIG = EMULATEUR
  ? { apiKey: "demo-cle", authDomain: "demo-sakaba.firebaseapp.com", projectId: "demo-sakaba", appId: "demo" }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

// Sans configuration, les pages de gestion restent en mode démonstration.
export const FIREBASE_CONFIGURE = EMULATEUR || Boolean(CONFIG.apiKey && CONFIG.projectId);
