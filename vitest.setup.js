import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";

console.log('ddddd')
// 在全局引入 Element Plus
const app = createApp({});
app.use(ElementPlus);

beforeAll(() => {
  globalThis.__VUE_APP__ = app;
});
