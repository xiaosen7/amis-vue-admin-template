declare module '*?sourcePath' {
  const sourcePath: string;
  export default sourcePath;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
