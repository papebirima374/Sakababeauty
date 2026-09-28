import { redirect } from "next/navigation";
import { PanierProvider } from "@/lib/panier";
import { BOUTIQUE_ACTIVE } from "@/lib/boutique";
import Entete from "@/components/Entete";
import PiedDePage from "@/components/PiedDePage";
import BarreMobile from "@/components/BarreMobile";

// Habillage de la boutique en ligne (en pause : un autre prestataire fait le site).
export default function LayoutBoutique({ children }: LayoutProps<"/">) {
  // Boutique sans site en ligne (démo de gestion seulement) : on montre la proposition.
  if (!BOUTIQUE_ACTIVE.siteEnLigne) redirect("/gestion/solution");
  return (
    <PanierProvider>
      <Entete />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <PiedDePage />
      <BarreMobile />
    </PanierProvider>
  );
}
