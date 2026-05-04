<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { inventoryCategories } from '../data/inventoryCategories'
import { seedDrinks } from '../data/seedDrinks'
import type { InventoryCategory } from '../features/inventory/types'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'

interface EditFormState {
  name: string
  category: InventoryCategory | ''
  subCategory: string
  brand: string
  quantity: number
  volumeMl: string
  alcoholPercentage: string
  barcode: string
  articleNumber: string
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
    relatedCanMakeNow: 'Kan göra nu med denna produkt',
    relatedMissingOne: 'Nära match, saknar en ingrediens',
    relatedOther: 'Andra recept med denna produkt',
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
    validationVolumeInvalid: 'Volym måste vara ett tal större än 0.',
    validationAlcoholInvalid: 'Alkoholhalt måste vara ett tal mellan 0 och 100.',
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
    relatedCanMakeNow: 'Can make now with this item',
    relatedMissingOne: 'Close matches, missing one ingredient',
    relatedOther: 'Other recipes using this item',
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
    validationVolumeInvalid: 'Volume must be a number greater than 0.',
    validationAlcoholInvalid: 'Alcohol must be a number between 0 and 100.',
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
        subCategory: '',
        brand: '',
        quantity: 1,
        volumeMl: '',
        alcoholPercentage: '',
        barcode: '',
        articleNumber: '',
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
    relatedRecommendations() {
      if (this.relatedDrinks.length === 0) {
        return {
          canMakeNow: [],
          missingOneIngredient: [],
          missingMultipleIngredients: [],
        }
      }

      return getDrinkRecommendations(this.inventoryItems, this.relatedDrinks)
    },
    relatedCanMakeNow() {
      return this.relatedRecommendations.canMakeNow
    },
    relatedMissingOne() {
      return this.relatedRecommendations.missingOneIngredient
    },
    relatedOtherRecipes() {
      return this.relatedRecommendations.missingMultipleIngredients
    },
  },
  methods: {
    startEdit() {
      if (!this.item) {
        return
      }

      this.editForm.name = this.item.name
      this.editForm.category = this.item.category
      this.editForm.subCategory = this.item.subCategory ?? ''
      this.editForm.brand = this.item.brand ?? ''
      this.editForm.quantity = this.item.quantity
      this.editForm.volumeMl = typeof this.item.volumeMl === 'number' ? String(this.item.volumeMl) : ''
      this.editForm.alcoholPercentage =
        typeof this.item.alcoholPercentage === 'number' ? String(this.item.alcoholPercentage) : ''
      this.editForm.barcode = this.item.barcode ?? ''
      this.editForm.articleNumber = this.item.articleNumber ?? ''
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
      const subCategory = this.editForm.subCategory.trim()
      const brand = this.editForm.brand.trim()
      const barcode = this.editForm.barcode.trim()
      const articleNumber = this.editForm.articleNumber.trim()
      const category = this.editForm.category
      const volumeRaw = this.editForm.volumeMl.trim()
      const alcoholRaw = this.editForm.alcoholPercentage.trim()

      if (!name) {
        this.validationMessage = this.t.validationNameRequired
        return
      }

      if (!category) {
        this.validationMessage = this.t.validationCategoryRequired
        return
      }

      let volumeMl: number | undefined
      if (volumeRaw) {
        const parsedVolume = Number(volumeRaw)
        if (!Number.isFinite(parsedVolume) || parsedVolume <= 0) {
          this.validationMessage = this.t.validationVolumeInvalid
          return
        }
        volumeMl = parsedVolume
      }

      let alcoholPercentage: number | undefined
      if (alcoholRaw) {
        const parsedAlcohol = Number(alcoholRaw)
        if (!Number.isFinite(parsedAlcohol) || parsedAlcohol < 0 || parsedAlcohol > 100) {
          this.validationMessage = this.t.validationAlcoholInvalid
          return
        }
        alcoholPercentage = parsedAlcohol
      }

      this.inventoryStore.updateInventoryItem({
        id: this.item.id,
        name,
        category,
        subCategory,
        brand,
        quantity: Math.max(0, Number(this.editForm.quantity) || 0),
        volumeMl,
        alcoholPercentage,
        barcode,
        articleNumber,
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

        <label for="edit-subcategory">{{ t.subCategory }}</label>
        <input id="edit-subcategory" v-model="editForm.subCategory" type="text" />

        <label for="edit-volume">{{ t.volumeMl }}</label>
        <input id="edit-volume" v-model="editForm.volumeMl" type="text" inputmode="decimal" />

        <label for="edit-alcohol">{{ t.alcoholPercentage }}</label>
        <input id="edit-alcohol" v-model="editForm.alcoholPercentage" type="text" inputmode="decimal" />

        <label for="edit-barcode">{{ t.barcode }}</label>
        <input id="edit-barcode" v-model="editForm.barcode" type="text" />

        <label for="edit-article-number">{{ t.articleNumber }}</label>
        <input id="edit-article-number" v-model="editForm.articleNumber" type="text" />

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
        <template v-if="relatedDrinks.length > 0">
          <p><strong>{{ t.relatedCanMakeNow }}</strong></p>
          <ul v-if="relatedCanMakeNow.length > 0">
            <li v-for="entry in relatedCanMakeNow" :key="entry.drink.id">
              <RouterLink :to="`/drinks/${entry.drink.id}`">{{ entry.drink.name }}</RouterLink>
            </li>
          </ul>

          <p><strong>{{ t.relatedMissingOne }}</strong></p>
          <ul v-if="relatedMissingOne.length > 0">
            <li v-for="entry in relatedMissingOne" :key="entry.drink.id">
              <RouterLink :to="`/drinks/${entry.drink.id}`">{{ entry.drink.name }}</RouterLink>
            </li>
          </ul>

          <p><strong>{{ t.relatedOther }}</strong></p>
          <ul v-if="relatedOtherRecipes.length > 0">
            <li v-for="entry in relatedOtherRecipes" :key="entry.drink.id">
              <RouterLink :to="`/drinks/${entry.drink.id}`">{{ entry.drink.name }}</RouterLink>
            </li>
          </ul>
        </template>
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
