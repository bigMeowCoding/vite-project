import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from './i18n/index.js'

import "./style.css";
import App from "./App.vue";
// import { default as i18n } from "./i18n";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(ElementPlus)

app.use(i18n);

app.mount("#app");
