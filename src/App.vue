<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import HelloWorld from "./components/HelloWorld.vue";
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
    <HelloWorld msg="你好" />
  </el-select>
</template>

<style scoped>
.a {
  color: red;
}
</style>
