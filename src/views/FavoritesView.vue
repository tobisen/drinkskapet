<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { useDrinkFavorites } from '../features/drinks/useDrinkFavorites'
import { seedDrinks } from '../data/seedDrinks'

const text = {
  sv: {
    title: 'Favoriter',
    intro: 'Översikt av favoriter från demo-data.',
    inventoryTitle: 'Favoritprodukter',
    drinksTitle: 'Favoritdrinkar',
    resetDrinkFavorites: 'Återställ drinkfavoriter',
    resetDrinkFavoritesAria: 'Återställ favoritdrinkar till standardvärden',
    noInventoryFavorites: 'Inga favoritprodukter ännu.',
    noDrinkFavorites: 'Inga favoritdrinkar ännu.',
  },
  en: {
    title: 'Favorites',
    intro: 'Summary of favorites from demo data.',
    inventoryTitle: 'Favorite Inventory Items',
    drinksTitle: 'Favorite Drinks',
    resetDrinkFavorites: 'Reset Drink Favorites',
    resetDrinkFavoritesAria: 'Reset favorite drinks to default values',
    noInventoryFavorites: 'No favorite inventory items yet.',
    noDrinkFavorites: 'No favorite drinks yet.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'FavoritesView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      drinkFavoritesStore: useDrinkFavorites(),
    }
  },
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
    favoriteInventoryItems() {
      return this.inventoryItems.filter((item: { isFavorite: boolean }) => item.isFavorite)
    },
    favoriteDrinks() {
      return seedDrinks.filter((drink) => this.drinkFavoritesStore.isDrinkFavorite(drink.id))
    },
  },
  methods: {
    resetDrinkFavorites() {
      this.drinkFavoritesStore.resetDrinkFavorites()
    },
  },
})
</script>

<template>
  <section class="view favorites-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>
    <button
      type="button"
      class="secondary-button"
      :aria-label="t.resetDrinkFavoritesAria"
      @click="resetDrinkFavorites"
    >
      {{ t.resetDrinkFavorites }}
    </button>

    <section class="group">
      <h3>{{ t.inventoryTitle }} ({{ favoriteInventoryItems.length }})</h3>
      <ul v-if="favoriteInventoryItems.length > 0" class="list">
        <li v-for="item in favoriteInventoryItems" :key="item.id" class="card">
          <strong>{{ item.name }}</strong>
          <p>{{ item.category }}</p>
        </li>
      </ul>
      <p v-else>{{ t.noInventoryFavorites }}</p>
    </section>

    <section class="group">
      <h3>{{ t.drinksTitle }} ({{ favoriteDrinks.length }})</h3>
      <ul v-if="favoriteDrinks.length > 0" class="list">
        <li v-for="drink in favoriteDrinks" :key="drink.id" class="card">
          <strong>{{ drink.name }}</strong>
          <p>{{ drink.description }}</p>
        </li>
      </ul>
      <p v-else>{{ t.noDrinkFavorites }}</p>
    </section>
  </section>
</template>

<style scoped>
.favorites-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.secondary-button {
  font: inherit;
  padding: 0.55rem;
  border: 1px solid #cdd8d2;
  border-radius: 0.4rem;
  background: #fff;
  color: #1f2a24;
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

.card p {
  margin: 0.25rem 0 0;
  color: #5a6a60;
}
</style>
