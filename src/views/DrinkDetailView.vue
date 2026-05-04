<script lang="ts">
import { defineComponent } from 'vue'
import { seedDrinks } from '../data/seedDrinks'
import { useInventory } from '../features/inventory/useInventory'
import { useDrinkFavorites } from '../features/drinks/useDrinkFavorites'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'
import type { DrinkRecipe } from '../features/drinks/types'

const text = {
  sv: {
    backToDrinks: 'Tillbaka till drinkar',
    notFoundTitle: 'Drink hittades inte',
    notFoundText: 'Den valda drinken finns inte i seed-data.',
    ingredients: 'Ingredienser',
    missingIngredients: 'Saknade ingredienser',
    method: 'Gör så här',
    glass: 'Glas',
    tags: 'Taggar',
    status: 'Status',
    canMakeNow: 'Kan göra nu',
    missingOne: 'Saknar en ingrediens',
    missingMultiple: 'Saknar flera ingredienser',
    favorite: 'Favorit',
    unfavorite: 'Ta bort favorit',
  },
  en: {
    backToDrinks: 'Back to Drinks',
    notFoundTitle: 'Drink not found',
    notFoundText: 'The selected drink does not exist in seed data.',
    ingredients: 'Ingredients',
    missingIngredients: 'Missing ingredients',
    method: 'Method',
    glass: 'Glass',
    tags: 'Tags',
    status: 'Status',
    canMakeNow: 'Can Make Now',
    missingOne: 'Missing One Ingredient',
    missingMultiple: 'Missing Multiple Ingredients',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DrinkDetailView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      drinkFavoritesStore: useDrinkFavorites(),
    }
  },
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    drinkId(): string {
      return String(this.$route.params.id ?? '')
    },
    drink(): DrinkRecipe | undefined {
      return seedDrinks.find((item) => item.id === this.drinkId)
    },
    drinkRecommendationEntry() {
      if (!this.drink) {
        return null
      }

      const recommendations = getDrinkRecommendations(this.inventoryStore.inventoryItems, [this.drink])
      return (
        recommendations.canMakeNow[0] ??
        recommendations.missingOneIngredient[0] ??
        recommendations.missingMultipleIngredients[0] ??
        null
      )
    },
    drinkStatusLabel(): string {
      if (!this.drinkRecommendationEntry) {
        return '-'
      }

      const missingCount = this.drinkRecommendationEntry.missingIngredients.length

      if (missingCount === 0) {
        return this.t.canMakeNow
      }

      if (missingCount === 1) {
        return this.t.missingOne
      }

      return this.t.missingMultiple
    },
    methodSteps(): string[] {
      if (!this.drink?.method) {
        return []
      }

      return this.drink.method
        .split('.')
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    },
  },
  methods: {
    toggleFavorite() {
      if (!this.drink) {
        return
      }

      this.drinkFavoritesStore.toggleDrinkFavorite(this.drink.id)
    },
    isFavorite(drinkId: string): boolean {
      return this.drinkFavoritesStore.isDrinkFavorite(drinkId)
    },
  },
})
</script>

<template>
  <section class="view detail-view">
    <RouterLink class="back-link" to="/drinks">{{ t.backToDrinks }}</RouterLink>

    <div v-if="!drink" class="not-found">
      <h2>{{ t.notFoundTitle }}</h2>
      <p>{{ t.notFoundText }}</p>
    </div>

    <article v-else class="detail-card">
      <div class="title-row">
        <h2>{{ drink.name }}</h2>
        <button type="button" @click="toggleFavorite">
          {{ isFavorite(drink.id) ? t.unfavorite : t.favorite }}
        </button>
      </div>

      <p>{{ drink.description }}</p>
      <p><strong>{{ t.status }}:</strong> {{ drinkStatusLabel }}</p>

      <div>
        <h3>{{ t.ingredients }}</h3>
        <ul>
          <li v-for="ingredient in drink.ingredients" :key="ingredient.name">
            {{ ingredient.name }} ({{ ingredient.amount }})
          </li>
        </ul>
      </div>

      <p v-if="drinkRecommendationEntry && drinkRecommendationEntry.missingIngredients.length > 0">
        <strong>{{ t.missingIngredients }}:</strong>
        {{ drinkRecommendationEntry.missingIngredients.map((item) => item.name).join(', ') }}
      </p>

      <div>
        <h3>{{ t.method }}</h3>
        <ol v-if="methodSteps.length > 0">
          <li v-for="step in methodSteps" :key="step">{{ step }}</li>
        </ol>
        <p v-else>{{ drink.method }}</p>
      </div>

      <p v-if="drink.glass"><strong>{{ t.glass }}:</strong> {{ drink.glass }}</p>
      <p v-if="drink.tags.length > 0"><strong>{{ t.tags }}:</strong> {{ drink.tags.join(', ') }}</p>
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
  gap: 0.6rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.title-row h2,
.detail-card h3,
.not-found h2 {
  margin: 0;
}

.detail-card p,
.not-found p {
  margin: 0;
}

.detail-card ul,
.detail-card ol {
  margin: 0;
  padding-left: 1.1rem;
}

.title-row button {
  font: inherit;
  border: 1px solid #cdd8d2;
  background: #fff;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
}
</style>
