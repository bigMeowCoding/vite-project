<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';

onMounted(() => {
// 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'));
// 绘制图表
  myChart.setOption({
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  });});

</script>

<template>
<div id="main" :style="{width:200,height:200}"></div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
#main{
  width:100vw;
  height:100vh;
}
</style>
