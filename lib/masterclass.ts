// Côté serveur uniquement : dialogue avec le programme du Google Sheet
// (scripts/masterclass-google-sheet.gs). L'adresse et le mot secret restent
// sur Vercel (MASTERCLASS_SCRIPT_URL, MASTERCLASS_SECRET), jamais dans le navigateur.
import "server-only";

export type Evenement = {
  titre: string;
  sousTitre: string;
  date: string;
  heure: string;
  lieu: string;
  description: string;
  places: number;
  inscrits: number;
  restantes: number;
  ouvert: boolean;
};

export type Inscription = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  cliente: string;
  attentes: string;
};

export type ReponseInscription =
  | { ok: true; evenement: Evenement }
  | { ok: false; erreur: "champs" | "ferme" | "complet" | "deja" | "occupe" | "acces" | "format" | "indisponible"; evenement?: Evenement };

const URL_SCRIPT = process.env.MASTERCLASS_SCRIPT_URL ?? "";
const SECRET = process.env.MASTERCLASS_SECRET ?? "";

export const MASTERCLASS_CONFIGUREE = Boolean(URL_SCRIPT && SECRET);

export async function lireEvenement(): Promise<Evenement | null> {
  if (!MASTERCLASS_CONFIGUREE) return null;
  try {
    const url = `${URL_SCRIPT}?secret=${encodeURIComponent(SECRET)}`;
    const rep = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    const json = await rep.json();
    return json.ok ? (json.evenement as Evenement) : null;
  } catch {
    return null;
  }
}

export async function inscrire(i: Inscription): Promise<ReponseInscription> {
  if (!MASTERCLASS_CONFIGUREE) return { ok: false, erreur: "indisponible" };
  try {
    const rep = await fetch(URL_SCRIPT, {
      method: "POST",
      // text/plain : ce que Google Apps Script accepte sans difficulté.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...i, secret: SECRET }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    return (await rep.json()) as ReponseInscription;
  } catch {
    return { ok: false, erreur: "indisponible" };
  }
}
