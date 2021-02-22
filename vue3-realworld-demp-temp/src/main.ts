import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 以前创建 vue 根实例用 new Vue()，现在用 createApp

createApp(App)
  .use(store) // use是挂载路由实例
  .use(router)
  .mount('#app') // 作用到根节点，这句代码要放在最最后
