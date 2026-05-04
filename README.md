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

## Current status

Initial Vue 3 + Vite + TypeScript structure is in place with Vue Router, base mobile-first views, initial domain types and seed data, a rule-based recommendation service, a dashboard summary using demo inventory, and a first usable local-state inventory view.

## Implemented features

- Vue 3 + Vite + TypeScript setup
- Vue Router with base routes
- Base app shell with responsive header/navigation
- Initial views:
  - Dashboard
  - My Bar / Inventory
  - Drink Suggestions
  - Favorites
  - Discover
- Initial domain model for:
  - Inventory categories and items
  - Drink recipes and drink ingredients
- Seed data:
  - Inventory categories
  - 9 classic drinks with ingredient `matchingTerms`
- Recommendation service:
  - Matches inventory items against ingredient `matchingTerms`
  - Classifies drinks into `canMakeNow`, `missingOneIngredient`, `missingMultipleIngredients`
  - Returns missing ingredients per drink
  - Suggests next purchases by counting which missing ingredients unlock most drinks
- Dashboard summary (seed data only):
  - Shows count/list for drinks that can be made now
  - Shows drinks missing one ingredient
  - Shows top suggested next purchases
- Inventory view (local state):
  - Shows a small demo inventory list
  - Includes a minimal add-item form (`name`, `category`, optional `brand`)
  - Supports toggling `isFavorite` per item

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

## Tech stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- GitHub
- Vercel

## Getting started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project structure

Current structure:

```text
src/
  assets/
  components/
  data/
    inventoryCategories.ts
    seedDrinks.ts
  features/
    drinks/
      types.ts
    inventory/
      types.ts
    recommendations/
      recommendationService.ts
      types.ts
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
  style.css
```

## Routes

- `/` -> Dashboard
- `/inventory` -> My Bar / Inventory
- `/drinks` -> Drink Suggestions
- `/favorites` -> Favorites
- `/discover` -> Discover

## Environment variables

No environment variables are required yet.

When environment variables are introduced, document them in `.env.example`.

## Deployment

The app is intended to be deployed with Vercel.

Expected Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Notes

- No authentication is implemented yet.
- No backend, database, external services or PWA setup is included yet.
- Recommendation logic is deterministic and framework-independent.
- Dashboard summary currently uses hardcoded demo inventory.
- Inventory data is currently local view state only (no persistence).
