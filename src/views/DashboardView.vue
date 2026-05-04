<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { seedDrinks } from '../data/seedDrinks'
import {
  getDrinkRecommendations,
  getSuggestedNextPurchases,
} from '../features/recommendations/recommendationService'
const text = {
  sv: {
    title: 'Översikt',
    intro: 'Snabb sammanfattning baserad på demo-innehåll och seedade drinkar.',
    canMakeNow: 'Kan göra nu',
    missingOne: 'Saknar en ingrediens',
    nextPurchases: 'Topp nästa köp',
    unlocks: 'låser upp',
    noItems: 'Inget att visa ännu.',
  },
  en: {
    title: 'Dashboard',
    intro: 'Quick summary based on demo inventory and seed drinks.',
    canMakeNow: 'Can Make Now',
    missingOne: 'Missing One Ingredient',
    nextPurchases: 'Top Next Purchases',
    unlocks: 'unlocks',
    noItems: 'Nothing to show yet.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DashboardView',
  data() {
    return {
      inventoryStore: useInventory(),
    }
  },
  inject: ['appLanguage'],
  computed: {
    inventoryItems() {
      return this.inventoryStore.inventoryItems
    },
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    recommendations() {
      return getDrinkRecommendations(this.inventoryItems, seedDrinks)
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
        <ul v-if="recommendations.canMakeNow.length > 0">
          <li v-for="entry in recommendations.canMakeNow.slice(0, 4)" :key="entry.drink.id">
            {{ entry.drink.name }}
          </li>
        </ul>
        <p v-else>{{ t.noItems }}</p>
      </article>

      <article class="summary-card">
        <h3>{{ t.missingOne }} ({{ recommendations.missingOneIngredient.length }})</h3>
        <ul v-if="recommendations.missingOneIngredient.length > 0">
          <li v-for="entry in recommendations.missingOneIngredient.slice(0, 4)" :key="entry.drink.id">
            {{ entry.drink.name }}: {{ entry.missingIngredients[0].name }}
          </li>
        </ul>
        <p v-else>{{ t.noItems }}</p>
      </article>

      <article class="summary-card">
        <h3>{{ t.nextPurchases }}</h3>
        <ul v-if="topPurchases.length > 0">
          <li v-for="purchase in topPurchases" :key="purchase.ingredientName">
            {{ purchase.ingredientName }} ({{ t.unlocks }} {{ purchase.unlocksDrinkCount }})
          </li>
        </ul>
        <p v-else>{{ t.noItems }}</p>
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
  border: 1px solid rgba(222, 237, 245, 0.24);
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: rgba(8, 10, 13, 0.55);
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
