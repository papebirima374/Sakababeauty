"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FIREBASE_CONFIGURE, firebase } from "@/lib/firebase";

export default function Connexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      await signInWithEmailAndPassword(firebase().auth, email.trim(), motDePasse);
      router.push("/gestion/caisse");
    } catch {
      setErreur("Email ou mot de passe incorrect.");
      setEnvoi(false);
    }
  }

  const champ = "w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3.5 outline-none focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15";
  return (
    <main className="flex-1 min-h-screen bg-noir text-creme grid place-items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(197,151,53,0.35), transparent 70%)" }} aria-hidden />
      <div className="relative w-full max-w-sm">
        <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={80} height={80} className="mx-auto rounded-full bg-white" />
        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.3em] text-or-clair">Espace équipe</p>
        <h1 className="titre text-4xl text-center mt-2">Connexion</h1>
        {!FIREBASE_CONFIGURE ? (
          <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-center">La base de données n&apos;est pas encore branchée : la caisse fonctionne en démonstration.</p>
        ) : (
          <form onSubmit={valider} className="mt-6 rounded-3xl bg-white text-noir p-6 space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" placeholder="Email" className={champ} required />
            <input value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} type="password" autoComplete="current-password" placeholder="Mot de passe" className={champ} required />
            {erreur && <p className="text-sm text-red-800">{erreur}</p>}
            <button type="submit" disabled={envoi} className="w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] py-3.5 font-semibold text-white disabled:opacity-60">
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
