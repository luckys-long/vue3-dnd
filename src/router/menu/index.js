const warnCenterRoutes = {
  path: "/warn",
  component: () => import("@/layout/index.vue"),
  redirect: "/warn/index",
  meta: {
    title: "告警中心",
    name: "warnCenter",
    icon: "iconfont icon-gaojing",
    isHide: true,
    // permission: [permission]
  },
  children: [
    {
      path: "index",
      name: "warnCenterIndex",
      icon: "iconfont icon-gaojing",
      component: () => import("@/views/home"),
    },
  ],
};

export default {
  // monitorCenterRoutes,
};
