"use client";

import { useState } from "react";

// Formulaire d'avis clients. Chaque réponse est envoyée par email à la boutique
// via Web3Forms (https://web3forms.com). La clé est liée à l'adresse de Sakaba :
// elle est publique par conception (elle ne permet que d'envoyer vers cette adresse).
const CLE_WEB3FORMS = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

const CONNU = ["Instagram", "TikTok", "Snapchat", "Bouche à oreille", "En passant devant la boutique", "Autre"];
const ACHAT = ["À la boutique de Mermoz", "Par WhatsApp / livraison", "Les deux"];
const ASPECTS = [
  { id: "accueil", nom: "L'accueil" },
  { id: "conseils", nom: "Les conseils" },
  { id: "choix", nom: "Le choix de produits" },
  { id: "prix", nom: "Les prix" },
  { id: "confiance", nom: "La confiance dans l'authenticité" },
  { id: "livraison", nom: "La livraison" },
];
const LIBELLES_NOTE = ["", "Très déçu(e)", "Déçu(e)", "Moyen", "Satisfait(e)", "Ravi(e)"];

type Etat = "saisie" | "envoi" | "merci" | "erreur";

function Etoiles({ valeur, onChange, taille = "text-3xl", nom }: { valeur: number; onChange: (n: number) => void; taille?: string; nom: string }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={nom}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valeur === n}
          aria-label={`${n} sur 5`}
          onClick={() => onChange(n)}
          className={`${taille} leading-none transition ${n <= valeur ? "text-or" : "text-bordure hover:text-or-clair"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Choix({ options, valeur, onChange }: { options: string[]; valeur: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={valeur === o}
          onClick={() => onChange(valeur === o ? "" : o)}
          className={`rounded-full border px-4 py-2 text-sm ${valeur === o ? "bg-noir text-white border-noir" : "border-bordure bg-white hover:border-or"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function FormulaireAvis() {
  const [etat, setEtat] = useState<Etat>("saisie");
  const [note, setNote] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [connu, setConnu] = useState("");
  const [achat, setAchat] = useState("");
  const [aime, setAime] = useState("");
  const [ameliorer, setAmeliorer] = useState("");
  const [souhaits, setSouhaits] = useState("");
  const [recommande, setRecommande] = useState<number | null>(null);
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [recontact, setRecontact] = useState(false);
  const [piege, setPiege] = useState(false); // champ invisible anti-robots
  const [manque, setManque] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (note === 0) {
      setManque(true);
      document.getElementById("note-globale")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (piege) return;
    setEtat("envoi");

    const etoiles = (n?: number) => (n ? `${"★".repeat(n)}${"☆".repeat(5 - n)} (${n}/5)` : "—");
    const donnees: Record<string, string | boolean> = {
      access_key: CLE_WEB3FORMS,
      subject: `Avis client ${note}/5${prenom ? ` — ${prenom}` : ""}`,
      from_name: "Formulaire avis Sakaba Beauty",
      botcheck: false,
      "Note globale": etoiles(note),
      ...Object.fromEntries(ASPECTS.map((a) => [a.nom, etoiles(aspects[a.id])])),
      "Ce qui lui plaît": aime || "—",
      "Ce qui ne va pas / à améliorer": ameliorer || "—",
      "Produits souhaités": souhaits || "—",
      "Recommanderait Sakaba (0 à 10)": recommande === null ? "—" : String(recommande),
      "Nous a connus par": connu || "—",
      "Achète": achat || "—",
      "Prénom": prenom || "—",
      "Téléphone / WhatsApp": telephone || "—",
      "Email": email || "—",
      "Accepte d'être recontacté(e)": recontact ? "Oui" : "Non",
    };
    if (email) donnees.replyto = email;

    try {
      const rep = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(donnees),
      });
      const json = await rep.json().catch(() => ({}));
      setEtat(rep.ok && json.success ? "merci" : "erreur");
    } catch {
      setEtat("erreur");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!CLE_WEB3FORMS) {
    return (
      <p className="rounded-2xl bg-creme p-6 text-center">
        Le formulaire n&apos;est pas encore activé. Merci de revenir un peu plus tard.
      </p>
    );
  }

  if (etat === "merci") {
    return (
      <div className="rounded-3xl bg-creme p-8 text-center">
        <p className="text-5xl text-or">✦</p>
        <h2 className="titre text-4xl mt-3">Merci pour votre avis !</h2>
        <p className="text-gris mt-3">
          Chaque réponse est lue par l&apos;équipe Sakaba Beauty. Elle nous aide à mieux vous recevoir et à mieux vous conseiller.
        </p>
      </div>
    );
  }

  const bloc = "rounded-2xl border border-bordure bg-white p-5 sm:p-6";
  const titreBloc = "font-semibold text-lg";
  const champ = "w-full rounded-xl border border-bordure bg-white px-4 py-3 outline-none focus:border-or";

  return (
    <form onSubmit={envoyer} className="space-y-5" noValidate>
      {etat === "erreur" && (
        <p className="rounded-2xl border-2 border-red-700 bg-red-50 p-4 text-sm">
          L&apos;envoi n&apos;a pas abouti. Vérifiez votre connexion internet puis appuyez de nouveau sur « Envoyer mon avis ».
        </p>
      )}

      <div id="note-globale" className={`${bloc} ${manque && note === 0 ? "border-red-700" : ""}`}>
        <p className={titreBloc}>
          Globalement, êtes-vous satisfait(e) de Sakaba Beauty ? <span className="text-red-700">*</span>
        </p>
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <Etoiles valeur={note} onChange={(n) => { setNote(n); setManque(false); }} taille="text-5xl" nom="Note globale" />
          <span className="text-gris">{LIBELLES_NOTE[note]}</span>
        </div>
        {manque && note === 0 && <p className="text-sm text-red-700 mt-2">Choisissez une note de 1 à 5 étoiles.</p>}
      </div>

      <div className={bloc}>
        <p className={titreBloc}>Donnez une note à chaque point</p>
        <p className="text-sm text-gris">Facultatif. Laissez vide ce qui ne vous concerne pas.</p>
        <ul className="mt-4 space-y-3">
          {ASPECTS.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 flex-wrap">
              <span>{a.nom}</span>
              <Etoiles valeur={aspects[a.id] ?? 0} onChange={(n) => setAspects((x) => ({ ...x, [a.id]: n }))} taille="text-2xl" nom={a.nom} />
            </li>
          ))}
        </ul>
      </div>

      <div className={bloc}>
        <label htmlFor="aime" className={titreBloc}>Qu&apos;est-ce qui vous plaît le plus chez nous ?</label>
        <textarea id="aime" value={aime} onChange={(e) => setAime(e.target.value)} rows={3} className={`${champ} mt-3`} placeholder="Les produits, l'accueil, les conseils…" />
      </div>

      <div className={bloc}>
        <label htmlFor="ameliorer" className={titreBloc}>Qu&apos;est-ce qui ne va pas, ou que devrions-nous améliorer ?</label>
        <p className="text-sm text-gris">Soyez franc(he) : c&apos;est ce qui nous aide le plus.</p>
        <textarea id="ameliorer" value={ameliorer} onChange={(e) => setAmeliorer(e.target.value)} rows={3} className={`${champ} mt-3`} />
      </div>

      <div className={bloc}>
        <label htmlFor="souhaits" className={titreBloc}>Un produit ou une marque que vous aimeriez trouver chez nous ?</label>
        <input id="souhaits" value={souhaits} onChange={(e) => setSouhaits(e.target.value)} className={`${champ} mt-3`} />
      </div>

      <div className={bloc}>
        <p className={titreBloc}>Recommanderiez-vous Sakaba Beauty à un proche ?</p>
        <p className="text-sm text-gris">0 = pas du tout, 10 = sans hésiter</p>
        <div className="mt-3 grid grid-cols-6 sm:grid-cols-11 gap-1.5">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              aria-pressed={recommande === n}
              onClick={() => setRecommande(recommande === n ? null : n)}
              className={`prix rounded-lg border py-2 text-sm font-semibold ${recommande === n ? "bg-or text-white border-or" : "border-bordure hover:border-or"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={bloc}>
        <p className={titreBloc}>Comment nous avez-vous connus ?</p>
        <div className="mt-3"><Choix options={CONNU} valeur={connu} onChange={setConnu} /></div>
        <p className={`${titreBloc} mt-6`}>Vous achetez plutôt…</p>
        <div className="mt-3"><Choix options={ACHAT} valeur={achat} onChange={setAchat} /></div>
      </div>

      <div className={bloc}>
        <p className={titreBloc}>Vos coordonnées <span className="font-normal text-gris text-sm">(facultatif)</span></p>
        <p className="text-sm text-gris">Vous pouvez répondre de façon anonyme.</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" autoComplete="given-name" className={champ} />
          <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone / WhatsApp" type="tel" autoComplete="tel" className={champ} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" className={`${champ} sm:col-span-2`} />
        </div>
        <label className="mt-4 flex items-start gap-3 text-sm cursor-pointer">
          <input type="checkbox" checked={recontact} onChange={(e) => setRecontact(e.target.checked)} className="mt-0.5 w-5 h-5 accent-[#C59735]" />
          J&apos;accepte que Sakaba Beauty me recontacte au sujet de mon avis.
        </label>
      </div>

      <input type="checkbox" name="botcheck" checked={piege} onChange={(e) => setPiege(e.target.checked)} className="hidden" tabIndex={-1} aria-hidden />

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="w-full rounded-full bg-or py-4 text-lg font-semibold text-white hover:bg-noir disabled:bg-gris/50"
      >
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer mon avis"}
      </button>
      <p className="text-xs text-gris text-center">
        Vos réponses sont transmises uniquement à l&apos;équipe Sakaba Beauty.
      </p>
    </form>
  );
}
