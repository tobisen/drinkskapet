export const INVENTORY_CATEGORIES = [
  'beer',
  'wine',
  'sparkling-wine',
  'cider',
  'spirits',
  'liqueurs',
  'bitters',
  'vermouth',
  'mixers',
  'juices',
  'syrups',
  'garnishes',
] as const

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number]

export interface InventoryCategoryOption {
  id: InventoryCategory
  label: string
  subCategories?: string[]
}

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  subCategory?: string
  brand?: string
  barcode?: string
  articleNumber?: string
  volumeMl?: number
  alcoholPercentage?: number
  quantity: number
  isFavorite: boolean
}
