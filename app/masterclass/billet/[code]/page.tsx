import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import CarteInvitation from "@/components/CarteInvitation";
import { BOUTIQUE_ACTIVE } from "@/lib/boutique";
import { URL_SITE } from "@/lib/config";
import { formatPrix } from "@/lib/format";
import { lireBillet } from "@/lib/masterclass";
import { MASTERCLASS } from "@/lib/masterclass-infos";

// Page d'une invitation. Deux usages :
// - la cliente (lien WhatsApp, « Déjà payé ? ») : seulement sa carte à télécharger,
//   sans bandeau de validité ;
// - le contrôle à l'entrée (?controle=1, ce que contient le QR code) : grand
//   bandeau vert / orange / rouge. Seule la directrice valide, en écrivant
//   « Payé » dans le Google Sheet.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invitation masterclass",
  robots: { index: false, follow: false },
};

function Bandeau({ couleur, titre, texte }: { couleur: "vert" | "orange" | "rouge"; titre: string; texte: string }) {
  const c = {
    vert: "bg-green-700 text-white",
    orange: "bg-amber-400 text-noir",
    rouge: "bg-red-700 text-white",
  }[couleur];
  return (
    <div className={`rounded-3xl p-6 text-center ${c}`} role="status">
      <p className="text-3xl font-bold">{titre}</p>
      <p className="mt-1">{texte}</p>
    </div>
  );
}

function Message({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-bordure/70">
      <p className="titre text-3xl">{titre}</p>
      <p className="text-gris mt-2">{texte}</p>
    </div>
  );
}

export default async function PageBillet({ params, searchParams }: PageProps<"/masterclass/billet/[code]">) {
  const controle = (await searchParams).controle === "1";
  if (BOUTIQUE_ACTIVE.id !== "sakaba") redirect("/gestion/solution");
  const { code: brut } = await params;
  const code = decodeURIComponent(brut).trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const r = await lireBillet(code);

  let contenu: React.ReactNode;
  if (r === "indisponible") {
    contenu = controle
      ? <Bandeau couleur="orange" titre="Vérification impossible" texte="La connexion ne répond pas. Réessayez dans un instant." />
      : <Message titre="Un instant…" texte="La connexion ne répond pas. Réessayez dans un instant." />;
  } else if (r === "inconnu" || r.billet.annule) {
    contenu = controle
      ? <Bandeau couleur="rouge" titre={r === "inconnu" ? "✕ Invitation introuvable" : "✕ Invitation annulée"} texte={r === "inconnu" ? `Aucune réservation avec le code ${code}.` : `${r.billet.prenom} ${r.billet.nom} · ${code}`} />
      : <Message titre="Invitation introuvable" texte="Contactez Sakaba Beauty sur WhatsApp au 78 588 54 54." />;
  } else if (!r.billet.paye) {
    contenu = controle ? (
      <Bandeau couleur="orange" titre="Paiement non confirmé" texte={`${r.billet.prenom} ${r.billet.nom} · ${code}`} />
    ) : (
      <>
        <Message titre={`Bonjour ${r.billet.prenom}`} texte="Votre invitation sera disponible ici dès que Sakaba Beauty aura confirmé votre paiement." />
        <div className="mt-5 rounded-3xl bg-white p-6 text-center">
          <p className="text-gris">Pas encore payé ?</p>
          <a href={MASTERCLASS.lienPaiement} className="mt-4 block rounded-full bg-[#1DC8FF] py-4 text-lg font-semibold text-[#0B1B33]">
            Payer {formatPrix(MASTERCLASS.prix)} avec Wave
          </a>
          <p className="text-xs text-gris mt-2">+ {formatPrix(MASTERCLASS.montantWave - MASTERCLASS.prix)} de frais Wave, déjà rempli.</p>
        </div>
      </>
    );
  } else {
    const titre = (r.evenement?.titre || MASTERCLASS.theme).replace(/^\s*masterclass\s*[-–—:·]?\s*/i, "") || MASTERCLASS.theme;
    contenu = (
      <>
        {controle && <Bandeau couleur="vert" titre="✓ Invitation valide" texte={`Payée · ${r.billet.prenom} ${r.billet.nom}`} />}
        <div className={controle ? "mt-6" : ""}>
          <CarteInvitation
            infos={{
              code,
              nomComplet: `${r.billet.prenom} ${r.billet.nom}`.trim(),
              titre,
              animee: MASTERCLASS.animee,
              date: r.evenement?.date ?? "",
              heure: r.evenement?.heure ?? "",
              lieu: r.evenement?.lieu ?? "",
              lien: `${URL_SITE}/masterclass/billet/${code}?controle=1`,
            }}
          />
        </div>
      </>
    );
  }

  return (
    <main className="flex-1 bg-creme min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="flex justify-center">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={72} height={72} className="rounded-full bg-white ring-2 ring-or" />
        </div>
        <p className="mt-4 mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-or">Invitation · Masterclass</p>
        {contenu}
      </div>
    </main>
  );
}
