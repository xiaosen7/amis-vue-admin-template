import './styles/index.less';

import App from './App.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';

import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });
NProgress.start();

function main() {
  createApp(App).use(router).use(createPinia()).mount('#app');
  NProgress.done();
}

if (__APP_DEV__) {
  require('./mock');

  require('./amis/registerInEditor').default();
  require('./amis/registerInRenderer').default();

  main();
} else {
  require('./amis/registerInRenderer').default();

  main();
}
