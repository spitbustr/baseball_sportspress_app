<template>
  <div class="player-list">
    <h1>{{ this.player.title.rendered }} {{ this.player.number }}</h1>
    <pre>{{ this.player }}</pre>
  </div>
</template>
<script>
export default {
  data() {
    return {
      player: {}
    }
  },
  created() {
    const playerId = this.$route?.params?.playerId
    if (playerId) {
      this.player = this.$store.state.data.players.find(p => p.id == playerId)
    }
  }
}
</script>