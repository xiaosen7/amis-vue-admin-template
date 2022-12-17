<template>
  <UseDraggable
    :onMove="handleDragMove"
    style="position: fixed;"
    :initialValue="position"
    @start="handleDragStart"
    @end="handleDragEnd"
  >
    <ElButton
      type="primary"
      @click="handleEditButtonClick"
      :icon="Edit"
    ></ElButton>
  </UseDraggable>
</template>

<script setup lang="ts">
import { UseDraggable } from '@vueuse/components'
import { Edit } from '@element-plus/icons-vue'
import { useStorage } from '@vueuse/core'

const position = useStorage('pos', { x: 100, y: 100 })
function handleDragMove(pos) {
  console.log('pos', pos)
  position.value = pos
}
function handleDragStart() {
  console.log('start')
}
function handleDragEnd() {
  console.log('end')
}

const waitingChoose = useStorage('waitingChoose', false)
function handleEditButtonClick() {
  waitingChoose.value = !waitingChoose.value
}
</script>

<style></style>
