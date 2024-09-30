<template>
<el-select placeholder="Select"><el-option :label="t('key_0')" value="zh"></el-option><el-option label="English" value="en"></el-option><HelloWorld :msg="t('key_1')"></HelloWorld></el-select>
</template>

<script setup setup lang="ts">

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import HelloWorld from "./components/HelloWorld.vue";
// const { locale, setLanguage } = useStore();
function setLanguage(val) {
  console.log(val);
  locale.value = val;
}

</script>

<style scoped>

.a {
  color: red;
}

</style>