<template>
  <div class="players-list">
    <div>
      <button @click="addPlayer()"><b>ADD PLAYER</b></button>
    </div>
    <template v-for="player in players" :key="player.id">
      <div class="player">
        <router-link :to="`/players/${player.id}`">
          <div>{{ player.id }} <span v-html="player.title.rendered"></span></div>
        </router-link>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  computed: {
    players() {
      return this.$store.state.data.players
    }
  },
  methods: {
    addPlayer() {
      
    }
  }
}
</script>
<style lang="scss" scoped>
.players-list {
  text-align: center;
  width: 100%;

  .player {
    margin: 0rem auto;
    width: fit-content;
  }

  button {
    cursor: pointer;
    margin: 0.125rem 0 1rem;
    padding: 0.25rem 1rem;
  }
}
</style>