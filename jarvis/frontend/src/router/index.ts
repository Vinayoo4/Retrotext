import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('../views/KnowledgeView.vue')
    },
    {
      path: '/audit',
      name: 'audit',
      component: () => import('../views/AuditView.vue')
    },
    {
      path: '/memory',
      name: 'memory',
      component: () => import('../views/MemoryView.vue')
    }
  ]
})

export default router
