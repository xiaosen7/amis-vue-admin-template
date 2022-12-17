import * as components from './components';

import { paramCase } from 'param-case';
import {
  createApp,
  ComponentPublicInstance,
  App,
  ref,
  Ref,
  reactive,
  ComputedOptions,
  MethodOptions,
  defineComponent,
  h,
  ComponentInternalInstance,
  DefineComponent,
  Component,
  ComponentOptions,
} from 'vue';
import { Renderer, RendererProps } from 'amis';

import React from 'react';
import * as _ from 'lodash-es';

/**
 * 注册组件，扩展渲染器
 */
export default function registerInRenderer() {
  Object.entries(components).forEach(([key, cmp]) => {
    registerVueComponentInRenderer(
      cmp?.meta?.type ?? paramCase(key), // 'AHelloWorld' => 'a-hello-world'
      cmp,
      cmp.meta,
    );
  });
}

function registerVueComponentInRenderer(
  type: string,
  component: ComponentOptions<any>,
  meta: AimsVueComponentMeta = {},
) {
  console.log('registerVueComponentInRenderer', type, component);

  const wrapper = createReactWrapperFromVueComponent(component);

  (meta.renderer || Renderer)({ type })(wrapper);
}

function createVueWrapperFromVueComponent(
  vueComponent: ComponentOptions,
  initialAmisProps: RendererProps,
  onMounted: Function,
) {
  /**
   * 自定义组件声明的的 props
   */
  const propNamesInVueComponent = Object.keys(vueComponent.props || {});

  return defineComponent({
    data() {
      /**
       * 只需要传入自定义组件声明的的 props 就行了
       *
       * 另外组件内部可以声明 'amisProps' 属性从而拿到整个 amisProps
       */
      return _.pick({ ...initialAmisProps, amisProps: initialAmisProps }, propNamesInVueComponent);
    },
    render() {
      return h(vueComponent, this.$data, null);
    },
    mounted() {
      onMounted(this);
    },
    methods: {
      updateAmisProps(nextAmisProps: RendererProps) {
        // 只需要更新自定义组件声明的的 props 就行了
        propNamesInVueComponent.forEach((key) => {
          let newValue;
          if (key === 'amisProps') {
            // 传入整个 amisProps
            newValue = nextAmisProps;
          } else {
            // 分开传 amisProps
            newValue = nextAmisProps[key];
          }

          const oldValue = this[key];

          if (newValue !== oldValue) {
            this[key] = newValue;
          }
        });
      },
    },
  });
}

function createReactWrapperFromVueComponent(vueComponent: ComponentOptions) {
  return (amisProps: RendererProps, ...rest) => {
    console.log('react component wrapper render', { amisProps, rest });

    const dom = React.useRef<HTMLElement>(null);
    const vueWrapper = React.useMemo(
      () => createVueWrapperFromVueComponent(vueComponent, amisProps, handleVueWrapperMounted),
      [],
    );
    const vueWrapperInstance = React.useRef<ComponentInternalInstance>(null);

    function handleVueWrapperMounted(instance: ComponentInternalInstance) {
      vueWrapperInstance.current = instance;
    }

    React.useEffect(() => {
      const app = createApp(vueWrapper);
      app.mount(dom.current);
    }, []);

    React.useEffect(() => {
      console.log('react component wrapper render amisProps changed');

      if (vueWrapperInstance.current) {
        // @ts-ignore it's ok
        vueWrapperInstance.current.updateAmisProps(amisProps);
      }
    }, [amisProps]);

    return React.createElement('div', {
      ref: dom,
      className: amisProps.className,
      style: amisProps.style,
    });
  };
}
