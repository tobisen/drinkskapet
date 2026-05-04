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

## 2026-05-04 (First usable drinks view)

### Changed
- Updated `src/views/DrinksView.vue` to use `seedDrinks`, hardcoded demo inventory, and recommendation service output.
- Added grouped sections for:
  - can make now
  - missing one ingredient
  - missing multiple ingredients
- Added drink cards showing name, description, full ingredient list, and missing ingredients when relevant.
- Added local favorite toggle for drinks.
- Added in-page language selection with Swedish as default and English as second option.

### Why
- Delivers the first practical drink recommendation view using current deterministic rules.
- Makes recommendation results and gaps clearly visible for users and future UI integration work.

### Next
- Connect drinks recommendations to shared inventory state.
- Add simple filtering by tags and favorites.

## 2026-05-04 (Shared demo inventory data)

### Changed
- Added `src/data/demoInventory.ts` with typed shared `InventoryItem[]` demo data.
- Updated `src/views/DashboardView.vue` to import shared demo inventory.
- Updated `src/views/DrinksView.vue` to import shared demo inventory.

### Why
- Removes duplicated hardcoded inventory data across views.
- Keeps demo recommendation input consistent between Dashboard and Drinks.

### Next
- Reuse the same inventory source in additional views where relevant.

## 2026-05-04 (First usable favorites view)

### Changed
- Updated `src/views/FavoritesView.vue` to use `demoInventory` and `seedDrinks`.
- Added read-only sections for favorite inventory items and favorite drinks.
- Added clear empty states, including when there are no favorite drinks yet.

### Why
- Delivers the first practical favorites view with real seeded/demo data.
- Keeps behavior simple and deterministic without adding persistence or shared state complexity.

### Next
- Connect favorites to interactive toggles from inventory and drinks views.

## 2026-05-04 (First usable discover view)

### Changed
- Updated `src/views/DiscoverView.vue` to use `seedDrinks` and `demoInventory`.
- Added read-only discovery sections for:
  - easy drinks to try
  - drinks close to your inventory
  - ingredients or categories to explore next
- Reused recommendation service output to drive close-drink and next-purchase insights.

### Why
- Delivers a practical discovery flow based on existing deterministic seed/demo data.
- Expands product value beyond direct recommendations while keeping implementation minimal.

### Next
- Add localization for drink descriptions and ingredient names in Discover.

## 2026-05-04 (First usable shopping suggestions view)

### Changed
- Added `src/views/ShoppingSuggestionsView.vue`.
- Added a new route in `src/router/index.ts` for `/shopping-suggestions`.
- Added navigation link in `src/App.vue`.
- Implemented read-only shopping suggestions using `seedDrinks`, `demoInventory`, and recommendation next-purchase helper.
- Added suggestion cards with ingredient name, unlock/improve count, and related drink names.
- Added clear empty state when no suggestions are available.

### Why
- Delivers the first dedicated shopping suggestion page aligned with core product value.
- Reuses deterministic recommendation logic without introducing persistence or external dependencies.

### Next
- Connect shopping suggestions to real user inventory when persistence is introduced.

## 2026-05-04 (Improved seed and demo content quality)

### Changed
- Expanded `src/data/seedDrinks.ts` to 15 simple classic drinks.
- Added a broader mix across gin, rum, whiskey/bourbon, vodka, and low-effort highballs.
- Included one non-alcoholic option (`Virgin Mojito`) within current drink types.
- Improved ingredient `matchingTerms` coverage for more practical matching.
- Updated `src/data/demoInventory.ts` with a more realistic Swedish home bar baseline.
- Marked several demo inventory items as favorites.

### Why
- Increases recommendation usefulness with better breadth and match quality.
- Makes demo behavior more representative for Swedish home bar usage.

### Next
- Add lightweight unit tests for ingredient matching stability across synonyms.

## 2026-05-04 (Shared inventory composable)

### Changed
- Added `src/features/inventory/useInventory.ts` as a shared in-memory inventory state composable initialized from `demoInventory`.
- Exposed `inventoryItems`, `addInventoryItem`, and `toggleInventoryFavorite`.
- Updated `InventoryView`, `DashboardView`, `DrinksView`, `FavoritesView`, `DiscoverView`, and `ShoppingSuggestionsView` to use shared inventory state instead of direct demo inventory imports where relevant.

### Why
- Keeps inventory behavior consistent across views without introducing persistence or backend complexity.
- Establishes a minimal shared-state baseline for future feature work.

### Next
- Add optional reset helper for demo sessions and upcoming tests.

## 2026-05-04 (Inventory localStorage persistence)

### Changed
- Updated `src/features/inventory/useInventory.ts` to persist shared inventory state to localStorage.
- Added storage key constant: `INVENTORY_STORAGE_KEY`.
- Added safe initialization from localStorage with validation and JSON parse error handling.
- Added fallback to `demoInventory` when localStorage is empty or invalid.
- Added storage writes when items are added or favorites are toggled.

### Why
- Preserves user inventory changes between page reloads without backend or auth.
- Keeps persistence logic centralized in the existing inventory composable.

### Next
- Add optional clear/reset inventory action for local testing.

## 2026-05-04 (Shared drink favorites composable)

### Changed
- Added `src/features/drinks/useDrinkFavorites.ts` for shared favorite drink ids state.
- Added safe localStorage initialization with parse validation and fallback to seed favorites.
- Exposed `favoriteDrinkIds`, `isDrinkFavorite`, and `toggleDrinkFavorite`.
- Updated `DrinksView` to use shared drink favorites state instead of local-only drink favorite toggling.
- Updated `FavoritesView` to show favorite drinks from shared drink favorites state.

### Why
- Keeps drink favorite behavior consistent across views with minimal shared state.
- Preserves favorite drink choices between reloads without backend/auth complexity.

### Next
- Add optional helper to clear drink favorites for demo reset flows.
