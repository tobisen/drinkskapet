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

Initial Vue 3 + Vite + TypeScript structure is in place with Vue Router, base mobile-first views, initial domain types and seed data, a rule-based recommendation service, a dashboard summary using demo inventory, a usable local-state inventory view, and a first usable drinks view.

## Implemented features

- Vue 3 + Vite + TypeScript setup
- Vue Router with base routes
- Base app shell with responsive header/navigation
- Initial views:
  - Dashboard
  - My Bar / Inventory
  - Inventory Item Detail
  - Drink Suggestions
  - Drink Detail
  - Favorites
  - Discover
  - Shopping Suggestions
- Initial domain model for:
  - Inventory categories and items
  - Drink recipes and drink ingredients
- Seed data:
  - Inventory categories
  - 15 classic and simple drinks with ingredient `matchingTerms`, including one non-alcoholic option
- Recommendation service:
  - Matches inventory items against ingredient `matchingTerms`
  - Classifies drinks into `canMakeNow`, `missingOneIngredient`, `missingMultipleIngredients`
  - Returns missing ingredients per drink
  - Suggests next purchases by counting which missing ingredients unlock most drinks
- Dashboard summary (seed data only):
  - Shows count/list for drinks that can be made now
  - Shows drinks missing one ingredient
  - Shows top suggested next purchases
- Shared inventory state (local composable):
  - Initializes from localStorage when valid data exists
  - Falls back to `demoInventory` when storage is empty or invalid
  - Persists changes when items are added, updated, deleted, or favorites are toggled
  - Exposes `inventoryItems`, `addInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`, `toggleInventoryFavorite`, and `resetInventory`
  - Reused across Dashboard, Inventory, Drinks, Favorites, Discover and Shopping Suggestions views
- Inventory view (shared in-memory state):
  - Shows shared inventory items
  - Includes add form fields for `name`, `category`, `subCategory`, `brand`, `volumeMl`, `alcoholPercentage`, `barcode`, and `articleNumber`
  - Adds inline validation (required name/category, trimmed input, duplicate prevention by name+brand, numeric range checks)
  - Adds local filters (search by name/brand, category, favorites-only)
  - Shows filtered results count and clear empty state
  - Clears form after successful add
  - Links each item to a detail page
  - Supports toggling `isFavorite` per item
- Inventory item detail view:
  - Route: `/inventory/:id`
  - Loads item from shared inventory state by route id
  - Supports edit mode (name, category, subCategory, brand, quantity, volumeMl, alcoholPercentage, barcode, articleNumber) and delete with confirm
  - Validates required fields and numeric ranges
  - Shows item details and favorite toggle
  - Shows related drinks grouped by can-make-now, close matches, and other recipes using the item
  - Includes back link to Inventory and clear not-found state
- Shared drink favorites state (local composable):
  - Initializes favorite drink ids from localStorage when valid data exists
  - Falls back to seed drink favorites when storage is empty or invalid
  - Exposes `favoriteDrinkIds`, `isDrinkFavorite`, `toggleDrinkFavorite`, and `resetDrinkFavorites`
  - Reused across Drinks and Favorites views
- Drinks view (shared favorites state):
  - Uses `seedDrinks` and shared inventory data
  - Groups drinks by recommendation status
  - Adds local filters (search, status, favorites-only)
  - Shows filtered results count and clear empty state
  - Shows name, description, ingredients, and missing ingredients
  - Links each drink to a detail page
  - Supports toggling shared drink favorite state
- Drink detail view:
  - Route: `/drinks/:id`
  - Loads drink from seed data by route id
  - Shows make-now status and missing ingredients via recommendation service
  - Supports adding missing ingredients directly to inventory with duplicate checks
  - Shows name, description, ingredients, method, glass, tags, and favorite toggle
  - Includes back link to Drinks and clear not-found state
- Favorites view (read-only):
  - Uses `demoInventory` and `seedDrinks`
  - Shows favorite inventory items
  - Shows favorite drinks
  - Shows a clear empty state when no favorite drinks exist
- Discover view (read-only):
  - Uses `seedDrinks` and `demoInventory`
  - Shows easy drinks to try
  - Shows drinks close to your inventory
  - Shows ingredients or categories to explore next
- Shopping Suggestions view (read-only):
  - Uses `seedDrinks` and `demoInventory`
  - Uses recommendation next-purchase helper
  - Shows suggested purchases sorted by usefulness
  - Shows ingredient, unlocked/improved drink count, and related drink names
- Shared shopping list state (local composable):
  - Persists shopping list items in localStorage with safe parse fallback to empty list
  - Prevents duplicates by item name (case-insensitive)
  - Exposes `shoppingListItems`, `addShoppingListItem`, `toggleShoppingListItem`, `removeShoppingListItem`, and `clearCheckedShoppingListItems`
- Drink detail view updates:
  - Adds missing ingredients to shopping list with source drink metadata
  - Keeps existing add-to-inventory flow unchanged
- Shopping Suggestions view updates:
  - Shows current shopping list below recommendations
  - Supports check/uncheck, remove item, and clear checked items

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
    demoInventory.ts
    inventoryCategories.ts
    seedDrinks.ts
  features/
    drinks/
      types.ts
    inventory/
      types.ts
    shopping/
      useShoppingList.ts
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
    ShoppingSuggestionsView.vue
  App.vue
  main.ts
  style.css
```

## Routes

- `/` -> Dashboard
- `/inventory` -> My Bar / Inventory
- `/inventory/:id` -> Inventory Item Detail
- `/drinks` -> Drink Suggestions
- `/drinks/:id` -> Drink Detail
- `/favorites` -> Favorites
- `/discover` -> Discover
- `/shopping-suggestions` -> Shopping Suggestions

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
- Dashboard and Drinks views use shared demo inventory from `src/data/demoInventory.ts` with a few favorite items marked.
- Dashboard summary currently uses demo inventory data only.
- Inventory data is currently shared in-memory state only (no persistence).
- Drink favorites are persisted in localStorage via shared drink favorites composable.
