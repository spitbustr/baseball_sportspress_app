<template>

  <div id="app">
    <div>
      <Modal type="loading" v-show="progressing || loading">
        <template v-slot:body>
          <div class="d-flex align-items-center gap-2">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div>{{progress.loading}}</div>
          </div>
        </template>
      </Modal>
      <div id="main-navigation" v-if="authenticated">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">LBAO/MRK</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <router-link class="nav-link" to="/games">Parties</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/teams">Équipes</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/players">Joueurs</router-link>
                </li>
              </ul>
              <span class="navbar-text d-flex align-items-center">
                <a class="nav-link" @click="openCast()"><span class="d-flex align-items-center fs-4 me-4"
                    v-html="$settings.icons.cast"></span></a>
                <router-link class="nav-link" to="/data"><span class="d-flex align-items-center fs-4 me-4"
                    v-html="$settings.icons.settings"></span></router-link>

                <button class="btn btn-outline-light" @click="logout">Déconnexion</button>
              </span>
            </div>

          </div>

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
  color: #2c3e50;
}

nav {
  padding: 1rem;

  a {
    font-weight: bold;
    margin: 0 10px;
    text-decoration: underline;
    cursor: pointer;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.navbar-brand {
  a {
    color: gray;
    text-decoration: none;
    &:active {
      color: gray;
    }
    &:hover {
      color: gray;
    }
    &.router-link-exact-active {
      color: gray;
    }
  }

}
.bi {
  width:1em;
  height:1em;

}
</style>
