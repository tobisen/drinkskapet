import { ref } from 'vue'
import { demoInventory } from '../../data/demoInventory'
import type { InventoryCategory, InventoryItem } from './types'

interface AddInventoryItemInput {
  name: string
  category: InventoryCategory
  brand?: string
}

const inventoryItems = ref<InventoryItem[]>(demoInventory.map((item) => ({ ...item })))

function addInventoryItem(input: AddInventoryItemInput): void {
  const name = input.name.trim()

  if (!name) {
    return
  }

  const brand = input.brand?.trim()

  inventoryItems.value.unshift({
    id: `item-${Date.now()}`,
    name,
    category: input.category,
    brand: brand || undefined,
    quantity: 1,
    isFavorite: false,
  })
}

function toggleInventoryFavorite(itemId: string): void {
  inventoryItems.value = inventoryItems.value.map((item) => {
    if (item.id !== itemId) {
      return item
    }

    return {
      ...item,
      isFavorite: !item.isFavorite,
    }
  })
}

export function useInventory() {
  return {
    inventoryItems,
    addInventoryItem,
    toggleInventoryFavorite,
  }
}
