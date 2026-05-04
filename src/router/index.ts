import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import InventoryView from '../views/InventoryView.vue'
import InventoryItemDetailView from '../views/InventoryItemDetailView.vue'
import DrinksView from '../views/DrinksView.vue'
import DrinkDetailView from '../views/DrinkDetailView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import ShoppingSuggestionsView from '../views/ShoppingSuggestionsView.vue'
import ImportView from '../views/ImportView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
    },
    {
      path: '/inventory/:id',
      name: 'inventory-item-detail',
      component: InventoryItemDetailView,
    },
    {
      path: '/drinks',
      name: 'drinks',
      component: DrinksView,
    },
    {
      path: '/drinks/:id',
      name: 'drink-detail',
      component: DrinkDetailView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
    },
    {
      path: '/discover',
      name: 'discover',
      component: DiscoverView,
    },
    {
      path: '/shopping-suggestions',
      name: 'shopping-suggestions',
      component: ShoppingSuggestionsView,
    },
    {
      path: '/import',
      name: 'import',
      component: ImportView,
    },
  ],
})

export default router
