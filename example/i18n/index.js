import { createI18n } from "vue-i18n";
import zh from "../assets/zh-cn.json";

const localeLang = "zh";
const i18n = createI18n({
  legacy: false,
  locale: localeLang,
  messages: {
    zh,
  },
});

export default i18n;
