<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { useDrinkFavorites } from '../features/drinks/useDrinkFavorites'
import { seedDrinks } from '../data/seedDrinks'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'
import type { DrinkWithMissingIngredients } from '../features/recommendations/types'

type DrinkStatusFilter = 'all' | 'canMakeNow' | 'missingOne' | 'missingMultiple'

const text = {
  sv: {
    title: 'Drinkförslag',
    intro: 'Översikt baserad på demo-inventering och seedade drinkar.',
    ingredients: 'Ingredienser',
    missingIngredients: 'Saknade ingredienser',
    favorite: 'Favorit',
    unfavorite: 'Ta bort favorit',
    filtersTitle: 'Filter',
    searchLabel: 'Sök',
    searchPlaceholder: 'Sök på drink, beskrivning eller ingrediens',
    statusLabel: 'Status',
    statusAll: 'Alla',
    statusCanMakeNow: 'Kan göra nu',
    statusMissingOne: 'Saknar en ingrediens',
    statusMissingMultiple: 'Saknar flera ingredienser',
    favoritesOnly: 'Endast favoriter',
    results: 'Träffar',
    emptyFiltered: 'Inga drinkar matchar dina filter.',
    statusPrefix: 'Status',
  },
  en: {
    title: 'Drink Suggestions',
    intro: 'Summary based on demo inventory and seed drinks.',
    ingredients: 'Ingredients',
    missingIngredients: 'Missing ingredients',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    filtersTitle: 'Filters',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by drink, description or ingredient',
    statusLabel: 'Status',
    statusAll: 'All',
    statusCanMakeNow: 'Can Make Now',
    statusMissingOne: 'Missing One Ingredient',
    statusMissingMultiple: 'Missing Multiple Ingredients',
    favoritesOnly: 'Favorites only',
    results: 'Results',
    emptyFiltered: 'No drinks match your filters.',
    statusPrefix: 'Status',
  },
} as const

type LanguageCode = keyof typeof text

interface FilteredDrinkItem {
  entry: DrinkWithMissingIngredients
  status: Exclude<DrinkStatusFilter, 'all'>
}

export default defineComponent({
  name: 'DrinksView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      drinkFavoritesStore: useDrinkFavorites(),
      drinks: seedDrinks,
      filters: {
        search: '',
        status: 'all' as DrinkStatusFilter,
        favoritesOnly: false,
      },
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
    recommendations() {
      return getDrinkRecommendations(this.inventoryItems, this.drinks)
    },
    allRecommendationItems(): FilteredDrinkItem[] {
      return [
        ...this.recommendations.canMakeNow.map((entry) => ({
          entry,
          status: 'canMakeNow' as const,
        })),
        ...this.recommendations.missingOneIngredient.map((entry) => ({
          entry,
          status: 'missingOne' as const,
        })),
        ...this.recommendations.missingMultipleIngredients.map((entry) => ({
          entry,
          status: 'missingMultiple' as const,
        })),
      ]
    },
    filteredDrinks(): FilteredDrinkItem[] {
      const searchTerm = this.filters.search.trim().toLowerCase()

      return this.allRecommendationItems.filter((item) => {
        if (this.filters.status !== 'all' && item.status !== this.filters.status) {
          return false
        }

        if (this.filters.favoritesOnly && !this.isFavorite(item.entry.drink.id)) {
          return false
        }

        if (!searchTerm) {
          return true
        }

        const drinkName = item.entry.drink.name.toLowerCase()
        const description = item.entry.drink.description.toLowerCase()
        const ingredients = item.entry.drink.ingredients
          .map((ingredient) => ingredient.name.toLowerCase())
          .join(' ')

        return (
          drinkName.includes(searchTerm) ||
          description.includes(searchTerm) ||
          ingredients.includes(searchTerm)
        )
      })
    },
  },
  methods: {
    toggleFavorite(drinkId: string) {
      this.drinkFavoritesStore.toggleDrinkFavorite(drinkId)
    },
    isFavorite(drinkId: string): boolean {
      return this.drinkFavoritesStore.isDrinkFavorite(drinkId)
    },
    formatIngredients(ingredients: Array<{ name: string; amount: string }>): string {
      return ingredients.map((ingredient) => `${ingredient.name} (${ingredient.amount})`).join(', ')
    },
    formatMissingIngredients(ingredients: Array<{ name: string }>): string {
      return ingredients.map((ingredient) => ingredient.name).join(', ')
    },
    getStatusLabel(status: Exclude<DrinkStatusFilter, 'all'>): string {
      if (status === 'canMakeNow') {
        return this.t.statusCanMakeNow
      }

      if (status === 'missingOne') {
        return this.t.statusMissingOne
      }

      return this.t.statusMissingMultiple
    },
  },
})
</script>

<template>
  <section class="view drinks-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <section class="filters-panel" :aria-label="t.filtersTitle">
      <label for="drink-search">{{ t.searchLabel }}</label>
      <input id="drink-search" v-model="filters.search" type="text" :placeholder="t.searchPlaceholder" />

      <label for="drink-status">{{ t.statusLabel }}</label>
      <select id="drink-status" v-model="filters.status">
        <option value="all">{{ t.statusAll }}</option>
        <option value="canMakeNow">{{ t.statusCanMakeNow }}</option>
        <option value="missingOne">{{ t.statusMissingOne }}</option>
        <option value="missingMultiple">{{ t.statusMissingMultiple }}</option>
      </select>

      <label class="favorites-toggle">
        <input v-model="filters.favoritesOnly" type="checkbox" />
        {{ t.favoritesOnly }}
      </label>

      <p class="results-count">{{ t.results }}: {{ filteredDrinks.length }}</p>
    </section>

    <section v-if="filteredDrinks.length > 0" class="group">
      <article v-for="item in filteredDrinks" :key="item.entry.drink.id" class="drink-card">
        <div class="title-row">
          <RouterLink class="drink-link" :to="`/drinks/${item.entry.drink.id}`">
            {{ item.entry.drink.name }}
          </RouterLink>
          <button type="button" @click="toggleFavorite(item.entry.drink.id)">
            {{ isFavorite(item.entry.drink.id) ? t.unfavorite : t.favorite }}
          </button>
        </div>

        <p class="status-row">{{ t.statusPrefix }}: {{ getStatusLabel(item.status) }}</p>
        <p>{{ item.entry.drink.description }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ formatIngredients(item.entry.drink.ingredients) }}</p>

        <p v-if="item.entry.missingIngredients.length > 0">
          <strong>{{ t.missingIngredients }}:</strong>
          {{ formatMissingIngredients(item.entry.missingIngredients) }}
        </p>
      </article>
    </section>

    <p v-else class="empty-state">{{ t.emptyFiltered }}</p>
  </section>
</template>

<style scoped>
.drinks-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.filters-panel {
  display: grid;
  gap: 0.5rem;
}

.filters-panel label,
.favorites-toggle {
  font-size: 0.9rem;
}

.filters-panel input,
.filters-panel select {
  font: inherit;
  padding: 0.55rem;
  border: 1px solid #cdd8d2;
  border-radius: 0.4rem;
}

.favorites-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.favorites-toggle input {
  width: 1rem;
  height: 1rem;
}

.results-count,
.empty-state,
.status-row {
  margin: 0;
  color: #5a6a60;
}

.group {
  display: grid;
  gap: 0.6rem;
}

.drink-card {
  border: 1px solid #d7e0db;
  border-radius: 0.5rem;
  padding: 0.7rem;
  display: grid;
  gap: 0.45rem;
}

.drink-card p {
  margin: 0;
  font-size: 0.95rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.title-row button {
  font: inherit;
  border: 1px solid #cdd8d2;
  background: #fff;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
}

.drink-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
</style>
