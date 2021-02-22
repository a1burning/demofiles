import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '', // 默认子组件
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
      }
    ]
  }
]

// new VueRouter()
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
