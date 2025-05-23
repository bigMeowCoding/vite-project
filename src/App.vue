<template>
  <!--  <el-form-demo></el-form-demo>-->
  <input @change="change" @input="input" />
</template>
<script setup>
import { ref } from "vue";
import { watch } from "vue";
import ElFormDemo from "./components/form-exercise.vue";
function change() {
  console.log("change");
}
/**
 * 输入框
 */
function input() {
  console.log("input");
}
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
const formValue = ref({
  cascader: [],
  cascader1: [],
});
/**
 * 监听表单值
 */
watch(
  formValue,
  (val) => {
    console.log(val, "formValue");
  },
  { deep: true },
);
/**
 * 表单配置
 */
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
