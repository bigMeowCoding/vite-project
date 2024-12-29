<template>
  <el-menu
    ellipsis
    class="el-menu-popper-demo"
    mode="horizontal"
    :popper-offset="16"
    style="max-width: 600px"
  >
    <el-menu-item index="1" @click="router.push('/')">首页</el-menu-item>
    <el-menu-item index="2" @click="router.push('/join/hello')"
      >招商管理</el-menu-item
    >
    <el-menu-item index="3" :popper-offset="8">
      <template #title>食安管理</template>
    </el-menu-item>
  </el-menu>
  <el-row>
    <el-col :span="4">
      <SideBar></SideBar>
    </el-col>
    <el-col :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
