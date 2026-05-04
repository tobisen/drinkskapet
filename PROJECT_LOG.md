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

## 2026-05-04 (Demo reset controls)

### Changed
- Added `resetInventory` in `src/features/inventory/useInventory.ts` to restore `demoInventory` and persist it to localStorage.
- Added `resetDrinkFavorites` in `src/features/drinks/useDrinkFavorites.ts` to restore seed favorite ids and persist to localStorage.
- Added a reset button in `src/views/InventoryView.vue` for restoring demo inventory.
- Added a reset button in `src/views/FavoritesView.vue` for restoring drink favorites.
- Added clear button labels and accessible `aria-label` text for both reset controls.

### Why
- Makes demo sessions easy to reset without manual localStorage cleanup.
- Keeps reset behavior centralized in existing composables.

### Next
- Add optional combined "reset all demo data" action in a future settings view.

## 2026-05-04 (Inventory form validation improvements)

### Changed
- Updated `src/views/InventoryView.vue` with basic form validation.
- Added required checks for item name and category.
- Added trim handling for name and brand before saving.
- Added duplicate prevention for same name + brand (case-insensitive).
- Added a small inline validation message for invalid form submissions.
- Kept form clear behavior for successful add only.

### Why
- Prevents common input issues and accidental duplicate inventory entries.
- Improves data quality while keeping the form simple and mobile-friendly.

### Next
- Consider adding optional quantity input and validation in the same form.

## 2026-05-04 (Inventory filters)

### Changed
- Updated `src/views/InventoryView.vue` with local filters for search, category, and favorites-only.
- Added filtered results count and clear empty state when no items match.
- Kept filters local to InventoryView while continuing to use shared inventory data from `useInventory`.

### Why
- Makes larger inventories easier to browse and inspect.
- Improves day-to-day usability without adding backend or state complexity.

### Next
- Consider adding quick filter reset and sort options.

## 2026-05-04 (Drinks filters)

### Changed
- Updated `src/views/DrinksView.vue` with local filters for text search, status, and favorites-only.
- Added status filter options for all / can make now / missing one / missing multiple.
- Added filtered results count and clear empty state when no drinks match.
- Kept filters local while continuing to use `useInventory`, `useDrinkFavorites`, and recommendation service.

### Why
- Makes drink discovery and decision-making faster when the list grows.
- Keeps filtering simple and client-side without backend complexity.

### Next
- Consider adding quick filter reset and sort by name/status.

## 2026-05-04 (Drink detail view)

### Changed
- Added `src/views/DrinkDetailView.vue` with route-based detail rendering from `seedDrinks`.
- Added route `/drinks/:id` in `src/router/index.ts`.
- Updated `src/views/DrinksView.vue` so each drink links to its detail page.
- Added detail content for name, description, ingredients with amounts, method steps, glass, tags, status, and missing ingredients.
- Added favorite toggle in detail view via `useDrinkFavorites` and back link to Drinks.
- Added clear not-found state for invalid drink ids.

### Why
- Provides a focused view for each drink and clearer decision support from inventory match status.
- Keeps implementation fully client-side with existing seed data and recommendation logic.

### Next
- Add localized drink text in detail view and deep-link sharing improvements.

## 2026-05-04 (Inventory item detail view)

### Changed
- Added `src/views/InventoryItemDetailView.vue`.
- Added route `/inventory/:id` in `src/router/index.ts`.
- Updated `src/views/InventoryView.vue` to link each item to its detail page.
- Added detail content for inventory fields (name, brand, category, subCategory, volume, alcohol, quantity, barcode, article number).
- Added inventory favorite toggle in detail view via `useInventory`.
- Added related drinks section based on ingredient matching terms against the selected item.
- Added back link to Inventory and clear not-found state for invalid ids.

### Why
- Makes inventory records easier to inspect and relate to potential drinks.
- Keeps behavior fully client-side using existing shared state and seed data.

### Next
- Add richer category/subcategory display labels in detail view.

## 2026-05-04 (Inventory item edit and delete)

### Changed
- Added `updateInventoryItem` and `deleteInventoryItem` in `src/features/inventory/useInventory.ts` with localStorage persistence.
- Updated `src/views/InventoryItemDetailView.vue` with minimal edit mode for name, category, brand, and quantity.
- Added validation for required name and category in edit mode.
- Added trim handling for name and brand before save.
- Added delete button with simple confirmation and redirect back to Inventory after delete.
- Kept favorite toggle and related drinks section in detail view.

### Why
- Enables practical inventory maintenance directly from item detail pages.
- Keeps editing/deleting logic in shared composable while preserving client-side simplicity.

### Next
- Add optional duplicate check in detail edit mode similar to add-form behavior.

## 2026-05-04 (Extended inventory add/edit fields)

### Changed
- Updated `src/views/InventoryView.vue` add form with optional fields:
  - subCategory
  - volumeMl
  - alcoholPercentage
  - barcode
  - articleNumber
- Updated `src/views/InventoryItemDetailView.vue` edit mode with the same optional fields.
- Added safe numeric conversion rules:
  - empty numeric input becomes `undefined`
  - invalid numbers show validation error
  - `alcoholPercentage` must be between 0 and 100 when provided
  - `volumeMl` must be greater than 0 when provided
- Kept required validation for name and category.
- Trimmed string fields before saving.
- Updated `src/features/inventory/useInventory.ts` add/update handlers to persist new optional fields.

### Why
- Improves product detail quality and ingredient matching precision.
- Keeps data handling robust while staying fully client-side.

### Next
- Add optional duplicate checks in edit mode against other inventory items.

## 2026-05-04 (Grouped related drinks on inventory detail)

### Changed
- Updated `src/views/InventoryItemDetailView.vue` related drinks section to use recommendation grouping.
- Related drinks are now grouped into:
  - can make now with this item
  - close matches missing one ingredient
  - other recipes using this item
- Kept links from each related drink to its detail page.
- Kept clear empty state when no drinks use the selected item.

### Why
- Makes related drink recommendations more actionable from an inventory perspective.
- Reuses existing recommendation logic for consistent classification.

### Next
- Optionally show missing ingredient names in the close-match group.

## 2026-05-04 (Add missing ingredients from drink detail)

### Changed
- Updated `src/views/DrinkDetailView.vue` to show an "Add to inventory" button for each missing ingredient.
- Added inventory insert flow using `useInventory.addInventoryItem`.
- Added duplicate prevention against existing inventory item names (case-insensitive).
- Added simple per-ingredient feedback messages for added/existing states.
- Added default category mapping for missing ingredients when adding to inventory.

### Why
- Makes it faster to act on missing ingredients directly from drink detail context.
- Keeps flow client-side and consistent with existing shared inventory logic.

### Next
- Optionally map more ingredient names to categories/subcategories for higher precision.

## 2026-05-04 (Shopping list local state)

### Changed
- Added `src/features/shopping/useShoppingList.ts` with localStorage persistence.
- Added duplicate prevention for shopping items by case-insensitive name.
- Added shopping list actions: add, toggle checked, remove, and clear checked items.
- Updated `src/views/DrinkDetailView.vue` to add missing ingredients to shopping list while keeping add-to-inventory.
- Updated `src/views/ShoppingSuggestionsView.vue` to render and manage the current shopping list below recommendations.

### Why
- Makes missing ingredients actionable without backend or auth.
- Reuses existing seed/inventory flows to support a simple planning loop for next purchases.

### Next
- Add optional quantity or notes per shopping list item.

## 2026-05-04 (Connect suggestions to shopping list)

### Changed
- Updated `src/views/ShoppingSuggestionsView.vue` to add an "Add to shopping list" action on each next-purchase suggestion.
- Connected suggestion adds to `useShoppingList.addShoppingListItem`.
- Added UI state for already-present suggestions and per-suggestion feedback for added/already-exists outcomes.
- Kept existing shopping list controls (check/uncheck, remove, clear checked) unchanged.

### Why
- Makes recommendation output directly actionable in the same view.
- Reuses existing duplicate protection in shared shopping list logic.

### Next
- Optionally prefill category for suggestion items where mapping is confident.

## 2026-05-04 (Minimal Import view)

### Changed
- Added `src/views/ImportView.vue` with a mobile-first URL input and disabled placeholder submit flow.
- Added route `/import` in `src/router/index.ts`.
- Added Import navigation link in `src/App.vue`.
- Added planned import scope text for drink recipe URLs, product URLs, and food recipe URLs later.

### Why
- Creates a clear entry point for future URL-based import features without implementing scraping or external API calls.
- Keeps current behavior explicit so users understand the feature is planned.

### Next
- Define the import parsing contract and validation rules before implementing actual fetch/parse flows.

## 2026-05-04 (MVP stabilization pass)

### Changed
- Improved shopping list localStorage safety in `useShoppingList` with safe read/write guards.
- Added clearer dashboard empty states when lists are empty.
- Added lightweight accessibility improvements for inline feedback and validation messages (`role="alert"` / `aria-live`).
- Removed duplicated style block structure in `DrinkDetailView` by keeping a single scoped style section.
- Updated README notes to match current localStorage persistence behavior.

### Why
- Reduces small runtime risks and improves clarity without adding new features.
- Keeps MVP behavior stable and easier to maintain before expanding scope.

### Next
- Add focused unit tests for recommendation and suggestion domain logic.

## 2026-05-04 (Basic recommendation unit tests)

### Changed
- Added minimal unit test setup with Vitest.
- Added `src/features/recommendations/recommendationService.test.ts`.
- Added tests for:
  - drinks that can be made now
  - drinks missing one ingredient
  - drinks missing multiple ingredients
  - next-purchase suggestions from missing ingredients
- Added `npm run test` script to `package.json`.

### Why
- Protects core recommendation behavior with fast domain-level tests.
- Keeps testing focused on deterministic logic, not UI.

### Next
- Add edge-case tests for synonym matching and duplicate ingredient term grouping.

## 2026-05-04 (Basic PWA installability)

### Changed
- Added minimal PWA setup in `vite.config.ts` using `vite-plugin-pwa`.
- Added a web app manifest configuration with app name, short name, theme/background color, display mode, start URL, and placeholder SVG icons.
- Enabled automatic service worker registration/update for installability support.

### Why
- Makes the app installable on supported platforms with minimal setup.
- Keeps scope small by avoiding advanced offline logic.

### Next
- Replace placeholder manifest icons with dedicated 192x192 and 512x512 PNG icons for broader install compatibility.

## 2026-05-04 (First Wine section)

### Changed
- Added `src/views/WineView.vue` as a mobile-first wine overview page.
- Added route `/wine` in `src/router/index.ts`.
- Added Wine navigation link in `src/App.vue`.
- Filtered wine data from shared inventory (`useInventory`) for categories `wine` and `sparkling-wine`.
- Grouped wines by subcategory: red, white, rosé, sparkling, dessert, fortified, and other.
- Added separate favorite wines section and clear empty states.
- Linked each wine item to existing inventory detail pages.
- Added read-only placeholder section for future food pairing ideas.
- Expanded `src/data/demoInventory.ts` with realistic Swedish home wine examples.

### Why
- Introduces a focused wine overview without adding backend/auth complexity.
- Reuses existing inventory data model and navigation structure.

### Next
- Add optional wine-specific filters (style, favorites-only, search) in the Wine view.
