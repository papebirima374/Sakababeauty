# Masterclass — mise en place (15 minutes, une seule fois)

Page d'inscription : **https://sakababeauty-nu.vercel.app/masterclass**
La liste des inscrits vit dans un **Google Sheet**. Pendant les tests : le Google
de Birima (papebirima10894@gmail.com). Pour le vrai événement : refaire ces
étapes avec le compte **Sakababeauty1@gmail.com**.

## 1. Créer le Google Sheet
1. Ouvrir **sheets.new** (connecté au bon compte Google).
2. Le nommer en haut à gauche : `Masterclass Sakaba — inscriptions`.

## 2. Coller le programme
1. Menu **Extensions** > **Apps Script**. Un nouvel onglet s'ouvre.
2. Tout effacer dans la fenêtre de code.
3. Copier **tout** le contenu du fichier `scripts/masterclass-google-sheet.gs`
   (sur GitHub : ouvrir le fichier > bouton « Copy raw file ») et le coller.
4. Cliquer sur l'icône **Enregistrer** (disquette).

## 3. Créer les onglets
1. En haut, dans la liste des fonctions, choisir **installer**, puis **Exécuter**.
2. Google demande l'autorisation : **Examiner les autorisations** > choisir le
   compte > « Google n'a pas validé cette application » : **Paramètres avancés** >
   **Accéder à … (non sécurisé)** > **Autoriser**.
   (C'est normal : c'est votre propre programme, pas une application publique.)
3. Revenir au Google Sheet : les onglets **Inscrits** et **Réglages** existent.

## 4. Choisir le mot secret
1. Dans Apps Script : roue dentée **Paramètres du projet** (à gauche) > tout en bas
   **Propriétés du script** > **Ajouter une propriété**.
2. Propriété : `SECRET` — Valeur : une longue phrase inventée, sans espace,
   par exemple 25 lettres et chiffres mélangés. **Ne l'envoyez à personne.**
3. **Enregistrer les propriétés du script**.

## 5. Publier le programme
1. En haut à droite : **Déployer** > **Nouveau déploiement**.
2. Roue dentée à côté de « Sélectionner le type » > **Application Web**.
3. Exécuter en tant que : **Moi**. Qui a accès : **Tout le monde**.
4. **Déployer**, puis copier l'**URL de l'application Web** (elle finit par `/exec`).

## 6. Brancher le site (Vercel)
Projet Sakababeauty > **Settings** > **Environment Variables** — ajouter :
- `MASTERCLASS_SCRIPT_URL` = l'URL copiée à l'étape 5
- `MASTERCLASS_SECRET` = exactement la même phrase qu'à l'étape 4

Puis **Deployments** > « … » du dernier > **Redeploy**.

## 7. Remplir l'onglet « Réglages »
| Ligne | À écrire |
|---|---|
| Titre | le nom de la masterclass |
| Sous-titre | facultatif |
| Date | la date (ex. 15/11/2026) |
| Heure | l'heure (ex. 15:00) |
| Lieu | l'adresse |
| Description | le programme, quelques phrases |
| Nombre de places | ex. 30 |
| Inscriptions ouvertes | `OUI` ou `NON` |
| Email de notification | qui reçoit un email à chaque inscription |

Tout changement ici apparaît sur la page du site au prochain chargement.

## Au quotidien
- **Annuler une inscription** : dans l'onglet Inscrits, écrire `Annulé` dans la
  colonne **Statut** : la place est libérée. Ne pas supprimer de ligne.
- **Fermer les inscriptions** : mettre `NON` dans « Inscriptions ouvertes ».
- **Le jour J** : imprimer l'onglet Inscrits, ou cocher les présents dans une
  nouvelle colonne à droite.

## Si vous modifiez le programme plus tard
Déployer > **Gérer les déploiements** > crayon > Version : **Nouvelle version** >
Déployer. L'URL ne change pas.
