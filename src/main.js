import { createApp } from "vue";
import { createPinia } from "pinia";
import formCreateMobile from "@form-create/vant";
import "vant/lib/index.css";
import vant from "vant";
import "./style.css";
import App from "./App.vue";
// import { default as i18n } from "./i18n";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(vant);

app.use(formCreateMobile);

app.mount("#app");
