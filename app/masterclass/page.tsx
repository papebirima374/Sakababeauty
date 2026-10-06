import { redirect } from "next/navigation";
import { BOUTIQUE_ACTIVE } from "@/lib/boutique";
import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { lireEvenement, MASTERCLASS_CONFIGUREE } from "@/lib/masterclass";
import FormulaireMasterclass from "@/components/FormulaireMasterclass";
import RetrouverInvitation from "@/components/RetrouverInvitation";
import { MASTERCLASS, debutEvenement } from "@/lib/masterclass-infos";
import CompteARebours from "@/components/CompteARebours";
import { formatPrix } from "@/lib/format";

// Informations lues en direct dans le Google Sheet à chaque visite, dont les
// places restantes (« Plus que 17 places ») : seules les places PAYÉES comptent,
// et le total n'est jamais montré (choix de la directrice).
export const dynamic = "force-dynamic";

// Aperçu de lien fixe : WhatsApp et les autres n'attendent pas la réponse de Google.
export const metadata: Metadata = {
  title: "Masterclass Acné & hyperpigmentation",
  description: "Samedi 24 octobre à 16 h chez Sakaba Beauty, Mermoz. Places limitées : réservez la vôtre en 1 minute.",
  openGraph: {
    title: "Masterclass Acné & hyperpigmentation · Sakaba Beauty",
    description: "Samedi 24 octobre à 16 h chez Sakaba Beauty, Mermoz. Places limitées : réservez la vôtre en 1 minute.",
  },
};

// Robots d'aperçu de liens : ils n'ont besoin que du titre et de l'image.
const ROBOTS_APERCU = /WhatsApp|facebookexternalhit|facebookcatalog|Twitterbot|TelegramBot|Slackbot|LinkedInBot|Discordbot|SkypeUriPreview|Snapchat|Pinterest|vkShare|redditbot/i;

const ICONES = {
  date: (
    <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  ),
  heure: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  lieu: (
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
  ),
};

function Icone({ nom }: { nom: keyof typeof ICONES }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONES[nom]}
    </svg>
  );
}

function Encart({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-25px_rgba(20,16,11,0.35)]">
      <p className="text-or text-3xl">✦</p>
      <p className="titre text-3xl mt-2">{titre}</p>
      <p className="text-gris mt-2">{texte}</p>
    </div>
  );
}

export default async function PageMasterclass() {
  // Page propre à Sakaba : absente des autres boutiques.
  if (BOUTIQUE_ACTIVE.id !== "sakaba") redirect("/gestion/solution");
  const agent = (await headers()).get("user-agent") ?? "";
  const ev = ROBOTS_APERCU.test(agent) ? null : await lireEvenement();
  const infos = ev
    ? ([
        ["date", "Date", ev.date],
        ["heure", "Heure", ev.heure],
        ["lieu", "Lieu", ev.lieu],
      ] as const).filter(([, , v]) => v)
    : [];
  const debut = ev ? debutEvenement(ev.date, ev.heure) : null;
  const inscriptionPossible = Boolean(MASTERCLASS_CONFIGUREE && ev && ev.ouvert && ev.places > 0 && ev.restantes > 0);
  // « MASTERCLASS » est déjà écrit en grand au-dessus du titre.
  const titreSansMasterclass = (ev?.titre || MASTERCLASS.theme).replace(/^\s*masterclass\s*[-–—:·]?\s*/i, "") || MASTERCLASS.theme;

  return (
    <main className="flex-1 bg-creme">
      {/* Bandeau */}
      <section className="relative overflow-hidden bg-noir text-creme">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 0%, rgba(var(--or-rgb),0.35), transparent 70%), radial-gradient(40% 40% at 90% 100%, rgba(var(--or-rgb),0.12), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 pt-10 pb-32 sm:pt-14 text-center">
          <div className="mx-auto w-24 h-24 rounded-full p-[3px] bg-gradient-to-b from-or-clair to-or shadow-[0_0_40px_rgba(var(--or-rgb),0.35)]">
            <Image src="/logo-sakaba.png" alt="Sakaba Beauty" width={96} height={96} className="w-full h-full rounded-full bg-white" priority />
          </div>
          <h1>
            <span className="block mt-7 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.4em] pl-[0.4em] text-or-clair">
              Masterclass
            </span>
            <span className="block titre text-[2.6rem] sm:text-6xl leading-[1.05] mt-3 text-balance break-words">
              {titreSansMasterclass}
            </span>
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-semibold text-or-clair">{MASTERCLASS.animee}</p>
          {ev?.sousTitre && <p className="titre text-2xl sm:text-3xl italic text-or-clair mt-3">{ev.sousTitre}</p>}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3 text-or" aria-hidden>
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-or" />
            <span className="text-sm">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-or" />
          </div>
          <p className="mt-4 text-creme/80">
            Participation : <strong className="prix text-or-clair">{formatPrix(MASTERCLASS.prix)}</strong>
          </p>
          <p className="mt-1 text-xs text-creme/55">
            + {formatPrix(MASTERCLASS.montantWave - MASTERCLASS.prix)} de frais Wave
          </p>
          {debut && (
            <div className="mt-7">
              <CompteARebours debut={debut} />
            </div>
          )}
          {inscriptionPossible && ev && (
            <div className="mt-8 mx-auto max-w-sm">
              <p className="font-semibold">
                {ev.restantes === 1 ? "Plus qu'une place !" : `Plus que ${ev.restantes} places`}
              </p>
              <a
                href="#inscription"
                className="mt-6 block rounded-full bg-gradient-to-r from-or to-(--or-fonce) py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(var(--or-rgb),0.8)] hover:brightness-110"
              >
                Réserver ma place
              </a>
            </div>
          )}
          {ev && (
            <a href="#invitation" className="mt-4 inline-block text-sm text-creme/70 underline hover:text-or-clair">
              Déjà payé ? Télécharger mon invitation
            </a>
          )}
        </div>
      </section>

      <div className="relative mx-auto max-w-3xl px-4 -mt-24 pb-14">
        {/* Date, heure, lieu */}
        {infos.length > 0 && (
          <dl className={`grid gap-3 ${infos.length === 3 ? "sm:grid-cols-3" : infos.length === 2 ? "sm:grid-cols-2" : ""}`}>
            {infos.map(([icone, libelle, valeur]) => (
              <div key={libelle} className="rounded-2xl bg-white p-5 shadow-[0_15px_40px_-20px_rgba(20,16,11,0.4)] flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-creme text-or">
                  <Icone nom={icone} />
                </span>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-gris">{libelle}</dt>
                  <dd className="font-semibold mt-0.5 first-letter:uppercase">{valeur}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        {/* Programme */}
        <section className="mt-10">
          <h2 className="titre text-3xl text-center">Au programme</h2>
          {ev?.description && <p className="mt-4 text-center text-gris whitespace-pre-line">{ev.description}</p>}
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {MASTERCLASS.programme.map((p, i) => (
              <li
                key={p}
                className={`flex items-start gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_35px_-22px_rgba(20,16,11,0.45)] ${i === MASTERCLASS.programme.length - 1 && MASTERCLASS.programme.length % 2 ? "sm:col-span-2" : ""}`}
              >
                <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full bg-gradient-to-b from-or-clair to-or text-white text-sm" aria-hidden>✓</span>
                <span className="pt-0.5">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Inscription */}
        <div id="inscription" className={ev ? "mt-10" : "mt-0"}>
          {!MASTERCLASS_CONFIGUREE || !ev ? (
            <Encart titre="Bientôt" texte="Les inscriptions ouvriront très bientôt. Merci de revenir un peu plus tard." />
          ) : !ev.ouvert ? (
            <Encart titre="Inscriptions closes" texte="Suivez @sakababeauty sur Instagram pour les prochaines dates." />
          ) : ev.restantes <= 0 ? (
            <Encart titre="C'est complet !" texte="Suivez @sakababeauty sur Instagram pour les prochaines dates." />
          ) : (
            <>
              <FormulaireMasterclass evenement={{ titre: titreSansMasterclass, date: ev.date, heure: ev.heure, lieu: ev.lieu, restantes: ev.restantes }} prix={MASTERCLASS.prix} montantWave={MASTERCLASS.montantWave} lienPaiement={MASTERCLASS.lienPaiement} />
            </>
          )}
        </div>

        {MASTERCLASS_CONFIGUREE && ev && <RetrouverInvitation />}

        <footer className="mt-12 text-center">
          <p className="titre text-lg text-or">Sakaba Beauty</p>
          <p className="text-sm text-gris mt-1">Mermoz Ancienne Piste, à côté de la <span className="whitespace-nowrap">Case des Tout-Petits</span></p>
          <p className="text-sm mt-1">
            <span aria-hidden>📞 </span>
            {BOUTIQUE_ACTIVE.telephones.map((t, i) => (
              <span key={t.lien}>
                {i > 0 && <span className="text-gris"> ou </span>}
                <a href={t.lien} className="prix font-semibold text-noir hover:text-or">{t.affiche}</a>
              </span>
            ))}
          </p>
        </footer>
      </div>
    </main>
  );
}
