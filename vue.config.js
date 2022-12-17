const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');

// plugins
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

// element-plus 自动导入
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const ElementPlus = require('unplugin-element-plus/webpack');

const smp = new SpeedMeasurePlugin();

const isDev = process.env.NODE_ENV === 'development';
module.exports = defineConfig({
  transpileDependencies: !isDev,
  configureWebpack: smp.wrap({
    cache: {
      type: 'filesystem',
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    devtool: isDev ? 'eval' : false,
    plugins: [
      /**
       * 关于如何覆盖自定义element-plus主题 https://github.com/element-plus/element-plus/issues/6906
       */
      AutoImport({
        include: [
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: ['vue', 'vue-router'],
        dirs: ['./src/hooks'],
        eslintrc: {
          enabled: true,
        },
        ignore: [/\.(j|t)sx$/],
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/],
        extensions: ['vue'],
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        exclude: [/\.(j|t)sx$/],
        dirs: ['src/components', 'src/amis/components'],
      }),
      ElementPlus({
        useSource: true,
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts'],
      modules: [path.resolve('node_modules')],
      mainFiles: ['index'],
    },
    devServer: {
      /**
       * 扩展 dev-server 实现保存 json 文件到本地
       * @param {*} middlewares
       * @param {{app: import("express").Application}} devServer
       * @returns
       */
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        devServer.app.use(require('body-parser').json());
        devServer.app.post('/dev-server/save-json', (req, res) => {
          const { file, json } = req.body;
          console.log(req.url, req.body, req.params);
          if (!/\.json$/.test(file)) {
            return res.json({ code: 1, msg: '目标文件不是 json 文件' });
          }

          const target = path.resolve(file);
          if (!fs.existsSync(target)) {
            return res.json({ code: 1, msg: '目标文件不存在' });
          }

          // 备份
          const backupDir = path.join(path.dirname(target), '__backup__');
          if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
          }

          const backupPath = path.join(
            backupDir,
            `${path.basename(target)}-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          );
          fs.renameSync(target, backupPath);

          // 写入
          fs.writeFileSync(target, JSON.stringify(json, null, 2));
          res.json({ code: 0, msg: '已保存到本地' });
        });

        return middlewares;
      },
    },
    optimization: {
      moduleIds: 'deterministic',
    },
  }),

  chainWebpack(config) {
    // 类型检查这块开发时可以交给 IDE 来处理，没必要再跑一个线程
    config.plugins.delete('fork-ts-checker');

    // 使用 esbuild 压缩
    config.optimization.minimizers.delete('terser');
    config.optimization
      .minimizer('esbuild')
      .use(ESBuildMinifyPlugin, [{ minify: true, css: true }]);

    // html 模板相关
    config.plugin('html').tap((options) => {
      /**
       * @see  https://github.com/jantimon/html-webpack-plugin#minification
       */

      options[0].buildTime = new Date().toString();
      options[0].title = require('./package.json').name;

      return options;
    });

    // 项目注入变量 __APP_DEV__
    config.plugin('define').tap((args) => {
      args[0].__APP_DEV__ = JSON.stringify(isDev ? 'true' : '');
      return args;
    });

    /**
     * 可以获得源代码相对于项目根目录的 loader
     * @example
     *
     * ```js
     * import localSchemaPath from './schema.json?sourcePath';
     * ```
     */
    config.module
      .rule('source-path')
      .resourceQuery(/sourcePath/)
      .type('javascript/auto')
      .use('source-path')
      .loader(path.resolve(__dirname, 'loaders', 'source-path-loader.js'));

    // 开发模式关闭产物优化
    config.when(isDev, (_config) => {
      _config.optimization.minimize = false;
      _config.optimization.concatenateModules = false;
      _config.optimization.usedExports = false;
      _config.optimization.removeEmptyChunks = false;
    });

    // 非开发模式通用优化
    config.when(!isDev, (_config) => {
      _config.mode('production');
      _config.optimization.runtimeChunk('single');

      // 代码分割

      function createNpmCacheGroup(npmName) {
        return {
          [npmName]: {
            name: npmName,
            test: new RegExp(`/node_modules/${npmName}/`),
            priority: 10,
          },
        };
      }

      function createNpmCacheGroups(npmNames) {
        return npmNames
          .map((n) => createNpmCacheGroup(n))
          .reduce((ret, group) => Object.assign(ret, group), {});
      }

      _config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          ...createNpmCacheGroups([
            'amis',
            'amis-ui',
            'amis-core',
            'monaco-editor',
            'amis-widget',
            'react',
            'react-dom',
            'vue',
            'axios',
            'mobx',
            'mobx-react',
            'vue-router',
            // 以下这两项在非开发模式下其实不应该被打包出来
            'amis-editor',
            'amis-editor-core',
          ]),
        },
      });

      /**
       * 如果业务要求要在 amis 中使用代码编辑器去掉下面一行代码
       * 非开发环境下去掉 monaco-editor 打包，因为 monaco-editor 一般业务上很少使用
       * 且打包出来体积很大，代码压缩后也有 3mb
       */
      _config.module
        .rule('skip')
        .test(/\/node_modules\/monaco-editor\//)
        .type('javascript/auto')
        .use('skip')
        .loader(path.resolve(__dirname, 'loaders', 'skip-loader.js'));

      // gzip 压缩
      _config.plugin('compression').use(require('compression-webpack-plugin'));
    });
  },
});
