<template>
  <el-row class="tac" style="width: 200px">
    <el-col :span="4">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="router.push('/')">首页</el-menu-item>
        <el-menu-item index="2" @click="router.push('/join/hello')">
          招商管理
        </el-menu-item>
        <el-menu-item index="3" @click="router.push('/period/standard')">
          效期管理
        </el-menu-item>
        <el-menu-item index="4" @click="router.push('/period/template')">
          模板管理
        </el-menu-item>
        <el-menu-item index="5"> 系统管理 </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
