import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite' // 按需导入组件
import AutoImport from 'unplugin-auto-import/vite' // 自动导入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'  // 按需导入 Element Plus 解析器
import { fileURLToPath } from 'url' // 用于将 file:// 协议的 URL 转换为文件路径
// import { visualizer } from 'rollup-plugin-visualizer'

// https://devtools.vuejs.org/getting-started/introduction
import vueDevTools from 'vite-plugin-vue-devtools'

// 若改为带 mode 的函数，可实现环境差异化配置
// 通过函数接收 Vite 的构建模式（mode）
export default ({ mode }: { mode: string }) => {
  const root = process.cwd() // 获取项目根目录
  const env = loadEnv(mode, root) // 加载环境变量
  // 获取环境变量
  const { VITE_VERSION, VITE_PORT, VITE_BASE_URL, VITE_API_URL } = env

  console.log(`🚀 API_URL = ${VITE_API_URL}`)
  console.log(`🚀 VERSION = ${VITE_VERSION}`)

  return defineConfig({
    // 定义全局常量
    define: { 
      __APP_VERSION__: JSON.stringify(VITE_VERSION),
    },
    base: VITE_BASE_URL, // 打包路径
    server: { // 服务配置
      port: parseInt(VITE_PORT), // 服务端口号
      proxy: { // 代理配置
        '/api': {
          target: VITE_API_URL, // 代理的目标地址
          changeOrigin: true, // 开发模式，默认的 origin 是真实的 origin:localhost:3000
          rewrite: (path) => path.replace(/^\/api/, '') // 重写传过来的path路径，去除/api
        },
      },
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
    },
    // 别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 把 @ 指向到 src 目录去
        '@views': path.resolve(__dirname,'src/views'), // 把 @views 指向到 src/views 目录去
        '@imgs': path.resolve(__dirname,'src/assets/imgs'), // 把 @imgs 指向到 src/assets/imgs 目录去
        '@icons': path.resolve(__dirname,'src/assets/icons'), // 把 @icons 指向到 src/assets/icons 目录去
        '@utils': path.resolve(__dirname,'src/utils'), // 把 @utils 指向到 src/utils 目录去
        '@stores': path.resolve(__dirname,'src/stores'), // 把 @stores 指向到 src/stores 目录去
        '@plugins': path.resolve(__dirname,'src/plugins'), // 把 @plugins 指向到 src/plugins 目录去
        '@styles': path.resolve(__dirname,'src/styles'), // 把 @styles 指向到 src/styles 目录去
      }
    },
    // 打包配置 以下都是优化配置思路，具体配置看项目需求
    build: {
      outDir: 'dist', // 指定输出路径
      target: 'es2015', // 设置最终构建的浏览器兼容目标
      chunkSizeWarningLimit: 2000, // 单位kb  打包后文件大小警告的限制 (文件大于此此值会出现警告)
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境去除 console
          drop_debugger: true // 生产环境去除 debugger
        }
      },
      rollupOptions: { // 自定义底层的 Rollup 打包配置
        output: {
          manualChunks: {
            // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
            vendor: ['vue', 'vue-router', 'pinia', 'element-plus'], // 指定项目运行依赖包
          }
        }
      },
      dynamicImportVarsOptions: { // 动态导入变量
        warnOnError: false, // 当动态导入变量时，是否显示警告信息
        exclude: [], // 排除的变量
        include: ['src/views/**/*.vue'] // 包含的变量
      }
    },
    // 插件list
    plugins: [
      vue(), 
      vueDevTools(),
      // 自动导入 components 下面的组件，无需 import 引入
      Components({
        deep: true,
        extensions: ['vue'],
        dirs: ['src/components'], // 自动导入的组件目录
        resolvers: [ElementPlusResolver()], // 按需导入 UI 库解析器（以 Element Plus 为例）
        dts: 'src/types/components.d.ts' // 指定类型声明文件的路径
      }),
      // 自动导入 vue 、vue-router、@vueuse/core、pinia 等
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
        // 按需导入 UI 库解析器（以 Element Plus 为例）
        resolvers: [ElementPlusResolver()], 
        // 生成全局声明文件
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          // 这里先设置成true然后pnpm dev 运行之后会生成 .auto-import.json 文件之后，在改为false
          enabled: true,
          filepath: './.auto-import.json',
          globalsPropValue: true
        }
      }),
      // 压缩
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用
        algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz', // 压缩后的文件名后缀
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240B = 10KB
        deleteOriginFile: false // 压缩后是否删除原文件
      }),
      // 打包分析
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: 'dist/stats.html' // 分析图生成的文件名及路径
      // }),
    ],
  })
}
