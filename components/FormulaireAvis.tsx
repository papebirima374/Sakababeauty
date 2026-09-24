"use client";

import { useState } from "react";

// Formulaire d'avis clients. Chaque réponse est envoyée par email à la boutique
// via Web3Forms (https://web3forms.com). La clé est liée à l'adresse de Sakaba :
// elle est publique par conception (elle ne permet que d'envoyer vers cette adresse).
const CLE_WEB3FORMS = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

const OBJETS = ["Suggestion", "Réclamation", "Problème rencontré"];

type Etat = "saisie" | "envoi" | "merci" | "erreur";

function Choix({ options, valeur, onChange, nom }: { options: string[]; valeur: string; onChange: (v: string) => void; nom: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={nom}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={valeur === o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-5 py-2.5 transition ${valeur === o ? "bg-noir text-white border-noir" : "border-bordure bg-creme/60 hover:border-or"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function FormulaireAvis() {
  const [etat, setEtat] = useState<Etat>("saisie");
  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const [recontact, setRecontact] = useState("");
  const [contact, setContact] = useState("");
  const [piege, setPiege] = useState(false); // champ invisible anti-robots
  const [verifier, setVerifier] = useState(false);

  const manques = {
    objet: !objet,
    message: !message.trim(),
    recontact: !recontact,
    contact: recontact === "Oui" && !contact.trim(),
  };

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    const premier = (Object.keys(manques) as (keyof typeof manques)[]).find((k) => manques[k]);
    if (premier) {
      setVerifier(true);
      document.getElementById(`q-${premier}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (piege) return;
    setEtat("envoi");

    const coordonnees = recontact === "Oui" ? contact.trim() : "";
    const donnees: Record<string, string | boolean> = {
      access_key: CLE_WEB3FORMS,
      subject: `${objet} — avis client Sakaba Beauty`,
      from_name: "Formulaire avis Sakaba Beauty",
      botcheck: false,
      "Objet": objet,
      "Message": message.trim(),
      "Souhaite être recontacté(e)": recontact,
      "E-mail ou téléphone": coordonnees || "—",
    };
    if (/^\S+@\S+\.\S+$/.test(coordonnees)) donnees.replyto = coordonnees;

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
      <p className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-25px_rgba(20,16,11,0.35)]">
        Le formulaire n&apos;est pas encore activé. Merci de revenir un peu plus tard.
      </p>
    );
  }

  if (etat === "merci") {
    return (
      <div className="rounded-3xl bg-white p-8 sm:p-10 text-center shadow-[0_25px_70px_-30px_rgba(20,16,11,0.45)]">
        <div className="mx-auto w-16 h-16 rounded-full grid place-items-center bg-gradient-to-b from-or-clair to-or text-white text-3xl shadow-[0_10px_30px_-8px_rgba(197,151,53,0.7)]">✓</div>
        <h2 className="titre text-4xl mt-4">Merci pour votre message !</h2>
        <p className="text-gris mt-3">
          Il a bien été transmis à l&apos;équipe Sakaba Beauty.
          {recontact === "Oui" ? " Nous vous recontacterons dès que possible." : ""}
        </p>
        <p className="titre text-2xl text-or mt-6">À très bientôt à Mermoz ✦</p>
      </div>
    );
  }

  const bloc = "rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_50px_-28px_rgba(20,16,11,0.45)]";
  const titreBloc = "font-semibold text-lg";
  const champ = "w-full rounded-2xl border border-bordure bg-creme/60 px-4 py-3.5 outline-none transition focus:bg-white focus:border-or focus:ring-4 focus:ring-or/15";
  const erreur = (k: keyof typeof manques, texte: string) =>
    verifier && manques[k] ? <p className="text-sm text-red-700 mt-2">{texte}</p> : null;
  const numero = (n: number) => (
    <span className="mr-2 inline-grid place-items-center w-7 h-7 rounded-full bg-gradient-to-b from-or-clair to-or text-white text-sm align-middle">{n}</span>
  );

  return (
    <form onSubmit={envoyer} className="space-y-5" noValidate>
      {etat === "erreur" && (
        <p className="rounded-2xl border-2 border-red-700 bg-red-50 p-4 text-sm">
          L&apos;envoi n&apos;a pas abouti. Vérifiez votre connexion internet puis appuyez de nouveau sur « Envoyer ».
        </p>
      )}

      <div id="q-objet" className={bloc}>
        <p className={titreBloc}>{numero(1)}Quel est l&apos;objet de votre message&nbsp;?&nbsp;<span className="text-red-700">*</span></p>
        <div className="mt-4"><Choix options={OBJETS} valeur={objet} onChange={setObjet} nom="Objet du message" /></div>
        {erreur("objet", "Choisissez l'objet de votre message.")}
      </div>

      <div id="q-message" className={bloc}>
        <label htmlFor="message" className={titreBloc}>{numero(2)}Que souhaitez-vous nous dire&nbsp;?&nbsp;<span className="text-red-700">*</span></label>
        <p className="text-sm text-gris mt-1">En quelques mots ou quelques phrases.</p>
        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={`${champ} mt-3`} />
        {erreur("message", "Écrivez votre message.")}
      </div>

      <div id="q-recontact" className={bloc}>
        <p className={titreBloc}>{numero(3)}Souhaitez-vous que Sakaba vous recontacte&nbsp;?&nbsp;<span className="text-red-700">*</span></p>
        <div className="mt-4"><Choix options={["Oui", "Non"]} valeur={recontact} onChange={(v) => { setRecontact(v); if (v === "Oui") setVerifier(false); }} nom="Être recontacté(e)" /></div>
        {erreur("recontact", "Répondez Oui ou Non.")}
        {recontact === "Oui" && (
          <div id="q-contact" className="mt-5">
            <label htmlFor="contact" className="font-semibold">Quelle est votre adresse e-mail ou votre numéro de téléphone ?</label>
            <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className={`${champ} mt-3`} placeholder="exemple@gmail.com ou 77 000 00 00" />
            {erreur("contact", "Indiquez un e-mail ou un numéro pour qu'on puisse vous recontacter.")}
          </div>
        )}
      </div>

      <input type="checkbox" name="botcheck" checked={piege} onChange={(e) => setPiege(e.target.checked)} className="hidden" tabIndex={-1} aria-hidden />

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="w-full rounded-full bg-gradient-to-r from-or to-[#B0852A] py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(197,151,53,0.8)] transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
      >
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer"}
      </button>
      <p className="text-xs text-gris text-center">
        Vos réponses sont transmises uniquement à l&apos;équipe Sakaba Beauty.
      </p>
    </form>
  );
}
