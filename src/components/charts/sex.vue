<template>
  <div id="charts-sex" style="width: 50%; height: 400px"></div>
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
  var chartDom = document.getElementById("charts-sex", "shine");
  // 初始化 ECharts 实例
  myChart = echarts.init(chartDom);

  // 定义图表选项
  const option = {
    title: {
      text: "男女比例",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "人数",
        type: "pie",
        radius: "50%",
        data: chartData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
});

const updateChart = () => {
  myChart.setOption({
    series: [
      {
        data: chartData.value,
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
// 定义响应式数据
const chartData = ref([]);
const getDataList = async () => {
  const res = await axios.get(`/adminapi/information/${props.applyId}`);
  const xData = [...new Set(res.data.data.map((item) => item.sex))];

  // 根据 sex 统计人数
  const gradeCounts = res.data.data.reduce((acc, item) => {
    if (acc[item.sex]) {
      acc[item.sex] += 1;
    } else {
      acc[item.sex] = 1;
    }
    return acc;
  }, {});

  // 将统计结果转换为对象数组
  chartData.value = xData.map((sex) => ({
    name: sex,
    value: gradeCounts[sex] || 0,
  }));
  // console.log(chartData.value);
  updateChart();
};
</script>
<style lang="scss" scoped></style>
