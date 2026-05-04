<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import { seedDrinks } from '../data/seedDrinks'
import {
  getDrinkRecommendations,
  getSuggestedNextPurchases,
} from '../features/recommendations/recommendationService'
import { useShoppingList } from '../features/shopping/useShoppingList'

const text = {
  sv: {
    title: 'Shoppingförslag',
    intro: 'Förslag baserade på vilka köp som låser upp flest drinkar.',
    unlocks: 'Låser upp/förbättrar drinkar',
    relatedDrinks: 'Relaterade drinkar',
    noSuggestions: 'Inga shoppingförslag tillgängliga just nu.',
    shoppingListTitle: 'Inköpslista',
    shoppingListEmpty: 'Inköpslistan är tom.',
    addedFromDrink: 'Tillagd från',
    remove: 'Ta bort',
    clearChecked: 'Rensa markerade',
    category: 'Kategori',
    addToShoppingList: 'Lägg till i inköpslista',
    addedToShoppingList: 'Tillagd i inköpslistan.',
    alreadyInShoppingList: 'Finns redan i inköpslistan.',
    alreadyAddedState: 'Redan i inköpslistan',
    clearCheckedAria: 'Rensa markerade inköpslistorader',
  },
  en: {
    title: 'Shopping Suggestions',
    intro: 'Suggestions based on purchases that unlock the most drinks.',
    unlocks: 'Unlocks/Improves drinks',
    relatedDrinks: 'Related drinks',
    noSuggestions: 'No shopping suggestions available right now.',
    shoppingListTitle: 'Shopping list',
    shoppingListEmpty: 'Shopping list is empty.',
    addedFromDrink: 'Added from',
    remove: 'Remove',
    clearChecked: 'Clear checked',
    category: 'Category',
    addToShoppingList: 'Add to shopping list',
    addedToShoppingList: 'Added to shopping list.',
    alreadyInShoppingList: 'Already in shopping list.',
    alreadyAddedState: 'Already on shopping list',
    clearCheckedAria: 'Clear checked shopping list rows',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'ShoppingSuggestionsView',
  data() {
    return {
      inventoryStore: useInventory(),
      shoppingListStore: useShoppingList(),
      suggestionFeedback: {} as Record<string, 'added' | 'exists'>,
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
    shoppingListItems() {
      return this.shoppingListStore.shoppingListItems
    },
    hasCheckedShoppingListItems(): boolean {
      return this.shoppingListItems.some((item) => item.isChecked)
    },
  },
  methods: {
    normalize(value: string): string {
      return value.trim().toLowerCase()
    },
    getRelatedDrinkNames(drinkIds: string[]): string[] {
      return drinkIds
        .map((id) => seedDrinks.find((drink) => drink.id === id)?.name)
        .filter((name): name is string => Boolean(name))
    },
    isSuggestionInShoppingList(ingredientName: string): boolean {
      const normalizedName = this.normalize(ingredientName)

      return this.shoppingListItems.some(
        (item) => this.normalize(item.name) === normalizedName,
      )
    },
    addSuggestionToShoppingList(ingredientName: string) {
      const added = this.shoppingListStore.addShoppingListItem({
        name: ingredientName,
      })

      this.suggestionFeedback = {
        ...this.suggestionFeedback,
        [ingredientName]: added ? 'added' : 'exists',
      }
    },
    getSuggestionFeedback(ingredientName: string): string {
      const status = this.suggestionFeedback[ingredientName]

      if (status === 'added') {
        return this.t.addedToShoppingList
      }

      if (status === 'exists') {
        return this.t.alreadyInShoppingList
      }

      return ''
    },
    toggleShoppingListItem(itemId: string) {
      this.shoppingListStore.toggleShoppingListItem(itemId)
    },
    removeShoppingListItem(itemId: string) {
      this.shoppingListStore.removeShoppingListItem(itemId)
    },
    clearCheckedShoppingListItems() {
      this.shoppingListStore.clearCheckedShoppingListItems()
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
        <button
          v-if="!isSuggestionInShoppingList(suggestion.ingredientName)"
          type="button"
          @click="addSuggestionToShoppingList(suggestion.ingredientName)"
        >
          {{ t.addToShoppingList }}
        </button>
        <p v-else class="feedback-message" aria-live="polite">{{ t.alreadyAddedState }}</p>
        <p
          v-if="getSuggestionFeedback(suggestion.ingredientName)"
          class="feedback-message"
          aria-live="polite"
        >
          {{ getSuggestionFeedback(suggestion.ingredientName) }}
        </p>
      </li>
    </ul>

    <p v-else>{{ t.noSuggestions }}</p>

    <section class="shopping-list-section">
      <div class="shopping-list-header">
        <h3>{{ t.shoppingListTitle }}</h3>
        <button
          type="button"
          :aria-label="t.clearCheckedAria"
          :disabled="!hasCheckedShoppingListItems"
          @click="clearCheckedShoppingListItems"
        >
          {{ t.clearChecked }}
        </button>
      </div>

      <ul v-if="shoppingListItems.length > 0" class="list">
        <li v-for="item in shoppingListItems" :key="item.id" class="card">
          <label class="shopping-item-row">
            <input
              :checked="item.isChecked"
              type="checkbox"
              @change="toggleShoppingListItem(item.id)"
            />
            <span :class="{ checked: item.isChecked }">{{ item.name }}</span>
          </label>
          <p v-if="item.category">{{ t.category }}: {{ item.category }}</p>
          <p v-if="item.sourceDrinkName">{{ t.addedFromDrink }}: {{ item.sourceDrinkName }}</p>
          <button type="button" @click="removeShoppingListItem(item.id)">{{ t.remove }}</button>
        </li>
      </ul>

      <p v-else>{{ t.shoppingListEmpty }}</p>
    </section>
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

.shopping-list-section {
  display: grid;
  gap: 0.6rem;
}

.shopping-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.shopping-list-header h3 {
  margin: 0;
}

.shopping-item-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checked {
  text-decoration: line-through;
  opacity: 0.75;
}

.feedback-message {
  margin-top: 0.4rem;
  font-size: 0.9rem;
}
</style>
