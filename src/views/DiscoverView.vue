<script lang="ts">
import { defineComponent } from 'vue'

const text = {
  sv: {
    title: 'Upptäck',
    intro: 'Nya drinkar och produkter att testa visas här.',
  },
  en: {
    title: 'Discover',
    intro: 'New drinks and products to try will appear here.',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'DiscoverView',
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
