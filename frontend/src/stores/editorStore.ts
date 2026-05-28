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
