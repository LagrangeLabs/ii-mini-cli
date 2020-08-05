const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js', // 通过占位符确保文件名称的唯一
  },
  /**
   * webpack 开箱即用只支持JS和JSON两种文件类型，需通过 loaders 去支持其他文件类型并且把它们转化为有效的模块，并且添加到依赖图中。
   * loaders 本身是一个函数，接收源文件作为参数，返回转换的结果。
   */
  module: {
    /**
     * test 指定匹配规则，use 指定使用的 loader 名称
     */
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(js|jsx)$/,
        // 解析ES6，配置文件
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        /**
         * 注意：loader 调用是链式调用，执行顺序是从右到左。
         */
        use: [
          // 'style-loader', // 将样式通过<style>标签插入到 head 中
          MiniCssExtractPlugin.loader, // 与 style-loader 是互斥的，一个是提取css成为一个独立文件，一个是将 css 插入页面中
          {
            // css-loader interprets(解释) `@import` and `url()` like import/require() and will resolve them.
            loader: 'css-loader',
            options: {
              modules: true, // 启用 CSS 模块
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader', // 将样式通过<style>标签插入到 head 中
          MiniCssExtractPlugin.loader, // 与 style-loader 是互斥的，一个是提取css成为一个独立文件，一个是将 css 插入页面中
          {
            // css-loader interprets(解释) `@import` and `url()` like import/require() and will resolve them.
            loader: 'css-loader',
            options: {
              modules: true, // 启用 CSS 模块
            },
          },
          {
            // 用于将 less 转换成 css。less-loader 依赖于 less，故还需安装下 less
            loader: 'less-loader',
            options: {
              lessOptions: {
                // CSS in JS。举例：<div style={{fontSize: '20px' }}>hello</div>
                javascriptEnabled: true,
              },
            },
          },
          /**
           * CSS3的属性为什么需要前缀？因为浏览器的标准并未完全统一。
           *
           * 目前主流四种浏览器内核：
           * + IE (内核Trident，要兼容该内核，编写的CSS需要加前缀-ms)
           * + 火狐 (内核Geko，要兼容该内核，编写的CSS需要加前缀前缀-moz)
           * + Chrome (内核Webkit，要兼容该内核，编写的CSS需要加前缀前缀-webkit)
           * + Opera (内核Presto，要兼容该内核，编写的CSS需要加前缀前缀-o)
           */
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                /**
                 * autoprefixer 插件可以自动补齐CSS3前缀，与 postcss-loader一起配合使用。
                 * 该插件是CSS的后处理器，而less-loader是预处理器，其中预处理器是指打包前进行处理，
                 * 后处理器是指样式处理(代码最终生成)之后，再对它进行后续处理。
                 */
                autoprefixer({
                  // 指定兼容浏览器的版本
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'], // 参数一表示兼容最近两个版本，参数二指定浏览器版本使用人数所占的比例, 参数三表示兼容IOS 7版本以上
                }),
              ],
            },
          },
        ],
      },
      /**
       * url-loader也可以处理图片和字体。可以设置较小资源自动转base64，从而减少网络请求。
       */
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            /**
             * 注意图片、字体的hash是指文件内容的hash，与之前提到的CSS的contentHash类似。
             */
            options: {
              limit: 10240, // 10K大小。如果资源小于10K大小，webpack打包的时候会自动对它进行base64编码。
              name: '[name]_[hash:8].[ext]', // ext：资源后缀名
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader', // 用于处理文件，也可以处理字体
            options: {
              name: '[name]_[hash:8].[ext]', // ext：资源后缀名
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // 自动解析确认的扩展
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  /**
   * 插件用于 bundle 文件的优化，资源管理和环境变量注入。
   *
   * Plugins作用于整个构建过程。
   */
  plugins: [
    // 若使用了style-loader、css-loader，css会由style-loader将css插入到style标签内，并且放置head标签头部。
    // 这个时候并没有独立的css文件。因此通常需要MiniCssExtractPlugin插件将css文件提取出来作为一个独立的文件。
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      chunks: 'app',
    }),
  ],
};
