# Project log

This file tracks meaningful project decisions and implementation steps.

## 2026-05-04

### Changed
- Created the project planning baseline.
- Defined the app as a personal home bar inventory and drink recommendation app.
- Added project instructions for AI coding assistants.
- Added initial README structure.
- Added an environment variable example file.

### Why
- The project needs a clear product direction before implementation starts.
- The app should be personal and inventory-based, not just a generic recipe website.
- AI coding assistants should follow the same technical and product principles throughout the project.

### Next
- Create the initial Vue project.
- Add Vue Router.
- Add base app views.
- Add inventory and drink domain types.
- Add seed data for inventory categories and initial drink recipes.

## 2026-05-04 (Initial app structure)

### Changed
- Added `vue-router`.
- Added router setup in `src/router/index.ts`.
- Created base views:
  - `DashboardView.vue`
  - `InventoryView.vue`
  - `DrinksView.vue`
  - `FavoritesView.vue`
  - `DiscoverView.vue`
- Added routes for all base views.
- Replaced Vite starter app with a minimal mobile-first app shell in `App.vue`.
- Updated global styles for a simple responsive layout.

### Why
- Establishes a clear and navigable foundation for feature work.
- Keeps early implementation minimal while matching the product's primary screens.
- Separates navigation and views from future domain logic.

### Next
- Add initial domain types for inventory and drinks.
- Add seed data.
- Start building rule-based recommendation logic in a separate service.

## 2026-05-04 (Domain types and seed data)

### Changed
- Added inventory domain types in `src/features/inventory/types.ts`.
- Added drink domain types in `src/features/drinks/types.ts`.
- Added inventory category seed data in `src/data/inventoryCategories.ts`.
- Added 9 classic seed drinks with ingredient `matchingTerms` in `src/data/seedDrinks.ts`.

### Why
- Establishes a typed foundation for inventory and drink matching.
- Provides realistic starter data for upcoming recommendation logic.
- Keeps matching deterministic and simple with explicit synonym terms.

### Next
- Implement recommendation service logic (can make now / missing one / missing multiple).
- Add a simple inventory seed list and connect seed data to views.

## 2026-05-04 (Recommendation service)

### Changed
- Added recommendation result and purchase suggestion types in `src/features/recommendations/types.ts`.
- Added `getDrinkRecommendations` in `src/features/recommendations/recommendationService.ts`.
- Added `getSuggestedNextPurchases` in `src/features/recommendations/recommendationService.ts`.
- Implemented deterministic matching between inventory items and ingredient `matchingTerms`.
- Implemented drink classification into `canMakeNow`, `missingOneIngredient`, and `missingMultipleIngredients`.

### Why
- Introduces the first framework-independent domain logic for core product value.
- Makes missing ingredients explicit per drink for future UI rendering.
- Enables data-driven next-purchase suggestions based on unlocked drinks.

### Next
- Add tests for recommendation matching and purchase suggestion ranking.
- Connect recommendation service to the Drink Suggestions view.

## 2026-05-04 (Dashboard recommendation summary)

### Changed
- Updated `src/views/DashboardView.vue` to use `seedDrinks` and a small hardcoded demo inventory.
- Added dashboard summary sections for:
  - drinks that can be made now
  - drinks missing one ingredient
  - top next purchases
- Kept implementation minimal, mobile-first, and without forms or persistence.

### Why
- Delivers the first visible product feedback loop using current rule-based logic.
- Validates recommendation service output directly in the app before deeper feature work.

### Next
- Replace demo inventory with user-managed inventory data.
- Expand dashboard with missing-multiple and quick action links.

## 2026-05-04 (First usable inventory view)

### Changed
- Updated `src/views/InventoryView.vue` with local component state and a small demo inventory list.
- Added a minimal add-item form for `name`, `category`, and optional `brand`.
- Reused `inventoryCategories` seed data for category options.
- Added favorite toggle support per inventory item.

### Why
- Creates the first interactive inventory management flow without adding persistence or backend complexity.
- Provides a practical UI baseline for later connection to shared state and recommendation features.

### Next
- Connect inventory state to dashboard and drink recommendations.
- Add remove/edit actions for inventory items.
