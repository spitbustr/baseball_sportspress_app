<template>
  <div class="d-flex flex-row mb-3 flex-wrap">
    <template v-for="game in games" :key="game">
      <div class="col-3 p-4">
        <div class="card">
          <div>Game #{{ game.id }}</div>
          <div> {{ getTeamName(game.teams[0], "Away Team") }} vs {{ getTeamName(game.teams[1], "Home Team") }}</div>
               <router-link :to="`/game/${game.id}`" class="btn btn-primary">Éditer </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import $games from "@/data/mock_games.json"
import $teams from "@/data/mock_teams.json"
export default {
  computed: {
    games() {
      return this.$store.state.data.games
    }
  },
  methods: {
    getTeamName(teamId, defaultName) {
      return this.$store.state.data.teams?.find(t => t?.id === teamId)?.title?.rendered ?? defaultName
    }
  }
}
</script>
<style lang="scss" scoped>

</style>