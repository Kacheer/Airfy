import { createApp } from 'vue'
import './styles/style.css'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())  // <-- Регистрируем Pinia :3
app.mount('#app')