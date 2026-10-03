/**
 * Inscriptions à la masterclass Sakaba Beauty — programme du Google Sheet.
 *
 * À coller dans le Google Sheet : Extensions > Apps Script (voir
 * docs/MASTERCLASS.md pour la mise en place pas à pas).
 *
 * - Onglet « Réglages » : titre, date, lieu, nombre de places… modifiables à la main.
 * - Onglet « Inscrits » : une ligne par inscription (colonne Statut : écrire
 *   « Annulé » libère la place).
 * - Chaque inscription envoie un email à l'adresse « Email de notification ».
 * - Menu « Masterclass > Préparer les messages WhatsApp » : crée l'onglet
 *   « Messages » avec, pour chaque inscrite, des liens qui ouvrent WhatsApp avec
 *   le message déjà écrit (textes modifiables dans l'onglet « Modèles »).
 * - Le site parle à ce programme avec un mot secret (propriété SECRET), pour que
 *   personne d'autre ne puisse ajouter de lignes.
 */

const INSCRITS = "Inscrits";
const REGLAGES = "Réglages";
const COLONNES = [
  "Date d'inscription", "Prénom", "Nom", "Téléphone", "Email",
  "Client(e) Sakaba", "Attentes", "Statut",
];
const REGLAGES_PAR_DEFAUT = [
  ["Titre", "Masterclass Sakaba Beauty"],
  ["Sous-titre", ""],
  ["Date", ""],
  ["Heure", ""],
  ["Lieu", ""],
  ["Description", ""],
  ["Nombre de places", 30],
  ["Inscriptions ouvertes", "OUI"],
  ["Email de notification", ""],
];

/** À lancer UNE fois : crée les deux onglets. */
function installer() {
  const classeur = SpreadsheetApp.getActive();
  let inscrits = classeur.getSheetByName(INSCRITS);
  if (!inscrits) inscrits = classeur.insertSheet(INSCRITS);
  if (inscrits.getLastRow() === 0) {
    inscrits.appendRow(COLONNES);
    inscrits.getRange(1, 1, 1, COLONNES.length).setFontWeight("bold").setBackground("#FCF9F3");
    inscrits.setFrozenRows(1);
    inscrits.getRange("D:D").setNumberFormat("@"); // téléphone en texte (garde les zéros)
  }
  let reglages = classeur.getSheetByName(REGLAGES);
  if (!reglages) reglages = classeur.insertSheet(REGLAGES);
  if (reglages.getLastRow() === 0) {
    reglages.getRange(1, 1, REGLAGES_PAR_DEFAUT.length, 2).setValues(REGLAGES_PAR_DEFAUT);
    reglages.getRange(1, 1, REGLAGES_PAR_DEFAUT.length, 1).setFontWeight("bold");
    reglages.getRange("B9").setValue(Session.getEffectiveUser().getEmail());
    reglages.setColumnWidth(1, 200);
    reglages.setColumnWidth(2, 420);
  }
  const defaut = classeur.getSheetByName("Feuille 1") || classeur.getSheetByName("Sheet1");
  if (defaut && defaut.getLastRow() === 0 && classeur.getSheets().length > 2) classeur.deleteSheet(defaut);
}

function lireReglages_() {
  const plage = SpreadsheetApp.getActive().getSheetByName(REGLAGES).getDataRange();
  const valeurs = plage.getValues();
  const affichees = plage.getDisplayValues();
  const r = {};
  valeurs.forEach(function (l, i) {
    if (!l[0]) return;
    const cle = String(l[0]).trim();
    r[cle] = l[1];
    r[cle + "__affiche"] = affichees[i][1]; // tel que visible dans la case
  });
  return r;
}

const JOURS_ = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS_ = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
  "septembre", "octobre", "novembre", "décembre"];

/** Date en français, quelle que soit la langue du compte Google : « samedi 15 novembre 2026 ». */
function formaterDate_(v) {
  if (v instanceof Date) {
    const fuseau = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
    const n = function (motif) { return Number(Utilities.formatDate(v, fuseau, motif)); };
    return JOURS_[n("u") % 7] + " " + n("d") + " " + MOIS_[n("M") - 1] + " " + n("yyyy");
  }
  return String(v || "").trim();
}

/**
 * Heure telle qu'elle est écrite dans la case (« 10:00 » → « 10h00 »).
 * On lit le texte affiché : une heure seule est stockée au 30/12/1899, date à
 * laquelle les fuseaux horaires donnent des décalages faux (ex. 08h50).
 */
function formaterHeure_(affiche) {
  const t = String(affiche || "").trim();
  const m = t.match(/^(\d{1,2})[:h](\d{2})/);
  return m ? ("0" + m[1]).slice(-2) + "h" + m[2] : t;
}

/** Les 9 derniers chiffres : 77 123 45 67, +221771234567 et 00221 77… sont le même numéro. */
function telephoneCle_(t) {
  const chiffres = String(t || "").replace(/\D/g, "");
  return chiffres.slice(-9);
}

function lignesActives_(feuille) {
  if (feuille.getLastRow() < 2) return [];
  return feuille.getRange(2, 1, feuille.getLastRow() - 1, COLONNES.length).getValues()
    .filter(function (l) { return String(l[7]).trim().toLowerCase() !== "annulé" && String(l[7]).trim().toLowerCase() !== "annule"; });
}

function etat_() {
  const r = lireReglages_();
  const feuille = SpreadsheetApp.getActive().getSheetByName(INSCRITS);
  const inscrits = lignesActives_(feuille).length;
  const places = Number(r["Nombre de places"]) || 0;
  return {
    titre: String(r["Titre"] || ""),
    sousTitre: String(r["Sous-titre"] || ""),
    date: formaterDate_(r["Date"]),
    heure: formaterHeure_(r["Heure__affiche"]),
    lieu: String(r["Lieu"] || ""),
    description: String(r["Description"] || ""),
    places: places,
    inscrits: inscrits,
    restantes: Math.max(0, places - inscrits),
    ouvert: String(r["Inscriptions ouvertes"] || "").trim().toUpperCase() === "OUI",
  };
}

function reponse_(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}

function secretOk_(valeur) {
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  return Boolean(secret) && valeur === secret;
}

/** Lecture : informations de l'événement et places restantes. */
function doGet(e) {
  if (!secretOk_(e && e.parameter && e.parameter.secret)) return reponse_({ ok: false, erreur: "acces" });
  return reponse_({ ok: true, evenement: etat_() });
}

/** Inscription. */
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return reponse_({ ok: false, erreur: "format" }); }
  if (!secretOk_(d.secret)) return reponse_({ ok: false, erreur: "acces" });

  const prenom = String(d.prenom || "").trim().slice(0, 80);
  const nom = String(d.nom || "").trim().slice(0, 80);
  const telephone = String(d.telephone || "").trim().slice(0, 30);
  const email = String(d.email || "").trim().slice(0, 120);
  if (!prenom || !nom || telephoneCle_(telephone).length < 9) return reponse_({ ok: false, erreur: "champs" });

  const verrou = LockService.getScriptLock();
  if (!verrou.tryLock(20000)) return reponse_({ ok: false, erreur: "occupe" });
  try {
    const ev = etat_();
    if (!ev.ouvert) return reponse_({ ok: false, erreur: "ferme", evenement: ev });
    if (ev.restantes <= 0) return reponse_({ ok: false, erreur: "complet", evenement: ev });

    const feuille = SpreadsheetApp.getActive().getSheetByName(INSCRITS);
    const cle = telephoneCle_(telephone);
    const deja = lignesActives_(feuille).some(function (l) { return telephoneCle_(l[3]) === cle; });
    if (deja) return reponse_({ ok: false, erreur: "deja", evenement: ev });

    feuille.appendRow([
      new Date(), prenom, nom, telephone, email,
      String(d.cliente || ""), String(d.attentes || "").trim().slice(0, 1000), "Inscrit",
    ]);
    SpreadsheetApp.flush();
    const apres = etat_();

    const destinataire = String(lireReglages_()["Email de notification"] || "").trim();
    if (destinataire) {
      try {
        MailApp.sendEmail({
          to: destinataire,
          subject: "Nouvelle inscription masterclass — " + prenom + " " + nom + " (" + apres.inscrits + "/" + apres.places + ")",
          body: [
            "Nouvelle inscription à : " + apres.titre,
            "",
            "Prénom : " + prenom,
            "Nom : " + nom,
            "Téléphone : " + telephone,
            "Email : " + (email || "—"),
            "Client(e) Sakaba : " + (d.cliente || "—"),
            "Attentes : " + (d.attentes || "—"),
            "",
            "Inscrits : " + apres.inscrits + " / " + apres.places + " — places restantes : " + apres.restantes,
            "Liste complète : " + SpreadsheetApp.getActive().getUrl(),
          ].join("\n"),
        });
      } catch (err) { /* l'inscription reste valable même si l'email échoue */ }
    }
    return reponse_({ ok: true, evenement: apres });
  } finally {
    verrou.releaseLock();
  }
}


// ——— Messages WhatsApp préparés ———————————————————————————————————————
// Rien n'est envoyé tout seul : chaque lien ouvre WhatsApp avec le message déjà
// écrit, il reste à appuyer sur « Envoyer ». Mots remplacés dans les modèles :
// {prenom} {titre} {date} {heure} {lieu}.
const MESSAGES = "Messages";
const MODELES = "Modèles";
const MODELES_PAR_DEFAUT = [
  ["Message", "Texte (modifiable)"],
  ["Confirmation", "Bonjour {prenom} ! Votre paiement est bien reçu 🎉 Votre place est confirmée pour la masterclass {titre}, le {date} à {heure}, chez {lieu}. À très bientôt ! L'équipe Sakaba Beauty"],
  ["Relance paiement", "Bonjour {prenom}, merci pour votre réservation à la masterclass {titre}. Pour confirmer votre place, il reste le paiement Wave : https://pay.wave.com/m/M_pOEPO7UxwCJr/c/sn/?amount=20200 — les places sont limitées ! L'équipe Sakaba Beauty"],
  ["Rappel la veille", "Bonjour {prenom} ! Petit rappel : la masterclass {titre}, c'est demain, {date} à {heure}, chez {lieu}. Nous avons hâte de vous accueillir ✨ L'équipe Sakaba Beauty"],
  ["Merci après", "Merci {prenom} d'être venue à la masterclass {titre} ! Donnez-nous votre avis en 1 minute : https://sakababeauty-nu.vercel.app/avis — L'équipe Sakaba Beauty"],
];

/** Ajoute le menu « Masterclass » à l'ouverture du tableur. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Masterclass")
    .addItem("Préparer les messages WhatsApp", "preparerMessages")
    .addToUi();
}

function modeles_() {
  const classeur = SpreadsheetApp.getActive();
  let f = classeur.getSheetByName(MODELES);
  if (!f) {
    f = classeur.insertSheet(MODELES);
    f.getRange(1, 1, MODELES_PAR_DEFAUT.length, 2).setValues(MODELES_PAR_DEFAUT);
    f.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#FCF9F3");
    f.setColumnWidth(1, 170);
    f.setColumnWidth(2, 700);
    f.getRange(2, 2, MODELES_PAR_DEFAUT.length - 1, 1).setWrap(true);
  }
  return f.getRange(2, 1, Math.max(f.getLastRow() - 1, 1), 2).getValues()
    .filter(function (l) { return String(l[0]).trim() && String(l[1]).trim(); });
}

/** Crée ou met à jour l'onglet « Messages » : une ligne par inscrite non annulée. */
function preparerMessages() {
  const classeur = SpreadsheetApp.getActive();
  const ev = etat_();
  const modeles = modeles_();
  const lignes = lignesActives_(classeur.getSheetByName(INSCRITS));

  let f = classeur.getSheetByName(MESSAGES);
  if (!f) f = classeur.insertSheet(MESSAGES);
  f.clear();
  const entete = ["Prénom", "Nom", "Téléphone", "Statut"].concat(modeles.map(function (m) { return m[0]; }));
  f.getRange(1, 1, 1, entete.length).setValues([entete]).setFontWeight("bold").setBackground("#FCF9F3");
  f.setFrozenRows(1);

  lignes.forEach(function (l, i) {
    const prenom = String(l[1]).trim();
    const numero = "221" + telephoneCle_(l[3]);
    f.getRange(i + 2, 1, 1, 4).setValues([[prenom, l[2], String(l[3]), l[7]]]);
    modeles.forEach(function (m, j) {
      const texte = String(m[1])
        .replace(/\{prenom\}/g, prenom)
        .replace(/\{titre\}/g, ev.titre)
        .replace(/\{date\}/g, ev.date)
        .replace(/\{heure\}/g, ev.heure)
        .replace(/\{lieu\}/g, ev.lieu);
      const lien = "https://wa.me/" + numero + "?text=" + encodeURIComponent(texte);
      f.getRange(i + 2, 5 + j).setRichTextValue(
        SpreadsheetApp.newRichTextValue().setText("Envoyer").setLinkUrl(lien).build()
      );
    });
  });
  f.autoResizeColumns(1, entete.length);
  classeur.setActiveSheet(f);
  SpreadsheetApp.getUi().alert(
    lignes.length + " inscrite(s). Cliquez sur « Envoyer » dans la colonne du message voulu : " +
    "WhatsApp s'ouvre avec le texte prêt, il reste à appuyer sur Envoyer."
  );
}
