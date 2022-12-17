<template>
  <iframe className="page" :src="withPrefix(store.activePath)"></iframe>
</template>

<script setup lang="ts">
import { withPrefix } from '@/router'
import { usePageStore } from '@/stores/page'

const store = usePageStore()
</script>

<style>
.page {
  flex: 1;
}
</style>
