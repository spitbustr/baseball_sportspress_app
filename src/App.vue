<template>
  <div id="app">
    <div>
      <nav id="main-navigation">
        <router-link to="/games">Games</router-link>
        <router-link to="/teams">Teams</router-link>
        <router-link to="/players">Players</router-link>
        <a @click="openCast()">CAST</a>
      </nav>
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      broadcastChannel: null,
    }
  },
  methods: {
    openCast() {
      window.open("/cast","castWindow")
    }
  },
  mounted() {

  }
}
</script>
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
    color: blue;
    margin: 0 10px;
    text-decoration: underline;
    cursor: pointer;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
