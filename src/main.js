import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./i18n/index.js";
import "./style.css";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Avue from "@smallwei/avue";

const pinia = createPinia();
import "@smallwei/avue/lib/index.css";

const app = createApp(App);
app.use(pinia);
app.use(ElementPlus)

app.use(i18n);
app.use(Avue);

app.mount("#app");
