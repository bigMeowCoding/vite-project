<template>
<h1>{{ undefined }}</h1><div class="card"><button type="button"></button><p><code>{{ t('key_0') HelloWorld.vue }}</code></p></div><p><a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a></p><p><a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a></p><p class="read-the-docs">{{ t('key_1') }}</p>
</template>

<script setup setup>

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