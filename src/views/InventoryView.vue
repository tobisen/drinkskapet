<script lang="ts">
import { defineComponent } from 'vue'
import { inventoryCategories } from '../data/inventoryCategories'
import { useInventory } from '../features/inventory/useInventory'
import type { InventoryCategory } from '../features/inventory/types'

interface InventoryFormState {
  name: string
  category: InventoryCategory | ''
  brand: string
}

interface InventoryFilters {
  search: string
  category: InventoryCategory | ''
  favoritesOnly: boolean
}

const text = {
  sv: {
    title: 'Min bar / Inventering',
    intro: 'Håll koll på vad du har hemma.',
    name: 'Namn',
    category: 'Kategori',
    brand: 'Varumärke (valfritt)',
    addItem: 'Lägg till',
    resetInventory: 'Återställ demo-inventering',
    resetInventoryAria: 'Återställ inventeringen till demo-data',
    validationNameRequired: 'Ange ett namn på produkten.',
    validationCategoryRequired: 'Välj en kategori.',
    validationDuplicate: 'Produkten finns redan med samma namn och varumärke.',
    filtersTitle: 'Filter',
    searchLabel: 'Sök',
    searchPlaceholder: 'Sök på namn eller varumärke',
    filterCategory: 'Filtrera kategori',
    allCategories: 'Alla kategorier',
    favoritesOnly: 'Endast favoriter',
    results: 'Träffar',
    emptyFiltered: 'Inga produkter matchar dina filter.',
    favorite: 'Favorit',
    unfavorite: 'Ta bort favorit',
  },
  en: {
    title: 'My Bar / Inventory',
    intro: 'Track what you have at home.',
    name: 'Name',
    category: 'Category',
    brand: 'Brand (optional)',
    addItem: 'Add Item',
    resetInventory: 'Reset Demo Inventory',
    resetInventoryAria: 'Reset inventory to demo data',
    validationNameRequired: 'Please enter an item name.',
    validationCategoryRequired: 'Please select a category.',
    validationDuplicate: 'An item with the same name and brand already exists.',
    filtersTitle: 'Filters',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name or brand',
    filterCategory: 'Filter category',
    allCategories: 'All categories',
    favoritesOnly: 'Favorites only',
    results: 'Results',
    emptyFiltered: 'No items match your filters.',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'InventoryView',
  inject: ['appLanguage'],
  data() {
    return {
      categories: inventoryCategories,
      inventoryStore: useInventory(),
      form: {
        name: '',
        category: '',
        brand: '',
      } as InventoryFormState,
      filters: {
        search: '',
        category: '',
        favoritesOnly: false,
      } as InventoryFilters,
      validationMessage: '',
    }
  },
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    items() {
      return this.inventoryStore.inventoryItems
    },
    filteredItems() {
      const searchTerm = this.filters.search.trim().toLowerCase()

      return this.items.filter((item) => {
        if (this.filters.category && item.category !== this.filters.category) {
          return false
        }

        if (this.filters.favoritesOnly && !item.isFavorite) {
          return false
        }

        if (!searchTerm) {
          return true
        }

        const name = item.name.toLowerCase()
        const brand = (item.brand ?? '').toLowerCase()

        return name.includes(searchTerm) || brand.includes(searchTerm)
      })
    },
  },
  methods: {
    clearValidationMessage() {
      this.validationMessage = ''
    },
    addItem() {
      const name = this.form.name.trim()
      const brand = this.form.brand.trim()
      const category = this.form.category

      if (!name) {
        this.validationMessage = this.t.validationNameRequired
        return
      }

      if (!category) {
        this.validationMessage = this.t.validationCategoryRequired
        return
      }

      const normalizedName = name.toLowerCase()
      const normalizedBrand = brand.toLowerCase()
      const hasDuplicate = this.items.some((item) => {
        const itemName = item.name.trim().toLowerCase()
        const itemBrand = (item.brand ?? '').trim().toLowerCase()
        return itemName === normalizedName && itemBrand === normalizedBrand
      })

      if (hasDuplicate) {
        this.validationMessage = this.t.validationDuplicate
        return
      }

      this.inventoryStore.addInventoryItem({
        name,
        category,
        brand,
      })

      this.validationMessage = ''
      this.form.name = ''
      this.form.brand = ''
      this.form.category = ''
    },
    resetInventory() {
      this.inventoryStore.resetInventory()
    },
    toggleFavorite(itemId: string) {
      this.inventoryStore.toggleInventoryFavorite(itemId)
    },
    getCategoryLabel(categoryId: InventoryCategory): string {
      return (
        this.categories.find((category) => category.id === categoryId)?.label ??
        categoryId
      )
    },
  },
})
</script>

<template>
  <section class="view inventory-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <form class="inventory-form" @submit.prevent="addItem">
      <label for="item-name">{{ t.name }}</label>
      <input id="item-name" v-model="form.name" type="text" required @input="clearValidationMessage" />

      <label for="item-category">{{ t.category }}</label>
      <select id="item-category" v-model="form.category" required @change="clearValidationMessage">
        <option disabled value="">-</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.label }}
        </option>
      </select>

      <label for="item-brand">{{ t.brand }}</label>
      <input id="item-brand" v-model="form.brand" type="text" @input="clearValidationMessage" />

      <button type="submit">{{ t.addItem }}</button>
      <button
        type="button"
        class="secondary-button"
        :aria-label="t.resetInventoryAria"
        @click="resetInventory"
      >
        {{ t.resetInventory }}
      </button>

      <p v-if="validationMessage" class="validation-message">{{ validationMessage }}</p>
    </form>

    <section class="filters-panel" :aria-label="t.filtersTitle">
      <label for="filter-search">{{ t.searchLabel }}</label>
      <input
        id="filter-search"
        v-model="filters.search"
        type="text"
        :placeholder="t.searchPlaceholder"
      />

      <label for="filter-category">{{ t.filterCategory }}</label>
      <select id="filter-category" v-model="filters.category">
        <option value="">{{ t.allCategories }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.label }}
        </option>
      </select>

      <label class="favorites-toggle">
        <input v-model="filters.favoritesOnly" type="checkbox" />
        {{ t.favoritesOnly }}
      </label>

      <p class="results-count">{{ t.results }}: {{ filteredItems.length }}</p>
    </section>

    <ul v-if="filteredItems.length > 0" class="inventory-list">
      <li v-for="item in filteredItems" :key="item.id" class="inventory-item">
        <div>
          <strong>{{ item.name }}</strong>
          <p>
            {{ getCategoryLabel(item.category) }}
            <span v-if="item.brand">· {{ item.brand }}</span>
          </p>
        </div>
        <button type="button" class="favorite-button" @click="toggleFavorite(item.id)">
          {{ item.isFavorite ? t.unfavorite : t.favorite }}
        </button>
      </li>
    </ul>

    <p v-else class="empty-state">{{ t.emptyFiltered }}</p>
  </section>
</template>

<style scoped>
.inventory-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.inventory-form,
.filters-panel {
  display: grid;
  gap: 0.5rem;
}

.inventory-form label,
.filters-panel label,
.favorites-toggle {
  font-size: 0.9rem;
}

.inventory-form input,
.inventory-form select,
.inventory-form button,
.secondary-button,
.filters-panel input,
.filters-panel select {
  font: inherit;
  padding: 0.55rem;
  border: 1px solid #cdd8d2;
  border-radius: 0.4rem;
}

.inventory-form button {
  background: #1e7a4e;
  color: #fff;
  border-color: #1e7a4e;
}

.secondary-button {
  background: #fff;
  color: #1f2a24;
}

.favorites-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.favorites-toggle input {
  width: 1rem;
  height: 1rem;
}

.results-count,
.empty-state {
  margin: 0;
  color: #5a6a60;
  font-size: 0.9rem;
}

.validation-message {
  margin: 0;
  font-size: 0.88rem;
  color: #9f2a2a;
}

.inventory-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}

.inventory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #d7e0db;
  border-radius: 0.5rem;
  padding: 0.7rem;
}

.inventory-item p {
  margin: 0.2rem 0 0;
  color: #5a6a60;
  font-size: 0.9rem;
}

.favorite-button {
  font: inherit;
  border: 1px solid #cdd8d2;
  background: #fff;
  border-radius: 0.4rem;
  padding: 0.45rem 0.6rem;
}
</style>
