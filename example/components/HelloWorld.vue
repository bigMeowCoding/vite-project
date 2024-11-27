<template>
  <h1>{{ `中文${count}` }}</h1>
  <p>{{ msg }}</p>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
defineProps({
  msg: String,
});
const { t } = useI18n();

const count = ref(0);
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
