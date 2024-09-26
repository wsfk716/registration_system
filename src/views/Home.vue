<template>
  <div class="box">
    <div class="top">
      <div class="left">
        <el-row class="user-info">
          <el-icon><User /></el-icon> 用户名:{{ user.userName }}
        </el-row>
        <el-row class="role-info">
          <el-col :span="12">角色类型:{{ user.role.roleName }}</el-col>
          <el-col :span="12">角色描述:{{ user.role.description }}</el-col>
        </el-row>
      </div>
      <div class="right">
        <el-calendar size="small" />
      </div>
    </div>
    <div class="bottom">
      <allApplyCounts />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/userStore.js";
import allApplyCounts from "../components/charts/allApplyCounts.vue";
const { user } = useUserStore();
</script>
<style lang="scss" scoped>
.box {
  height: 100vh;
  .top {
    display: flex;
    justify-content: space-between;
    height: 40%;
    width: 95%;
    margin: 20px;
    .left {
      width: 50%;
      height: 90%;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

      .user-info {
        display: flex;
        align-items: center;
        font-size: 24px; /* 增大字体 */
        margin-bottom: 10px;
        color: #007bff; /* 蓝色字体 */
        padding: 10px;
        border-radius: 4px;
      }

      .user-info el-icon {
        margin-right: 8px;
      }

      .role-info {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        padding: 0 10px;
      }

      .role-info el-col {
        padding: 5px 0;
      }
    }
    .right {
      width: 40%;
      height: 90%;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

      .el-calendar {
        --el-calendar-cell-width: 40px;
      }
    }
  }
}
.bottom {
  margin: 20px;
  height: 40%;
}
</style>
