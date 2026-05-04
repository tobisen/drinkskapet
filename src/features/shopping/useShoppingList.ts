import { ref } from 'vue'

export interface ShoppingListItem {
  id: string
  name: string
  category?: string
  sourceDrinkId?: string
  sourceDrinkName?: string
  isChecked: boolean
}

const SHOPPING_LIST_STORAGE_KEY = 'drinkskapet.shoppingList.v1'

const shoppingListItems = ref<ShoppingListItem[]>(loadShoppingListItems())

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function isValidShoppingListItem(value: unknown): value is ShoppingListItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<ShoppingListItem>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.isChecked === 'boolean'
  )
}

function loadShoppingListItems(): ShoppingListItem[] {
  let rawValue: string | null = null

  try {
    rawValue = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY)
  } catch {
    return []
  }

  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isValidShoppingListItem)
  } catch {
    return []
  }
}

function saveShoppingListItems(items: ShoppingListItem[]): void {
  try {
    localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage write errors for now.
  }
}

function addShoppingListItem(input: {
  name: string
  category?: string
  sourceDrinkId?: string
  sourceDrinkName?: string
}): boolean {
  const name = input.name.trim()

  if (!name) {
    return false
  }

  const normalizedName = normalize(name)

  const exists = shoppingListItems.value.some(
    (item) => normalize(item.name) === normalizedName,
  )

  if (exists) {
    return false
  }

  const item: ShoppingListItem = {
    id: `shopping-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    category: input.category?.trim() || undefined,
    sourceDrinkId: input.sourceDrinkId,
    sourceDrinkName: input.sourceDrinkName?.trim() || undefined,
    isChecked: false,
  }

  shoppingListItems.value = [...shoppingListItems.value, item]
  saveShoppingListItems(shoppingListItems.value)

  return true
}

function toggleShoppingListItem(itemId: string): void {
  shoppingListItems.value = shoppingListItems.value.map((item) => {
    if (item.id !== itemId) {
      return item
    }

    return {
      ...item,
      isChecked: !item.isChecked,
    }
  })

  saveShoppingListItems(shoppingListItems.value)
}

function removeShoppingListItem(itemId: string): void {
  shoppingListItems.value = shoppingListItems.value.filter((item) => item.id !== itemId)
  saveShoppingListItems(shoppingListItems.value)
}

function clearCheckedShoppingListItems(): void {
  shoppingListItems.value = shoppingListItems.value.filter((item) => !item.isChecked)
  saveShoppingListItems(shoppingListItems.value)
}

export function useShoppingList() {
  return {
    shoppingListItems,
    addShoppingListItem,
    toggleShoppingListItem,
    removeShoppingListItem,
    clearCheckedShoppingListItems,
  }
}
