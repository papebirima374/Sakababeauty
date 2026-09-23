import type { MetadataRoute } from "next";
import { EST_PRODUCTION, URL_SITE } from "@/lib/config";

// Hors production, tout le site est fermé aux moteurs de recherche.
export default function robots(): MetadataRoute.Robots {
  if (!EST_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panier", "/recherche"] },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
