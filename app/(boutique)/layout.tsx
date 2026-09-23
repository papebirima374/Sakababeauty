import { PanierProvider } from "@/lib/panier";
import Entete from "@/components/Entete";
import PiedDePage from "@/components/PiedDePage";
import BarreMobile from "@/components/BarreMobile";

// Habillage de la boutique en ligne (en pause : un autre prestataire fait le site).
export default function LayoutBoutique({ children }: LayoutProps<"/">) {
  return (
    <PanierProvider>
      <Entete />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <PiedDePage />
      <BarreMobile />
    </PanierProvider>
  );
}
