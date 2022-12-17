<template>
  <el-radio-group :disabled="disabled" v-model="modelValue">
    <el-radio
      :key="labelObj.label"
      v-for="labelObj in labelOptions"
      :label="labelObj.label"
      size="large"
    >
      {{ labelObj.text }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { OptionsControl } from 'amis';

const { value, labelOptions, onChange, formStore, automaticName, onBulkChange, disabled } =
  defineProps<{
    value;
    labelOptions;
    onChange;
    formStore;
    automaticName;
    onBulkChange;
    disabled;
  }>();

function formChangeListener(arg) {
  if (!automaticName || arg.type !== 'update') {
    return;
  }

  // console.log({ args })
  const {
    oldValue: { storedValue: oldData },
    newValue: { storedValue: newData },
  } = arg;

  /**
   * 要在 labelOption.includes 中寻找的值
   */
  const target = newData[automaticName];
  const oldTarget = oldData[automaticName];

  if (oldTarget === target) {
    return;
  }

  const found = (labelOptions as any[]).find((option) => (option.includes || []).includes(target));
  if (found) {
    modelValue.value = found.label;
  }
}

if ((formStore as any)?.$mobx) {
  (formStore as any).$mobx.changeListeners.push(formChangeListener);

  onBeforeUnmount(() => {
    const i = (formStore as any).$mobx.changeListeners.indexOf(formChangeListener);
    i >= 0 && (formStore as any).$mobx.changeListeners.splice(i, 1);
  });
}

const modelValue = ref(value);
watch(modelValue, (value, oldValue) => {
  if (value === oldValue) {
    return;
  }

  if (formStore) {
    // 从表单中查询 automaticName 字段的值，如果该值不在 option.includes 中就改变它
    const option = labelOptions.find((option) => option.label === modelValue.value);

    if (!option.includes.includes(formStore.data[automaticName])) {
      onBulkChange &&
        onBulkChange({
          [automaticName]: labelOptions.find((option) => option.label === modelValue.value)
            ?.includes[0],
        });
    }
  }

  onChange(modelValue.value);
});
</script>

<script lang="ts">
const meta: AimsVueComponentMeta = {
  type: 'a-automatic-choice',
  renderer: OptionsControl,
  desc: '当 form 中某个字段包含在 labelOption.includes 里面的时候，自动选择单选框',
};

export default {
  meta,
};
</script>
