<script lang="ts">
import { defineComponent } from 'vue'
import { seedDrinks } from '../data/seedDrinks'
import {
  getDrinkRecommendations,
  getSuggestedNextPurchases,
} from '../features/recommendations/recommendationService'
import type { InventoryItem } from '../features/inventory/types'

const demoInventory: InventoryItem[] = [
  { id: 'inv-gin', name: 'Gin', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-vodka', name: 'Vodka', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-white-rum', name: 'White Rum', category: 'spirits', quantity: 1, isFavorite: false },
  { id: 'inv-lime-juice', name: 'Lime Juice', category: 'juices', quantity: 1, isFavorite: false },
  { id: 'inv-simple-syrup', name: 'Simple Syrup', category: 'syrups', quantity: 1, isFavorite: false },
  { id: 'inv-tonic-water', name: 'Tonic Water', category: 'mixers', quantity: 1, isFavorite: false },
]

const text = {
  sv: {
    title: 'Översikt',
    intro: 'Snabb sammanfattning baserad på demo-innehåll och seedade drinkar.',
    canMakeNow: 'Kan göra nu',
    missingOne: 'Saknar en ingrediens',
    nextPurchases: 'Topp nästa köp',
    unlocks: 'låser upp',
  },
  en: {
    title: 'Dashboard',
    intro: 'Quick summary based on demo inventory and seed drinks.',
    canMakeNow: 'Can Make Now',
    missingOne: 'Missing One Ingredient',
    nextPurchases: 'Top Next Purchases',
    unlocks: 'unlocks',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DashboardView',
  inject: ['appLanguage'],
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    recommendations() {
      return getDrinkRecommendations(demoInventory, seedDrinks)
    },
    topPurchases() {
      return getSuggestedNextPurchases(this.recommendations).slice(0, 3)
    },
  },
})
</script>

<template>
  <section class="view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <div class="summary-grid">
      <article class="summary-card">
        <h3>{{ t.canMakeNow }} ({{ recommendations.canMakeNow.length }})</h3>
        <ul>
          <li v-for="entry in recommendations.canMakeNow.slice(0, 4)" :key="entry.drink.id">
            {{ entry.drink.name }}
          </li>
        </ul>
      </article>

      <article class="summary-card">
        <h3>{{ t.missingOne }} ({{ recommendations.missingOneIngredient.length }})</h3>
        <ul>
          <li v-for="entry in recommendations.missingOneIngredient.slice(0, 4)" :key="entry.drink.id">
            {{ entry.drink.name }}: {{ entry.missingIngredients[0].name }}
          </li>
        </ul>
      </article>

      <article class="summary-card">
        <h3>{{ t.nextPurchases }}</h3>
        <ul>
          <li v-for="purchase in topPurchases" :key="purchase.ingredientName">
            {{ purchase.ingredientName }} ({{ t.unlocks }} {{ purchase.unlocksDrinkCount }})
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.intro {
  margin: 0.25rem 0 1rem;
}

.summary-grid {
  display: grid;
  gap: 0.75rem;
}

.summary-card {
  border: 1px solid #d7e0db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: #fff;
}

.summary-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.summary-card ul {
  margin: 0;
  padding-left: 1rem;
}

.summary-card li {
  margin: 0.25rem 0;
}
</style>
