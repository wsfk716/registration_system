<template>
  <div class="box">
    <div>
      <el-select
        v-model="applyId"
        placeholder="请选择报名表"
        style="width: 240px"
      >
        <el-option
          v-for="item in applyList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
    </div>
    <div v-if="applyId" class="allCharts">
      <div class="group1">
        <Grades :applyId="applyId" />
        <School :applyId="applyId" />
      </div>
      <div class="group2">
        <Professional :applyId="applyId" />
        <Sex :applyId="applyId" />
      </div>
    </div>
    <div v-else>
      <el-alert
        title="请选择报名表"
        type="warning"
        show-icon
        center
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Grades from "../../components/charts/grades.vue";
import Professional from "../../components/charts/professional.vue";
import School from "../../components/charts/school.vue";
import Sex from "@/components/charts/sex.vue";
onMounted(() => {
  getApplyList();
});
// 获取报名列表
const applyList = ref([]);
const getApplyList = async () => {
  const res = await axios.get("/adminapi/apply/all");
  applyList.value = res.data.data;
  // console.log(applyList.value);
};
const applyId = ref();
</script>
<style lang="scss" scoped>
.box {
  padding: 20px;

  .allCharts {
    padding: 20px;
    margin-top: 20px;
    display: block;
    justify-content: space-between;
    height: 90%;
    box-shadow: 2px 2px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px; // 可选：添加圆角
    padding: 10px; // 可选：添加内边距
    background-color: #fff; // 可选：设置背景颜色
    .group1 {
      display: flex;
      justify-content: space-between;
      gap: 5%;
    }
    .group2 {
      display: flex;
      justify-content: space-between;
      gap: 5%;
    }
  }
}
</style>
