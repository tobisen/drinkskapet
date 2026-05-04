import { ref } from 'vue'
import { demoInventory } from '../../data/demoInventory'
import type { InventoryCategory, InventoryItem } from './types'

interface AddInventoryItemInput {
  name: string
  category: InventoryCategory
  brand?: string
}

interface UpdateInventoryItemInput {
  id: string
  name: string
  category: InventoryCategory
  brand?: string
  quantity: number
}

const INVENTORY_STORAGE_KEY = 'drinkskapet.inventory.v1'

function cloneDemoInventory(): InventoryItem[] {
  return demoInventory.map((item) => ({ ...item }))
}

function isValidInventoryItem(value: unknown): value is InventoryItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as Partial<InventoryItem>

  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.category === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.isFavorite === 'boolean'
  )
}

function readInventoryFromStorage(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY)

    if (!raw) {
      return cloneDemoInventory()
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed) || !parsed.every(isValidInventoryItem)) {
      return cloneDemoInventory()
    }

    return parsed
  } catch {
    return cloneDemoInventory()
  }
}

function writeInventoryToStorage(items: InventoryItem[]): void {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage write errors for now.
  }
}

const inventoryItems = ref<InventoryItem[]>(readInventoryFromStorage())

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

  writeInventoryToStorage(inventoryItems.value)
}

function updateInventoryItem(input: UpdateInventoryItemInput): void {
  const name = input.name.trim()

  if (!name) {
    return
  }

  const brand = input.brand?.trim()

  inventoryItems.value = inventoryItems.value.map((item) => {
    if (item.id !== input.id) {
      return item
    }

    return {
      ...item,
      name,
      category: input.category,
      brand: brand || undefined,
      quantity: Number.isFinite(input.quantity) ? Math.max(0, input.quantity) : item.quantity,
    }
  })

  writeInventoryToStorage(inventoryItems.value)
}

function deleteInventoryItem(itemId: string): void {
  inventoryItems.value = inventoryItems.value.filter((item) => item.id !== itemId)
  writeInventoryToStorage(inventoryItems.value)
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

  writeInventoryToStorage(inventoryItems.value)
}

function resetInventory(): void {
  inventoryItems.value = cloneDemoInventory()
  writeInventoryToStorage(inventoryItems.value)
}

export function useInventory() {
  return {
    inventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    toggleInventoryFavorite,
    resetInventory,
  }
}
