// Vérifie les règles Firestore sur les ÉMULATEURS (après « npm run seed »).
// Lancer : node scripts/test-regles.mjs — chaque ligne doit commencer par ✓.
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, connectFirestoreEmulator, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc, increment } from "firebase/firestore";
const app = initializeApp({ apiKey: "demo-cle", projectId: "demo-sakaba" });
const auth = getAuth(app); connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8080);
const essai = async (nom, attendu, f) => { let ok; try { await f(); ok = true; } catch { ok = false; } console.log(ok === attendu ? "✓" : "✗ PROBLÈME", nom, ok ? "(autorisé)" : "(refusé)"); };
const P = doc(db, "produits", "cerave-nettoyant-hydratant-236ml");
// Anonyme
await essai("anonyme lit un produit", true, () => getDocs(collection(db, "produits")));
await essai("anonyme lit les ventes", false, () => getDocs(collection(db, "ventes")));
await essai("anonyme baisse un stock", false, () => updateDoc(P, { stock: increment(-1) }));
await essai("anonyme crée une vente", false, () => addDoc(collection(db, "ventes"), { total: 1, lignes: [1], vendeuse: { uid: "x" } }));
// Vendeuse
const v = await signInWithEmailAndPassword(auth, "vendeuse@test.sakaba", "sakaba-test");
await essai("vendeuse baisse un stock", true, () => updateDoc(P, { stock: increment(-1) }));
await essai("vendeuse change un prix", false, () => updateDoc(P, { prix: 1 }));
await essai("vendeuse crée un produit", false, () => setDoc(doc(db, "produits", "faux"), { nom: "x" }));
await essai("vendeuse crée une vente à son nom", true, () => addDoc(collection(db, "ventes"), { total: 1000, lignes: [{ id: "a" }], vendeuse: { uid: v.user.uid, nom: "V" }, jour: "test", canal: "test" }));
await essai("vendeuse crée une vente au nom d'une autre", false, () => addDoc(collection(db, "ventes"), { total: 1000, lignes: [{ id: "a" }], vendeuse: { uid: "autre" } }));
const ventes = await getDocs(collection(db, "ventes"));
await essai("vendeuse supprime une vente", false, () => deleteDoc(ventes.docs[0].ref));
await essai("vendeuse modifie une vente", false, () => updateDoc(ventes.docs[0].ref, { total: 0 }));
await essai("vendeuse se nomme directrice", false, () => updateDoc(doc(db, "equipe", v.user.uid), { role: "directrice" }));
await essai("vendeuse lit l'équipe entière", false, () => getDocs(collection(db, "equipe")));
await signOut(auth);
// Directrice
await signInWithEmailAndPassword(auth, "directrice@test.sakaba", "sakaba-test");
await essai("directrice change un prix", true, () => updateDoc(P, { prix: 11500 }));
await essai("directrice annule une vente", true, () => updateDoc(ventes.docs[0].ref, { statut: "annulee" }));
await essai("directrice supprime une vente", false, () => deleteDoc(ventes.docs[0].ref));
await essai("directrice lit l'équipe", true, () => getDocs(collection(db, "equipe")));
process.exit(0);
