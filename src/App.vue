<template>
  <avue-form :option="option" v-model="formValue"></avue-form>
</template>
<script setup>
import { ref } from "vue";
import { watch } from "vue";
const dicData = [
  {
    value: "zhinan",
    label: "指南",
    children: [
      {
        value: "shejiyuanze",
        label: "设计原则",
        children: [
          {
            value: "yizhi",
            label: "一致",
          },
          {
            value: "fankui",
            label: "反馈",
          },
        ],
      },
    ],
  },
];
const formValue = ref({});
watch(
  formValue,
  (val) => {
    console.log(val, "formValue");
  },
  { deep: true },
);
const option = ref({
  column: [
    {
      label: "级联",
      prop: "cascader",
      type: "cascader",
      dicData: dicData,
      rules: [{ required: true, message: "请选择级联", trigger: "change" }],
      change: (val) => {
        console.log(val, "cascader1");
      },
    },
    {
      label: "级联",
      prop: "cascader1",
      type: "cascader",
      expandTrigger: "click",
      dicData: dicData,
      change: (val) => {
        console.log(val, "cascader2");
      },
    },
  ],
});
</script>
