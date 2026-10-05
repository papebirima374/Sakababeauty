"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

// Carte d'invitation de la masterclass, avec son QR code, et sa version image
// (PNG) à télécharger. Le QR code mène à la page de l'invitation : scanné à
// l'entrée, il affiche si elle est valide.
export type InfosCarte = {
  code: string;
  nomComplet: string;
  titre: string;
  animee: string;
  date: string;
  heure: string;
  lieu: string;
  lien: string;
};

const OR = "#C59735";
const OR_CLAIR = "#E3C77E";
const NOIR = "#14100B";
const CREME = "#FCF9F3";

function charger(src: string) {
  return new Promise<HTMLImageElement>((ok, ko) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = ko;
    i.src = src;
  });
}

// Découpe un texte en lignes qui tiennent dans la largeur donnée.
function lignes(ctx: CanvasRenderingContext2D, texte: string, largeur: number) {
  const mots = texte.split(/\s+/);
  const res: string[] = [];
  let l = "";
  for (const m of mots) {
    const essai = l ? `${l} ${m}` : m;
    if (ctx.measureText(essai).width > largeur && l) {
      res.push(l);
      l = m;
    } else l = essai;
  }
  if (l) res.push(l);
  return res;
}

async function dessiner(infos: InfosCarte, polices: { titre: string; texte: string }) {
  const L = 1080;
  const H = 1600;
  const c = document.createElement("canvas");
  c.width = L;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = NOIR;
  ctx.fillRect(0, 0, L, H);
  const halo = ctx.createRadialGradient(L / 2, 0, 0, L / 2, 0, 900);
  halo.addColorStop(0, "rgba(197,151,53,0.42)");
  halo.addColorStop(1, "rgba(197,151,53,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, L, H);
  ctx.strokeStyle = "rgba(197,151,53,0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, L - 72, H - 72);
  ctx.textAlign = "center";

  // Logo
  const logo = await charger("/logo-sakaba.png");
  ctx.save();
  ctx.beginPath();
  ctx.arc(L / 2, 190, 100, 0, Math.PI * 2);
  ctx.fillStyle = OR;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(L / 2, 190, 92, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.clip();
  ctx.drawImage(logo, L / 2 - 92, 98, 184, 184);
  ctx.restore();

  let y = 370;
  ctx.fillStyle = OR_CLAIR;
  ctx.font = `600 40px ${polices.texte}`;
  ctx.letterSpacing = "16px";
  ctx.fillText("MASTERCLASS", L / 2 + 8, y);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = CREME;
  ctx.font = `500 76px ${polices.titre}`;
  for (const l of lignes(ctx, infos.titre, L - 200)) {
    y += 86;
    ctx.fillText(l, L / 2, y);
  }
  y += 58;
  ctx.fillStyle = OR_CLAIR;
  ctx.font = `600 34px ${polices.texte}`;
  ctx.fillText(infos.animee, L / 2, y);

  // Nom
  y += 90;
  ctx.fillStyle = "rgba(252,249,243,0.6)";
  ctx.font = `400 30px ${polices.texte}`;
  ctx.fillText("Invitation au nom de", L / 2, y);
  y += 66;
  ctx.fillStyle = CREME;
  ctx.font = `600 56px ${polices.texte}`;
  ctx.fillText(infos.nomComplet, L / 2, y);

  // Date, heure, lieu
  y += 70;
  ctx.font = `400 34px ${polices.texte}`;
  ctx.fillStyle = CREME;
  const quand = [infos.date, infos.heure].filter(Boolean).join(" · ");
  ctx.fillText(quand.charAt(0).toUpperCase() + quand.slice(1), L / 2, y);
  ctx.fillStyle = "rgba(252,249,243,0.75)";
  ctx.font = `400 30px ${polices.texte}`;
  for (const l of lignes(ctx, infos.lieu, L - 240)) {
    y += 44;
    ctx.fillText(l, L / 2, y);
  }

  // QR code
  const taille = 420;
  const qy = Math.max(y + 50, H - taille - 230);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(L / 2 - taille / 2 - 30, qy, taille + 60, taille + 60, 28);
  ctx.fill();
  const qr = await charger(await QRCode.toDataURL(infos.lien, { margin: 0, width: taille, errorCorrectionLevel: "M", color: { dark: NOIR, light: "#ffffff" } }));
  ctx.drawImage(qr, L / 2 - taille / 2, qy + 30, taille, taille);

  ctx.fillStyle = OR_CLAIR;
  ctx.font = `600 32px ${polices.texte}`;
  ctx.letterSpacing = "6px";
  ctx.fillText(infos.code, L / 2 + 3, qy + taille + 120);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "rgba(252,249,243,0.55)";
  ctx.font = `400 26px ${polices.texte}`;
  ctx.fillText("À présenter à l'entrée · Sakaba Beauty", L / 2, qy + taille + 165);
  return c;
}

export default function CarteInvitation({ infos }: { infos: InfosCarte }) {
  const [qr, setQr] = useState("");
  const [enCours, setEnCours] = useState(false);
  const titreRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    QRCode.toDataURL(infos.lien, { margin: 0, width: 360, errorCorrectionLevel: "M", color: { dark: NOIR, light: "#ffffff" } }).then(setQr);
  }, [infos.lien]);

  async function telecharger() {
    setEnCours(true);
    try {
      await document.fonts.ready;
      const polices = {
        titre: titreRef.current ? getComputedStyle(titreRef.current).fontFamily : "serif",
        texte: getComputedStyle(document.body).fontFamily,
      };
      const c = await dessiner(infos, polices);
      const a = document.createElement("a");
      a.download = `invitation-masterclass-${infos.nomComplet.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.href = c.toDataURL("image/png");
      a.click();
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div>
      <div className="relative text-left rounded-3xl bg-noir text-creme overflow-hidden shadow-[0_25px_60px_-25px_rgba(20,16,11,0.6)]">
        <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(70% 60% at 100% 0%, rgba(var(--or-rgb),0.35), transparent 70%)" }} aria-hidden />
        <div className="relative p-6 sm:p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-or-clair">Masterclass</p>
          <p ref={titreRef} className="titre text-3xl sm:text-4xl mt-2 text-balance">{infos.titre}</p>
          <p className="mt-2 text-sm font-semibold text-or-clair">{infos.animee}</p>
          <p className="mt-5 text-sm text-creme/60">Invitation au nom de</p>
          <p className="text-2xl font-semibold">{infos.nomComplet}</p>
        </div>
        <div className="relative flex items-center" aria-hidden>
          <span className="w-6 h-6 -ml-3 rounded-full bg-creme" />
          <span className="flex-1 border-t-2 border-dashed border-creme/25" />
          <span className="w-6 h-6 -mr-3 rounded-full bg-creme" />
        </div>
        <div className="relative p-6 sm:p-8 grid gap-6 sm:grid-cols-[1fr_auto] items-center">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-creme/60">Date</dt><dd className="font-semibold first-letter:uppercase">{infos.date}</dd></div>
            <div><dt className="text-creme/60">Heure</dt><dd className="font-semibold">{infos.heure}</dd></div>
            <div><dt className="text-creme/60">Lieu</dt><dd className="font-semibold">{infos.lieu}</dd></div>
          </dl>
          <div className="mx-auto text-center">
            <div className="rounded-2xl bg-white p-3 w-44 h-44 grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- image générée dans le navigateur */}
              {qr ? <img src={qr} alt={`QR code de l'invitation ${infos.code}`} className="w-full h-full" /> : null}
            </div>
            <p className="prix mt-2 text-sm tracking-[0.3em] text-or-clair">{infos.code}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={telecharger}
        disabled={enCours}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-or to-(--or-fonce) py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(var(--or-rgb),0.8)] hover:brightness-110 disabled:opacity-60"
      >
        {enCours ? "Préparation…" : "Télécharger mon invitation (PNG)"}
      </button>
      <p className="text-xs text-gris text-center mt-2">Présentez cette invitation (sur votre téléphone ou imprimée) à l&apos;entrée.</p>
    </div>
  );
}
