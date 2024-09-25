<template>
  <div class="topHeader">
    <div class="left">
      <el-icon size="32px"><Expand /></el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadList">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <div class="desc">欢迎您，{{ user.userName }}!</div>
      <el-dropdown>
        <el-avatar :size="50" :src="avaUrl"></el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ user.userName }}</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/userStore";
const { user, changeUser } = useUserStore();
const route = useRoute();
const breadList = ref([]);
const avaUrl = "/avatar.png";
const getbreadList = () => {
  const res = route.matched;
  breadList.value = res[1].name.split("/");
  // console.log(breadList.value);
};
onMounted(() => {
  getbreadList();
});

// 调用watch钩子函数，监听路由变化
watch(route, () => {
  getbreadList();
});

const logOut = () => {
  // 清除本地存储
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // 清空pinia中的user
  changeUser({});
  location.href = "/login";
};
</script>
<style lang="scss" scoped>
.topHeader {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #b3b4b8;
  justify-content: space-between;
  .left {
    display: flex;
    .el-breadcrumb {
      padding-top: 3px;
      align-items: center;
      margin-left: 5px;
      font-size: 24px;
    }
  }
  .right {
    display: flex;
    margin-right: 20px;
    align-items: center;
    font-size: 24px;
    .desc {
      margin-right: 20px;
    }
  }
}
</style>
