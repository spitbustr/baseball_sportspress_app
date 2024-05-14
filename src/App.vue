<template>

  <div id="app">
    <div>
      <Modal type="loading" v-show="progressing || loading">
        <template v-slot:body>
          {{progress.loading}}
        </template>
      </Modal>
      <div id="main-navigation" v-if="authenticated">
        <div>
          <button @click="logout">Bouton de Logout temporaire</button>
        </div>
        <nav>
          <router-link to="/games">Games</router-link>
          <router-link to="/teams">Teams</router-link>
          <router-link to="/players">Players</router-link>
          <router-link to="/data">Data</router-link>
          <a @click="openCast()">CAST</a>
        </nav>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>

import $settings from "@/data/settings.json"
export default {
  computed: {
    authenticated() {
      return this.$store.state.user.loggedIn
    },
    progress() {
      return this.$store.state.data.progress
    },
    progressing() {
      return this.$store.state.data.progress.percentage < 100
    }
  },
  data() {
    return {
      broadcastChannel: null,
      loading: false,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem(`${$settings.playballConfig.id}_login`)
      this.$router.push("login")
    },
    openCast() {
      window.open("/cast","castWindow")
    }
  },
  mounted() {

  },
  watch: {
    progressing(val, old) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
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
