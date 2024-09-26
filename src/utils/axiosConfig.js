import { Loading } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
let loading = null;
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 如果有token，添加到请求头
    const token = localStorage.getItem("token");
    config.headers.token = token;
    loading = ElLoading.service({ fullscreen: true });
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response);
    const res = response.data;
    res?.data?.token && localStorage.setItem("token", res?.data?.token);
    loading && loading.close();
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    loading && loading.close();
    if (error.response.status === 401) {
      ElMessage.error("token失效,请重新登录!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
