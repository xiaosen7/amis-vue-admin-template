import * as plugins from './plugins';
import { registerEditorPlugin } from 'amis-editor';

/**
 * 注册插件，扩展编辑器
 */
export default function registerInEditor() {
  Object.values(plugins).forEach((plugin) => {
    registerEditorPlugin(plugin);
  });
}

/**
 * @reference https://www.webpackjs.com/api/module-variables#md-content
 */
// @ts-ignore
if (__webpack_exports_info__.default.used && !__APP_DEV__) {
  console.warn('registerInEditor 函数应该只有在开发环境下才被打包');
}
