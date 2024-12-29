import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./i18n/index.js";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Avue from "@smallwei/avue";
import { createRouter, createWebHistory } from "vue-router";
// import Home from "vite_child_1/Home";
// import About from "vite_child_1";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const pinia = createPinia();
import "@smallwei/avue/lib/index.css";

const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.use(i18n);
app.use(Avue);

app.mount("#app");
