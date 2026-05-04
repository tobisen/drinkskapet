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
    title: 'Shoppingförslag',
    intro: 'Förslag baserade på vilka köp som låser upp flest drinkar.',
    unlocks: 'Låser upp/förbättrar drinkar',
    relatedDrinks: 'Relaterade drinkar',
    noSuggestions: 'Inga shoppingförslag tillgängliga just nu.',
  },
  en: {
    title: 'Shopping Suggestions',
    intro: 'Suggestions based on purchases that unlock the most drinks.',
    unlocks: 'Unlocks/Improves drinks',
    relatedDrinks: 'Related drinks',
    noSuggestions: 'No shopping suggestions available right now.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'ShoppingSuggestionsView',
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
    suggestions() {
      return getSuggestedNextPurchases(this.recommendations)
    },
  },
  methods: {
    getRelatedDrinkNames(drinkIds: string[]): string[] {
      return drinkIds
        .map((id) => seedDrinks.find((drink) => drink.id === id)?.name)
        .filter((name): name is string => Boolean(name))
    },
  },
})
</script>

<template>
  <section class="view shopping-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <ul v-if="suggestions.length > 0" class="list">
      <li v-for="suggestion in suggestions" :key="suggestion.ingredientName" class="card">
        <strong>{{ suggestion.ingredientName }}</strong>
        <p>{{ t.unlocks }}: {{ suggestion.unlocksDrinkCount }}</p>
        <p>
          {{ t.relatedDrinks }}:
          {{ getRelatedDrinkNames(suggestion.unlocksDrinkIds).join(', ') || '-' }}
        </p>
      </li>
    </ul>

    <p v-else>{{ t.noSuggestions }}</p>
  </section>
</template>

<style scoped>
.shopping-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}

.card {
  border: 1px solid #d7e0db;
  border-radius: 0.5rem;
  padding: 0.7rem;
}

.card p {
  margin: 0.25rem 0 0;
  color: #5a6a60;
}
</style>
