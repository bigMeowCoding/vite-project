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
  <HelloWorld msg="你好" />
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import HelloWorld from "./components/HelloWorld.vue";

// 欢迎使用我们的多语言应用
const welcomeMessage = "欢迎使用我们的多语言应用！";
console.log(welcomeMessage);

// 语言选项
const languageOptions = [
  { label: "简体中文", value: "zh-CN" },
  { label: "繁體中文", value: "zh-TW" },
  { label: "English", value: "en" },
];

// 设置语言函数
function setLanguage(val) {
  console.log(`正在切换语言到: ${val}`);
  locale.value = val;
}

// 当前日期
const currentDate = new Date().toLocaleDateString("zh-CN");
console.log(`今天是 ${currentDate}`);

// 问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "早上好！";
  } else if (hour < 18) {
    return "下午好！";
  } else {
    return "晚上好！";
  }
}

console.log(getGreeting());
</script>

<style scoped>
.a {
  color: red;
}
</style>
