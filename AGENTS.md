# Project instructions for AI coding assistants

## Project overview

This is a Vue 3 + Vite web app for managing a personal home bar inventory.

The app should allow users to:
- Sign in
- Add home inventory items such as beer, wine, sparkling wine, cider, spirits, liqueurs, bitters, vermouth, mixers, juices, syrups and garnishes
- Add inventory items by name, barcode or article number
- Get drink suggestions based on available inventory
- See which ingredients are missing for recommended drinks
- Get suggestions for useful next purchases
- Discover drinks and products the user has not tried before
- Favorite inventory items and drinks
- Install the website as a PWA on the home screen
- Deploy via GitHub and Vercel

Future scope:
- Add food recipes
- Suggest drinks that pair well with food
- Support LCHF-friendly food and drink filtering

## Language

All code, comments, commit messages, README content and documentation should be written in English.

User-facing text in the app can initially be English, but the app should be structured so Swedish can be added later if needed.

## Tech stack

Use:
- Vue 3
- Vite
- TypeScript
- Vue Router
- CSS with minimal JavaScript where possible
- GitHub for source control
- Vercel for deployment

Avoid adding heavy dependencies unless clearly justified.

Do not introduce backend, database or authentication libraries until the feature requires it and the decision has been discussed.

## Vue style

Prefer:
- Vue 3 Single File Components
- Options API unless there is a strong reason to use Composition API
- Small focused components
- Clear props and events
- Feature-based folder structure

Avoid:
- Large monolithic components
- Mixing unrelated feature logic in App.vue
- Global state until needed
- Premature abstraction

## Suggested folder structure

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

## Domain model guidelines

Inventory items should support:
- id
- name
- category
- subCategory
- brand
- barcode
- articleNumber
- volumeMl
- alcoholPercentage
- quantity
- isFavorite

Drink recipes should support:
- id
- name
- description
- ingredients
- method
- glass
- tags
- imageUrl
- isFavorite

Drink ingredients should support:
- name
- amount
- required
- matchingTerms

Matching logic should initially be rule-based and deterministic.

## Recommendation logic

The app should be able to classify drinks into:
- Can be made now
- Missing one ingredient
- Missing multiple ingredients

The app should also be able to suggest useful next purchases based on which missing ingredients unlock the most drink recipes.

Keep recommendation logic separate from Vue components.

Preferred location:

src/features/recommendations/recommendationService.ts

## UX principles

The app is mobile-first.

Important views:
- Dashboard
- My Bar / Inventory
- Drink Suggestions
- Favorites
- Discover
- Shopping Suggestions

Prioritize clarity over visual complexity.

Each screen should answer a simple user question:
- What do I have?
- What can I make?
- What am I missing?
- What should I buy next?
- What should I try?

## Accessibility

Use semantic HTML where possible.

Prefer:
- buttons for actions
- links for navigation
- labels for form controls
- accessible names for icons
- keyboard-friendly interactions

Avoid custom UI controls unless necessary.

## PWA

The app should eventually be installable on the home screen.

Do not add PWA setup until the base app structure is stable, unless explicitly requested.

## README maintenance

Before each commit, update README.md when the change affects:
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

The README should stay useful for a developer opening the project for the first time.

## Project log

Maintain a PROJECT_LOG.md.

Before each commit, add a short entry when meaningful work has been completed.

Each entry should include:
- date
- what changed
- why it changed
- next possible step

Example entry:

## 2026-05-04

### Changed
- Added base Vue Router setup.
- Added initial Dashboard, Inventory, Drinks, Favorites and Discover views.

### Why
- Establishes the first navigable app structure.

### Next
- Add initial domain types and seed data.

## Commit workflow

Before suggesting a commit, always check:
- The app builds
- The app runs without obvious console errors
- README.md is updated if needed
- PROJECT_LOG.md is updated if needed
- No secrets or local files are committed

Use clear commit messages.

Examples:
- Initial Vue Vite setup
- Add base routes and app views
- Add inventory and drink domain types
- Add initial recommendation service
- Add dashboard inventory summary

## Git and secrets

Never commit:
- .env
- API keys
- access tokens
- private credentials
- local machine paths
- generated debug files

Use .env.example for documenting required environment variables.

GitHub authentication should use SSH or GitHub CLI, not password authentication.

## Development order

Recommended order:

1. Create Vue + Vite + TypeScript app
2. Add Vue Router
3. Add base views
4. Add domain types
5. Add seed data
6. Add inventory list
7. Add drink list
8. Add recommendation matching
9. Add favorites
10. Add shopping suggestions
11. Add persistence
12. Add authentication
13. Add barcode/article lookup
14. Add PWA support
15. Add food recipe support

## Testing

Do not add a large test setup too early.

When logic becomes non-trivial, especially recommendation matching, add unit tests for:
- drink matching
- missing ingredient detection
- next purchase suggestions
- favorite toggling logic

Prefer testing domain logic before UI.

## AI assistant behavior

When implementing a feature:
1. Make the smallest useful change.
2. Do not rewrite unrelated files.
3. Explain any architectural decision briefly.
4. Prefer simple local data before adding external services.
5. Keep domain logic outside Vue components.
6. Update README.md and PROJECT_LOG.md before suggesting a commit.
7. Suggest a commit command after a completed change.

## Important product principle

This should not become just another generic drink recipe website.

The core product idea is:

A personal home bar app that tells the user what they can make with what they already have, what they are missing, and what they should discover next.
