<template>
  <div id="container" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;
let marker = null;
const center = ref([116.397428, 39.90923]); // 默认中心位置

onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "c72dc6cf4a402e15e0f9eecf9b0473a4",
  };
  AMapLoader.load({
    key: "bf285fc8671e6443d4c64c5d06fe6107", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geolocation"], // 只使用 Geolocation 插件
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 16, // 初始化地图级别
        center: center.value, // 初始化地图中心点位置
      });

      // 使用高德地图的 Geolocation 插件
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
        position: "RB", // 定位按钮的停靠位置
        offset: [10, 20], // 定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
        showCircle: false, // 不显示定位精度圈
      });

      map.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
        if (status === "complete") {
          const { position } = result;
          center.value = [position.lng, position.lat];
          if (!marker) {
            marker = new AMap.Marker({
              position: center.value,
              map: map,
            });
          } else {
            marker.setPosition(center.value);
          }
          map.setZoomAndCenter(16, center.value);

          console.log("定位成功:", center.value);
        } else {
          console.error("定位失败:", result);
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
