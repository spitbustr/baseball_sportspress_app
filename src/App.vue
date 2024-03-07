<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-12">
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
