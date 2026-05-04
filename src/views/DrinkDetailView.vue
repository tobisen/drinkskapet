<script lang="ts">
import { defineComponent } from 'vue'
import { seedDrinks } from '../data/seedDrinks'
import { useInventory } from '../features/inventory/useInventory'
import { useDrinkFavorites } from '../features/drinks/useDrinkFavorites'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'
import type { DrinkRecipe } from '../features/drinks/types'
import type { InventoryCategory } from '../features/inventory/types'

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
    addToInventory: 'Lägg till i inventering',
    addedToInventory: 'Tillagd i inventering.',
    alreadyInInventory: 'Finns redan i inventeringen.',
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
    addToInventory: 'Add to inventory',
    addedToInventory: 'Added to inventory.',
    alreadyInInventory: 'Already exists in inventory.',
  },
} as const

type LanguageCode = keyof typeof text

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function getDefaultCategoryForIngredient(name: string): InventoryCategory {
  const normalized = normalize(name)

  if (normalized.includes('rum') || normalized.includes('gin') || normalized.includes('vodka') || normalized.includes('whiskey') || normalized.includes('whisky') || normalized.includes('bourbon') || normalized.includes('tequila')) {
    return 'spirits'
  }

  if (normalized.includes('vermouth')) {
    return 'vermouth'
  }

  if (normalized.includes('bitters')) {
    return 'bitters'
  }

  if (normalized.includes('juice')) {
    return 'juices'
  }

  if (normalized.includes('syrup') || normalized.includes('sockerlag')) {
    return 'syrups'
  }

  if (normalized.includes('mint') || normalized.includes('olive') || normalized.includes('twist') || normalized.includes('peel') || normalized.includes('wedge')) {
    return 'garnishes'
  }

  return 'mixers'
}

export default defineComponent({
  name: 'DrinkDetailView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      drinkFavoritesStore: useDrinkFavorites(),
      ingredientFeedback: {} as Record<string, 'added' | 'exists'>,
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
    addMissingIngredientToInventory(ingredientName: string) {
      const normalizedIngredient = normalize(ingredientName)

      const exists = this.inventoryStore.inventoryItems.some(
        (item) => normalize(item.name) === normalizedIngredient,
      )

      if (exists) {
        this.ingredientFeedback = {
          ...this.ingredientFeedback,
          [ingredientName]: 'exists',
        }
        return
      }

      this.inventoryStore.addInventoryItem({
        name: ingredientName,
        category: getDefaultCategoryForIngredient(ingredientName),
      })

      this.ingredientFeedback = {
        ...this.ingredientFeedback,
        [ingredientName]: 'added',
      }
    },
    getIngredientFeedback(ingredientName: string): string {
      const status = this.ingredientFeedback[ingredientName]

      if (status === 'added') {
        return this.t.addedToInventory
      }

      if (status === 'exists') {
        return this.t.alreadyInInventory
      }

      return ''
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

      <div v-if="drinkRecommendationEntry && drinkRecommendationEntry.missingIngredients.length > 0">
        <h3>{{ t.missingIngredients }}</h3>
        <ul>
          <li v-for="missing in drinkRecommendationEntry.missingIngredients" :key="missing.name" class="missing-row">
            <span>{{ missing.name }}</span>
            <button type="button" @click="addMissingIngredientToInventory(missing.name)">
              {{ t.addToInventory }}
            </button>
            <span v-if="getIngredientFeedback(missing.name)" class="feedback-message">
              {{ getIngredientFeedback(missing.name) }}
            </span>
          </li>
        </ul>
      </div>

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

.title-row button,
.missing-row button {
  font: inherit;
  border: 1px solid #cdd8d2;
  background: #fff;
  border-radius: 0.35rem;
  padding: 0.35rem 0.55rem;
}

.missing-row {
  margin-bottom: 0.5rem;
}

.feedback-message {
  margin-left: 0.5rem;
  font-size: 0.88rem;
  color: #5a6a60;
}
</style>
