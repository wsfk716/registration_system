<template>
  <div class="common-layout">
    <el-container style="height: 100vh; padding: 0; margin: 0">
      <el-aside width="12%">
        <sideMenu></sideMenu>
      </el-aside>
      <el-container style="width: 88%">
        <el-header style="height: 70px">
          <topHeader></topHeader>
        </el-header>
        <el-main>
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import sideMenu from "@/components/sideMenu.vue";
import topHeader from "@/components/topHeader.vue";
</script>
<style lang="scss">
.el-header {
  padding: 0;
}
.el-main {
  padding: 0;
}
</style>
