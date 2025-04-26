<template>
  <router-view></router-view>
</template>
<script setup>
import { ref } from "vue";

const name = ref("hello world");
name.value = "hello world";

</script>
<style scoped></style>
