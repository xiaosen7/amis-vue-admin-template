<template>
  <div className="full-height" id="c-amis-editor"></div>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { Editor } from 'amis-editor'
import ReactDom from 'react-dom'
import React from 'react'
import { env } from '@/amis/env'
import 'amis/lib/themes/cxd.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import 'amis-editor-core/lib/style.css'

/**
 * 这里的 props 是传到了 react 组件 {@link Editor} 当中去了
 */
export default defineComponent<
  Partial<ConstructorParameters<typeof Editor>[0]>
>({
  setup(_, { attrs }) {
    onMounted(() => {
      const el = document.getElementById('c-amis-editor')

      ReactDom.render(
        React.createElement(Editor, {
          value: {},
          env,
          ...(attrs as any),
        }),
        el,
      )
    })
  },
})
</script>

<style></style>
