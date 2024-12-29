<template>
  <h1>Home</h1>
  <div>dddsss</div>
  {{ name }}
  <!-- <Home /> -->
</template>
<script setup>
import { defineAsyncComponent } from "vue";
// import App from "vite_child_1";
// import Home from "vite_child_1/components/Home";
import { name } from "vite_child_1/test";
// const App = defineAsyncComponent(() => import("vite_child_1"));

console.log(App, "App");
const handleClick = () => {
  console.log("click");
};
</script>
