<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { seedDrinks } from '../data/seedDrinks'

const text = {
  sv: {
    backToInventory: 'Tillbaka till inventering',
    notFoundTitle: 'Produkt hittades inte',
    notFoundText: 'Den valda produkten finns inte i inventeringen.',
    brand: 'Varumärke',
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
  },
  en: {
    backToInventory: 'Back to Inventory',
    notFoundTitle: 'Item not found',
    notFoundText: 'The selected item does not exist in inventory.',
    brand: 'Brand',
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

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
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

.detail-card ul {
  margin: 0;
  padding-left: 1.1rem;
}

.detail-card a {
  color: #cbe6da;
  text-decoration: none;
}

.title-row button {
  font: inherit;
  border: 1px solid #cdd8d2;
  background: #fff;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
}
</style>
