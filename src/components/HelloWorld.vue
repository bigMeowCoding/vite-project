<template>
  {{ name }}
  {{ work }}
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      {{ $t('编辑') }}<code>{{ $t('组件 HelloWorld.vue') }}</code
      >{{ $t(' 测试热更新') }}
    </p>
  </div>

  <p>
    {{ $t('哈哈')
    }}<a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >{{ $t('官方文档') }}
  </p>
  <p>
    {{ $t('安装')
    }}<a href="https://github.com/johnsoncodehk/volar" target="_blank" class
      >Volar</a
    >{{ $t('最好的idea') }}
  </p>
  <p class="read-the-docs">{{ $t('点击') }}</p>
</template>
<script setup>
import { ref } from 'vue'
import request from 'umi-request'
// import { name, work } from './test.js'
defineProps({
  msg: String,
})
const name = $t('周义竣')
const work = $t('前端开发工程师')
const count = ref(0)
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
