import { createApp } from "vue";
import { createPinia } from "pinia";

import "./style.css";
import App from "./App.vue";
import { createRouter } from "./router";
/**
 * 创建并初始化 Pinia 实例。
 *
 * Pinia 是一个 Vue 的状态管理库，用来替代 Vuex。它提供了更简洁的 API 和更好的类型支持，
 * 使得状态管理变得更加直观和易于维护。通过调用 `createPinia` 函数，可以创建一个 Pinia
 * 根存储实例，该实例用于在整个 Vue 应用中集中管理和共享状态。
 *
 * @returns {Pinia} 返回一个新的 Pinia 实例，该实例应被安装到 Vue 应用中以启用状态管理功能。
 *
 * 使用方法：
 * 在 Vue 应用的入口文件中，调用此函数并将其结果传递给 `app.use()` 方法。
 *
 * ```javascript
 * import { createApp } from 'vue';
 * import { createPinia } from 'pinia';
 * import App from './App.vue';
 *
 * const app = createApp*/
const pinia = createPinia();
/**
 * app 变量存储了由 createApp 方法创建的 Vue 应用实例。
 * 这个实例是整个 Vue 应用的入口，管理着组件的注册、生命周期、路由以及全局状态等核心功能。
 *
 * @type {VueApp}
 */
const app = createApp(App);
app.use(createRouter());
app.use(pinia);

app.mount("#app");
