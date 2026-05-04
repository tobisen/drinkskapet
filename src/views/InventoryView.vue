<script lang="ts">
import { defineComponent } from 'vue'
import { inventoryCategories } from '../data/inventoryCategories'
import type { InventoryCategory, InventoryItem } from '../features/inventory/types'

interface InventoryFormState {
  name: string
  category: InventoryCategory
  brand: string
}

export default defineComponent({
  name: 'InventoryView',
  data() {
    return {
      categories: inventoryCategories,
      items: [
        {
          id: 'demo-gin',
          name: 'Dry Gin',
          category: 'spirits',
          brand: 'Beefeater',
          quantity: 1,
          isFavorite: true,
        },
        {
          id: 'demo-vodka',
          name: 'Vodka',
          category: 'spirits',
          brand: 'Absolut',
          quantity: 1,
          isFavorite: false,
        },
        {
          id: 'demo-tonic',
          name: 'Tonic Water',
          category: 'mixers',
          quantity: 4,
          isFavorite: false,
        },
      ] as InventoryItem[],
      form: {
        name: '',
        category: 'spirits',
        brand: '',
      } as InventoryFormState,
    }
  },
  methods: {
    addItem() {
      const name = this.form.name.trim()
      const brand = this.form.brand.trim()

      if (!name) {
        return
      }

      this.items.unshift({
        id: `item-${Date.now()}`,
        name,
        category: this.form.category,
        brand: brand || undefined,
        quantity: 1,
        isFavorite: false,
      })

      this.form.name = ''
      this.form.brand = ''
      this.form.category = 'spirits'
    },
    toggleFavorite(itemId: string) {
      this.items = this.items.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        return {
          ...item,
          isFavorite: !item.isFavorite,
        }
      })
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
    <h2>My Bar / Inventory</h2>
    <p class="intro">Track what you have at home.</p>

    <form class="inventory-form" @submit.prevent="addItem">
      <label for="item-name">Name</label>
      <input id="item-name" v-model="form.name" type="text" required />

      <label for="item-category">Category</label>
      <select id="item-category" v-model="form.category">
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.label }}
        </option>
      </select>

      <label for="item-brand">Brand (optional)</label>
      <input id="item-brand" v-model="form.brand" type="text" />

      <button type="submit">Add Item</button>
    </form>

    <ul class="inventory-list">
      <li v-for="item in items" :key="item.id" class="inventory-item">
        <div>
          <strong>{{ item.name }}</strong>
          <p>
            {{ getCategoryLabel(item.category) }}
            <span v-if="item.brand">· {{ item.brand }}</span>
          </p>
        </div>
        <button type="button" class="favorite-button" @click="toggleFavorite(item.id)">
          {{ item.isFavorite ? 'Unfavorite' : 'Favorite' }}
        </button>
      </li>
    </ul>
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

.inventory-form {
  display: grid;
  gap: 0.5rem;
}

.inventory-form label {
  font-size: 0.9rem;
}

.inventory-form input,
.inventory-form select,
.inventory-form button {
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
