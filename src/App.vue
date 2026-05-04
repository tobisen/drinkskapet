<script lang="ts">
import { defineComponent } from 'vue'

type LanguageCode = 'sv' | 'en'

const text = {
  sv: {
    title: 'Drinkskåpet',
    subtitle: 'Personlig assistent för hemmabaren',
    language: 'Språk',
    navLabel: 'Primär navigering',
    dashboard: 'Översikt',
    inventory: 'Min bar',
    drinks: 'Drinkar',
    favorites: 'Favoriter',
    discover: 'Upptäck',
    shoppingSuggestions: 'Shoppingförslag',
  },
  en: {
    title: 'Drinkskåpet',
    subtitle: 'Personal home bar companion',
    language: 'Language',
    navLabel: 'Primary navigation',
    dashboard: 'Dashboard',
    inventory: 'My Bar',
    drinks: 'Drinks',
    favorites: 'Favorites',
    discover: 'Discover',
    shoppingSuggestions: 'Shopping Suggestions',
  },
} as const

export default defineComponent({
  name: 'App',
  data() {
    return {
      appLanguage: {
        selected: 'sv' as LanguageCode,
      },
    }
  },
  provide() {
    return {
      appLanguage: this.appLanguage,
    }
  },
  computed: {
    t() {
      return text[this.appLanguage.selected]
    },
  },
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand-block">
        <h1>
          <RouterLink to="/" aria-label="Go to start page" class="brand-link">
            {{ t.title }}
          </RouterLink>
        </h1>
        <p>{{ t.subtitle }}</p>
      </div>

      <div class="header-controls">
        <div class="language-toggle" role="group" :aria-label="t.language">
          <button
            type="button"
            :class="{ 'is-active': appLanguage.selected === 'sv' }"
            :aria-pressed="appLanguage.selected === 'sv'"
            @click="appLanguage.selected = 'sv'"
          >
            SV
          </button>
          <button
            type="button"
            :class="{ 'is-active': appLanguage.selected === 'en' }"
            :aria-pressed="appLanguage.selected === 'en'"
            @click="appLanguage.selected = 'en'"
          >
            EN
          </button>
        </div>

        <nav class="app-nav" :aria-label="t.navLabel">
          <RouterLink to="/" exact-active-class="is-active">{{ t.dashboard }}</RouterLink>
          <RouterLink to="/inventory" exact-active-class="is-active">{{ t.inventory }}</RouterLink>
          <RouterLink to="/drinks" exact-active-class="is-active">{{ t.drinks }}</RouterLink>
          <RouterLink to="/favorites" exact-active-class="is-active">{{ t.favorites }}</RouterLink>
          <RouterLink to="/discover" exact-active-class="is-active">{{ t.discover }}</RouterLink>
          <RouterLink to="/shopping-suggestions" exact-active-class="is-active">{{ t.shoppingSuggestions }}</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
