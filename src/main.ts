import App from './App.vue'
import { createApp } from 'vue'
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 移动端网页兼容性优化，解决因浏览器默认被动监听模式导致的页面滑动卡顿问题
document.addEventListener(
    'touchstart',
    function () {},
    { passive: false }
)

const app = createApp(App)


// 注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
