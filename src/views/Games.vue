<template>
  <div class="games-list">
    <template v-for="game in games" :key="game">
      <div class="game">
        <router-link :to="`/game/${game.id}`">
          <div>Game #{{ game.id }}</div>
          <div> {{ getTeamName(game.teams[0], "Away Team") }} vs {{ getTeamName(game.teams[1], "Home Team") }}</div>
        </router-link>
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
.games-list {
  text-align: center;
  width: 100%;

  .game {
    margin: 1rem auto;
  }
}
</style>