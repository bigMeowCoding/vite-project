<template>
  <el-select
    placeholder="Select"
    v-model="locale"
    @change="
      (val) => {
        setLanguage(val);
      }
    "
    :style="{ width: '240px' }"
    ><el-option :label="t('key_0')" value="zh"></el-option
    ><el-option label="English" value="en"></el-option></el-select
  ><HelloWorld :msg="t('key_1')"></HelloWorld>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import HelloWorld from "./components/HelloWorld.vue";

// 欢迎使用我们的多语言应用
const welcomeMessage = t("key_2");
console.log(welcomeMessage);

// 语言选项
const languageOptions = [
  {
    label: t("key_3"),
    value: "zh-CN",
  },
  {
    label: t("key_4"),
    value: "zh-TW",
  },
  {
    label: "English",
    value: "en",
  },
];

// 设置语言函数
function setLanguage(val) {
  console.log(`${t("key_5")}: ${val}`);
  locale.value = val;
}

// 当前日期
const currentDate = new Date().toLocaleDateString("zh-CN");
console.log(`${t("key_6")} ${currentDate}`);

// 问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return t("key_7");
  } else if (hour < 18) {
    return t("key_8");
  } else {
    return t("key_9");
  }
}
console.log(getGreeting());
</script>

<style scoped>
.a {
  color: red;
}
</style>
