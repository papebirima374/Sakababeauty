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

### Boutique en ligne : EN PAUSE
La directrice a confié le site à un autre prestataire. Le code de la boutique
reste dans `app/(boutique)/`, mais on n'y travaille plus sans nouvelle demande.

### Formulaire d'avis clients : `/avis`
- Page autonome (sans menu ni prix), lien à envoyer aux clientes :
  https://sakababeauty-nu.vercel.app/avis
- Chaque réponse part par email à **Sakababeauty1@gmail.com** via Web3Forms
  (gratuit, 250 réponses/mois). Clé dans la variable Vercel
  `NEXT_PUBLIC_WEB3FORMS_KEY` (publique par conception, liée à cette adresse).
  Sans clé, la page affiche « pas encore activé ».
- Prochaine demande annoncée : **inscriptions à une masterclass** (événement).

### Ancien état de la boutique (avant la pause)
- Étape 1 (vitrine) en place : accueil, univers/catégories, marques, fiche produit
  avec preuve d'authenticité, recherche tolérante aux fautes, filtres, diagnostic
  beauté, panier sans compte (commande envoyée par WhatsApp pour l'instant).
- **Provisoire** : 17 produits d'exemple (`lib/catalogue.ts`), zones et tarifs de
  livraison (`lib/config.ts`), règles du diagnostic (`lib/diagnostic.ts`), texte de
  la page Authenticité.
- **À obtenir de Sakaba** : numéro WhatsApp, zones et tarifs de livraison, accès
  WordPress/WooCommerce (export des 2 700 produits), règles du diagnostic.
- **Étapes suivantes** : Firebase (catalogue, commandes, stocks), paiement Wave /
  Orange Money via agrégateur, plateforme de gestion.
