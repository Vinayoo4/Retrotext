import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  { path: '/', name: 'Home', redirect: '/desk'  },
  { path: '/editor', name: 'Editor', component: () => import('../pages/Editor.vue') },
  { path: '/catalogue', name: 'Catalogue', component: () => import('../pages/Catalogue.vue') },
  { path: '/parties', name: 'Parties', component: () => import('../pages/Parties.vue') }
  , { path: '/expenses', name: 'Expenses', component: () => import('../pages/Expenses.vue') }
  , { path: '/insights', name: 'Insights', component: () => import('../pages/Insights.vue') }
  , { path: '/settings', name: 'Settings', component: () => import('../pages/Settings.vue') }
  , { path: '/desk', name: 'Desk', component: () => import('../pages/Desk.vue') }
  , { path: '/missions', name: 'Missions', component: () => import('../pages/Missions.vue') }
  , { path: '/daysheet', name: 'DaySheet', component: () => import('../pages/DaySheet.vue') }
  , { path: '/campaigns', name: 'Campaigns', component: () => import('../pages/Campaigns.vue') }
];
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;
