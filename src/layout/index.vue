<template>
  <el-container class="is-vertical full-height">
    <Head />
    <el-container>
      <SideBar />
      <Page>
        <slot></slot>
      </Page>
    </el-container>
    <DevBar v-if="shouldShowDevBar" />
  </el-container>
</template>

<script setup lang="ts">
import Head from './head/index.vue'
import SideBar from './sidebar/index.vue'
import Page from './page/index.vue'
import DevBar from './dev-bar/index.vue'

const shouldShowDevBar = __APP_DEV__
</script>

<style></style>
