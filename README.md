# Drinkskåpet

A personal home bar inventory and drink recommendation app.

## Purpose

Drinkskåpet helps users keep track of what they have at home and get drink suggestions based on their actual inventory.

The app should answer:
- What do I have at home?
- What can I make right now?
- What am I missing?
- What should I buy next?
- What should I try?

## Core product idea

This is not a generic drink recipe website.

The core idea is a personal home bar app that gives useful recommendations based on what the user already owns.

## Planned MVP features

- Add and manage home inventory
- Categorize inventory items
- View drink suggestions based on inventory
- See drinks that can be made now
- See drinks where only one ingredient is missing
- See useful next-purchase suggestions
- Favorite drinks
- Favorite inventory items
- Mobile-first interface
- Deploy to Vercel

## Future features

- User login
- Persistent user inventory
- Barcode lookup
- Article number lookup
- PWA installation on home screen
- Food recipes
- Drink pairing with food
- LCHF-friendly food and drink filtering
- Discovery recommendations for drinks and products the user has not tried before

## Tech stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- GitHub
- Vercel

## Recommended development order

1. Create Vue + Vite + TypeScript app
2. Add Vue Router
3. Add base views
4. Add inventory and drink domain types
5. Add seed data
6. Add inventory list
7. Add drink list
8. Add recommendation matching
9. Add favorites
10. Add shopping suggestions
11. Add persistence
12. Add authentication
13. Add barcode and article lookup
14. Add PWA support
15. Add food recipe support

## Getting started

Install dependencies:

npm install

Start development server:

npm run dev

Build for production:

npm run build

Preview production build:

npm run preview

## Project structure

Planned structure:

src/
  assets/
  components/
  data/
  features/
    auth/
    inventory/
      components/
      types.ts
    drinks/
      components/
      types.ts
    favorites/
      components/
      types.ts
    recommendations/
      recommendationService.ts
  router/
    index.ts
  views/
    DashboardView.vue
    InventoryView.vue
    DrinksView.vue
    FavoritesView.vue
    DiscoverView.vue
  App.vue
  main.ts

## Main views

### Dashboard

Overview of inventory, available drinks, missing ingredients and suggested next purchases.

### My Bar / Inventory

The user's home inventory, including beer, wine, sparkling wine, cider, spirits, liqueurs, bitters, vermouth, mixers, juices, syrups, garnishes and other items.

### Drink Suggestions

Drink recommendations based on available inventory.

### Favorites

Favorite drinks and inventory items.

### Discover

Suggestions for drinks, ingredients and products the user has not tried before.

### Shopping Suggestions

Recommended next purchases based on what unlocks the most drink recipes.

## Recommendation model

Drink suggestions should initially be rule-based and deterministic.

Drinks can be classified as:
- Can be made now
- Missing one ingredient
- Missing multiple ingredients

The app should also be able to suggest ingredients or products that unlock the most drink recipes.

## Environment variables

No environment variables are required yet.

When environment variables are introduced, document them in .env.example.

## Deployment

The app is intended to be deployed with Vercel.

Expected Vercel settings:

Framework preset: Vite
Build command: npm run build
Output directory: dist

## GitHub authentication

Use SSH or GitHub CLI for GitHub authentication.

Do not use password authentication for Git operations.

## Documentation rules

Before each commit, update this README when the change affects:
- project purpose
- setup instructions
- available scripts
- folder structure
- main features
- deployment
- environment variables
- architecture decisions
- known limitations
- next steps

Also update PROJECT_LOG.md after meaningful changes.
