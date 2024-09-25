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
    // 如果是登录页面，直接跳转
    next();
  } else {
    if (user.token) {
      // 如果有token，直接跳转
      const rights = JSON.parse(user.role.rights);
      if (rights.includes(to.path)) {
        next();
      } else {
        ElMessage.error("没有权限访问");

        next(from.path);
      }
    } else {
      ElMessage.error("token失效,请重新登录");
      next("/login");
    }
  }
});

// router.afterEach((to, from) => {
//   // 跳转之后，userStore已经存在，移除掉一些user不包含的路由
//   if (from.path === "/login") {
//     // 如果是从登录页面跳转过来的，需要移除路由
//     const { user } = useUserStore();
//     console.log(router.getRoutes());
//     const rights = JSON.parse(user.role.rights);
//     const allRoutes = router
//       .getRoutes()
//       .filter(
//         (item) => typeof item.name === "string" && item.name.includes("系统")
//       );
//     console.log(allRoutes);
//     allRoutes.forEach((item) => {
//       if (!rights.includes(item.path)) {
//         // 如果rights中不包含这个路由，就移除掉
//         router.removeRoute(item.name);
//       }
//     });
//     console.log(router.getRoutes());
//   }
// });
export default router;
