<script lang="ts">
import { defineComponent } from 'vue'
import { useInventory } from '../features/inventory/useInventory'
import type { InventoryItem } from '../features/inventory/types'

const text = {
  sv: {
    title: 'Vin',
    intro: 'Översikt av vin i din inventering.',
    favoritesTitle: 'Favoritviner',
    allWinesTitle: 'Alla viner',
    noWines: 'Inga vinprodukter hittades i inventeringen.',
    noFavorites: 'Inga favoritviner ännu.',
    foodPairingTitle: 'Matmatchning (kommer senare)',
    foodPairingText:
      'Här kommer förslag på vilka rätter som passar dina viner.',
    brand: 'Varumärke',
    subCategory: 'Typ',
    volumeMl: 'Volym',
    alcoholPercentage: 'Alkohol',
    favorite: 'Favorit',
    notFavorite: 'Inte favorit',
    redWine: 'Rött vin',
    whiteWine: 'Vitt vin',
    rose: 'Rosé',
    sparklingWine: 'Mousserande vin',
    dessertWine: 'Dessertvin',
    fortifiedWine: 'Fortifierat vin',
    otherWine: 'Övrigt vin',
  },
  en: {
    title: 'Wine',
    intro: 'Overview of wines in your inventory.',
    favoritesTitle: 'Favorite wines',
    allWinesTitle: 'All wines',
    noWines: 'No wine items found in inventory.',
    noFavorites: 'No favorite wines yet.',
    foodPairingTitle: 'Food pairing (coming later)',
    foodPairingText:
      'This section will suggest food pairings for your wines.',
    brand: 'Brand',
    subCategory: 'Type',
    volumeMl: 'Volume',
    alcoholPercentage: 'Alcohol',
    favorite: 'Favorite',
    notFavorite: 'Not favorite',
    redWine: 'Red wine',
    whiteWine: 'White wine',
    rose: 'Rosé',
    sparklingWine: 'Sparkling wine',
    dessertWine: 'Dessert wine',
    fortifiedWine: 'Fortified wine',
    otherWine: 'Other wine',
  },
} as const

type LanguageCode = keyof typeof text
type WineGroupKey =
  | 'red wine'
  | 'white wine'
  | 'rosé'
  | 'sparkling wine'
  | 'dessert wine'
  | 'fortified wine'
  | 'other wine'

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function toWineGroup(item: InventoryItem): WineGroupKey {
  if (item.category === 'sparkling-wine') {
    return 'sparkling wine'
  }

  const subCategory = normalize(item.subCategory ?? '')

  if (subCategory.includes('red')) {
    return 'red wine'
  }

  if (subCategory.includes('white')) {
    return 'white wine'
  }

  if (subCategory.includes('rosé') || subCategory.includes('rose')) {
    return 'rosé'
  }

  if (subCategory.includes('sparkling') || subCategory.includes('mousserande')) {
    return 'sparkling wine'
  }

  if (subCategory.includes('dessert') || subCategory.includes('söt')) {
    return 'dessert wine'
  }

  if (subCategory.includes('fortified')) {
    return 'fortified wine'
  }

  return 'other wine'
}

export default defineComponent({
  name: 'WineView',
  inject: ['appLanguage'],
  data() {
    return {
      inventoryStore: useInventory(),
      groupOrder: [
        'red wine',
        'white wine',
        'rosé',
        'sparkling wine',
        'dessert wine',
        'fortified wine',
        'other wine',
      ] as WineGroupKey[],
    }
  },
  computed: {
    t() {
      const selected =
        ((this.appLanguage as { selected: LanguageCode } | undefined)?.selected ??
          'sv') as LanguageCode
      return text[selected]
    },
    wineItems(): InventoryItem[] {
      return this.inventoryStore.inventoryItems.filter(
        (item) => item.category === 'wine' || item.category === 'sparkling-wine',
      )
    },
    favoriteWines(): InventoryItem[] {
      return this.wineItems.filter((item) => item.isFavorite)
    },
    groupedWines(): Array<{ key: WineGroupKey; label: string; items: InventoryItem[] }> {
      return this.groupOrder.map((groupKey) => ({
        key: groupKey,
        label: this.getGroupLabel(groupKey),
        items: this.wineItems.filter((item) => toWineGroup(item) === groupKey),
      }))
    },
  },
  methods: {
    getGroupLabel(group: WineGroupKey): string {
      if (group === 'red wine') {
        return this.t.redWine
      }

      if (group === 'white wine') {
        return this.t.whiteWine
      }

      if (group === 'rosé') {
        return this.t.rose
      }

      if (group === 'sparkling wine') {
        return this.t.sparklingWine
      }

      if (group === 'dessert wine') {
        return this.t.dessertWine
      }

      if (group === 'fortified wine') {
        return this.t.fortifiedWine
      }

      return this.t.otherWine
    },
  },
})
</script>

<template>
  <section class="view wine-view">
    <h2>{{ t.title }}</h2>
    <p class="intro">{{ t.intro }}</p>

    <p v-if="wineItems.length === 0" class="empty-state">{{ t.noWines }}</p>

    <template v-else>
      <section class="group">
        <h3>{{ t.favoritesTitle }} ({{ favoriteWines.length }})</h3>
        <ul v-if="favoriteWines.length > 0" class="list">
          <li v-for="item in favoriteWines" :key="item.id" class="card">
            <RouterLink class="item-link" :to="`/inventory/${item.id}`">{{ item.name }}</RouterLink>
            <p v-if="item.brand">{{ t.brand }}: {{ item.brand }}</p>
            <p v-if="item.subCategory">{{ t.subCategory }}: {{ item.subCategory }}</p>
            <p v-if="typeof item.volumeMl === 'number'">{{ t.volumeMl }}: {{ item.volumeMl }} ml</p>
            <p v-if="typeof item.alcoholPercentage === 'number'">
              {{ t.alcoholPercentage }}: {{ item.alcoholPercentage }}%
            </p>
            <p>{{ t.favorite }}</p>
          </li>
        </ul>
        <p v-else>{{ t.noFavorites }}</p>
      </section>

      <section class="group">
        <h3>{{ t.allWinesTitle }}</h3>
        <div class="group-list">
          <section v-for="group in groupedWines" :key="group.key" class="group">
            <h4>{{ group.label }} ({{ group.items.length }})</h4>
            <ul v-if="group.items.length > 0" class="list">
              <li v-for="item in group.items" :key="item.id" class="card">
                <RouterLink class="item-link" :to="`/inventory/${item.id}`">{{ item.name }}</RouterLink>
                <p v-if="item.brand">{{ t.brand }}: {{ item.brand }}</p>
                <p v-if="item.subCategory">{{ t.subCategory }}: {{ item.subCategory }}</p>
                <p v-if="typeof item.volumeMl === 'number'">{{ t.volumeMl }}: {{ item.volumeMl }} ml</p>
                <p v-if="typeof item.alcoholPercentage === 'number'">
                  {{ t.alcoholPercentage }}: {{ item.alcoholPercentage }}%
                </p>
                <p>{{ item.isFavorite ? t.favorite : t.notFavorite }}</p>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </template>

    <section class="group">
      <h3>{{ t.foodPairingTitle }}</h3>
      <p>{{ t.foodPairingText }}</p>
    </section>
  </section>
</template>

<style scoped>
.wine-view {
  display: grid;
  gap: 1rem;
}

.intro {
  margin: 0;
}

.group-list,
.group {
  display: grid;
  gap: 0.6rem;
}

.group h3,
.group h4 {
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

.card p,
.empty-state {
  margin: 0.25rem 0 0;
  color: #5a6a60;
}

.item-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
</style>
