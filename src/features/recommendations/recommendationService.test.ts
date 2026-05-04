import { describe, expect, it } from 'vitest'
import type { DrinkRecipe } from '../drinks/types'
import type { InventoryItem } from '../inventory/types'
import {
  getDrinkRecommendations,
  getSuggestedNextPurchases,
} from './recommendationService'

const drinks: DrinkRecipe[] = [
  {
    id: 'gin-tonic',
    name: 'Gin Tonic',
    description: 'Classic highball.',
    ingredients: [
      { name: 'Gin', amount: '50 ml', required: true, matchingTerms: ['gin'] },
      { name: 'Tonic Water', amount: '100 ml', required: true, matchingTerms: ['tonic water', 'tonic'] },
      { name: 'Lime Wedge', amount: '1', required: false, matchingTerms: ['lime wedge', 'lime'] },
    ],
    method: 'Build over ice.',
    glass: 'Highball',
    tags: ['highball'],
    isFavorite: false,
  },
  {
    id: 'vodka-soda',
    name: 'Vodka Soda',
    description: 'Simple and crisp.',
    ingredients: [
      { name: 'Vodka', amount: '50 ml', required: true, matchingTerms: ['vodka'] },
      { name: 'Soda Water', amount: '100 ml', required: true, matchingTerms: ['soda water', 'sparkling water'] },
    ],
    method: 'Build over ice.',
    glass: 'Highball',
    tags: ['highball'],
    isFavorite: false,
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    description: 'Rum sour.',
    ingredients: [
      { name: 'White Rum', amount: '60 ml', required: true, matchingTerms: ['white rum', 'rum'] },
      { name: 'Lime Juice', amount: '25 ml', required: true, matchingTerms: ['lime juice'] },
      { name: 'Simple Syrup', amount: '15 ml', required: true, matchingTerms: ['simple syrup', 'syrup'] },
    ],
    method: 'Shake and strain.',
    glass: 'Coupe',
    tags: ['sour'],
    isFavorite: false,
  },
]

function item(name: string): InventoryItem {
  return {
    id: `item-${name}`,
    name,
    category: 'spirits',
    quantity: 1,
    isFavorite: false,
  }
}

describe('recommendationService', () => {
  it('classifies drinks that can be made now', () => {
    const inventory: InventoryItem[] = [item('Gin'), item('Tonic Water')]

    const recommendations = getDrinkRecommendations(inventory, drinks)

    expect(recommendations.canMakeNow.map((entry) => entry.drink.id)).toEqual(['gin-tonic'])
  })

  it('classifies drinks missing one ingredient', () => {
    const inventory: InventoryItem[] = [item('Vodka')]

    const recommendations = getDrinkRecommendations(inventory, drinks)
    const ids = recommendations.missingOneIngredient.map((entry) => entry.drink.id)

    expect(ids).toEqual(['vodka-soda'])
    expect(recommendations.missingOneIngredient[0].missingIngredients.map((ingredient) => ingredient.name)).toEqual(['Soda Water'])
  })

  it('classifies drinks missing multiple ingredients', () => {
    const inventory: InventoryItem[] = [item('Rum')]

    const recommendations = getDrinkRecommendations(inventory, drinks)
    const daiquiri = recommendations.missingMultipleIngredients.find(
      (entry) => entry.drink.id === 'daiquiri',
    )

    expect(daiquiri).toBeDefined()
    expect(daiquiri?.missingIngredients.map((ingredient) => ingredient.name)).toEqual([
      'Lime Juice',
      'Simple Syrup',
    ])
  })

  it('builds next-purchase suggestions from missing ingredients', () => {
    const inventory: InventoryItem[] = [item('Vodka'), item('Rum')]

    const recommendations = getDrinkRecommendations(inventory, drinks)
    const suggestions = getSuggestedNextPurchases(recommendations)

    const sodaSuggestion = suggestions.find((suggestion) => suggestion.ingredientName === 'Soda Water')
    const limeSuggestion = suggestions.find((suggestion) => suggestion.ingredientName === 'Lime Juice')

    expect(sodaSuggestion?.unlocksDrinkCount).toBe(1)
    expect(sodaSuggestion?.unlocksDrinkIds).toEqual(['vodka-soda'])
    expect(limeSuggestion?.unlocksDrinkCount).toBe(1)
    expect(limeSuggestion?.unlocksDrinkIds).toEqual(['daiquiri'])
  })
})
