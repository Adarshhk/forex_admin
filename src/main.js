import './assets/main.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import globalComponents from './global-components/index'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

app.use(createPinia()).use(Vue3Marquee)
app.use(router)
globalComponents(app)

app.mount('#app')
