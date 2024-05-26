<template>
  <div class="player-list">
    <button @click="openConfirmation" :disabled="loading">DELETE PLAYER</button>
    <h1>{{ this.player.title.rendered }} {{ this.player.number }}</h1>
    <pre>{{ this.player }}</pre>
    <Confirmation :show="showConfirmation" :action="`Delete ${player?.title?.rendered || 'the player'}`" @closeModal="closeModal"></Confirmation>
  </div>
</template>
<script>
import SportspressAPIService from '@/services/SportspressAPIService'
export default {
  data() {
    return {
      player: {},
      showConfirmation: false,
      loading: false,
    }
  },
  created() {
    const playerId = this.$route?.params?.playerId
    if (playerId) {
      this.player = this.$store.state.data.players.find(p => p.id == playerId)
    }
  },
  methods: {
    closeModal(result) {
      if(result) {
        this.deletePlayer(this.player.id)
      }
      this.showConfirmation = false
    },
    openConfirmation() {
      this.showConfirmation = true
    },
    async deletePlayer(playerId) {
      this.loading = true
      await SportspressAPIService.deletePlayer(playerId, this.$store)
        .then(result => {
          this.$router.push("/players")
        })
        .finally(() => {
          this.loading = false
        })
    },
  }
}
</script>