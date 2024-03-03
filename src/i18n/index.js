import { createI18n } from "vue-i18n";
import { useStore } from "../store/index.js";
// const { local } = useStore();
const i18n = createI18n({
  locale: "en",
  messages: {
    en: {
      message: {
        hello: "hello world",
      },
    },
    zh: {
      message: {
        hello: "你好，世界",
      },
    },
  },
  globalInjection: true,
  legacy: false,
});

export default i18n;
