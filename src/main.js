import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from './i18n/index.js'

import "./style.css";
import App from "./App.vue";
// import { default as i18n } from "./i18n";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

app.use(i18n);

app.mount("#app");
