import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router, { registerGuards } from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
registerGuards(pinia);
app.use(router);

app.mount('#app');
