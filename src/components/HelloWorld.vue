<script setup>
import { ref } from "vue";
import request from "umi-request";
import { name, work } from "./test.js";
defineProps({
  msg: String,
});

function clickWrapper() {
  console.log("clickWrapper");
}
const count = ref(0);
const clicH1 = () => {
  console.log("clicH1");
};
function clickContent() {
  console.log("clickContent");
}
</script>

<template>
  <div class="wrapper" @click.stop="clickWrapper">
    <div >
      {{ name }}
      {{ work }}
      <h1 @click.stop="clicH1">{{ msg }}</h1>

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
        安装
        <a href="https://github.com/johnsoncodehk/volar" target="_blank" class
        >Volar</a
        >
        最好的idea
      </p>
      <p class="read-the-docs">点击</p>
    </div>

  </div>

</template>

<style scoped>
.wrapper{
  border:1px solid #ddd;
}
.read-the-docs {
  color: #888;
}
</style>
