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
    title: 'Upptäck',
    intro: 'Utforska nya möjligheter baserat på demo-inventering.',
    easyDrinks: 'Lätta drinkar att testa',
    closeDrinks: 'Drinkar nära din inventering',
    exploreNext: 'Ingredienser eller kategorier att utforska',
    missing: 'Saknar',
    unlocks: 'Låser upp',
    inventoryCategories: 'Kategorier du redan har',
    noItems: 'Inget att visa ännu.',
  },
  en: {
    title: 'Discover',
    intro: 'Explore new options based on demo inventory.',
    easyDrinks: 'Easy Drinks To Try',
    closeDrinks: 'Drinks Close To Your Inventory',
    exploreNext: 'Ingredients or Categories To Explore Next',
    missing: 'Missing',
    unlocks: 'Unlocks',
    inventoryCategories: 'Categories you already have',
    noItems: 'Nothing to show yet.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DiscoverView',
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
    easyDrinks() {
      return this.recommendations.canMakeNow.slice(0, 4)
    },
    closeDrinks() {
      return this.recommendations.missingOneIngredient.slice(0, 4)
    },
    nextPurchases() {
      return getSuggestedNextPurchases(this.recommendations).slice(0, 4)
    },
    currentCategories() {
      return Array.from(new Set(this.inventoryItems.map((item: { category: string }) => item.category))).sort()
    },
  },
})
</script>

<template>
  <section class="view discover-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <section class="group">
      <h3>{{ t.easyDrinks }} ({{ easyDrinks.length }})</h3>
      <ul v-if="easyDrinks.length > 0" class="list">
        <li v-for="entry in easyDrinks" :key="entry.drink.id" class="card">
          <strong>{{ entry.drink.name }}</strong>
          <p>{{ entry.drink.description }}</p>
        </li>
      </ul>
      <p v-else>{{ t.noItems }}</p>
    </section>

    <section class="group">
      <h3>{{ t.closeDrinks }} ({{ closeDrinks.length }})</h3>
      <ul v-if="closeDrinks.length > 0" class="list">
        <li v-for="entry in closeDrinks" :key="entry.drink.id" class="card">
          <strong>{{ entry.drink.name }}</strong>
          <p>{{ t.missing }}: {{ entry.missingIngredients[0].name }}</p>
        </li>
      </ul>
      <p v-else>{{ t.noItems }}</p>
    </section>

    <section class="group">
      <h3>{{ t.exploreNext }}</h3>
      <ul v-if="nextPurchases.length > 0" class="list">
        <li v-for="item in nextPurchases" :key="item.ingredientName" class="card">
          <strong>{{ item.ingredientName }}</strong>
          <p>{{ t.unlocks }}: {{ item.unlocksDrinkCount }}</p>
        </li>
      </ul>
      <p v-else>{{ t.noItems }}</p>
      <p class="categories">{{ t.inventoryCategories }}: {{ currentCategories.join(', ') }}</p>
    </section>
  </section>
</template>

<style scoped>
.discover-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.group {
  display: grid;
  gap: 0.6rem;
}

.group h3 {
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

.card p,
.categories {
  margin: 0.25rem 0 0;
  color: #5a6a60;
}
</style>
