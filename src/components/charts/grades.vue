<template>
  <div id="charts-grades" style="width: 50%; height: 400px"></div>
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
  var chartDom = document.getElementById("charts-grades", "shine");
  // 初始化 ECharts 实例
  myChart = echarts.init(chartDom);

  // 定义图表选项
  const option = {
    title: {
      text: "年级分布情况",
    },
    tooltip: {},
    toolbox: {
      feature: {
        saveAsImage: {},
        dataView: {},
        magicType: {
          type: ["bar", "line"],
        },
      },
    },
    xAxis: {
      data: xData.value, // x轴数据
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: {
        formatter: "{value} 人",
      },
    },
    series: [
      {
        name: "人数",
        type: "bar",
        data: seriesData.value, // 数据
      },
    ],
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
});

const updateChart = () => {
  myChart.setOption({
    xAxis: {
      data: xData.value,
    },
    series: [
      {
        data: seriesData.value,
      },
    ],
  });
};

const props = defineProps({
  applyId: {
    type: Number,
    required: true,
  },
});

// 监听 applyId 的变化
watch(
  () => props.applyId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      getDataList();
    }
  }
);
// 根据id查询对应报名表相关的报名信息
const xData = ref([]);
const seriesData = ref([]);
const getDataList = async () => {
  const res = await axios.get(`/adminapi/information/${props.applyId}`);
  xData.value = [...new Set(res.data.data.map((item) => item.grades))];

  // 根据 grades 统计人数
  const gradeCounts = res.data.data.reduce((acc, item) => {
    if (acc[item.grades]) {
      acc[item.grades] += 1;
    } else {
      acc[item.grades] = 1;
    }
    return acc;
  }, {});

  // 将统计结果转换为数组
  seriesData.value = xData.value.map((grade) => gradeCounts[grade] || 0);

  // console.log(xData.value, seriesData.value);
  updateChart();
};
</script>
<style lang="scss" scoped></style>
