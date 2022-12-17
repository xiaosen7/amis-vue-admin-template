import { BasePlugin, PluginInterface } from 'amis-editor';
import { __spreadArray } from 'tslib';
import { i18n } from 'i18n-runtime';
import { getSchemaTpl } from 'amis-editor-core';

export default class HelloWorldPlugin extends BasePlugin implements PluginInterface {
  /**
   * 需要和渲染的 type 值对应
   */
  rendererName = 'a-hello-world';

  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json';

  // 用来配置名称和描述
  name = '你好世界';
  description = '这只是个示例';

  // tag，决定会在哪个 tab 下面显示的
  tags = ['自定义', '文本'];

  // 图标
  icon = 'fa fa-user';

  // 用来生成预览图的，也是一个 schema
  previewSchema = {
    type: 'a-hello-world',
  };

  // 拖入组件里面时的初始数据
  scaffold = {
    type: 'a-hello-world',
  };

  /**
   * 对应到哪个面板下面
   */
  panelTitle = '自定义组件';

  /**
   * 右侧编辑栏
   */
  panelBody = [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'm-t-n-xs',
      contentClassName: 'no-border p-l-none p-r-none',
      tabs: [
        {
          // 外观
          title: i18n('afcde2611bdd13c1e65b4fb6a2f13425'),
          body: getSchemaTpl(
            'collapseGroup',
            __spreadArray(
              __spreadArray([], getSchemaTpl('style:common', ['layout']), true),
              [
                getSchemaTpl('style:classNames', {
                  isFormItem: false,
                }),
              ],
              false,
            ),
          ),
        },
      ],
    },
  ];
}
