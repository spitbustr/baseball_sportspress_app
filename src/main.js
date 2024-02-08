import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import OutcomeBox from '@/components/ingame/OutcomeBox'
import OutcomeBoxModal from '@/components/ingame/OutcomeBoxModal'
import Modal from '@/components/overlays/Modal'


const app = createApp(App).use(store).use(router)

// Components
app.component('OutcomeBox', OutcomeBox)
app.component('OutcomeBoxModal', OutcomeBoxModal)
app.component('Modal', Modal)

// Mount app
app.mount('#app')

store.dispatch("initialize")