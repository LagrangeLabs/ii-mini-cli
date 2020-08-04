# ii-mini-cli

`ii-mini-cli` 脚手架主要适用于 Chrome 插件、单个 React 页面开发等小型项目场景。在 Webpack 配置上，都添加了详见说明，非常易于修改。

## 一、为什么要重复造轮子

### 1.1 为什么不用 Umi ？

通常在做中后台项目时，我们会使用 Umi 脚手架。在文件和目录的组织上，Umi 更倾向于选择约定的方式。所以针对一些非中后台的小型项目，如开发某款 Chrome 插件、某大屏数据可视化等场景等，通常定制化需求比较高，采用 Umi 就会比较不方便。

### 1.2 为什么不用 create-react-app ？

create-react-app 是基于 webpack 的打包层方案，包含 build、dev、lint 等，他在打包层把体验做到了极致，但是它不支持配置。所以，如果想基于它修改部分配置，就会遇到困难。