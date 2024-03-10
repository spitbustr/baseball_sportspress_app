import $settings from "@/data/settings.json"
import moment from 'moment'

const SET_USER = "SET_USER"
const RESET_USER = "RESET_USER"
const SET_LOGIN = "SET_LOGIN"

export default ({
  actions: {
    initialize({state, commit}) {
      const userString = localStorage.getItem(`${$settings.playballConfig.id}_login`)
      const user = JSON.parse(userString)
      if(user) {
        if(user?.timestamp < moment().valueOf()) {
          commit(RESET_USER)
        }
        else {
          commit(SET_USER, user)
        }
      }
    },
    checkLocalStorage({state}) {
      const local = localStorage.getItem(`${$settings.playballConfig.id}_login`)
      if(JSON.parse(local)?.id) {
        return true
      }
      else {
        return false
      }
    },
    setUser({state, commit}, user) {
      const currentTimestamp = moment().valueOf()
      const userData = {
        ...user,
        timestamp: moment(currentTimestamp).add(8, 'days').valueOf()
      }
      localStorage.setItem(`${$settings.playballConfig.id}_login`, JSON.stringify(userData))
      commit(SET_USER, userData)
    },
    setLoggedIn({state, commit}, logged) {
      commit(SET_LOGIN, logged)
    }
  },

  getters: {
    getUser: (state) => {
      return state.user
    },
  },
  mutations: {
    [SET_USER]: (state, user) => {
      state.user = user
    },
    [RESET_USER]: (state) => {
      localStorage.setItem(`${$settings.playballConfig.id}_login`, "{}")
      state.user = {}
    },
    [SET_LOGIN]: (state, logged) => {
      state.loggedIn = logged
    },
  },
  state: {
    user: {},
    loggedIn: false,
  },
  namespaced: true,
})
