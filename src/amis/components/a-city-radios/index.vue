<template>
  <el-radio-group :disabled="disabled" class="a-city-radio" v-model="modelValue">
    <el-radio :key="option[valueField]" :label="option[valueField]" v-for="option in options">{{
      `${option[labelField]} ${option.count ?? ''}`
    }}</el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { FormControlProps, OptionsControl } from 'amis';

const { value, onChange, labelField, valueField } = withDefaults(
  defineProps<{
    value;
    onChange;
    options: FormControlProps;
    labelField?: string;
    valueField?: string;
    disabled: boolean;
  }>(),
  {
    valueField: 'value',
    labelField: 'label',
  },
);

const modelValue = ref(value);

watch(modelValue, () => {
  onChange(modelValue.value);
});
</script>

<style lang="less" scoped>
.a-city-radio {
  :deep(.el-radio__input .el-radio__inner) {
    width: 0;
    height: 0;
    border-left: 0.5rem solid skyblue;
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    border-color: none;
    background: none;

    border-left: 0.5rem solid rgb(13, 156, 213);
  }
}
</style>

<script lang="ts">
const meta: AimsVueComponentMeta = {
  type: 'a-city-radios',
  renderer: OptionsControl,
  desc: '城市单选框',
};

export default {
  meta,
};
</script>
