import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import("@/views/Homepage.vue")
    }
  },
  {
    path: '/games',
    name: 'games',
    component: function () {
      return import("@/views/Games.vue")
    }
  },
  {
    path: '/teams/:teamId',
    name: 'teamView',
    component: function () {
      return import("@/views/TeamView.vue")
    }
  },
  {
    path: '/teams',
    name: 'teams',
    component: function () {
      return import("@/views/Teams.vue")
    }
  },
  {
    path: '/game/:gameId',
    name: 'inGame',
    component: function () {
      return import("@/views/InGame.vue")
    }
  },
  {
    path: '/players',
    name: 'players',
    component: function () {
      return import("@/views/Players.vue")
    }
  },
  {
    path: '/players/:playerId',
    name: 'playerView',
    component: function () {
      return import("@/views/PlayerView.vue")
    }
  },
  {
    path: '/standings',
    name: 'standings',
    component: function () {
      return import("@/views/Standings.vue")
    }
  },
  {
    path: '/cast',
    name: 'cast',
    component: function () {
      return import("@/views/Cast.vue")
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
