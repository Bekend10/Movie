import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import CSS
import './assets/css/variables.css'
import './assets/css/base.css'
import './assets/css/animations.css'
import './assets/css/utilities.css'

// Create app instance
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')
