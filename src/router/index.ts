import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';
import { routes as developerRoutes } from '@/pages/developer/routes';
import { routes as examplePageRoutes } from '@/pages/example-page/routes';
import NProgress from 'nprogress';

export const defaultActivePath = '/developer/amis-vue-examples/register-in-editor';

// function importAll(r) {
//   console.log("r", r);
//   console.log(r.keys());
// }

// importAll(require.context("../pages", true, /^routes\.ts$/, "sync"));

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
  },
  ...examplePageRoutes,
  ...developerRoutes,
];

export const isWebHashHistory = true;

export function withPrefix(path: string) {
  if (isWebHashHistory) {
    return `/#${path}`;
  }

  return path;
}

const BASE_URL = process.env.BASE_URL;
const router = createRouter({
  history: isWebHashHistory ? createWebHashHistory(BASE_URL) : createWebHistory(BASE_URL),
  routes,
});

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
