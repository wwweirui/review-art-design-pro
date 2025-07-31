# 百废待兴，我太难了

新建vite光秃秃项目，直达当前文件夹目录 ”pnpm create vite@latest . “
选择vue typescript 模板
pnpm i
pnpm dev

好好好，我要开始搭建了

## tsconfig.json 配置重写

```js
{
  "compilerOptions": {
    "target": "esnext",  // 指定ECMAScript版本
    "module": "esnext",  // 指定模块系统
    "moduleResolution": "node", // 指定模块解析策略
    "strict": true, // 启用所有严格类型检查选项
    "jsx": "preserve",  // 指定JSX代码的生成方式
    "sourceMap": true, // 生成相应的 .map 文件
    "resolveJsonModule": true,  // 让 TypeScript 能够处理 JSON 文件
    "esModuleInterop": true, //      启用与 CommonJS 模块的互操作性
    "lib": ["esnext", "dom"], // 指定要包含在编译中的库文件
    "types": ["vite/client", "node", "element-plus/global"], // 指定额外的类型声明文件
    "skipLibCheck": true, // 针对element-plus的打包校验
    "baseUrl": ".",  // 指定解析非相对模块名的基目录
    "paths": { 
      "@/*": ["src/*"] // 指定模块名到其实际文件路径的映射
    }
  },
  "include": ["src/**/*", "src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"], // 指定要包含在类型检查中的文件
  "exclude": ["node_modules", "dist", "**/*.js"] // 指定要排除在类型检查之外的文件
}

```

## 缺少 vite-plugin-vue-devtools

vue 3 + Vite 项目设计的开发工具插件，它能将 Vue DevTools 集成到 Vite 开发服务器中，提供更强大的组件调试、状态追踪和性能分析能力（相比浏览器扩展版 DevTools，支持更多 Vite 特有的功能，如模块热更新状态查看）。

pnpm add -D vite-plugin-vue-devtools

- 仅用于开发环境（devDependencies），生产构建时会自动排除
- vite.config.js 开始猛猛配置

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(), 
    // 添加到插件列表（建议放在 vue 插件之后）
    vueDevTools() 
  ]
})

```

## path

ts无法识别Node.js内置模块path的类型声明，缺少 @types/node

pnpm add -D @types/node

作用：@types/node 是 Node.js 内置模块（如 path、fs、process 等）的 TypeScript 类型声明文件，安装后 TypeScript 即可识别 path 模块的类型。

## 安装 viteCompression 包

pnpm add vite-plugin-compression
作用：vite-plugin-compression 是一个 Vite 插件，用于在构建过程中对静态资源进行压缩，从而减小文件大小，提高加载速度。

## 安装 Components vite 插件

pnpm add -D unplugin-vue-components unplugin-auto-import
作用：unplugin-vue-components 是一个 Vite 插件，用于自动按需导入 Vue 组件，
而 unplugin-auto-import 则是一个插件，用于自动导入 Vue 相关的 API，如 ref、reactive、computed 等。

## 安装 ElementPlusResolver 解析器

pnpm add -D unplugin-vue-components
作用：ElementPlusResolver 是 unplugin-vue-components 插件的解析器，用于识别和自动导入 Element Plus 组件。

## 安装 unplugin-auto-import

pnpm add -D unplugin-auto-import
作用：unplugin-auto-import 是一个 Vite 插件，用于自动导入 Vue 相关的 API，如 ref、reactive、computed 等。

## 安装 rollup-plugin-visualizer

pnpm add -D rollup-plugin-visualizer
作用：rollup-plugin-visualizer 是一个 Rollup 插件，用于生成打包后的文件大小可视化图表，帮助开发者分析和优化打包后的文件大小。

## 安装 terser 压缩包

pnpm add -D terser
JavaScript 代码压缩工具（minifier），主要用于生产环境构建时对 JS 代码进行体积优化和混淆处理，核心功能是通过删除冗余代码、缩短变量名、合并语句等方式减小文件体积，提升页面加载速度。

## 创建环境变量

env env.development env.production

预配置环境怎么这么麻烦，有点累了

## vite.config.js

### optimizeDeps配置项

Vite 提供的依赖预构建配置，用于在开发环境中预打包第三方依赖（如 vue、element-plus 等），将其转换为 ESM 格式并合并为少数几个文件，从而提升开发服务器启动速度和热更新性能。

- commonJs转换为ESM 避免解析commonjs的兼容性问题
- 依赖合并，减少浏览器请求次数
- 缓存优化与构建结果缓存到node_modules/.vite/deps，后续启动时直接复用，大幅缩短启动时间。

## 缺少 Vue Router，pinia, nprogress, axios 需要安装

pnpm i pinia
pnpm i vue-router@4
pnpm i nprogress
pnpm i axios

## 组件库按ELementPlus按需引入

pnpm i element-plus
pnpm i unplugin-vue-components

### 安装 ElementPlus 图标库

pnpm i @element-plus/icons-vue

在 Vite + Vue3 项目中实现 Element Plus 按需引入，推荐使用官方维护的 自动按需导入插件，无需手动写 import，打包时只会包含你用到的组件和样式，极大减小体积
