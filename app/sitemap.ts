import type { MetadataRoute } from "next";
import { MARQUES, PRODUITS, UNIVERS } from "@/lib/catalogue";
import { URL_SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/boutique", "/marques", "/diagnostic", "/authenticite", "/livraison"];
  return [
    ...pages.map((p) => ({ url: `${URL_SITE}${p}` })),
    ...UNIVERS.flatMap((u) => [
      { url: `${URL_SITE}/${u.slug}` },
      ...u.categories.map((c) => ({ url: `${URL_SITE}/${u.slug}/${c.slug}` })),
    ]),
    ...MARQUES.map((m) => ({ url: `${URL_SITE}/marques/${m.slug}` })),
    ...PRODUITS.map((p) => ({ url: `${URL_SITE}/produit/${p.slug}` })),
  ];
}
