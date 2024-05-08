<template>
  <div class="d-flex flex-row mb-3 flex-wrap">
    <template v-for="game in games" :key="game">
      <div class="col-3 p-4">
        <div class="card">
          <div>Game #{{ game.id }}</div>
          <div> {{ getTeamName(game.teams[0], "Away Team") }} vs {{ getTeamName(game.teams[1], "Home Team") }}</div>
          <div class="date-time">{{ getDateTime(game) }}</div>
          <router-link :to="`/game/${game.id}`" class="btn btn-primary">Éditer </router-link>
        </div>
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
      return moment(event.date).locale("fr").format("dddd DD MMM YYYY")
    },
    getTeamName(teamId, defaultName) {
      return this.$store.state.data.teams?.find(t => t?.id === teamId)?.title?.rendered ?? defaultName
    }
  }
}
</script>
<style lang="scss" scoped>
  .game {
    margin: 1rem auto;
    width: fit-content;
  }
  .date-time {
    text-transform: capitalize;
  }

</style>