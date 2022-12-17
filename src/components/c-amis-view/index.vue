<template>
  <div
    @mouseleave.native="hiddenEditButton"
    @mouseenter.native="showEditButton"
    :class="[
      'c-amis-view',
      {
        'c-amis-view__waiting': waitingChooseRef,
      },
    ]"
    ref="amisViewElRef"
    @click="handleContainerClick"
  >
    <!-- <CAmisViewDevBar
      :style="`display: ${
        showEditButtonRef ? 'block' : 'none'
      }; background: beige`"
      :schema="schema"
      @mouseleave.native="() => (showOutlineRef = false)"
      @mouseenter.native="() => (showOutlineRef = true)"
    /> -->

    <Toast key="toast" :theme="theme" />
    <Alert key="alert" :theme="theme" />
    <div ref="amisViewRenderElRef"></div>
    <div
      :style="{ display: waitingChooseRef ? 'flex' : 'none' }"
      class="c-amis-view-mask box-center"
    >
      <el-icon :size="20"><Edit /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @reference https://aisuda.bce.baidu.com/amis/zh-CN/docs/start/getting-started#react
 */
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { Schema, render as renderAmis, ToastComponent, AlertComponent } from 'amis';
import ReactDOM from 'react-dom';
import { onMounted, ref, onUpdated, VNode } from 'vue';
import { env } from '@/amis/env';
import { applyReactInVue } from 'veaury';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { Edit } from '@element-plus/icons-vue';

const waitingChooseRef = useStorage('waitingChoose', false);

/**
 * container
 */
const amisViewElRef = ref<HTMLDivElement | null>(null);

/**
 * renderer container
 */
const amisViewRenderElRef = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  schema: Schema;
  /**
   * 本地的 schema json 文件相对于项目根目录的路径，用于保存到项目
   *
   * @example 'src/pages/developer/amis-vue-examples/register-vue-component/schema.json'
   */
  localPathToSave?: string;
}>();

/**
 * 主题
 */
const theme = 'cxd';

/**
 * amis 组件
 */
const Toast = applyReactInVue(ToastComponent);

/**
 * amis 组件
 */
const Alert = applyReactInVue(AlertComponent);

function renderSchema() {
  ReactDOM.render(
    // @ts-ignore
    renderAmis(
      props.schema,
      {
        theme,
      },
      env,
    ),
    amisViewRenderElRef.value!,
  );
}

const showEditButtonRef = ref(false);
function showEditButton() {
  showEditButtonRef.value = true;
}
function hiddenEditButton() {
  showEditButtonRef.value = false;
}

const router = useRouter();
function handleContainerClick() {
  if (waitingChooseRef.value) {
    localStorage.setItem('amis-saved-schema', JSON.stringify(props.schema));

    const { href } = router.resolve({
      path: '/developer/amis-editor',
      query: {
        localPathToSave: props.localPathToSave,
      },
    });

    console.log({ href, props });

    window.open(href, '_blank');
  }
}

/**
 * 挂载后调用
 */
onMounted(() => {
  renderSchema();
});

/**
 * props更新时调用
 */
onUpdated(renderSchema);
</script>

<style lang="less" scoped>
.c-amis-view {
  position: relative;

  &.c-amis-view__waiting {
    cursor: pointer;
  }

  .c-amis-view-mask {
    position: absolute;
    z-index: 2000;
    background-color: rgba(255, 255, 255, 0.6);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity var(--el-transition-duration);
  }
}
</style>
