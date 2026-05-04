export interface DrinkIngredient {
  name: string
  amount: string
  required: boolean
  matchingTerms: string[]
}

export interface IngredientInfo {
  id: string
  name: string
  matchingTerms: string[]
  category: string
  subCategory?: string
  description: string
  imageUrl: string
  imageAlt: string
  servingNotes: string
  usageTips: string
}

export interface DrinkRecipe {
  id: string
  name: string
  description: string
  ingredients: DrinkIngredient[]
  method: string
  glass: string
  tags: string[]
  imageUrl?: string
  imageAlt?: string
  flavorProfile?: string[]
  servingNotes?: string
  shortHistory?: string
  isFavorite: boolean
}
