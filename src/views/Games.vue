<template>
  <div class="games-list">
    <template v-for="game in games" :key="game">
      <div class="game">
        <router-link :to="`/game/${game.id}`">
          <div>Game #{{ game.id }}</div>
          <div>{{ getTeamName(game.teams[0], "Away Team") }} vs {{ getTeamName(game.teams[1], "Home Team") }}</div>
          <div class="date-time">{{ getDateTime(game) }}</div>
        </router-link>
      </div>
    </template>
  </div>
</template>
<script>
import $games from "@/data/mock_games.json"
import $teams from "@/data/mock_teams.json"
import moment from "moment"
import {cloneDeep} from "lodash"

export default {
  computed: {
    games() {
      const list = cloneDeep(this.$store.state.data.games)
      moment.locale("fr")
      return list.sort((a,b) => {return new Date(a.date)-new Date(b.date)})
    },
  },
  methods: {
    getDateTime(event) {
      return moment(event.date).locale("fr").format("dddd DD MMM YYYY HH:mm")
    },
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
    width: fit-content;
  }
  .date-time {
    text-transform: capitalize;
  }
}
</style>