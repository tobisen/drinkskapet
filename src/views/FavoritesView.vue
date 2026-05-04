<script lang="ts">
import { defineComponent } from 'vue'

const text = {
  sv: {
    title: 'Favoriter',
    intro: 'Dina favoritdrinkar och favoritprodukter visas här.',
  },
  en: {
    title: 'Favorites',
    intro: 'Your favorite drinks and inventory items will appear here.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'FavoritesView',
  inject: ['appLanguage'],
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
  },
})
</script>

<template>
  <section class="view">
    <h2>{{ t.title }}</h2>
    <p>{{ t.intro }}</p>
  </section>
</template>
