<template>
  <div class="amis-editor-wrapper full-height">
    <ElCard body-style="padding-left: 0;" class="mt-primary">
      <template #header>
        <ElButton type="primary" @click="handlePreviewButtonClick">
          {{ previewToTexts }}
        </ElButton>

        <ElButton type="primary" @click="save()"> 保存 </ElButton>
      </template>
      <Editor class="editor" :preview="previewRef" v-bind="props" />
    </ElCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { Editor as ReactEditor } from 'amis-editor';
import { env } from '@/amis/env';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import 'amis-editor-core/lib/style.css';
import { applyPureReactInVue } from 'veaury';
import { ElMessage, ElMessageBox } from 'element-plus';
import { devServerRequest } from '@/utils/http';

const route = useRoute();

/**
 * 本地 schema 文件路径
 */
const localPathToSave = route.query.localPathToSave;

let schema = JSON.parse(localStorage.getItem('amis-saved-schema') || '{}');

const Editor = applyPureReactInVue(ReactEditor);
const previewRef = ref(false);
const previewToTexts = computed(() => (previewRef.value ? '编辑' : '预览'));

function handlePreviewButtonClick() {
  previewRef.value = !previewRef.value;
}

async function saveInLocalFile() {
  if (localPathToSave) {
    await ElMessageBox.confirm(`确定要覆盖项目中的 ${localPathToSave} 文件吗`, 'Warning', {
      type: 'warning',
    })
      .then(() =>
        devServerRequest.post('/save-json', {
          file: localPathToSave,
          json: schema,
        }),
      )

      .catch(() => {});
  }
}

function saveInLocalStorage() {
  localStorage.setItem('amis-saved-schema', JSON.stringify(schema));
  ElMessage.success('已保存在 localStorage');
}

function save() {
  saveInLocalFile().then(() => saveInLocalStorage());
}

/**
 * 间隔5分钟自动保存一次
 */
const timer = setInterval(saveInLocalStorage, 1000 * 60 * 5);

const props: ConstructorParameters<typeof ReactEditor>[0] = {
  value: schema,
  onChange(value) {
    if (schema !== value) {
      schema = value;
    }
  },
  showCustomRenderersPanel: true,
  amisEnv: env,
};

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped lang="less">
.amis-editor-wrapper {
  padding: var(--spacing-primary);
  :deep(.ae-Editor-inner) {
    max-height: 80vh;
  }
}
</style>
