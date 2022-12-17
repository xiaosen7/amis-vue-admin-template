const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: [
    'eslint-config-ali/essential/typescript/vue',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/vue',
  ],
  rules: {
    // 和 vue 组件不兼容，固去掉
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    // 生产环境下利用工具清理
    'no-console': 'off',

    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
});
