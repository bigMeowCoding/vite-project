import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from './i18n/index.js'

import "./style.css";



import App from "./App.vue";
console.log("i18n", i18n.global.t)

window.$t = i18n.global.t;

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$t = i18n.global.t;

app.use(pinia);

app.use(i18n);

app.mount("#app");
