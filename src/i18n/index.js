import { createI18n } from 'vue-i18n'
import zh from '../assets/zh.json'
import en from '../assets/en.json'
import {ref} from "vue";

const localeLang = 'zh'
const i18n = createI18n({
  legacy: false,
  locale: localeLang,
  messages: {
    zh,
    en
  }
})

export default i18n