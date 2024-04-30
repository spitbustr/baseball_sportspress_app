<template>
  <div class="data-list">
    <div>
      <button @click="refreshGames()">Refresh <b>GAMES SCHEDULE</b></button>
    </div>
    <div>
      <button @click="refreshTeams()">Refresh <b>TEAMS</b></button>
    </div>
    <div>
      <button @click="refreshGames()">Refresh <b>PLAYERS</b></button>
    </div>
  </div>
</template>
<script>
export default {
  computed: {

  },
  methods: {
    async refreshGames() {
      await this.$store.dispatch("refreshCalendar")
      await this.$store.dispatch("refreshGames")
    },
    async refreshTeams() {
      await this.$store.dispatch("refreshTeams")
    },
    async refreshPlayers() {
      await this.$store.dispatch("refreshPlayers")
    }
  }
}
</script>
<style lang="scss" scoped>
.data-list {
  flex-direction: column;
  text-align: center;
  width: 100%;

  button {
    padding: 0.75rem 0.875rem;
    margin: 0.275rem 0;
  }
}
</style>