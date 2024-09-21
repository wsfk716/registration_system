<template>
  <div class="title">在线报名系统</div>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    :router="true"
    style="height: 100vh"
  >
    <template v-for="item in menuList" :key="item.path">
      <el-sub-menu :index="item.path" v-if="item.children.length">
        <template #title>
          <el-icon>
            <component :is="mapIcons[item.icon]"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
        <template v-for="child in item.children" :key="child.path">
          <el-menu-item :index="child.path">
            <el-icon>
              <component :is="mapIcons[child.icon]"></component>
            </el-icon>
            <span>{{ child.name }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item :index="item.path" v-else-if="!item.children.length">
        <el-icon>
          <component :is="mapIcons[item.icon]"></component>
        </el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import {
  HomeFilled,
  Menu,
  Lock,
  Setting,
  List,
  Tickets,
  Document,
  Calendar,
  User,
  Avatar,
  Key,
} from "@element-plus/icons-vue";
const menuList = ref({});
onMounted(() => {
  getList();
});
const getList = async () => {
  const res = await axios.get("/adminapi/menu");
  menuList.value = res.data.data;
  // console.log(menuList.value);
};

// 图标映射
const mapIcons = {
  HomeFilled,
  Menu,
  Lock,
  Setting,
  List,
  Tickets,
  Document,
  Calendar,
  User,
  Avatar,
  Key,
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 28px;
  color: #fff;
  text-align: center;
  height: 60px;
  line-height: 60px;
  background: #545c64;
}
</style>
