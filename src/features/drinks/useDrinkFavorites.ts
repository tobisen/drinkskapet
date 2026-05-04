import { ref } from 'vue'
import { seedDrinks } from '../../data/seedDrinks'

const DRINK_FAVORITES_STORAGE_KEY = 'drinkskapet.drinkFavorites.v1'

function getSeedFavoriteIds(): string[] {
  return seedDrinks.filter((drink) => drink.isFavorite).map((drink) => drink.id)
}

function readFavoriteDrinkIds(): string[] {
  try {
    const raw = localStorage.getItem(DRINK_FAVORITES_STORAGE_KEY)

    if (!raw) {
      return getSeedFavoriteIds()
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) {
      return getSeedFavoriteIds()
    }

    return parsed
  } catch {
    return getSeedFavoriteIds()
  }
}

function writeFavoriteDrinkIds(ids: string[]): void {
  try {
    localStorage.setItem(DRINK_FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Ignore storage write errors for now.
  }
}

const favoriteDrinkIds = ref<string[]>(readFavoriteDrinkIds())

function isDrinkFavorite(drinkId: string): boolean {
  return favoriteDrinkIds.value.includes(drinkId)
}

function toggleDrinkFavorite(drinkId: string): void {
  if (isDrinkFavorite(drinkId)) {
    favoriteDrinkIds.value = favoriteDrinkIds.value.filter((id) => id !== drinkId)
  } else {
    favoriteDrinkIds.value = [...favoriteDrinkIds.value, drinkId]
  }

  writeFavoriteDrinkIds(favoriteDrinkIds.value)
}

function resetDrinkFavorites(): void {
  favoriteDrinkIds.value = getSeedFavoriteIds()
  writeFavoriteDrinkIds(favoriteDrinkIds.value)
}

export function useDrinkFavorites() {
  return {
    favoriteDrinkIds,
    isDrinkFavorite,
    toggleDrinkFavorite,
    resetDrinkFavorites,
  }
}
