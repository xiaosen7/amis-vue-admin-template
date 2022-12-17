import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/example-page",
    name: "示例页面",
    component: () => import("./index.vue"),
  },
];
