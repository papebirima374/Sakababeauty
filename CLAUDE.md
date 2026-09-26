@AGENTS.md

# Projet Sakaba Beauty — règles de travail (à lire avant toute chose)

Prestataire : **Birima Gueye** (Kër Salaatu Tech). Il n'est pas développeur :
**toutes les explications en français**, simples, pas à pas, sans jargon.
Chaque commande à lancer : une par bloc, avec le dossier où la lancer.

Client : **Sakaba Beauty**, cosmétiques authentiques importés des USA, boutique à
Mermoz (Dakar). Référence : cahier des charges CDC-SKB-2026-01 (septembre 2026).

## Comptes
- Email de travail pour ce projet : **papebirima10894@gmail.com** (Vercel, auteur des commits).
- GitHub : dépôt `papebirima374/Sakababeauty`, branche `main`.
- Vercel : **un seul projet**. Lien de test : **https://sakababeauty-nu.vercel.app/**
  Chaque envoi sur `main` met ce lien à jour automatiquement.

## Ne pas confondre avec le Dahira
Ce dépôt n'a **rien à voir** avec `ksn-site` (site du Dahira). Ne jamais mélanger
le code, les bases Firebase ni les comptes des deux projets.

## Règles
- Le site reste **invisible pour Google** tant que `NEXT_PUBLIC_SITE_ENV` ne vaut pas
  `production`. Ne mettre cette valeur que le jour de la vraie mise en ligne, avec
  l'accord de Birima (c'est l'erreur relevée sur `sakaba.mghosteur.com`).
- Jamais de secret dans Git ni dans la conversation.
- Aucune promesse thérapeutique (fiches, diagnostic) : usages cosmétiques seulement.
- Ne jamais inventer d'informations sur Sakaba (tarifs, numéro, chaîne d'import) :
  ce qui n'est pas confirmé est marqué « À CONFIRMER » dans le code.
- Vérifications avant de dire « c'est fait » : `npx tsc --noEmit`, `npx eslint .`,
  `npm run build`.

## Où on en est (23/09/2026)

### Boutique en ligne : DÉMO POUR CONVAINCRE LA DIRECTRICE
La directrice a confié le site à un autre prestataire. Birima continue la
boutique de son côté (décision du 23/09/2026) pour la lui proposer : priorité à
une démo qui impressionne (style noir et or, comme /avis et /masterclass).
Code dans `app/(boutique)/`. Photos produits recadrées au carré sur fond blanc.

- Page **/contact** : adresse, 2 numéros (tel:), itinéraire Google Maps vers le
  repère (Case des Tout-Petits). WhatsApp de la boutique : **78 588 54 54** (confirmé le
  25/09/2026, dans `lib/config.ts`). Horaires : À CONFIRMER.
- Démo **/gestion** (espace de gestion, non indexé, sans lien depuis la boutique) :
  chiffres, commandes et avis INVENTÉS (`lib/demo-gestion.ts`), stocks du catalogue
  d'exemple. Sert à montrer à la directrice ce que l'outil fera.
- Démo **/gestion/caisse** : vraie caisse de comptoir (douchette = clavier, codes
  EAN-13 internes « 2… » de démo, pavé numérique Qté/Remise/Reçu, rendu de monnaie,
  ticket 80 mm imprimable, ticket WhatsApp, clôture par moyen de paiement). Rien
  n'est enregistré.
- **Décision du 26/09/2026 : on construit NOTRE solution complète** (caisse, stock,
  site, gestion), sans dépendre d'Odoo (logiciel actuel de Sakaba). Sakaba est la
  première cliente ; le produit sera proposé à d'autres boutiques. Le nom du
  produit sera choisi à la fin. Page de présentation : **/gestion/solution**.
  Les données d'Odoo (articles, codes-barres, stocks, clientes) seront récupérées
  par export Excel/CSV.
- Contrat avec Sakaba : prévoir que la plateforme reste la propriété de Birima
  (Sakaba paie l'usage), sinon il ne pourra pas la revendre.

### Base de données (Firebase) — commencée le 26/09/2026
- Testée **en local uniquement** (émulateurs, projet `demo-sakaba`). Aucun vrai projet
  Firebase n'existe encore : à créer avec papebirima10894@gmail.com, JAMAIS le
  projet `ksn-site` du Dahira.
- Collections : `equipe/{uid}` (role directrice | vendeuse, actif), `produits/{slug}`
  (prix, stock, codeBarre), `ventes` (canal, jour, lignes, total, paiement, vendeuse),
  `mouvements` (chaque sortie de stock). Règles : `firestore.rules` (toujours publier
  le fichier ENTIER). Test : `npm run test:regles` (17 vérifications ✓).
- Caisse : si Firebase est configuré → connexion obligatoire (`/gestion/connexion`)
  et vraies ventes ; sinon démonstration. Une vente = un lot groupé (vente + stock
  `increment` + mouvement) qui marche SANS internet et part au retour du réseau.
- Lancer en local (dossier sakababeauty), dans 3 terminaux :
  `npm run emulateurs`, puis `npm run seed`, puis
  `NEXT_PUBLIC_FIREBASE_EMULATEUR=1 npm run dev`. Comptes de test :
  directrice@test.sakaba / vendeuse@test.sakaba, mot de passe `sakaba-test`.
- Variables pour le vrai projet (Vercel) : `NEXT_PUBLIC_FIREBASE_API_KEY`,
  `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`,
  `NEXT_PUBLIC_FIREBASE_APP_ID`.

### Formulaire d'avis clients : `/avis`
- Page autonome (sans menu ni prix), lien à envoyer aux clientes :
  https://sakababeauty-nu.vercel.app/avis
- Chaque réponse part par email via Web3Forms (gratuit, 250 réponses/mois).
  Clé dans la variable Vercel `NEXT_PUBLIC_WEB3FORMS_KEY` (publique par
  conception, liée à UNE adresse). Sans clé, la page affiche « pas encore activé ».
- **Pendant les tests (depuis le 23/09/2026)** : clé liée à l'email de Birima
  (papebirima10894@gmail.com), posée dans Vercel.
- **Avant l'envoi aux clientes** : créer une clé pour **Sakababeauty1@gmail.com**
  (Birima attend l'accès à cette boîte), la mettre à la place dans Vercel,
  puis Redeploy. Aucun changement de code nécessaire.

- Pied de page de /avis : adresse « Mermoz Ancienne Piste, à côté de la Case des
  Tout-Petits » et numéros 78 588 54 54 / 78 303 24 24 (donnés par Birima le 24/09/2026).

### Inscriptions masterclass : `/masterclass`
- Gratuite, places limitées, confirmation à l'écran (choix de Birima, 23/09/2026).
- Liste des inscrits dans un **Google Sheet** + programme Apps Script
  (`scripts/masterclass-google-sheet.gs`). Onglet « Réglages » : titre, date,
  lieu, places, ouvert OUI/NON — modifiable par la directrice sans code.
- Le site passe par `/api/masterclass` (côté serveur) : variables Vercel
  `MASTERCLASS_SCRIPT_URL` et `MASTERCLASS_SECRET` (secret : jamais dans Git).
- Doublons refusés (9 derniers chiffres du téléphone), verrou contre les
  inscriptions simultanées, « Annulé » dans la colonne Statut libère la place.
- Mise en place pas à pas : `docs/MASTERCLASS.md`. Tests : Google de Birima ;
  vrai événement : refaire avec Sakababeauty1@gmail.com.

### Ancien état de la boutique (avant la pause)
- Étape 1 (vitrine) en place : accueil, univers/catégories, marques, fiche produit
  avec preuve d'authenticité, recherche tolérante aux fautes, filtres, diagnostic
  beauté, panier sans compte (commande envoyée par WhatsApp pour l'instant).
- **Provisoire** : 17 produits d'exemple (`lib/catalogue.ts`), règles du diagnostic (`lib/diagnostic.ts`), texte de
  la page Authenticité.
- **Livraison (décision du 25/09/2026)** : aucun tarif sur le site, la cliente
  convient du prix directement avec le livreur (`MODES_RECEPTION`, `lib/config.ts`).
- **À obtenir de Sakaba** : accès
  WordPress/WooCommerce (export des 2 700 produits), règles du diagnostic.
- **Étapes suivantes** : Firebase (catalogue, commandes, stocks), paiement Wave /
  Orange Money via agrégateur, plateforme de gestion.
