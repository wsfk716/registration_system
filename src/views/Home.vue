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
        <el-row class="system-info">
          <el-col :span="24">
            <div class="sys-left">浏览器信息:</div>
            <div class="sys-right">{{ browserInfo }}</div>
          </el-col>
          <el-col :span="24">IP 地址: {{ ipAddress }}</el-col>
          <el-col :span="24">地理位置: {{ location }}</el-col>
        </el-row>
      </div>
      <div class="right">
        <el-calendar size="small" />
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-left">
        <allApplyCounts />
      </div>
      <div class="bottom-right">
        <MapContainer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/userStore.js";
import allApplyCounts from "../components/charts/allApplyCounts.vue";
import { User } from "@element-plus/icons-vue";
import axios from "axios";
import MapContainer from "../components/MapContainer.vue";
const { user } = useUserStore();
const browserInfo = ref("");
const ipAddress = ref("");
const location = ref("");

const getBrowserInfo = () => {
  browserInfo.value = navigator.userAgent;
  console.log("navigator:", navigator);
};

const getIpAddressAndLocation = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json?lang=zh-CN");
    ipAddress.value = response.data.query;
    location.value = `${response.data.regionName}, ${response.data.country}`;
  } catch (error) {
    console.error("Error fetching IP address and location:", error);
  }
};

onMounted(() => {
  getBrowserInfo();
  getIpAddressAndLocation();
});
</script>

<style lang="scss" scoped>
.box {
  height: 100vh;
  width: 100%;
  padding: 20px;
  background-color: #f0f2f5;

  .top {
    display: flex;
    height: 40%;
    width: 95%;
    margin: 20px;
    justify-content: space-between;
    .right {
      width: 45%;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-calendar {
        --el-calendar-cell-width: 40px;
      }
    }
    .left {
      width: 55%;
      padding: 20px;
      margin-right: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .user-info {
        display: flex;
        align-items: center;
        font-size: 24px; /* 增大字体 */
        margin-bottom: 20px;
        color: #007bff; /* 蓝色字体 */
        font-weight: bold; /* 加粗字体 */
      }

      .user-info el-icon {
        margin-right: 8px;
      }

      .role-info {
        display: flex;
        justify-content: space-between;
        font-size: 18px; /* 调整字体大小 */
        margin-bottom: 20px;
        color: #333; /* 深色字体 */
      }

      .role-info el-col {
        padding: 5px 0;
      }

      .system-info {
        font-size: 20px;
        margin-top: 20px;

        .sys-left {
          font-weight: bold;
          color: #555; /* 中等深度的字体颜色 */
          padding-bottom: 10px;
        }

        .sys-right {
          font-size: 16px;
          margin-left: 10px;
          color: #333;
          padding-bottom: 20px;
        }
      }
    }
  }

  .bottom {
    height: 40%;
    display: flex;
    margin: 20px;
    justify-content: space-between;
    width: 95%;
    .bottom-right {
      width: 45%;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .bottom-left {
      width: 55%;
      margin-right: 20px;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
