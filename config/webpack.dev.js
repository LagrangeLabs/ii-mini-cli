const path = require('path');
const { merge } = require('webpack-merge'); // 将配置合并在一起
const commonCfg = require('./common');

const developmentCfg = {
  mode: 'development',
  /**
   * webpack-dev-server 输出的文件只存在内存中，不输出真实的文件
   */
  devServer: {
    contentBase: path.resolve(__dirname, '../dist/'), // 告诉 devServer 从哪个目录中提供内容。
    // compress: true, // 一切服务都启用 gzip 压缩
    port: 9001,
    host: 'localhost',
    open: true, // server 启动后自动打开浏览器
    /**
     * 启用 webpack 的 模块热替换 功能
     *
     * 注：需结合 webpack.HotModuleReplacementPlugin 才能完全开启模块热替换功能。
     * 如果启动命令包含 --hot 选项，该插件会自动被加载。
     */
    hot: true,
  },
};

module.exports = merge(commonCfg, developmentCfg);
