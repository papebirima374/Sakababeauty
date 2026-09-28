import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { EST_PRODUCTION, URL_SITE } from "@/lib/config";
import { BOUTIQUE_ACTIVE as B, variablesCouleurs } from "@/lib/boutique";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: B.siteEnLigne ? `${B.nom} — Cosmétiques authentiques importés des USA, Dakar` : `${B.nom} ${B.slogan}`,
    template: `%s | ${B.nom}`,
  },
  description: B.description,
  icons: { icon: B.icone },
  openGraph: {
    siteName: B.nom,
    locale: "fr_SN",
    type: "website",
    images: [{ url: B.apercu, width: 1200, height: 630, alt: `Logo ${B.nom}` }],
  },
  // Tant que le site n'est pas officiellement en ligne : invisible des moteurs.
  robots: EST_PRODUCTION ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: B.couleurs.sombre };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable} h-full antialiased`} style={variablesCouleurs(B.couleurs)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
