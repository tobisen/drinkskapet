<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>Drinkskåpet</h1>
      <p>Personal home bar companion</p>
    </header>

    <nav class="app-nav" aria-label="Primary">
      <RouterLink to="/" exact-active-class="is-active">Dashboard</RouterLink>
      <RouterLink to="/inventory" exact-active-class="is-active">My Bar</RouterLink>
      <RouterLink to="/drinks" exact-active-class="is-active">Drinks</RouterLink>
      <RouterLink to="/favorites" exact-active-class="is-active">Favorites</RouterLink>
      <RouterLink to="/discover" exact-active-class="is-active">Discover</RouterLink>
    </nav>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
