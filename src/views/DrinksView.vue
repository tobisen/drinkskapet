<script lang="ts">
import { defineComponent } from 'vue'
import { seedDrinks } from '../data/seedDrinks'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'
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
    title: 'Drinkförslag',
    intro: 'Översikt baserad på demo-inventering och seedade drinkar.',
    canMakeNow: 'Kan göra nu',
    missingOne: 'Saknar en ingrediens',
    missingMultiple: 'Saknar flera ingredienser',
    ingredients: 'Ingredienser',
    missingIngredients: 'Saknade ingredienser',
    favorite: 'Favorit',
    unfavorite: 'Ta bort favorit',
    noDrinks: 'Inga drinkar i den här gruppen ännu.',
  },
  en: {
    title: 'Drink Suggestions',
    intro: 'Summary based on demo inventory and seed drinks.',
    canMakeNow: 'Can Make Now',
    missingOne: 'Missing One Ingredient',
    missingMultiple: 'Missing Multiple Ingredients',
    ingredients: 'Ingredients',
    missingIngredients: 'Missing ingredients',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    noDrinks: 'No drinks in this group yet.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DrinksView',
  inject: ['appLanguage'],
  data() {
    return {
      drinks: seedDrinks.map((drink) => ({ ...drink })),
    }
  },
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    recommendations() {
      return getDrinkRecommendations(demoInventory, this.drinks)
    },
  },
  methods: {
    toggleFavorite(drinkId: string) {
      this.drinks = this.drinks.map((drink) => {
        if (drink.id !== drinkId) {
          return drink
        }

        return {
          ...drink,
          isFavorite: !drink.isFavorite,
        }
      })
    },
  },
})
</script>

<template>
  <section class="view drinks-view">
    <h2>{{ t.title }}</h2>

    <p class="intro">{{ t.intro }}</p>

    <section class="group">
      <h3>{{ t.canMakeNow }} ({{ recommendations.canMakeNow.length }})</h3>
      <p v-if="recommendations.canMakeNow.length === 0">{{ t.noDrinks }}</p>
      <article v-for="entry in recommendations.canMakeNow" :key="entry.drink.id" class="drink-card">
        <div class="title-row">
          <strong>{{ entry.drink.name }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ entry.drink.description }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ entry.drink.ingredients.map((i) => `${i.name} (${i.amount})`).join(', ') }}</p>
      </article>
    </section>

    <section class="group">
      <h3>{{ t.missingOne }} ({{ recommendations.missingOneIngredient.length }})</h3>
      <p v-if="recommendations.missingOneIngredient.length === 0">{{ t.noDrinks }}</p>
      <article v-for="entry in recommendations.missingOneIngredient" :key="entry.drink.id" class="drink-card">
        <div class="title-row">
          <strong>{{ entry.drink.name }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ entry.drink.description }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ entry.drink.ingredients.map((i) => `${i.name} (${i.amount})`).join(', ') }}</p>
        <p><strong>{{ t.missingIngredients }}:</strong> {{ entry.missingIngredients.map((i) => i.name).join(', ') }}</p>
      </article>
    </section>

    <section class="group">
      <h3>{{ t.missingMultiple }} ({{ recommendations.missingMultipleIngredients.length }})</h3>
      <p v-if="recommendations.missingMultipleIngredients.length === 0">{{ t.noDrinks }}</p>
      <article v-for="entry in recommendations.missingMultipleIngredients" :key="entry.drink.id" class="drink-card">
        <div class="title-row">
          <strong>{{ entry.drink.name }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ entry.drink.description }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ entry.drink.ingredients.map((i) => `${i.name} (${i.amount})`).join(', ') }}</p>
        <p><strong>{{ t.missingIngredients }}:</strong> {{ entry.missingIngredients.map((i) => i.name).join(', ') }}</p>
      </article>
    </section>
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

.group {
  display: grid;
  gap: 0.6rem;
}

.group h3 {
  margin: 0;
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
</style>
