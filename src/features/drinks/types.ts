export interface DrinkIngredient {
  name: string
  amount: string
  required: boolean
  matchingTerms: string[]
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
  isFavorite: boolean
}
