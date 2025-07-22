import { createApp } from 'vue'
import './styles/style.css'
import pinia from './store/index.js'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$store = pinia.state.value
app.use(pinia) // <-- Регистрируем Pinia :3
app.mount('#app')
// gg
