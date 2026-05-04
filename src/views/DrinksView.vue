<script lang="ts">
import { defineComponent } from 'vue'
import { demoInventory } from '../data/demoInventory'
import { seedDrinks } from '../data/seedDrinks'
import { getDrinkRecommendations } from '../features/recommendations/recommendationService'
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
    drinkNames: {
      'old-fashioned': 'Old Fashioned',
      'whiskey-sour': 'Whiskey Sour',
      'gin-tonic': 'Gin & Tonic',
    } as Record<string, string>,
    drinkDescriptions: {
      margarita: 'En frisk och citrusdriven tequilaklassiker.',
      daiquiri: 'En enkel rom sour med tydlig limebalans.',
      'old-fashioned': 'Whiskydriven klassiker med socker och bitters.',
      negroni: 'Klassisk bitter aperitif i lika delar.',
      martini: 'En ren och aromatisk klassiker med gin och vermouth.',
      'whiskey-sour': 'Balanserad sour med whiskey, citrus och sötma.',
      mojito: 'Fräsch highball med rom, mynta och lime.',
      'moscow-mule': 'Kryddig och syrlig vodka-highball.',
      'gin-tonic': 'Enkel longdrink med frisk beska.',
    } as Record<string, string>,
    ingredientNames: {
      Tequila: 'Tequila',
      'Triple Sec': 'Triple Sec',
      'Lime Juice': 'Limejuice',
      Salt: 'Salt',
      'White Rum': 'Vit rom',
      'Simple Syrup': 'Sockerlag',
      Bourbon: 'Bourbon',
      'Sugar Syrup': 'Sockerlag',
      'Angostura Bitters': 'Angostura bitters',
      'Orange Peel': 'Apelsinzest',
      Gin: 'Gin',
      Campari: 'Campari',
      'Sweet Vermouth': 'Söt vermouth',
      'Dry Vermouth': 'Torr vermouth',
      'Lemon Twist or Olive': 'Citronzest eller oliv',
      'Lemon Juice': 'Citronjuice',
      'Egg White': 'Äggvita',
      Mint: 'Mynta',
      'Soda Water': 'Sodavatten',
      Vodka: 'Vodka',
      'Ginger Beer': 'Ginger beer',
      'Tonic Water': 'Tonic water',
      'Lime Wedge': 'Limeklyfta',
    } as Record<string, string>,
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
    drinkNames: {},
    drinkDescriptions: {},
    ingredientNames: {},
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
    getDrinkName(drink: { id: string; name: string }): string {
      return (this.t.drinkNames as Record<string, string>)[drink.id] ?? drink.name
    },
    getDrinkDescription(drink: { id: string; description: string }): string {
      return (this.t.drinkDescriptions as Record<string, string>)[drink.id] ?? drink.description
    },
    getIngredientName(name: string): string {
      return (this.t.ingredientNames as Record<string, string>)[name] ?? name
    },
    formatIngredients(
      ingredients: Array<{ name: string; amount: string }>,
    ): string {
      return ingredients
        .map((ingredient) => `${this.getIngredientName(ingredient.name)} (${ingredient.amount})`)
        .join(', ')
    },
    formatMissingIngredients(
      ingredients: Array<{ name: string }>,
    ): string {
      return ingredients
        .map((ingredient) => this.getIngredientName(ingredient.name))
        .join(', ')
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
          <strong>{{ getDrinkName(entry.drink) }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ getDrinkDescription(entry.drink) }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ formatIngredients(entry.drink.ingredients) }}</p>
      </article>
    </section>

    <section class="group">
      <h3>{{ t.missingOne }} ({{ recommendations.missingOneIngredient.length }})</h3>
      <p v-if="recommendations.missingOneIngredient.length === 0">{{ t.noDrinks }}</p>
      <article v-for="entry in recommendations.missingOneIngredient" :key="entry.drink.id" class="drink-card">
        <div class="title-row">
          <strong>{{ getDrinkName(entry.drink) }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ getDrinkDescription(entry.drink) }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ formatIngredients(entry.drink.ingredients) }}</p>
        <p><strong>{{ t.missingIngredients }}:</strong> {{ formatMissingIngredients(entry.missingIngredients) }}</p>
      </article>
    </section>

    <section class="group">
      <h3>{{ t.missingMultiple }} ({{ recommendations.missingMultipleIngredients.length }})</h3>
      <p v-if="recommendations.missingMultipleIngredients.length === 0">{{ t.noDrinks }}</p>
      <article v-for="entry in recommendations.missingMultipleIngredients" :key="entry.drink.id" class="drink-card">
        <div class="title-row">
          <strong>{{ getDrinkName(entry.drink) }}</strong>
          <button type="button" @click="toggleFavorite(entry.drink.id)">
            {{ entry.drink.isFavorite ? t.unfavorite : t.favorite }}
          </button>
        </div>
        <p>{{ getDrinkDescription(entry.drink) }}</p>
        <p><strong>{{ t.ingredients }}:</strong> {{ formatIngredients(entry.drink.ingredients) }}</p>
        <p><strong>{{ t.missingIngredients }}:</strong> {{ formatMissingIngredients(entry.missingIngredients) }}</p>
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
