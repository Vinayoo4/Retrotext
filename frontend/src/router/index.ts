import { createRouter, createWebHistory } from 'vue-router';
const routes = [{ path: '/', name: 'Home', component: () => import('../pages/Editor.vue') }];
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;
