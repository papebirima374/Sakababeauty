// Formulaire d'avis Sakaba Beauty, version autonome pour Railway (20/11/2026),
// mise en place pendant la pause du projet Vercel. Aucune dépendance : une page
// HTML, le logo et l'image d'aperçu. La clé Web3Forms vient de la variable
// WEB3FORMS_KEY (publique par conception : elle n'envoie que vers l'adresse de Sakaba).
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const dossier = new URL("./public/", import.meta.url);
const CLE = (process.env.WEB3FORMS_KEY ?? "").trim();
const page = readFileSync(new URL("index.html", dossier), "utf8").replace("__CLE_WEB3FORMS__", JSON.stringify(CLE).slice(1, -1));
const fichiers = {
  "/logo-sakaba.png": ["image/png", readFileSync(new URL("logo-sakaba.png", dossier))],
  "/apercu.jpg": ["image/jpeg", readFileSync(new URL("apercu.jpg", dossier))],
};

createServer((req, res) => {
  const chemin = new URL(req.url ?? "/", "http://x").pathname.replace(/\/+$/, "") || "/";
  if (chemin === "/" || chemin === "/avis") {
    // Adresse complète du site, pour l'image d'aperçu (WhatsApp exige une adresse absolue).
    const hote = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").replace(/[^a-zA-Z0-9.:-]/g, "");
    const proto = req.headers["x-forwarded-proto"] === "http" ? "http" : "https";
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    return res.end(page.replace("__ORIGINE__", `${proto}://${hote}`));
  }
  if (fichiers[chemin]) {
    const [type, contenu] = fichiers[chemin];
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "public, max-age=86400" });
    return res.end(contenu);
  }
  res.writeHead(302, { Location: "/" });
  res.end();
}).listen(Number(process.env.PORT) || 3000, () => console.log("Formulaire d'avis prêt"));
