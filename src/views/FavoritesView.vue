<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { seedDrinks } from '../data/seedDrinks'

const text = {
  sv: {
    title: 'Favoriter',
    intro: 'Översikt av favoriter från demo-data.',
    inventoryTitle: 'Favoritprodukter',
    drinksTitle: 'Favoritdrinkar',
    noInventoryFavorites: 'Inga favoritprodukter ännu.',
    noDrinkFavorites: 'Inga favoritdrinkar ännu.',
  },
  en: {
    title: 'Favorites',
    intro: 'Summary of favorites from demo data.',
    inventoryTitle: 'Favorite Inventory Items',
    drinksTitle: 'Favorite Drinks',
    noInventoryFavorites: 'No favorite inventory items yet.',
    noDrinkFavorites: 'No favorite drinks yet.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'FavoritesView',
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
    favoriteInventoryItems() {
      return this.inventoryItems.filter((item: { isFavorite: boolean }) => item.isFavorite)
    },
    favoriteDrinks() {
      return seedDrinks.filter((drink) => drink.isFavorite)
    },
  },
})
</script>

<template>
  <section class="view favorites-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

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
