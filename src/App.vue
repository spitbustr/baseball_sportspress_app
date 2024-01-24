<template>
  <div id="app">
    <nav>
      <router-link to="/games">Games</router-link>
      <router-link to="/teams">Teams</router-link>
      <router-link to="/players">Players</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 1rem;

  a {
    font-weight: bold;
    color: blue#2c3e50;
    margin: 0 10px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
