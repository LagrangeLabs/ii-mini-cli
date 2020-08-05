const path = require('path');
const { merge } = require('webpack-merge'); // 将配置合并在一起
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const commonCfg = require('./common');

const productionCfg = {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]_[hash:8].js', // 通过占位符确保文件名称的唯一
  },
  /**
   * 一、Mode 用于指定当前的构建环境是：production、development还是none。
   * +  设置 mode 可以使用webpack内置的函数，默认值是production。
   *
   * 二、Tree shaking(摇树优化)
   * 概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去。
   * tree shaking就是只把用到的方法打入bundle，没有用到的会在uglify阶段被擦除掉。
   *
   * 使用：webpack默认支持，在.babelrc里设置modules:false即可。
   * + production mode的情况下默认开启。
   *
   * 要求：必须是ES6的语法，CommonJS的方法不支持。
   *
   * 2.1 DCE(dead code elimination)概念
   *
   * DCE---擦除未使用的dead code：
   * + 代码不会被执行，不可到达；
   * + 代码执行的结果不会被用到；
   * + 代码只会影响死变量(只写不读)；
   *
   * 以上特征统称DCE。Tree shaking利用这一特点从而分析哪些代码需要删除。
   *
   * 2.2 Tree-shaking原理
   *
   * 利用ES6模块的特点：
   * + 只能作为模块顶层的语句出现；
   * + import的模块名只能是字符常量(无法动态设置import内容)；
   * + import binding是immutable；
   *
   * CommonJS不具备以上特点，举例：在不同条件下，可以require不同的模块。
   *
   * Tree shaking为什么需具备以上特点？
   * Tree shaking本质是对模块代码进行静态分析，因此在编译阶段代码是否有用过是需要确定下来的。
   * Tree shaking针对未使用的代码会进行注释标记，然后在uglify阶段会删除这些注释代码；
   *
   * 2.3 注意点
   *
   * Tree shaking要求模块里面编写的方法是无副作用的。如果有副作用，Tree shaking会失效。
   *
   * 三、Scope Hoisting(作用域提升)
   *
   * 3.1 现有问题
   *
   * 构建后的代码存在大量闭包代码。对于每一个模块代码，它会有一个包裹的头，如下所示：
   *
   * // a.js(编译前)
   * export default 'xxxx'
   *
   * // bundle.js(编译后)
   * (function(module, __webpack_exports__, __webpack_require__){
   *
   *  "use strict"
   *   __webpack_require__.r(__webpack_exports__);
   *
   *   __webpack_exports__["default"]= ('xxxx');
   *
   * })
   *
   * 当页面中的代码含有成百上千的模块时，会导致什么问题呢？
   *
   * + 大量函数闭包包裹代码，导致体积增大(模块越多越明显);
   * + 运行代码时创建的函数作用域变多，内存开销变大；
   *
   */
  mode: 'production',
  plugins: [
    /**
     * 压缩CSS
     */
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g, // 匹配所有的css文件后再有CSS处理器进行压缩
      // eslint-disable-next-line global-require
      cssProcessor: require('cssnano'), // 预处理器
    }),

    /**
     * 每次构建的时候不会清理目录，造成构建的输出目录output文件越来越多
     *
     * + rm -rf ./dist && webpack --- 不够优雅
     * + clean-webpack-plugin: 默认会删除output指定的输出目录，避免手动删除dist
     */
    new CleanWebpackPlugin(),
  ],
};

module.exports = merge(commonCfg, productionCfg);
