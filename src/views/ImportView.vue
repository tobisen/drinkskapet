<script lang="ts">
import { defineComponent } from 'vue'

const text = {
  sv: {
    title: 'Import',
    intro: 'Klistra in en URL för framtida import av recept eller produkter.',
    urlLabel: 'URL',
    urlPlaceholder: 'https://...',
    submit: 'Importera URL',
    planned: 'URL-import är planerad men ännu inte implementerad.',
    plannedTypesTitle: 'Planerade importtyper',
    drinkRecipe: 'Drinkrecept-URL',
    product: 'Produkt-URL',
    foodRecipeLater: 'Matrecept-URL (senare)',
  },
  en: {
    title: 'Import',
    intro: 'Paste a URL for future recipe or product import.',
    urlLabel: 'URL',
    urlPlaceholder: 'https://...',
    submit: 'Import URL',
    planned: 'URL import is planned but not implemented yet.',
    plannedTypesTitle: 'Planned import types',
    drinkRecipe: 'Drink recipe URL',
    product: 'Product URL',
    foodRecipeLater: 'Food recipe URL (later)',
  },
} as const

type LanguageCode = keyof typeof text

export default defineComponent({
  name: 'ImportView',
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
  <section class="view import-view">
    <h2>{{ t.title }}</h2>
    <p>{{ t.intro }}</p>

    <form class="import-form" @submit.prevent>
      <label for="import-url">{{ t.urlLabel }}</label>
      <input id="import-url" type="url" :placeholder="t.urlPlaceholder" />
      <button type="submit" disabled>{{ t.submit }}</button>
    </form>

    <p class="planned-message">{{ t.planned }}</p>

    <div>
      <h3>{{ t.plannedTypesTitle }}</h3>
      <ul>
        <li>{{ t.drinkRecipe }}</li>
        <li>{{ t.product }}</li>
        <li>{{ t.foodRecipeLater }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.import-view {
  display: grid;
  gap: 0.75rem;
}

.import-form {
  display: grid;
  gap: 0.5rem;
}

.planned-message {
  margin: 0;
}
</style>
