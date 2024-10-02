<template>
  {{ name }}
  {{ work }}
  <h1>{{ props.msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      编辑
      <code>组件 HelloWorld.vue</code> 测试热更新
    </p>
  </div>

  <p>
    哈哈
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >官方文档
  </p>
  <p>
    {{ t("5") }}

    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    最好的idea
  </p>
  <p class="read-the-docs">点击</p>
</template>

<script setup>
import { ref } from "vue";
import request from "umi-request";
import { name, work } from "./test.js";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  msg: String,
});

const count = ref(0);
// request.post('/api/getUser',{data:{a:1}}).then((res) => {
//   console.log(res);
// });
// request.post('/api/mock/test',{data:{a:1}}).then((res) => {
//   console.log(res);
// });
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
