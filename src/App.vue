<script setup lang="ts">
import { useI18n } from "vue-i18n";
function clickHandler() {
  console.log("click");
}
</script>

<template>
  <!--  <el-table-->
  <!--    :data="tableData"-->
  <!--    :span-method="arraySpanMethod"-->
  <!--    border-->
  <!--    :tooltip-options="{ effect: 'light', trigger: 'click', enterable: true }"-->
  <!--    style="width: 100%"-->
  <!--  >-->
  <!--    <el-table-column prop="id" label="ID" width="180" />-->

  <!--    <el-table-column-->
  <!--      prop="name"-->
  <!--      label="Name"-->
  <!--      :show-overflow-tooltip="true"-->
  <!--      width="100"-->
  <!--    />-->
  <!--    <el-table-column prop="amount1" sortable label="Amount 1" />-->
  <!--    <el-table-column prop="amount2" sortable label="Amount 2" />-->
  <!--    <el-table-column prop="amount3" sortable label="Amount 3" />-->
  <!--  </el-table>-->
  <el-button type="primary">Primary</el-button>
  <HelloWorld msg="你好" @click="clickHandler"></HelloWorld>
  <el-select @click="()=>{
    console.log('click')
  }">
  </el-select>
</template>

<style scoped></style>
