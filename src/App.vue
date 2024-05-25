<template>

  <div id="app">
    <div>
      <Modal type="loading" v-show="progressing || loading">
        <template v-slot:body>
          {{progress.loading}}
        </template>
      </Modal>
      <div id="main-navigation" v-if="authenticated">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/games">Games</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/teams">Teams</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/players">Players</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/data">Data</router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="openCast()">CAST</a>
              </li>
            </ul>
            <button class="btn btn-primary" @click="logout">Bouton de Logout temporaire</button>

          </div>
        </nav>
      </div>
      <div class="container">
        <router-view />
      </div>
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
