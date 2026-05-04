import type { DrinkIngredient, DrinkRecipe } from '../drinks/types'
import type { InventoryItem } from '../inventory/types'
import type {
  DrinkRecommendations,
  DrinkWithMissingIngredients,
  SuggestedPurchase,
} from './types'

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function getInventorySearchTerms(item: InventoryItem): string[] {
  const terms = [item.name]

  if (item.subCategory) {
    terms.push(item.subCategory)
  }

  if (item.brand) {
    terms.push(item.brand)
  }

  return terms.map(normalize)
}

function hasIngredient(
  ingredient: DrinkIngredient,
  inventoryTerms: Set<string>,
): boolean {
  return ingredient.matchingTerms
    .map(normalize)
    .some((term) => inventoryTerms.has(term))
}

function getMissingRequiredIngredients(
  drink: DrinkRecipe,
  inventoryTerms: Set<string>,
): DrinkIngredient[] {
  return drink.ingredients.filter(
    (ingredient) => ingredient.required && !hasIngredient(ingredient, inventoryTerms),
  )
}

function sortByDrinkNameThenId(
  a: DrinkWithMissingIngredients,
  b: DrinkWithMissingIngredients,
): number {
  return a.drink.name.localeCompare(b.drink.name) || a.drink.id.localeCompare(b.drink.id)
}

export function getDrinkRecommendations(
  inventoryItems: InventoryItem[],
  drinks: DrinkRecipe[],
): DrinkRecommendations {
  const inventoryTerms = new Set(
    inventoryItems
      .filter((item) => item.quantity > 0)
      .flatMap((item) => getInventorySearchTerms(item)),
  )

  const canMakeNow: DrinkWithMissingIngredients[] = []
  const missingOneIngredient: DrinkWithMissingIngredients[] = []
  const missingMultipleIngredients: DrinkWithMissingIngredients[] = []

  for (const drink of drinks) {
    const missingIngredients = getMissingRequiredIngredients(drink, inventoryTerms)
    const result: DrinkWithMissingIngredients = { drink, missingIngredients }

    if (missingIngredients.length === 0) {
      canMakeNow.push(result)
      continue
    }

    if (missingIngredients.length === 1) {
      missingOneIngredient.push(result)
      continue
    }

    missingMultipleIngredients.push(result)
  }

  canMakeNow.sort(sortByDrinkNameThenId)
  missingOneIngredient.sort(sortByDrinkNameThenId)
  missingMultipleIngredients.sort(sortByDrinkNameThenId)

  return {
    canMakeNow,
    missingOneIngredient,
    missingMultipleIngredients,
  }
}

export function getSuggestedNextPurchases(
  recommendations: DrinkRecommendations,
): SuggestedPurchase[] {
  const purchaseMap = new Map<string, SuggestedPurchase>()

  const lockedDrinks = [
    ...recommendations.missingOneIngredient,
    ...recommendations.missingMultipleIngredients,
  ]

  for (const entry of lockedDrinks) {
    for (const ingredient of entry.missingIngredients) {
      const key = ingredient.matchingTerms
        .map(normalize)
        .sort()
        .join('|')

      const existing = purchaseMap.get(key)

      if (!existing) {
        purchaseMap.set(key, {
          ingredientName: ingredient.name,
          matchingTerms: ingredient.matchingTerms.map(normalize),
          unlocksDrinkCount: 1,
          unlocksDrinkIds: [entry.drink.id],
        })
        continue
      }

      if (!existing.unlocksDrinkIds.includes(entry.drink.id)) {
        existing.unlocksDrinkIds.push(entry.drink.id)
        existing.unlocksDrinkCount += 1
      }
    }
  }

  return Array.from(purchaseMap.values()).sort((a, b) => {
    if (b.unlocksDrinkCount !== a.unlocksDrinkCount) {
      return b.unlocksDrinkCount - a.unlocksDrinkCount
    }

    return a.ingredientName.localeCompare(b.ingredientName)
  })
}
