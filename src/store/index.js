import { ref } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("counter", () => {
  const local = ref("en");
  function setLanguage(lang) {
    local.value = lang;
  }

  return { local, setLanguage };
});
