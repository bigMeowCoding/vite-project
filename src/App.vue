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
    <el-option label="{{ $t('key_0') }}" value="zh" />
    <el-option label="English" value="en" />
  </el-select>
  <HelloWorld msg="{{ t('key_2') }}"></HelloWorld>
</template>

<style scoped></style>
