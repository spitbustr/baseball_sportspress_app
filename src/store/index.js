import { createStore } from 'vuex'
import SportspressAPIService from "@/services/SportspressAPIService"
import user from "@/store/modules/user"
import $settings from "@/data/settings.json"
const ADD_PLAYER = "ADD_PLAYER"
const SET_PLAYERS = "SET_PLAYERS"
const SET_GAMES = "SET_GAMES"
const SET_MEDIA = "SET_MEDIA"
const SET_TEAMS = "SET_TEAMS"
const SET_CALENDAR = "SET_CALENDAR"
const SET_PROGRESS = "SET_PROGRESS"
const DELETE_PLAYER = "DELETE_PLAYER"
export default createStore({
  actions: {
    async addPlayer({state, commit},payload) {
      commit(ADD_PLAYER, payload)
      localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(state.data.players))
    },
    async deletePlayer({state, commit},playerId) {
      commit(DELETE_PLAYER, playerId)
      localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(state.data.players))
    },
    async initialize({state, commit, dispatch}) {
      let progress = {
        percentage: 0,
        loading: "Loading Teams..."
      }
      commit(SET_PROGRESS, progress)
      if(localStorage.getItem(`${$settings.playballConfig.id}_teams`)) {
        commit(SET_TEAMS, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_teams`)))
      }
      else {
        await SportspressAPIService.getAllTeams().then(response => {
          commit(SET_TEAMS, response)
          localStorage.setItem(`${$settings.playballConfig.id}_teams`, JSON.stringify(response))
        })
      }
      progress = {
        percentage: 0,
        loading: "Loading Calendar..."
      }
      commit(SET_PROGRESS, progress)
      if(localStorage.getItem(`${$settings.playballConfig.id}_calendar`)) {
        commit(SET_CALENDAR, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_calendar`)))
      }
      else {
        await SportspressAPIService.getCalendar().then(response => {
          commit(SET_CALENDAR, response[0])
          localStorage.setItem(`${$settings.playballConfig.id}_calendar`, JSON.stringify(response[0]))
        })
      }
      progress = {
        percentage: 0,
        loading: "Loading Games..."
      }
      commit(SET_PROGRESS, progress)
      if(localStorage.getItem(`${$settings.playballConfig.id}_games`)) {
        commit(SET_GAMES, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_games`)))
      }
      else {
        await SportspressAPIService.getAllGames().then(response => {
          commit(SET_GAMES, response)
          localStorage.setItem(`${$settings.playballConfig.id}_games`, JSON.stringify(response))
        })
      }
      progress = {
        percentage: 0,
        loading: "Loading Media..."
      }
      commit(SET_PROGRESS, progress)
      if(localStorage.getItem(`${$settings.playballConfig.id}_media`)) {
        commit(SET_MEDIA, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_media`)))
      }
      else {
        await SportspressAPIService.getAllMedia().then(response => {
          commit(SET_MEDIA, response)
          localStorage.setItem(`${$settings.playballConfig.id}_media`, JSON.stringify(response))
        })
      }
      progress = {
        percentage: 0,
        loading: "Loading Players..."
      }
      commit(SET_PROGRESS, progress)
      if(localStorage.getItem(`${$settings.playballConfig.id}_players`)) {
        commit(SET_PLAYERS, JSON.parse(localStorage.getItem(`${$settings.playballConfig.id}_players`)))
      }
      else {
        await SportspressAPIService.getAllPlayers().then(response => {
          commit(SET_PLAYERS, response)
          localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(response))
        })
      }
      progress = {
        percentage: 100,
        loading: "Loading DONE!!!"
      }
      commit(SET_PROGRESS, progress)
    },
    async refreshData({state, dispatch}) {
      await dispatch("refreshCalendar")
      await dispatch("refreshGames")
      await dispatch("refreshTeams")
      await dispatch("refreshPlayers")
      await dispatch("refreshMedia")
    },
    async refreshPlayers({state, commit}) {
      let progress = {
        percentage: 0,
        loading: "Loading Players..."
      }
      commit(SET_PROGRESS, progress)
      localStorage.removeItem(`${$settings.playballConfig.id}_players`)
      await SportspressAPIService.getAllPlayers().then(response => {
        commit(SET_PLAYERS, response)
        localStorage.setItem(`${$settings.playballConfig.id}_players`, JSON.stringify(response))
        progress = {
          percentage: 100,
          loading: "Loading DONE!!"
        }
        commit(SET_PROGRESS, progress)
      })
    },
    async refreshMedia({state, commit}) {
      let progress = {
        percentage: 0,
        loading: "Loading Media..."
      }
      commit(SET_PROGRESS, progress)
      localStorage.removeItem(`${$settings.playballConfig.id}_media`)
      await SportspressAPIService.getAllMedia().then(response => {
        commit(SET_MEDIA, response)
        localStorage.setItem(`${$settings.playballConfig.id}_media`, JSON.stringify(response))
        progress = {
          percentage: 100,
          loading: "Loading DONE!!"
        }
        commit(SET_PROGRESS, progress)
      })
    },
    async refreshGames({state, commit}) {
      let progress = {
        percentage: 0,
        loading: "Loading Games..."
      }
      commit(SET_PROGRESS, progress)
      localStorage.removeItem(`${$settings.playballConfig.id}_games`)
      await SportspressAPIService.getAllGames().then(response => {
        commit(SET_GAMES, response)
        localStorage.setItem(`${$settings.playballConfig.id}_games`, JSON.stringify(response))
        progress = {
          percentage: 100,
          loading: "Loading DONE!!"
        }
        commit(SET_PROGRESS, progress)
      })
    },
    async refreshCalendar({state, commit}) {
      let progress = {
        percentage: 0,
        loading: "Loading Calendar..."
      }
      commit(SET_PROGRESS, progress)
      localStorage.removeItem(`${$settings.playballConfig.id}_calendar`)
      await SportspressAPIService.getCalendar().then(response => {
        commit(SET_CALENDAR, response[0])
        localStorage.setItem(`${$settings.playballConfig.id}_calendar`, JSON.stringify(response[0]))
        progress = {
          percentage: 100,
          loading: "Loading DONE!!"
        }
        commit(SET_PROGRESS, progress)
      })
    },
    async refreshTeams({state, commit}) {
      let progress = {
        percentage: 0,
        loading: "Loading Teams..."
      }
      commit(SET_PROGRESS, progress)
      localStorage.removeItem(`${$settings.playballConfig.id}_teams`)
      await SportspressAPIService.getAllTeams().then(response => {
        commit(SET_TEAMS, response)
        localStorage.setItem(`${$settings.playballConfig.id}_teams`, JSON.stringify(response))
        progress = {
          percentage: 100,
          loading: "Loading DONE!!"
        }
        commit(SET_PROGRESS, progress)
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
    getAllMedia: (state) => {
      return state.data.media
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
    [SET_MEDIA]: (state, media) => {
      state.data.media = media
    },
    [SET_GAMES]: (state, games) => {
      state.data.games = games
    },
    [SET_CALENDAR]: (state, calendar) => {
      state.data.calendar = calendar
    },
    [ADD_PLAYER]: (state, player) => {
      state.data.players.unshift(player)
    },
    [DELETE_PLAYER]: (state,playerId) => {
      const index = state.data.players.findIndex(p => p.id === playerId)
      console.log(index)
      if(index !== -1) {
        state.data.players.splice(index,1)
        console.log(state.data.players)
      }
    },
    [SET_PROGRESS]: (state, progress) => {
      state.data.progress = progress
    }
  },
  modules: {
    user,
  },
  state: {
    data: {
      progress: {},
      media: [],
      players: [],
      teams: [],
      games: [],
      calendar: {},
    },
  },
})
