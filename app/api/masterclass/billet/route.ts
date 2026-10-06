import { chercherBillet } from "@/lib/masterclass";

// « Retrouver mon invitation » : téléphone + nom → code de l'invitation.
export async function POST(request: Request) {
  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return Response.json({ ok: false, erreur: "format" }, { status: 400 });
  }
  const telephone = typeof d.telephone === "string" ? d.telephone.slice(0, 30) : "";
  const nom = typeof d.nom === "string" ? d.nom.trim().slice(0, 80) : "";
  if (telephone.replace(/\D/g, "").length < 9 || !nom) return Response.json({ ok: false, erreur: "champs" });
  const r = await chercherBillet(telephone, nom);
  if (r === "inconnu" || r === "indisponible") return Response.json({ ok: false, erreur: r });
  return Response.json({ ok: true, code: r.code, paye: r.paye });
}
