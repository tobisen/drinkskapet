<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { inventoryCategories } from '../data/inventoryCategories'
import { seedDrinks } from '../data/seedDrinks'
import type { InventoryCategory } from '../features/inventory/types'

interface EditFormState {
  name: string
  category: InventoryCategory | ''
  brand: string
  quantity: number
}

const text = {
  sv: {
    backToInventory: 'Tillbaka till inventering',
    notFoundTitle: 'Produkt hittades inte',
    notFoundText: 'Den valda produkten finns inte i inventeringen.',
    brand: 'Varumärke',
    name: 'Namn',
    category: 'Kategori',
    subCategory: 'Underkategori',
    volumeMl: 'Volym (ml)',
    alcoholPercentage: 'Alkoholhalt (%)',
    quantity: 'Antal',
    barcode: 'Streckkod',
    articleNumber: 'Artikelnummer',
    relatedDrinks: 'Relaterade drinkar',
    noRelatedDrinks: 'Inga relaterade drinkar hittades för denna produkt.',
    favorite: 'Favorit',
    unfavorite: 'Ta bort favorit',
    edit: 'Redigera',
    cancel: 'Avbryt',
    save: 'Spara',
    delete: 'Ta bort',
    deleteConfirm: 'Vill du ta bort den här produkten?',
    validationNameRequired: 'Ange ett namn.',
    validationCategoryRequired: 'Välj en kategori.',
  },
  en: {
    backToInventory: 'Back to Inventory',
    notFoundTitle: 'Item not found',
    notFoundText: 'The selected item does not exist in inventory.',
    brand: 'Brand',
    name: 'Name',
    category: 'Category',
    subCategory: 'Sub-category',
    volumeMl: 'Volume (ml)',
    alcoholPercentage: 'Alcohol (%)',
    quantity: 'Quantity',
    barcode: 'Barcode',
    articleNumber: 'Article number',
    relatedDrinks: 'Related drinks',
    noRelatedDrinks: 'No related drinks found for this item.',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    deleteConfirm: 'Do you want to delete this item?',
    validationNameRequired: 'Please enter a name.',
    validationCategoryRequired: 'Please select a category.',
  },
} as const

type LanguageCode = keyof typeof text

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export default defineComponent({
  name: 'InventoryItemDetailView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      categories: inventoryCategories,
      isEditing: false,
      validationMessage: '',
      editForm: {
        name: '',
        category: '',
        brand: '',
        quantity: 1,
      } as EditFormState,
    }
  },
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    itemId(): string {
      return String(this.$route.params.id ?? '')
    },
    inventoryItems() {
      return this.inventoryStore.inventoryItems
    },
    item() {
      return this.inventoryItems.find((entry) => entry.id === this.itemId)
    },
    relatedDrinks() {
      if (!this.item) {
        return []
      }

      const itemTerms = [this.item.name, this.item.subCategory ?? '', this.item.brand ?? '']
        .map(normalize)
        .filter((term) => term.length > 0)

      return seedDrinks.filter((drink) => {
        return drink.ingredients.some((ingredient) => {
          return ingredient.matchingTerms
            .map(normalize)
            .some((term) => itemTerms.includes(term))
        })
      })
    },
  },
  methods: {
    startEdit() {
      if (!this.item) {
        return
      }

      this.editForm.name = this.item.name
      this.editForm.category = this.item.category
      this.editForm.brand = this.item.brand ?? ''
      this.editForm.quantity = this.item.quantity
      this.validationMessage = ''
      this.isEditing = true
    },
    cancelEdit() {
      this.validationMessage = ''
      this.isEditing = false
    },
    saveEdit() {
      if (!this.item) {
        return
      }

      const name = this.editForm.name.trim()
      const brand = this.editForm.brand.trim()
      const category = this.editForm.category

      if (!name) {
        this.validationMessage = this.t.validationNameRequired
        return
      }

      if (!category) {
        this.validationMessage = this.t.validationCategoryRequired
        return
      }

      this.inventoryStore.updateInventoryItem({
        id: this.item.id,
        name,
        category,
        brand,
        quantity: Math.max(0, Number(this.editForm.quantity) || 0),
      })

      this.validationMessage = ''
      this.isEditing = false
    },
    confirmDelete() {
      if (!this.item) {
        return
      }

      if (!window.confirm(this.t.deleteConfirm)) {
        return
      }

      this.inventoryStore.deleteInventoryItem(this.item.id)
      this.$router.push('/inventory')
    },
    toggleFavorite() {
      if (!this.item) {
        return
      }

      this.inventoryStore.toggleInventoryFavorite(this.item.id)
    },
  },
})
</script>

<template>
  <section class="view detail-view">
    <RouterLink class="back-link" to="/inventory">{{ t.backToInventory }}</RouterLink>

    <div v-if="!item" class="not-found">
      <h2>{{ t.notFoundTitle }}</h2>
      <p>{{ t.notFoundText }}</p>
    </div>

    <article v-else class="detail-card">
      <div class="title-row">
        <h2>{{ item.name }}</h2>
        <button type="button" @click="toggleFavorite">
          {{ item.isFavorite ? t.unfavorite : t.favorite }}
        </button>
      </div>

      <div class="actions-row">
        <button v-if="!isEditing" type="button" @click="startEdit">{{ t.edit }}</button>
        <button v-if="isEditing" type="button" @click="saveEdit">{{ t.save }}</button>
        <button v-if="isEditing" type="button" @click="cancelEdit">{{ t.cancel }}</button>
        <button type="button" class="delete-button" @click="confirmDelete">{{ t.delete }}</button>
      </div>

      <form v-if="isEditing" class="edit-form" @submit.prevent="saveEdit">
        <label for="edit-name">{{ t.name }}</label>
        <input id="edit-name" v-model="editForm.name" type="text" required />

        <label for="edit-category">{{ t.category }}</label>
        <select id="edit-category" v-model="editForm.category" required>
          <option disabled value="">-</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.label }}
          </option>
        </select>

        <label for="edit-brand">{{ t.brand }}</label>
        <input id="edit-brand" v-model="editForm.brand" type="text" />

        <label for="edit-quantity">{{ t.quantity }}</label>
        <input id="edit-quantity" v-model.number="editForm.quantity" type="number" min="0" step="1" />

        <p v-if="validationMessage" class="validation-message">{{ validationMessage }}</p>
      </form>

      <template v-else>
        <p v-if="item.brand"><strong>{{ t.brand }}:</strong> {{ item.brand }}</p>
        <p><strong>{{ t.category }}:</strong> {{ item.category }}</p>
        <p v-if="item.subCategory"><strong>{{ t.subCategory }}:</strong> {{ item.subCategory }}</p>
        <p v-if="typeof item.volumeMl === 'number'"><strong>{{ t.volumeMl }}:</strong> {{ item.volumeMl }}</p>
        <p v-if="typeof item.alcoholPercentage === 'number'">
          <strong>{{ t.alcoholPercentage }}:</strong> {{ item.alcoholPercentage }}
        </p>
        <p v-if="typeof item.quantity === 'number'"><strong>{{ t.quantity }}:</strong> {{ item.quantity }}</p>
        <p v-if="item.barcode"><strong>{{ t.barcode }}:</strong> {{ item.barcode }}</p>
        <p v-if="item.articleNumber"><strong>{{ t.articleNumber }}:</strong> {{ item.articleNumber }}</p>
      </template>

      <div>
        <h3>{{ t.relatedDrinks }}</h3>
        <ul v-if="relatedDrinks.length > 0">
          <li v-for="drink in relatedDrinks" :key="drink.id">
            <RouterLink :to="`/drinks/${drink.id}`">{{ drink.name }}</RouterLink>
          </li>
        </ul>
        <p v-else>{{ t.noRelatedDrinks }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.detail-view {
  display: grid;
  gap: 1rem;
}

.back-link {
  color: #cbe6da;
  text-decoration: none;
  font-size: 0.92rem;
}

.not-found,
.detail-card {
  border: 1px solid #d7e0db;
  border-radius: 0.6rem;
  padding: 0.8rem;
  display: grid;
  gap: 0.55rem;
}

.title-row,
.actions-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.title-row h2,
.not-found h2,
.detail-card h3 {
  margin: 0;
}

.detail-card p,
.not-found p {
  margin: 0;
}

.edit-form {
  display: grid;
  gap: 0.45rem;
}

.edit-form input,
.edit-form select,
.actions-row button,
.title-row button {
  font: inherit;
  border: 1px solid #cdd8d2;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
  background: #fff;
}

.delete-button {
  border-color: #b44848;
  color: #7d1f1f;
}

.validation-message {
  margin: 0;
  color: #9f2a2a;
  font-size: 0.88rem;
}

.detail-card ul {
  margin: 0;
  padding-left: 1.1rem;
}

.detail-card a {
  color: #cbe6da;
  text-decoration: none;
}
</style>
