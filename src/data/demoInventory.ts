import type { InventoryItem } from '../features/inventory/types'

export const demoInventory: InventoryItem[] = [
  { id: 'inv-gin', name: 'Gin', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-vodka', name: 'Vodka', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-white-rum', name: 'White Rum', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-lime-juice', name: 'Lime Juice', category: 'juices', quantity: 1, isFavorite: false },
  { id: 'inv-simple-syrup', name: 'Simple Syrup', category: 'syrups', quantity: 1, isFavorite: false },
  { id: 'inv-tonic-water', name: 'Tonic Water', category: 'mixers', quantity: 1, isFavorite: false },
]
