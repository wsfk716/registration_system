const routes = [
  {
    path: "/home",
    name: "首页",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/registration/itemShow",
    name: "数据信息/报名详情",
    component: () => import("@/views/registration/itemShow.vue"),
  },
  {
    path: "/registration/itemType",
    name: "数据信息/报名表",
    component: () => import("@/views/registration/itemType.vue"),
  },
  {
    path: "/registration/dataList",
    name: "数据信息/信息列表",
    component: () => import("@/views/registration/dataList.vue"),
  },
  {
    path: "/registration/blackList",
    name: "数据信息/黑名单",
    component: () => import("@/views/registration/backList.vue"),
  },
  {
    path: "/rights/roleList",
    name: "权限设置/角色列表",
    component: () => import("@/views/rights/roleList.vue"),
  },
  {
    path: "/rights/userList",
    name: "权限设置/人员管理",
    component: () => import("@/views/rights/userList.vue"),
  },
  {
    path: "/settings/EditPassword",
    name: "系统设置/修改密码",
    component: () => import("@/views/settings/EditPassword.vue"),
  },
];

export default routes;
