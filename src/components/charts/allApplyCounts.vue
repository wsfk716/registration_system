<template>
  <div id="charts-allCounts" style="width: 100%; height: 100%"></div>
</template>
<script setup>
import * as echarts from "echarts";
import { onMounted, watch } from "vue";
import { ref } from "vue";
import axios from "axios";

let myChart = null;
onMounted(() => {
  // 获取数据
  getDataList();
  // 初始化图表
  // 图表
  var chartDom = document.getElementById("charts-allCounts");
  // 初始化 ECharts 实例
  myChart = echarts.init(chartDom);

  // 定义图表选项
  const option = {
    title: {
      text: "报名情况一览表",
      left: "center", // 标题居中
    },
    tooltip: {},
    toolbox: {
      feature: {
        saveAsImage: {},
        dataView: {},
      },
    },
    grid: {
      left: "20%", // 调整左边距，增加y轴标签显示空间
      right: "10%", // 调整右边距
      top: "10%", // 调整上边距
      bottom: "10%", // 调整下边距
    },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: {
        formatter: "{value} 人",
      },
    },
    yAxis: {
      type: "category",
      data: yData.value,
      axisLabel: {
        interval: 0, // 强制显示所有标签
      },
    },
    series: [
      {
        name: "人数",
        type: "bar",
        data: seriesData.value, // 数据
        label: {
          show: true,
          position: "right", // 标签显示在条形图右侧
        },
      },
    ],
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
});

const updateChart = () => {
  myChart.setOption({
    yAxis: {
      data: yData.value,
    },
    series: [
      {
        data: seriesData.value,
      },
    ],
  });
};

// 根据id查询对应报名表相关的报名信息
const yData = ref([]);
const seriesData = ref([]);
const getDataList = async () => {
  const res = await axios.get(`/adminapi/information/all`);

  console.log(res.data.data);
  yData.value = [...new Set(res.data.data.map((item) => item.typeName))];

  // 根据 typeName 统计人数
  const gradeCounts = res.data.data.reduce((acc, item) => {
    if (acc[item.typeName]) {
      acc[item.typeName] += 1;
    } else {
      acc[item.typeName] = 1;
    }
    return acc;
  }, {});

  // 将统计结果转换为数组
  seriesData.value = yData.value.map((typeName) => gradeCounts[typeName] || 0);

  console.log(yData.value, seriesData.value);
  updateChart();
};
</script>
<style lang="scss" scoped></style>
