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
      <button @click="editorStore.saveToCloud" class="px-4 py-2 rounded font-bold ml-4" :style="{ backgroundColor: '#4CAF50', color: '#fff' }">Save to Cloud</button>
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
import { logger } from '../../../shared/utils/logger';
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
    } catch (e) {
        logger.error('Failed to fetch themes', e); }
});
</script>
