import { createApp } from "vue";
import { createPinia } from "pinia";

import "./style.css";
import App from "./App.vue";
import { createRouter } from "./router";
const pinia = createPinia();
const app = createApp(App);
app.use(createRouter());
app.use(pinia);

app.mount("#app");
