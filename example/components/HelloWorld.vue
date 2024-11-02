<template>
中文
</template>
<script setup>
import { ref } from "vue";
import request from "umi-request";
import { name, work } from "./test.js";
import { useI18n } from "vue-i18n";
defineProps({
  msg: String,
});
const { t } = useI18n();

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
