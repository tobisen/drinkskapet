import type { DrinkIngredient, DrinkRecipe } from '../drinks/types'

export interface DrinkWithMissingIngredients {
  drink: DrinkRecipe
  missingIngredients: DrinkIngredient[]
}

export interface DrinkRecommendations {
  canMakeNow: DrinkWithMissingIngredients[]
  missingOneIngredient: DrinkWithMissingIngredients[]
  missingMultipleIngredients: DrinkWithMissingIngredients[]
}

export interface SuggestedPurchase {
  ingredientName: string
  matchingTerms: string[]
  unlocksDrinkCount: number
  unlocksDrinkIds: string[]
}
