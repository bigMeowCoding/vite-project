<script setup>
import { useI18n } from "vue-i18n";
import { useStore } from "./store/index.js";
const { t, locale } = useI18n();
// const { locale, setLanguage } = useStore();
function setLanguage(val) {
  console.log(val);
  locale.value = val;
}
</script>

<template>
  <el-select
    v-model="locale"
    placeholder="Select"
    @change="
      (val) => {
        setLanguage(val);
      }
    "
    style="width: 240px"
  >
    <el-option label="中文" value="zh" />
    <el-option label="English" value="en" />
  </el-select>
  {{ t("message.hello") }}
</template>

<style scoped></style>
