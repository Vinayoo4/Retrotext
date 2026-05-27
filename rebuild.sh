#!/bin/bash
set -e
mkdir -p frontend/public/icons frontend/src/assets frontend/src/components/pwa frontend/src/pages frontend/src/router frontend/src/stores frontend/src/services frontend/src/styles
mkdir -p backend/src/routes backend/src/controllers backend/src/storage shared/types data/seed

# Backend setup
cd backend
npm init -y
npm install express cors
npm install -D typescript ts-node @types/express @types/cors @types/node
echo '{"compilerOptions":{"target":"es2022","module":"commonjs","esModuleInterop":true,"strict":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true,"types":["node"]}}' > tsconfig.json

cat << 'SERVER' > src/server.ts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const seedThemes = [
  { id: "theme-dark", name: "Dark Canvas", colors: { background: "#1e1e1e", text: "#d4d4d4", primary: "#007acc", secondary: "#333333", accent: "#569cd6" } },
  { id: "theme-light", name: "Light Canvas", colors: { background: "#ffffff", text: "#000000", primary: "#005cc5", secondary: "#f6f8fa", accent: "#d73a49" } }
];

app.get('/api/themes', (req, res) => {
  res.json(seedThemes);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
SERVER
cd ..

# Shared setup
cat << 'SHARED' > shared/types/index.ts
export interface Theme {
  id: string;
  name: string;
  colors: { background: string; text: string; primary: string; secondary: string; accent: string; };
}
SHARED

# Frontend setup
cd frontend
npm create vite@latest . -- --template vue-ts
npm install vue-router pinia vite-plugin-pwa tailwindcss postcss autoprefixer
npm install -D tailwindcss@3.4.1
npx tailwindcss init -p

cat << 'VITE_CONFIG' > vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Code Canvas',
        short_name: 'CodeCanvas',
        description: 'A minimal, aesthetic web code editor.',
        theme_color: '#1e1e1e',
        icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }]
      }
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
});
VITE_CONFIG

cat << 'ROUTER' > src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
const routes = [{ path: '/', name: 'Home', component: () => import('../pages/Editor.vue') }];
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;
ROUTER

cat << 'STORES' > src/stores/index.ts
import { createPinia } from 'pinia';
const pinia = createPinia();
export default pinia;
STORES

cat << 'API' > src/services/api.ts
import type { Theme } from '../../../shared/types';
const BASE_URL = 'http://localhost:3001/api';
export const api = {
    async getThemes(): Promise<Theme[]> {
        const response = await fetch(`${BASE_URL}/themes`);
        return response.json();
    }
};
API

cat << 'TAILWIND' > tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
TAILWIND

cat << 'MAIN_CSS' > src/styles/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;
body { margin: 0; font-family: sans-serif; }
MAIN_CSS

cat << 'EDITOR_STORE' > src/stores/editorStore.ts
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Theme } from '../../../shared/types';

export const useEditorStore = defineStore('editor', () => {
  const content = ref('');
  const currentThemeId = ref('theme-dark');
  const themes = ref<Theme[]>([]);

  const savedContent = localStorage.getItem('draft_content');
  if (savedContent) content.value = savedContent;

  const savedTheme = localStorage.getItem('draft_theme');
  if (savedTheme) currentThemeId.value = savedTheme;

  watch(content, (n) => localStorage.setItem('draft_content', n));
  watch(currentThemeId, (n) => localStorage.setItem('draft_theme', n));

  const setThemes = (n: Theme[]) => { themes.value = n; };
  const getTheme = () => themes.value.find(t => t.id === currentThemeId.value);

  const exportSession = () => {
    const data = { version: "1.0.0", session: { content: content.value, themeId: currentThemeId.value } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSession = async (file: File) => {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                content.value = data.session.content;
                currentThemeId.value = data.session.themeId;
                resolve(true);
            } catch (err) { reject(err); }
        };
        r.readAsText(file);
    });
  };

  return { content, currentThemeId, themes, setThemes, getTheme, exportSession, importSession };
});
EDITOR_STORE

cat << 'EDITOR_VUE' > src/pages/Editor.vue
<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300" :style="themeStyles">
    <header class="p-4 flex justify-between items-center border-b" :style="{ borderColor: theme?.colors.secondary }">
      <h1 class="text-xl font-bold">Code Canvas</h1>
      <div class="flex gap-4">
        <select v-model="editorStore.currentThemeId" class="p-2 rounded bg-black/20 text-white">
          <option v-for="t in editorStore.themes" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button @click="editorStore.exportSession" class="px-4 py-2 rounded font-bold" :style="{ backgroundColor: theme?.colors.primary, color: '#fff' }">Export</button>
        <label class="px-4 py-2 rounded font-bold cursor-pointer" :style="{ backgroundColor: theme?.colors.secondary, color: theme?.colors.text }">
          Import <input type="file" accept=".json" class="hidden" @change="handleImport">
        </label>
      </div>
    </header>
    <main class="flex-grow p-8 flex justify-center">
      <div class="w-full max-w-5xl rounded-xl shadow-2xl flex flex-col" :style="{ backgroundColor: theme?.colors.secondary }">
        <textarea v-model="editorStore.content" class="flex-grow w-full p-6 bg-transparent outline-none resize-none font-mono text-lg" :style="{ color: theme?.colors.accent }" placeholder="Start typing..."></textarea>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useEditorStore } from '../stores/editorStore';
import { api } from '../services/api';

const editorStore = useEditorStore();
const theme = computed(() => editorStore.getTheme());
const themeStyles = computed(() => theme.value ? { backgroundColor: theme.value.colors.background, color: theme.value.colors.text } : {});

const handleImport = async (e: Event) => {
  const t = e.target as HTMLInputElement;
  if (t.files?.length) await editorStore.importSession(t.files[0]);
};

onMounted(async () => {
    try {
        const themes = await api.getThemes();
        if(themes) editorStore.setThemes(themes);
    } catch (e) { console.error(e); }
});
</script>
EDITOR_VUE

cat << 'APP_VUE' > src/App.vue
<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
@import './styles/main.css';
</style>
APP_VUE

cat << 'MAIN_TS' > src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './styles/main.css';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
MAIN_TS

touch public/icons/icon-192x192.png
touch public/icons/icon-512x512.png

cd ..
