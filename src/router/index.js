import { createWebHistory, createRouter } from "vue-router";
import routeConfig from "./config";
import { useUserStore } from "../store/userStore";
import { ElMessage } from "element-plus";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/mainbox",
    name: "mainbox",
    component: () => import("@/views/MainBox.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

routeConfig.forEach((item) => {
  router.addRoute("mainbox", item);
});
// router.addRoute("mainbox", {
//   path: "/",
//   redirect: "/home",
// });
router.beforeEach((to, from, next) => {
  const { user } = useUserStore();
  if (to.path === "/login") {
    next();
  } else {
    if (user.value.token) {
      // 如果有token，直接跳转
      next();
    } else {
      ElMessage.error("token失效，请重新登录");
      next("/login");
    }
  }
});

export default router;
