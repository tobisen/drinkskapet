<script lang="ts">
import { defineComponent } from 'vue'

type LanguageCode = 'sv' | 'en'

const text = {
  sv: {
    title: 'Drinkskåpet',
    subtitle: 'Personlig assistent för hemmabaren',
    language: 'Språk',
    languageSwedish: 'Svenska',
    languageEnglish: 'Engelska',
    navLabel: 'Primär navigering',
    dashboard: 'Översikt',
    inventory: 'Min bar',
    drinks: 'Drinkar',
    favorites: 'Favoriter',
    discover: 'Upptäck',
  },
  en: {
    title: 'Drinkskåpet',
    subtitle: 'Personal home bar companion',
    language: 'Language',
    languageSwedish: 'Swedish',
    languageEnglish: 'English',
    navLabel: 'Primary navigation',
    dashboard: 'Dashboard',
    inventory: 'My Bar',
    drinks: 'Drinks',
    favorites: 'Favorites',
    discover: 'Discover',
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
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
      <label class="language-picker" for="global-language">
        {{ t.language }}
        <select id="global-language" v-model="appLanguage.selected">
          <option value="sv">{{ t.languageSwedish }}</option>
          <option value="en">{{ t.languageEnglish }}</option>
        </select>
      </label>
    </header>

    <nav class="app-nav" :aria-label="t.navLabel">
      <RouterLink to="/" exact-active-class="is-active">{{ t.dashboard }}</RouterLink>
      <RouterLink to="/inventory" exact-active-class="is-active">{{ t.inventory }}</RouterLink>
      <RouterLink to="/drinks" exact-active-class="is-active">{{ t.drinks }}</RouterLink>
      <RouterLink to="/favorites" exact-active-class="is-active">{{ t.favorites }}</RouterLink>
      <RouterLink to="/discover" exact-active-class="is-active">{{ t.discover }}</RouterLink>
    </nav>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
