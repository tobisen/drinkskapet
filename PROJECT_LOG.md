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
