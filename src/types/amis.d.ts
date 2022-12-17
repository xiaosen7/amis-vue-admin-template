interface AimsVueComponentMeta {
  /**
   * amis schema 中的 type 命中这个值的时候使用这个组件
   */
  type?: string;

  /**
   * 这个字段表示用于以何种方式注册 vue 组件
   *
   * 如果是表单项类型组件，则用 OptionsControl
   *
   * 其他类型组件，则用 Renderer
   *
   * @reference https://aisuda.bce.baidu.com/amis/zh-CN/docs/extend/custom-react#%E8%A1%A8%E5%8D%95%E9%A1%B9%E7%9A%84%E6%89%A9%E5%B1%95
   * @default import("amis").Renderer
   */
  renderer?: import('amis').Renderer;

  /**
   * 组件描述
   */
  desc?: string;
}

interface ComponentPropertyAmis<P extends RendererProps = RendererProps> {
  props: P;
}
