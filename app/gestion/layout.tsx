import type { Metadata } from "next";

// L'espace gestion n'apparaît jamais dans Google, même une fois le site en ligne.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LayoutGestion({ children }: LayoutProps<"/gestion">) {
  return children;
}
