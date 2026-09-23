// Récupère la photo de chaque produit d'exemple depuis sa page (site de la marque
// d'abord, revendeur ensuite) et l'enregistre dans public/produits/.
// Lancé par GitHub Actions (.github/workflows/photos-produits.yml), qui a accès à
// Internet. Ne remplace pas une photo déjà présente, sauf avec --forcer.
//
//   node scripts/photos-produits.mjs [--forcer]

import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..");
const DOSSIER = path.join(RACINE, "public", "produits");
const SORTIE = path.join(RACINE, "lib", "photos-produits.json");
const FORCER = process.argv.includes("--forcer");

const ENTETES = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

async function recuperer(url, delai = 20000) {
  const ctrl = new AbortController();
  const minuterie = setTimeout(() => ctrl.abort(), delai);
  try {
    return await fetch(url, { headers: ENTETES, redirect: "follow", signal: ctrl.signal });
  } finally {
    clearTimeout(minuterie);
  }
}

function decoder(s) {
  return s.replace(/&amp;/g, "&").replace(/&#x2F;/g, "/").replace(/&#47;/g, "/").replace(/&quot;/g, '"');
}

// Adresse de la photo principale : balises og:image / twitter:image, puis JSON-LD Product.
function trouverImage(html, base) {
  const candidats = [];
  const meta = /<meta\s+[^>]*(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]*>/gi;
  for (const balise of html.match(meta) ?? []) {
    const m = balise.match(/content=["']([^"']+)["']/i);
    if (m) candidats.push(m[1]);
  }
  for (const bloc of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const donnees = JSON.parse(bloc[1]);
      for (const d of [donnees, ...(donnees["@graph"] ?? [])].flat()) {
        if (d?.["@type"] !== "Product") continue;
        const img = Array.isArray(d.image) ? d.image[0] : d.image;
        const url = typeof img === "string" ? img : img?.url;
        if (url) candidats.unshift(url);
      }
    } catch {}
  }
  for (const c of candidats) {
    try {
      const url = new URL(decoder(c.trim()), base);
      if (!/logo|favicon|placeholder|default/i.test(url.pathname)) return url.href;
    } catch {}
  }
  return null;
}

async function telecharger(slug, pages) {
  for (const page of pages) {
    try {
      const rep = await recuperer(page);
      if (!rep.ok) {
        console.log(`  ${slug} : page ${rep.status} — ${page}`);
        continue;
      }
      const image = trouverImage(await rep.text(), rep.url);
      if (!image) {
        console.log(`  ${slug} : pas d'image trouvée — ${page}`);
        continue;
      }
      const img = await recuperer(image);
      const type = (img.headers.get("content-type") ?? "").split(";")[0].trim();
      const octets = Buffer.from(await img.arrayBuffer());
      if (!img.ok || !EXTENSIONS[type] || octets.length < 5000) {
        console.log(`  ${slug} : image refusée (${img.status}, ${type}, ${octets.length} o) — ${image}`);
        continue;
      }
      const fichier = `${slug}.${EXTENSIONS[type]}`;
      await writeFile(path.join(DOSSIER, fichier), octets);
      console.log(`✓ ${slug} ← ${new URL(page).hostname} (${Math.round(octets.length / 1024)} Ko)`);
      return { image: `/produits/${fichier}`, source: page };
    } catch (e) {
      console.log(`  ${slug} : erreur ${e.name === "AbortError" ? "délai dépassé" : e.message} — ${page}`);
    }
  }
  console.log(`✗ ${slug} : aucune photo`);
  return null;
}

const sources = JSON.parse(await readFile(path.join(RACINE, "scripts", "sources-photos.json"), "utf8"));
delete sources._note;
await mkdir(DOSSIER, { recursive: true });

let photos = {};
try {
  photos = JSON.parse(await readFile(SORTIE, "utf8"));
} catch {}
const presents = new Set(await readdir(DOSSIER));

for (const [slug, pages] of Object.entries(sources)) {
  const deja = photos[slug]?.image;
  if (!FORCER && deja && presents.has(path.basename(deja))) {
    console.log(`· ${slug} : déjà présente`);
    continue;
  }
  const resultat = await telecharger(slug, pages);
  if (resultat) photos[slug] = resultat;
}

await writeFile(SORTIE, JSON.stringify(photos, null, 2) + "\n");
console.log(`\n${Object.keys(photos).length} / ${Object.keys(sources).length} produits avec photo.`);
