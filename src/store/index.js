import { createStore } from 'vuex'
import SportspressAPIService from "@/services/SportspressAPIService"
import user from "@/store/modules/user"
import $settings from "@/data/settings.json"
const SET_PLAYERS = "SET_PLAYERS"
const SET_GAMES = "SET_GAMES"
const SET_TEAMS= "SET_TEAMS"
const SET_CALENDAR= "SET_CALENDAR"

export default createStore({
  actions: {
    async initialize({state, commit}) {
      if(localStorage.getItem(`${$settings.playballConfig.id}_teams`)) {
        commit(SET_TEAMS, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_teams`)))
      }
      else {
        await SportspressAPIService.getAllTeams().then(response => {
          commit(SET_TEAMS, response)
          localStorage.setItem(`${$settings.playballConfig.id}_teams`, JSON.stringify(response))
        })
      }
      if(localStorage.getItem(`${$settings.playballConfig.id}_calendar`)) {
        commit(SET_CALENDAR, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_calendar`)))
      }
      else {
        await SportspressAPIService.getCalendar().then(response => {
          commit(SET_CALENDAR, response[0])
          localStorage.setItem(`${$settings.playballConfig.id}_calendar`, JSON.stringify(response[0]))
        })
      }
      if(localStorage.getItem(`${$settings.playballConfig.id}_games`)) {
        commit(SET_GAMES, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_games`)))
      }
      else {
        await SportspressAPIService.getAllGames().then(response => {
          commit(SET_GAMES, response)
          localStorage.setItem(`${$settings.playballConfig.id}_games`, JSON.stringify(response))
        })
      }
      if(localStorage.getItem(`${$settings.playballConfig.id}_players`)) {
        commit(SET_PLAYERS, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_players`)))
      }
      else {
        await SportspressAPIService.getAllPlayers().then(response => {
          commit(SET_PLAYERS, response)
          localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(response))
        })
      }
    },
    async refreshData({state, dispatch}) {
      await dispatch("refreshCalendar")
      await dispatch("refreshGames")
      await dispatch("refreshTeams")
      await dispatch("refreshPlayers")

    },
    async refreshPlayers({state, commit}) {
      await SportspressAPIService.getAllPlayers().then(response => {
        commit(SET_PLAYERS, response)
        localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(response))
      })
    },
    async refreshGames({state, commit}) {
      await SportspressAPIService.getAllGames().then(response => {
        commit(SET_GAMES, response)
        localStorage.setItem(`${$settings.playballConfig.id}_games`, JSON.stringify(response))
      })
    },
    async refreshCalendar({state, commit}) {
      await SportspressAPIService.getCalendar().then(response => {
        commit(SET_CALENDAR, response[0])
        localStorage.setItem(`${$settings.playballConfig.id}_calendar`, JSON.stringify(response[0]))
      })
    },
    async refreshTeams({state, commit}) {
      await SportspressAPIService.getAllTeams().then(response => {
        commit(SET_TEAMS, response)
        localStorage.setItem(`${$settings.playballConfig.id}_teams`, JSON.stringify(response))
      })
    },

  },

  getters: {
    getPlayersInTeam: (state) => (teamId) => {
      return state.data.players
        .filter(p => p.current_teams.flat().indexOf(+teamId) !== -1 && p?.title?.rendered.indexOf("(R)") === -1 && p.number)
    },
    getPlayersInTeamWithSpares: (state) => (teamId) => {
      return state.data.players
        .filter(p => p.current_teams.flat().indexOf(+teamId) !== -1 && p?.title?.rendered.indexOf("(R)") === -1)
    },
    getAllPlayers: (state) => {
      return state.data.players
    },
    getGame: (state) => (gameId) => {
      return state.data.games.find(g => g.id == +gameId)
    },
    getTeam: (state) => (teamId) => {
      return state.data.teams.find(t => t.id == +teamId)
    },
  },
  mutations: {
    [SET_TEAMS]: (state, teams) => {
      state.data.teams = teams
    },
    [SET_PLAYERS]: (state, players) => {
      state.data.players = players
    },
    [SET_GAMES]: (state, games) => {
      state.data.games = games
    },
    [SET_CALENDAR]: (state, calendar) => {
      state.data.calendar = calendar
    },
  },
  modules: {
    user,
  },
  state: {
    data: {
      players: [],
      teams: [],
      games: [],
      calendar: {},
    },
  },
})
