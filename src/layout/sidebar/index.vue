<template>
  <el-aside class="sidebar">
    <el-menu class="full-height" :default-active="defaultActivePath">
      <RoutesToSubMenus :routes="routes" />
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { routes, defaultActivePath } from '@/router'
import RoutesToSubMenus from './routes-to-sub-menus.vue'
</script>

<style>
.sidebar {
  width: var(--sidebar-width);
}
</style>
