import { defineStore } from 'pinia';

export interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  _offlineStatus?: 'created' | 'updated' | 'deleted';
}

const OFFLINE_KEY = 'jarvis_catalogue_offline_cache';

export const useCatalogueStore = defineStore('catalogue', {
  state: () => ({
    items: [] as CatalogueItem[],
    loading: false,
    error: null as string | null,
    isOffline: !navigator.onLine,
  }),
  getters: {
    activeItems: (state) => state.items.filter(i => i._offlineStatus !== 'deleted')
  },
  actions: {
    initOfflineListener() {
      window.addEventListener('online', async () => {
        this.isOffline = false;
        await this.syncOfflineData();
        this.fetchItems();
      });
      window.addEventListener('offline', () => {
        this.isOffline = true;
      });
    },
    saveToLocalCache() {
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(this.items));
    },
    loadFromLocalCache() {
      const cached = localStorage.getItem(OFFLINE_KEY);
      if (cached) {
        this.items = JSON.parse(cached);
      }
    },
    async syncOfflineData() {
      const drafts = this.items.filter(i => i._offlineStatus);
      for (const draft of drafts) {
        try {
          const payload = { ...draft };
          const originalId = draft.id;
          const status = draft._offlineStatus;

          delete payload.id;
          delete payload._offlineStatus;
          delete payload.createdAt;
          delete payload.updatedAt;

          if (status === 'created') {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'updated') {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue/${originalId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'deleted') {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue/${originalId}`, {
              method: 'DELETE',
            });
          }
        } catch (e) {
          console.error("Failed to sync offline draft", draft);
        }
      }
    },
    async fetchItems() {
      this.loading = true;
      try {
        if (this.isOffline) {
          this.loadFromLocalCache();
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue`);
        if (!response.ok) throw new Error('Failed to fetch');
        this.items = await response.json();
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
        this.loadFromLocalCache();
      } finally {
        this.loading = false;
      }
    },
    async createItem(item: Omit<CatalogueItem, 'id' | '_offlineStatus'>) {
      if (this.isOffline) {
        const newItem = {
          id: crypto.randomUUID(),
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _offlineStatus: 'created' as const
        };
        this.items.push(newItem);
        this.saveToLocalCache();
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Failed to create');
        const newItem = await response.json();
        this.items.push(newItem);
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async updateItem(id: string, updates: Partial<CatalogueItem>) {
      if (this.isOffline) {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
          const currentStatus = this.items[index]._offlineStatus;
          this.items[index] = {
            ...this.items[index],
            ...updates,
            updatedAt: new Date().toISOString(),
            _offlineStatus: currentStatus === 'created' ? 'created' : 'updated'
          };
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update');
        const updatedItem = await response.json();
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
          this.items[index] = updatedItem;
          this.saveToLocalCache();
        }
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async deleteItem(id: string) {
      if (this.isOffline) {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
          if (this.items[index]._offlineStatus === 'created') {
             // Hard delete if it was just created offline
             this.items = this.items.filter(i => i.id !== id);
          } else {
             // Mark for sync deletion later
             this.items[index]._offlineStatus = 'deleted';
          }
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/catalogue/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        this.items = this.items.filter(i => i.id !== id);
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
      }
    }
  }
});
