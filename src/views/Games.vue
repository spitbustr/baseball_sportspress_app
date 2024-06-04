<template>
  <div class="container-fluid">
    <div class="row py-4">
      <div class="col-md-6">
        <div class="btn-group" role="group" aria-label="Game Filter">
          <button type="button" class="btn btn-outline-secondary" @click="changeFilter('past')">PAST GAMES</button>
          <button type="button" class="btn btn-outline-secondary" @click="changeFilter('today')">TODAY'S GAMES</button>
          <button type="button" class="btn btn-outline-secondary" @click="changeFilter('upcoming')">UPCOMING GAMES</button>
        </div>
      </div>
      <div class="col-md-6 text-md-end">
      <div class="btn-group" role="group" aria-label="Week Filter">
        <button type="button" class="btn btn-outline-secondary" @click="changeFilter('week',-1)">LAST WEEK'S GAMES</button>
        <button type="button" class="btn btn-outline-secondary" @click="changeFilter('week',0)">THIS WEEK'S GAMES</button>
        <button type="button" class="btn btn-outline-secondary" @click="changeFilter('week',1)">NEXT WEEK'S GAMES</button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12">
      <table class="table table-striped table-hover text-star align-middle">
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
          <template v-for="(game,index) in filteredGames" :key="game">
            <tr :class="{'today-game': isToday(game), 'day-change':dayHasChanged(index)}">
              <td>{{ game.id }}</td>
              <td>
                <div class="team-display away">
                  <div>
                    <img class="team-logo away" :src="media[getTeamLogo(game.teams[0])] || defaultImage">
                    <span :class="{'winning-team': hasWon(game,'away')}">{{ getTeamName(game.teams[0], "Away Team") }}</span>
                  </div>
                  <div>
                    <span :class="{'winning-team': hasWon(game,'away')}" v-if="game?.main_results?.[0]">{{game.main_results[0]}}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="team-display away">
                  <div>
                    <img class="team-logo away" :src="media[getTeamLogo(game.teams[1])] || defaultImage">
                    <span :class="{'winning-team': hasWon(game,'home')}">{{ getTeamName(game.teams[1], "Home Team") }}</span>
                  </div>
                  <div>
                    <span :class="{'winning-team': hasWon(game,'home')}" v-if="game?.main_results?.[1]">{{game.main_results[1]}}</span>
                  </div>
                </div>
              </td>
              <td class="date-time">{{ getDateTime(game) }}</td>
              <td>
                <div class="d-grid gap-1">

                  <router-link :to="`/game/${game.id}`" class="btn btn-primary btn-block btn-sm">
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
  </div>
</template>
<script>
import $games from "@/data/mock_games.json"
import $teams from "@/data/mock_teams.json"
import moment from "moment"
import {cloneDeep} from "lodash"

export default {
  computed: {
    defaultImage() {
      return require(`@/assets/images/defaults/team_home.png`)
    },

    filteredGames() {
      if(this.gameFilter?.type === "today") {
        return this.todayGames
      }
      else if(this.gameFilter?.type === "upcoming") {
        return this.games.filter(g => this.isUpcoming(g))
      }
      else if(this.gameFilter?.type === "past") {
        return this.games.filter(g => this.isPast(g))
      }
      else if(this.gameFilter?.type === "week") {
        return this.gamesbyWeek(this.gameFilter.week)
      }
      return this.games
    },
    games() {
      const list = cloneDeep(this.$store.state.data.games)
      moment.locale("fr")
      return list.sort((a,b) => {return new Date(a.date)-new Date(b.date)})
    },
    media() {
      return this.$store.state.data.media
    },
    todayGames() {
      return this.games.filter(g => this.isToday(g))
    },
  },
  data() {
    return {
      dayChange: {
        currentDay: null,
      },
      gameFilter: null,
    }
  },
  methods: {
    changeFilter(id,week) {
      this.gameFilter = {
        type: id,
        week: week,
      }
    },
    dayHasChanged(index) {
      if (index === 0) return false
      const currentGameDate = moment(this.filteredGames?.[index]?.date)
      const previousGameDate = moment(this.filteredGames?.[index+1]?.date || null)
      return !currentGameDate.isSame(previousGameDate, "day")
    },
    gamesbyWeek(week) {
      // Add 1 to start the week on Sunday
      const today = moment().add(1, 'days')
      // Start of this week (Sunday)
      const startOfWeek = today.add(week, 'weeks').startOf('week').day(0)
      // End of this week (Saturday)
      const endOfWeek = moment(startOfWeek).day(6)

      return this.games.filter(game => {
        const gameDate = moment(game.date)
        return gameDate.isSameOrAfter(startOfWeek) && gameDate.isSameOrBefore(endOfWeek)
      })

    },
    getDateTime(event) {
      return moment(event.date).locale("fr").format("dddd DD MMM YYYY HH:mm")
    },
    getTeamData(teamId) {
      return this.$store.state.data.teams?.find(t => t?.id === teamId)
    },
    getTeamLogo(teamId) {
      return this.getTeamData(teamId).featured_media
    },
    getTeamName(teamId, defaultName) {
      return this.getTeamData(teamId)?.title?.rendered ?? defaultName
    },
    hasWon(game, team) {
      let winner = ""
      if(+game?.main_results[0] > +game?.main_results[1]) {
        winner = "away"
      }
      if(+game?.main_results[0] < +game?.main_results[1]) {
        winner = "home"
      }
      return winner === team
    },
    isPast(game) {
      const today = moment()
      const date = game.date
      return moment(date).isBefore(today, 'day')
    },

    isToday(game) {
      const today = moment()
      const date = game.date
      return moment(date).isSame(today, 'day')
    },
    isUpcoming(game) {
      const today = moment()
      const date = game.date
      return moment(date).isAfter(today, 'day')
    },

  }
}
</script>
<style lang="scss" scoped>
.date-time {
  text-transform: capitalize;
}
.today-game {
  td {
    background: #e5fbe5;
  }
}

.team-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .team-logo {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  &.home {
     justify-content: start;
  }
  .winning-team {
    font-weight: bold;
  }
}
.day-change {
  td {
    border-bottom: 3px solid black;
  }

}
</style>

