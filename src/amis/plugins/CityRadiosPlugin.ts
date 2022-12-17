import { BasePlugin, PluginInterface, defaultValue } from 'amis-editor';
import { ValidatorTag } from 'amis-editor/esm/validator';
import { getEventControlConfig } from 'amis-editor/esm/renderer/event-control/helper';
import { __assign } from 'tslib';
import { i18n } from 'i18n-runtime';
import { getSchemaTpl } from 'amis-editor-core';

export default class AutomaticChoicePlugin extends BasePlugin implements PluginInterface {
  rendererName = 'a-city-radios';
  name = '单选框（城市选择）';
  description = '这只是个示例';

  /**
   * 左侧组件列表的图标，不知道还有哪些其他的，只有在 amis-editor 源码当中查了
   */
  pluginIcon = 'radios-plugin';

  /**
   * 固定的
   *
   * 官方说：暂时只支持这个，配置后会开启代码编辑器
   */
  $schema = '/schemas/UnkownSchema.json';

  /**
   * tag，决定会在哪个 tab 下面显示的
   */
  tags = ['自定义', '表单项'];

  /**
   * 用来生成预览图的
   */
  previewSchema = {
    type: 'a-city-radios',
    name: 'city',
    options: [
      {
        label: '北京',
        value: 0,
        count: 35,
      },
      {
        label: '四川',
        value: 1,
        count: 35,
      },
    ],
    value: 0,
    label: '城市选择',
  };

  /**
   * 拖入组件里面时的初始数据
   */
  scaffold = {
    type: 'a-city-radios',
    name: 'city',
    options: [
      {
        label: '北京',
        value: 0,
        count: 35,
      },
      {
        label: '四川',
        value: 1,
        count: 35,
      },
    ],
    value: 0,
    label: '城市选择',
  };

  /**
   * 右侧编辑面板显示标题
   */
  panelTitle = 'panelTitle';

  /**
   * 不显示表单项面板
   *
   * 只有把这个置为 true ，panelBodyCreator 函数才生效，不知道为什么
   */
  notRenderFormZone = true;

  /**
   * 复制的源码
   *
   * @reference node_modules/amis-editor/esm/plugin/form/Radios.js
   */
  panelBodyCreator(context) {
    console.log('------------------');

    // 这里返回值是一个 schema 数组，猜测 getSchemaTpl 函数可以获得常用的 schema 描述
    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: getSchemaTpl('collapseGroup', [
          // 基本
          {
            title: i18n('4092ed98e9035652d4c9ca9441701ed7'),
            body: [
              getSchemaTpl('formItemName', {
                required: true,
              }),
              getSchemaTpl('label'),
              getSchemaTpl('valueFormula', {
                rendererSchema: context == null ? null : context.schema,
                useSelectMode: true,
                visibleOn: 'this.options && this.options.length > 0 && this.selectFirst !== true',
              }),
              // getSchemaTpl('autoFill')
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('autoFillApi'),
            ],
          },
          // 选项
          {
            title: i18n('ea15ae2b7fba76c83eec6d0986d15197'),
            body: [getSchemaTpl('optionControlV2')],
          },
          // 状态
          getSchemaTpl('status', {
            isFormItem: true,
          }),
          // 校验
          getSchemaTpl('validation', {
            tag: ValidatorTag.MultiSelect,
          }),
        ]),
      },
      {
        // 外观
        title: i18n('afcde2611bdd13c1e65b4fb6a2f13425'),
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              schema: [
                getSchemaTpl('switch', {
                  label: i18n('46110787e4774b81418b274e9b06127e'),
                  name: 'inline',
                  hiddenOn: 'data.mode === "inline"',
                  pipeIn: defaultValue(true),
                }),
                {
                  label: i18n('83a00680e0872e2a35496be7e12c1309'),
                  name: 'columnsCount',
                  hiddenOn: 'data.mode === "inline" || data.inline !== false',
                  type: 'input-range',
                  min: 1,
                  max: 6,
                  pipeIn: defaultValue(1),
                },
              ],
            }),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: i18n('c30264927c3c170efd2e7763becf12fc'),
                  name: 'itemClassName',
                }),
              ],
            }),
          ]),
        ],
      },
    ]);
  }
}
