<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
// const { locale, setLanguage } = useStore();
function setLanguage(val) {
  console.log(val);
  locale.value = val;
}
const tableData = [
  {
    id: "12987122",
    name: "Tom",
    amount1: "234",
    amount2: "3.2",
    amount3: 10,
  },
  {
    id: "12987123",
    name: "Tom",
    amount1: "165",
    amount2: "4.43",
    amount3: 12,
  },
  {
    id: "12987124",
    name: "Tom",
    amount1: "324",
    amount2: "1.9",
    amount3: 9,
  },
  {
    id: "12987125",
    name: "TomTomTomTomTomTomTomTomTomTomTomTomTomTomTomTomTomTom",
    amount1: "621",
    amount2: "2.2",
    width: 100,
    amount3: 17,
  },
  {
    id: "12987126",
    name: "Tom",
    amount1: "539",
    amount2: "4.1",
    amount3: 15,
  },
];

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2];
    } else if (columnIndex === 1) {
      return [0, 0];
    }
  }
};
</script>

<template>
  <el-table
    :data="tableData"
    :span-method="arraySpanMethod"
    border
    :tooltip-options="{ effect: 'light',
    trigger: 'click',
    enterable: true}"
    style="width: 100%"
  >
    <el-table-column prop="id" label="ID" width="180" />

    <el-table-column prop="name" label="Name"

                     :show-overflow-tooltip="true" width="100" />
    <el-table-column prop="amount1" sortable label="Amount 1" />
    <el-table-column prop="amount2" sortable label="Amount 2" />
    <el-table-column prop="amount3" sortable label="Amount 3" />
  </el-table>
  <el-select
    v-model="locale"
    placeholder="Select"
    @change="
      (val) => {
        setLanguage(val);
      }
    "
    style="width: 240px"
  >
    <el-option label="中文" value="zh" />
    <el-option label="English" value="en" />
  </el-select>
  {{ t("message.hello") }}
</template>

<style scoped></style>
