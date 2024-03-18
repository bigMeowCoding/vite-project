<script setup>
import { useI18n } from "vue-i18n";
import HelloWorld from "./components/HelloWorld.vue";
const { locale } = useI18n();
function refresh(value) {
  locale.value = value;
  console.log(value);
}
</script>

<template>
  <el-select
    v-model="locale"
    placeholder="Select"
    @change="
      (val) => {
        refresh(val);
      }
    "
    style="width: 240px"
  >
    <el-option label="中文" value="zh" />
    <el-option label="English" value="en" />
  </el-select>
  <!--  {{ t("message.hello") }}-->
  <HelloWorld msg="你好"></HelloWorld>
</template>

<style scoped></style>
