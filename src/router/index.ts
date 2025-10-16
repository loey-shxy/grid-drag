import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('../components/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: async () => await import('../views/Home.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router