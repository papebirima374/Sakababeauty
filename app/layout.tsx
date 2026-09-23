import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { BOUTIQUE, EST_PRODUCTION, URL_SITE } from "@/lib/config";

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
    default: `${BOUTIQUE.nom} — Cosmétiques authentiques importés des USA, Dakar`,
    template: `%s | ${BOUTIQUE.nom}`,
  },
  description:
    "Soins du visage, cheveux, maquillage et parfums 100 % authentiques, importés des États-Unis. Boutique à Mermoz, livraison à Dakar et dans les régions. Paiement Wave et Orange Money.",
  openGraph: { siteName: BOUTIQUE.nom, locale: "fr_SN", type: "website" },
  // Tant que le site n'est pas officiellement en ligne : invisible des moteurs.
  robots: EST_PRODUCTION ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#14100B" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
