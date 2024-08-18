<script setup>
import { computed, onMounted, ref } from "vue";
import * as echarts from "echarts";
const serverData = ref({
  errcode: "0",
  errmsg: "Success",
  data: [
    {
      provinceCode: "11",
      provinceName: "北京",
      targetQuantity: 100,
      signingCompletedQuantity: 80,
      provinceCustomerMakeQuantity: 50,
      provinceWorkerDevelopQuantity: 30,
    },
    {
      provinceCode: "12",
      provinceName: "天津",
      targetQuantity: 0,
      signingCompletedQuantity: 70,
      provinceCustomerMakeQuantity: 40,
      provinceWorkerDevelopQuantity: 30,
    },
    {
      provinceCode: "13",
      provinceName: "河北",
      targetQuantity: 150,
      signingCompletedQuantity: 120,
      provinceCustomerMakeQuantity: 80,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "14",
      provinceName: "山西",
      targetQuantity: 110,
      signingCompletedQuantity: 90,
      provinceCustomerMakeQuantity: 60,
      provinceWorkerDevelopQuantity: 30,
    },
    {
      provinceCode: "15",
      provinceName: "内蒙古",
      targetQuantity: 100,
      signingCompletedQuantity: 85,
      provinceCustomerMakeQuantity: 50,
      provinceWorkerDevelopQuantity: 35,
    },
    {
      provinceCode: "21",
      provinceName: "辽宁",
      targetQuantity: 130,
      signingCompletedQuantity: 110,
      provinceCustomerMakeQuantity: 70,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "22",
      provinceName: "吉林",
      targetQuantity: 120,
      signingCompletedQuantity: 100,
      provinceCustomerMakeQuantity: 60,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "23",
      provinceName: "黑龙江",
      targetQuantity: 140,
      signingCompletedQuantity: 115,
      provinceCustomerMakeQuantity: 75,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "31",
      provinceName: "上海",
      targetQuantity: 160,
      signingCompletedQuantity: 140,
      provinceCustomerMakeQuantity: 90,
      provinceWorkerDevelopQuantity: 50,
    },
    {
      provinceCode: "32",
      provinceName: "江苏",
      targetQuantity: 180,
      signingCompletedQuantity: 160,
      provinceCustomerMakeQuantity: 100,
      provinceWorkerDevelopQuantity: 60,
    },
    {
      provinceCode: "33",
      provinceName: "浙江",
      targetQuantity: 170,
      signingCompletedQuantity: 150,
      provinceCustomerMakeQuantity: 95,
      provinceWorkerDevelopQuantity: 55,
    },
    {
      provinceCode: "34",
      provinceName: "安徽",
      targetQuantity: 140,
      signingCompletedQuantity: 120,
      provinceCustomerMakeQuantity: 80,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "35",
      provinceName: "福建",
      targetQuantity: 150,
      signingCompletedQuantity: 130,
      provinceCustomerMakeQuantity: 85,
      provinceWorkerDevelopQuantity: 45,
    },
    {
      provinceCode: "36",
      provinceName: "江西",
      targetQuantity: 130,
      signingCompletedQuantity: 110,
      provinceCustomerMakeQuantity: 70,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "37",
      provinceName: "山东",
      targetQuantity: 190,
      signingCompletedQuantity: 170,
      provinceCustomerMakeQuantity: 110,
      provinceWorkerDevelopQuantity: 60,
    },
    {
      provinceCode: "41",
      provinceName: "河南",
      targetQuantity: 200,
      signingCompletedQuantity: 180,
      provinceCustomerMakeQuantity: 120,
      provinceWorkerDevelopQuantity: 60,
    },
    {
      provinceCode: "42",
      provinceName: "湖北",
      targetQuantity: 160,
      signingCompletedQuantity: 140,
      provinceCustomerMakeQuantity: 90,
      provinceWorkerDevelopQuantity: 50,
    },
    {
      provinceCode: "43",
      provinceName: "湖南",
      targetQuantity: 150,
      signingCompletedQuantity: 130,
      provinceCustomerMakeQuantity: 85,
      provinceWorkerDevelopQuantity: 45,
    },
    {
      provinceCode: "44",
      provinceName: "广东",
      targetQuantity: 220,
      signingCompletedQuantity: 200,
      provinceCustomerMakeQuantity: 130,
      provinceWorkerDevelopQuantity: 70,
    },
    {
      provinceCode: "45",
      provinceName: "广西",
      targetQuantity: 130,
      signingCompletedQuantity: 110,
      provinceCustomerMakeQuantity: 70,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "46",
      provinceName: "海南",
      targetQuantity: 100,
      signingCompletedQuantity: 85,
      provinceCustomerMakeQuantity: 50,
      provinceWorkerDevelopQuantity: 35,
    },
    {
      provinceCode: "50",
      provinceName: "重庆",
      targetQuantity: 140,
      signingCompletedQuantity: 120,
      provinceCustomerMakeQuantity: 80,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "51",
      provinceName: "四川",
      targetQuantity: 180,
      signingCompletedQuantity: 160,
      provinceCustomerMakeQuantity: 100,
      provinceWorkerDevelopQuantity: 60,
    },
    {
      provinceCode: "52",
      provinceName: "贵州",
      targetQuantity: 120,
      signingCompletedQuantity: 100,
      provinceCustomerMakeQuantity: 60,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "53",
      provinceName: "云南",
      targetQuantity: 140,
      signingCompletedQuantity: 120,
      provinceCustomerMakeQuantity: 80,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "54",
      provinceName: "西藏",
      targetQuantity: 80,
      signingCompletedQuantity: 70,
      provinceCustomerMakeQuantity: 40,
      provinceWorkerDevelopQuantity: 30,
    },
    {
      provinceCode: "61",
      provinceName: "陕西",
      targetQuantity: 140,
      signingCompletedQuantity: 120,
      provinceCustomerMakeQuantity: 80,
      provinceWorkerDevelopQuantity: 40,
    },
    {
      provinceCode: "62",
      provinceName: "甘肃",
      targetQuantity: 110,
      signingCompletedQuantity: 95,
      provinceCustomerMakeQuantity: 60,
      provinceWorkerDevelopQuantity: 35,
    },
    {
      provinceCode: "63",
      provinceName: "青海",
      targetQuantity: 90,
      signingCompletedQuantity: 80,
      provinceCustomerMakeQuantity: 50,
      provinceWorkerDevelopQuantity: 30,
    },
    {
      provinceCode: "64",
      provinceName: "宁夏",
      targetQuantity: 100,
      signingCompletedQuantity: 85,
      provinceCustomerMakeQuantity: 50,
      provinceWorkerDevelopQuantity: 35,
    },
    {
      provinceCode: "65",
      provinceName: "新疆",
      targetQuantity: 130,
      signingCompletedQuantity: 110,
      provinceCustomerMakeQuantity: 70,
      provinceWorkerDevelopQuantity: 40,
    },
  ],
  traceId: "1234567890abcdef",
});
const chart = ref(null);
const provinces = computed(() => {
  return serverData.value.data.map((item) => item.provinceName);
});
const provinceTarget = computed(() => {
  return serverData.value.data.map((item) => item.targetQuantity);
});
const proviceCompleted = computed(() => {
  return serverData.value.data.map((item) => item.signingCompletedQuantity);
});

onMounted(() => {
  var myChart = echarts.init(chart.value);
  var option;

  option = {
    legend: {
      data: ["目标", "已完成"],
      right: "0",
    },
    grid: {
      left: "1%", // 左侧留白，值越小，留白越少
      right: "1%", // 右侧留白，值越小，留白越少
      top: "10%", // 上侧留白，值越小，留白越少
      bottom: "10%", // 下侧留白，值越小，留白越少
      containLabel: true, // 防止标签溢出容器
    },
    xAxis: {
      type: "category",
      data: provinces.value,
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: provinceTarget.value,
        name: "目标",
        type: "bar",
      },
      {
        name: "已完成",
        data: proviceCompleted.value,
        type: "bar",
      },
    ],
  };

  option && myChart.setOption(option);

  window.addEventListener("resize", function () {
    myChart.resize();
  });
});
</script>

<template>
  <div ref="chart" class="chart"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 320px;
}
</style>
