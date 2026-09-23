// Diagnostic de la liaison site ↔ Google Sheet. N'affiche jamais le secret ni l'adresse.
// Ouvrir /api/masterclass/verification dans le navigateur.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.MASTERCLASS_SCRIPT_URL ?? "";
  const secret = process.env.MASTERCLASS_SECRET ?? "";
  const r: Record<string, string | boolean | number> = {
    variable_url_presente: Boolean(url),
    variable_secret_presente: Boolean(secret),
    url_se_termine_par_exec: url.trim().endsWith("/exec"),
    url_espaces_en_trop: url !== url.trim(),
    secret_espaces_en_trop: secret !== secret.trim(),
  };
  if (!url || !secret) {
    r.conclusion = "Variables absentes : les ajouter dans Vercel puis faire Redeploy.";
    return Response.json(r);
  }
  try {
    const rep = await fetch(`${url.trim()}?secret=${encodeURIComponent(secret)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    r.statut_google = rep.status;
    const type = rep.headers.get("content-type") ?? "";
    const texte = await rep.text();
    if (type.includes("json") || texte.trim().startsWith("{")) {
      const json = JSON.parse(texte);
      if (json.ok) {
        r.conclusion = "Tout fonctionne : le site lit le Google Sheet.";
        r.titre_lu = json.evenement?.titre ?? "";
        r.places_restantes = json.evenement?.restantes ?? "";
      } else if (json.erreur === "acces") {
        r.conclusion = "Le mot secret ne correspond pas : SECRET dans Apps Script et MASTERCLASS_SECRET dans Vercel doivent être identiques.";
      } else {
        r.conclusion = `Réponse inattendue du programme : ${json.erreur ?? "?"}`;
      }
    } else if (/accounts\.google\.com|ServiceLogin|signin/i.test(texte)) {
      r.conclusion = "Google demande une connexion : dans Déployer > Gérer les déploiements, mettre « Qui a accès » sur « Tout le monde », puis Nouvelle version.";
    } else if (rep.status === 404) {
      r.conclusion = "Adresse introuvable : recopier l'URL de l'application Web (elle finit par /exec) dans MASTERCLASS_SCRIPT_URL.";
    } else {
      const titre = texte.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
      const extrait = texte
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z#0-9]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300);
      if (/introuvable|not found|doGet/i.test(extrait)) {
        r.conclusion = "Le programme publié ne contient pas doGet : dans Apps Script, Déployer > Gérer les déploiements > crayon > Version : Nouvelle version > Déployer.";
      } else {
        r.conclusion = "Google a répondu par une page au lieu des données (souvent : programme mal collé ou erreur dans le script).";
      }
      r.titre_page_google = titre;
      r.extrait_page_google = extrait;
    }
  } catch (e) {
    r.conclusion = `Impossible de joindre Google : ${(e as Error).name}`;
  }
  return Response.json(r);
}
