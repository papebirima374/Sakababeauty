# Sakaba Beauty — boutique en ligne

Refonte de sakababeauty.com (cahier des charges CDC-SKB-2026-01).
Next.js + TypeScript + Tailwind. Firebase viendra pour les données (catalogue, commandes, stocks).

## Ce qui est en place (étape 1 — vitrine)
- Accueil, univers et catégories (`/soin-visage/serums`), marques, fiche produit.
- Prix affiché partout, stock réel, preuve d'authenticité sur chaque fiche.
- Recherche instantanée tolérante aux fautes, recherche par besoin, filtres et tri.
- Diagnostic beauté (peau / cheveux) → routine en 3 budgets, ajout en un geste.
- Panier sans compte, livraison offerte avec montant restant, zones, paiement.
- Barre mobile : Rechercher · Diagnostic · Panier · WhatsApp.
- Site **fermé à Google** tant que `NEXT_PUBLIC_SITE_ENV` ne vaut pas `production`.

## Provisoire (à remplacer)
- Produits, prix et stocks : **exemples** (`lib/catalogue.ts`) en attendant l'export WooCommerce.
- Zones et tarifs de livraison, seuil de livraison offerte : **à confirmer** (`lib/config.ts`).
- Règles du diagnostic : **à remplacer** par le savoir-faire de l'équipe (`lib/diagnostic.ts`).
- Commande envoyée par WhatsApp en attendant l'agrégateur de paiement.
- Texte de la page Authenticité : à relire avec Sakaba.

## Variables (Vercel)
- `NEXT_PUBLIC_WHATSAPP_BOUTIQUE` : numéro WhatsApp, ex. `221770000000`.
- `NEXT_PUBLIC_SITE_ENV` : `production` uniquement sur le vrai site.
- `NEXT_PUBLIC_SITE_URL` : `https://sakababeauty.com`.

Lien de test : https://sakababeauty-nu.vercel.app/

## Vérifier
```
npx tsc --noEmit
npm run build
```
