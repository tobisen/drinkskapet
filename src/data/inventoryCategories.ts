import type { InventoryCategoryOption } from '../features/inventory/types'

export const inventoryCategories: InventoryCategoryOption[] = [
  { id: 'beer', label: 'Beer' },
  { id: 'wine', label: 'Wine', subCategories: ['Red', 'White', 'Rose'] },
  {
    id: 'sparkling-wine',
    label: 'Sparkling Wine',
    subCategories: ['Champagne', 'Prosecco', 'Cava'],
  },
  { id: 'cider', label: 'Cider' },
  { id: 'spirits', label: 'Spirits', subCategories: ['Gin', 'Vodka', 'Rum', 'Tequila', 'Whisky'] },
  {
    id: 'liqueurs',
    label: 'Liqueurs',
    subCategories: ['Triple Sec', 'Coffee Liqueur', 'Amaretto', 'Aperitif'],
  },
  { id: 'bitters', label: 'Bitters' },
  { id: 'vermouth', label: 'Vermouth', subCategories: ['Dry', 'Sweet'] },
  { id: 'mixers', label: 'Mixers', subCategories: ['Tonic Water', 'Soda Water', 'Cola', 'Ginger Beer'] },
  { id: 'juices', label: 'Juices', subCategories: ['Lime', 'Lemon', 'Orange', 'Cranberry', 'Pineapple'] },
  { id: 'syrups', label: 'Syrups', subCategories: ['Simple Syrup', 'Sugar Syrup', 'Grenadine'] },
  { id: 'garnishes', label: 'Garnishes', subCategories: ['Lime Wedge', 'Lemon Twist', 'Mint', 'Olive'] },
]
