import { inscrire } from "@/lib/masterclass";

// Reçoit l'inscription depuis la page /masterclass et la transmet au Google Sheet.
export async function POST(request: Request) {
  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return Response.json({ ok: false, erreur: "format" }, { status: 400 });
  }
  const texte = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  // Champ piège invisible : un robot le remplit, un humain non.
  if (texte(d.site, 200)) return Response.json({ ok: true });

  const inscription = {
    prenom: texte(d.prenom, 80),
    nom: texte(d.nom, 80),
    telephone: texte(d.telephone, 30),
    email: texte(d.email, 120),
    cliente: texte(d.cliente, 20),
    attentes: texte(d.attentes, 1000),
  };
  if (!inscription.prenom || !inscription.nom || inscription.telephone.replace(/\D/g, "").length < 9) {
    return Response.json({ ok: false, erreur: "champs" }, { status: 400 });
  }
  return Response.json(await inscrire(inscription));
}
