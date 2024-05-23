<template>
  <div class="row">
    <div class="col-sm-12">
      <table class="table table-striped table-hover text-start">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Away Team</th>
            <th>Home Team</th>
            <th>Date and Time</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          <template v-for="game in games" :key="game">
            <tr>
              <td>{{ game.id }}</td>
              <td>{{ getTeamName(game.teams[0], "Away Team") }}</td>
              <td>{{ getTeamName(game.teams[1], "Home Team") }}</td>
              <td>{{ getDateTime(game) }}</td>
              <td>
                <div class="d-grid gap-1">

                  <router-link :to="`/game/${game.id}`" class="btn btn-primary btn-block">
                    Éditer
                  </router-link>
                  </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

    </div>
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
