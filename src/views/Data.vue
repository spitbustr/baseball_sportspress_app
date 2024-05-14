<template>
  <div class="data-list">
    <div>
      <button @click="refreshGames()">Refresh <b>GAMES SCHEDULE</b></button>
    </div>
    <div>
      <button @click="refreshTeams()">Refresh <b>TEAMS</b></button>
    </div>
    <div>
      <button @click="refreshMedia()">Refresh <b>MEDIA</b></button>
    </div>
    <div>
      ------
    </div>
    <div>
      <button @click="refreshPlayers()">Refresh <b>PLAYERS</b></button>
    </div>
    <div>
      ------
    </div>
    <div>
      <button @click="clearDataBase()">CLEAR DATABASE FOR SEASON <b>{{ settings.playballConfig.season }}</b></button>
    </div>
  </div>
</template>
<script>
import $settings from "@/data/settings.json"
export default {
  computed: {
    settings() {
      return $settings
    },
  },
  methods: {
    async clearDataBase() {

    },
    async refreshGames() {
      await this.$store.dispatch("refreshCalendar")
      await this.$store.dispatch("refreshGames")
    },
    async refreshTeams() {
      await this.$store.dispatch("refreshTeams")
    },
    async refreshPlayers() {
      await this.$store.dispatch("refreshPlayers")
    },
    async refreshMedia() {
      await this.$store.dispatch("refreshMedia")
    },
  }
}
</script>
<style lang="scss" scoped>
.data-list {
  flex-direction: column;
  text-align: center;
  width: 100%;

  button {
    cursor: pointer;
    margin: 0.275rem 0;
    padding: 0.75rem 0.875rem;
  }
}
</style>