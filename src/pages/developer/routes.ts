import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [];

if (__APP_DEV__) {
  routes.push(
    ...[
      {
        path: '/developer',
        name: '开发者',
        children: [
          {
            path: '/developer/amis-editor',
            name: 'amis 编辑器',
            component: () => import('./amis-editor/index.vue'),
          },
          {
            path: '/developer/amis-vue-examples',
            name: 'amis-vue 结合使用示例',
            children: [
              {
                path: '/developer/amis-vue-examples/register-vue-component',
                name: '在 schema 中使用 type 字段渲染 Vue 组件',
                component: () => import('./amis-vue-examples/register-vue-component/index.vue'),
              },
              {
                path: '/developer/amis-vue-examples/register-in-editor',
                name: '在编辑器中注册 Vue 组件',
                component: () => import('./amis-vue-examples/register-in-editor/index.vue'),
              },
            ],
          },
        ],
      },
    ],
  );
}
