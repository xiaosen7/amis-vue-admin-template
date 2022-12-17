import { BasePlugin, PluginInterface, defaultValue } from 'amis-editor';
import { ValidatorTag } from 'amis-editor/esm/validator';
import { getEventControlConfig } from 'amis-editor/esm/renderer/event-control/helper';
import { __assign } from 'tslib';
import { i18n } from 'i18n-runtime';
import { getSchemaTpl } from 'amis-editor-core';

export default class AutomaticChoicePlugin extends BasePlugin implements PluginInterface {
  rendererName = 'a-automatic-choice';

  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json';

  // 用来配置名称和描述
  name = '单选框（自动选择）';
  description = '这只是个示例';

  // tag，决定会在哪个 tab 下面显示的
  tags = ['自定义', '表单项'];

  // 图标
  icon = 'fa fa-user';

  // 用来生成预览图的
  previewSchema = {
    type: 'a-automatic-choice',
    name: 'choice',
    label: '性别(Vue组件)',
    value: 0,
    automaticName: 'username',
    labelOptions: [
      {
        text: '女性',
        label: 0,
        includes: ['小红', '小月'],
      },
      {
        text: '男性',
        label: 1,
        includes: ['小明', '小张'],
      },
    ],
  };

  // 拖入组件里面时的初始数据
  scaffold = {
    type: 'a-automatic-choice',
    name: 'choice',
    label: '性别(Vue组件)',
    value: 0,
    automaticName: 'username',
    labelOptions: [
      {
        text: '女性',
        label: 0,
        includes: ['小红', '小月'],
      },
      {
        text: '男性',
        label: 1,
        includes: ['小明', '小张'],
      },
    ],
  };

  panelTitle = '自定义组件';
  notRenderFormZone = true;

  panelBodyCreator(context) {
    const schemaTpl = getSchemaTpl('tabs', [
      {
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

    console.log({ schemaTpl });

    return schemaTpl;
  }
}
