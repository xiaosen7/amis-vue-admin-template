<template>
  <template :key="route.path" v-for="(route, index) in namedRoutes">
    <!-- 如果 route.children 为真，则认为它是一个菜单组 -->
    <template v-if="route.children">
      <el-sub-menu
        :index="(String(index)+String(route.name))"
        @click="handleSubMenuClick"
      >
        <template #title>
          <span>{{ route.name }}</span>
        </template>

        <!-- 递归调用展示子菜单 -->
        <routes-to-sub-menus :routes="route.children" />
      </el-sub-menu>
    </template>

    <!-- 否则就是一个菜单项 -->
    <template v-else>
      <el-menu-item
        @click="handleMenuItemClick(route)"
        :key="route.path"
        :route="route"
        :index="route.path"
      >
        <span>{{ route.name }}</span>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts" name="routes-to-sub-menus">
import { RouteRecordRaw } from 'vue-router'
import { usePageStore } from '@/stores/page'

const props = defineProps<{
  routes: RouteRecordRaw[]
}>()

/**
 * 只将有name值的路由对象展示出来
 */
const namedRoutes = props.routes.filter((r) => r.name)

const store = usePageStore()

function handleMenuItemClick(route: RouteRecordRaw) {
  store.setActivePath(route.path)
  console.log('MenuItemClick')
}

function handleSubMenuClick() {
  console.log('SubMenuClick')
}
</script>

<style></style>
