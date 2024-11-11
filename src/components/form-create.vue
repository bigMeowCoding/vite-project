<template>
  <!-- 使用 form-create-mobile 组件 -->
  <form-create-mobile
    :rule="rule"
    v-model:api="fApi"
    v-model="formData"
    :option="options"
  />
</template>

<script setup>
import { ref } from "vue";
import formCreateMobile from "@form-create/vant";
const fApi = ref({});
const formData = ref({});
const options = {
  onSubmit: (formData) => {
    alert(JSON.stringify(formData)); // 提交表单时弹出表单数据
  },
  resetBtn: true, // 显示重置按钮
};
const rule = ref([
  {
    type: "input",
    field: "goods_name",
    title: "商品名称",
    value: "form-create",
  },
  {
    type: "checkbox",
    title: "多选框",
    field: "checkbox",
    value: ["1"],
    props: {
      options: [
        {
          text: "复选框1",
          value: "1",
        },
        {
          text: "复选框2",
          value: "2",
        },
      ],
    },
  },
  {
    type: "checkbox",
    field: "label",
    title: "标签",
    // value: [0, 1, 2, 3],
    props: {
      options: [
        { label: "好用", value: 0 },
        { label: "快速", value: 1 },
        { label: "高效", value: 2 },
        { label: "全能", value: 3 },
      ],
    },
  },
]);
</script>

<style lang="scss" scoped></style>
