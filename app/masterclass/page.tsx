import type { Metadata } from "next";
import Image from "next/image";
import { lireEvenement, MASTERCLASS_CONFIGUREE } from "@/lib/masterclass";
import FormulaireMasterclass from "@/components/FormulaireMasterclass";

// Places restantes lues en direct dans le Google Sheet à chaque visite.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const ev = await lireEvenement();
  const titre = ev?.titre || "Masterclass Sakaba Beauty";
  const quand = [ev?.date, ev?.heure].filter(Boolean).join(" à ");
  const description = [quand, ev?.lieu, "Inscription gratuite, places limitées."].filter(Boolean).join(" · ");
  return { title: titre, description, openGraph: { title: titre, description } };
}

export default async function PageMasterclass() {
  const ev = await lireEvenement();

  return (
    <main className="flex-1 bg-creme">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="text-center">
          <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={96} height={96} className="mx-auto rounded-full bg-white" priority />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-or">Événement · Inscription gratuite</p>
          <h1 className="titre text-4xl sm:text-5xl mt-2">{ev?.titre || "Masterclass Sakaba Beauty"}</h1>
          {ev?.sousTitre && <p className="text-lg text-gris mt-2">{ev.sousTitre}</p>}
        </header>

        {ev && (ev.date || ev.heure || ev.lieu) && (
          <dl className="mt-8 grid gap-3 sm:grid-cols-3 text-center">
            {[
              ["Date", ev.date],
              ["Heure", ev.heure],
              ["Lieu", ev.lieu],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white border border-bordure p-4">
                <dt className="text-xs uppercase tracking-wider text-gris">{k}</dt>
                <dd className="font-semibold mt-1 first-letter:uppercase">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {ev?.description && <p className="mt-6 leading-relaxed whitespace-pre-line">{ev.description}</p>}

        <div className="mt-8">
          {!MASTERCLASS_CONFIGUREE || !ev ? (
            <p className="rounded-2xl bg-white border border-bordure p-6 text-center">
              Les inscriptions ouvriront très bientôt. Merci de revenir un peu plus tard.
            </p>
          ) : !ev.ouvert ? (
            <p className="rounded-2xl bg-white border border-bordure p-6 text-center">
              Les inscriptions sont closes. Suivez @sakababeauty sur Instagram pour les prochaines dates.
            </p>
          ) : ev.restantes <= 0 ? (
            <div className="rounded-2xl bg-white border border-bordure p-6 text-center">
              <p className="titre text-3xl">C&apos;est complet !</p>
              <p className="text-gris mt-2">Suivez @sakababeauty sur Instagram pour les prochaines dates.</p>
            </div>
          ) : (
            <>
              <p className={`mb-4 text-center font-semibold ${ev.restantes <= 5 ? "text-red-700" : "text-or"}`}>
                {ev.restantes === 1 ? "Plus qu'une place disponible !" : `${ev.restantes} places disponibles sur ${ev.places}`}
              </p>
              <FormulaireMasterclass evenement={{ titre: ev.titre, date: ev.date, heure: ev.heure, lieu: ev.lieu, restantes: ev.restantes }} />
            </>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-gris">Sakaba Beauty · Mermoz Ancienne Piste, Dakar</p>
      </div>
    </main>
  );
}
