import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
console.log("[Pinia] Плагин persistedstate подключён:", piniaPluginPersistedstate);
export default pinia;