import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import OutcomeBox from '@/components/ingame/OutcomeBox'


const app = createApp(App).use(store).use(router)

// Components
app.component('OutcomeBox', OutcomeBox)

// Mount app
app.mount('#app')

store.dispatch("initialize")