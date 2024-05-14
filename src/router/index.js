import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import UserService from "@/services/UserService"
const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import("@/views/Homepage.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/games',
    name: 'games',
    component: function () {
      return import("@/views/Games.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/teams/:teamId',
    name: 'teamView',
    component: function () {
      return import("@/views/TeamView.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/teams',
    name: 'teams',
    component: function () {
      return import("@/views/Teams.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/game/:gameId',
    name: 'inGame',
    component: function () {
      return import("@/views/InGame.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/players',
    name: 'players',
    component: function () {
      return import("@/views/Players.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/players/:playerId',
    name: 'playerView',
    component: function () {
      return import("@/views/PlayerView.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/standings',
    name: 'standings',
    component: function () {
      return import("@/views/Standings.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/cast',
    name: 'cast',
    component: function () {
      return import("@/views/Cast.vue")
    },
    meta: { requiresAuth: true, robots: "noindex"  },
  },
  {
    path: '/login',
    name: 'login',
    component: function () {
      return import("@/views/Login.vue")
    },
    meta: { requiresAuth: false, robots: "noindex"  },
  },
  {
    path: '/data',
    name: 'data',
    component: function () {
      return import("@/views/Data.vue")
    },
    meta: { requiresAuth: false, robots: "noindex"  },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach (async (to, from, next) => {
  // Authetication check
  let authentication = null
  const user = {...store?.getters?.["user/getUser"]}
  if(await store?.dispatch("user/checkLocalStorage")) {
    await UserService.loginCheck(user).then((response) =>{
      authentication = response
    })
  }
  if(authentication) {
    store?.dispatch("initialize")
  }
  store.dispatch("user/setLoggedIn",!!authentication)
  if(to.meta.requiresAuth && !authentication) {
    next({ name: 'login' })
  }
  else if (to.fullPath === '/login' && authentication) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})
export default router
