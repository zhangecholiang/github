import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AMap from 'vue-amap'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(AMap).use(ElementPlus).mount('#app')
