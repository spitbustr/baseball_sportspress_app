<template>
  <div id="app">
    <div class="container" id="main-navigation" v-if="authenticated">
      <div class="row">
        <div class="col-12">
          <button class="hamburger-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#mainNavigation" aria-controls="mainNavigation">
            <span class="hamburger-icon"></span>
          </button>
          <div class="offcanvas offcanvas-start" tabindex="-1" id="mainNavigation" aria-labelledby="mainNavigationLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="mainNavigationLabel">Main Navigation</h5>
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul id="main-navigation" class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <router-link to="/games" class="nav-link active">Games</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/teams" class="nav-link">Teams</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/players" class="nav-link">Players</router-link>
                </li>
                <li class="nav-item">
                  <a @click="openCast()" class="nav-link">CAST</a>
                </li>
              </ul>
              <div>
                <button @click="logout">Bouton de Logout temporaire</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
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
    }
  },
  data() {
    return {
      broadcastChannel: null,
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

  }
}
</script>
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.hamburger-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  background-color: transparent;
  border: 1px solid black;
  padding: 5px;
  width: 50px;
  height: 50px;
  border-radius: 10%;
  cursor: pointer;
}

.hamburger-icon {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #2c3e50;
  position: relative;
  transition: background-color 0.3s ease;
  margin: auto;
  /* Center the lines horizontally */
}

.hamburger-icon:before,
.hamburger-icon:after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background-color: #2c3e50;
  transition: background-color 0.3s ease;
  left: 0;
  /* Center the lines horizontally */
  right: 0;
  /* Center the lines horizontally */
  margin: auto;
  /* Center the lines vertically */
}

/* Rest of the styles... */



.hamburger-icon:before {
  top: -6px;
  left: 0;
  right: 0;
  margin: auto;
}

.hamburger-icon:after {
  top: 6px;
  left: 0;
  right: 0;
  margin: auto;
}

.hamburger-btn:hover .hamburger-icon,
.hamburger-btn:focus .hamburger-icon {
  background-color: #000;
}

.hamburger-btn:hover .hamburger-icon:before,
.hamburger-btn:focus .hamburger-icon:before,
.hamburger-btn:hover .hamburger-icon:after,
.hamburger-btn:focus .hamburger-icon:after {
  background-color: #000;
}

.hamburger-btn:hover {
  background-color: lightgray;
}
</style>
