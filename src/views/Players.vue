<template>
  <div class="players-list">
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
}
</style>