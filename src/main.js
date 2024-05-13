import { createApp } from 'vue'
import "@/assets/styles/site.scss"
import App from './App.vue'
import router from './router'
import store from './store'
import OutcomeBox from '@/components/ingame/OutcomeBox'
import OutcomeBoxModal from '@/components/ingame/OutcomeBoxModal'
import Modal from '@/components/overlays/Modal'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App).use(store).use(router)

// Components
app.component('OutcomeBox', OutcomeBox)
app.component('OutcomeBoxModal', OutcomeBoxModal)
app.component('Modal', Modal)

// Mount app
app.mount('#app')

store.dispatch("initialize")
store.dispatch("user/initialize")

router.beforeEach (async (to, from, next) => {
    // Change background on different pages
    const bodyColors = {
      '/cast': 'black',
    }
    const displayNavs = {
      '/cast': 'none',
    }
    const bodyColor = bodyColors[to.path] || 'white'
    const displayNav = displayNavs[to.path] || 'block'
    document.body.style.backgroundColor = bodyColor
    const nav = document.getElementById("main-navigation")
    if(nav) {
      nav.style.display = displayNav
    }
    next()
})