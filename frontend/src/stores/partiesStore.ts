import { defineStore } from 'pinia';

export interface Party {
  id: string;
  name: string;
  role: 'Customer' | 'Supplier' | 'Partner';
  email: string;
  phone: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
  _offlineStatus?: 'created' | 'updated' | 'deleted';
}

const OFFLINE_KEY = 'jarvis_parties_offline_cache';

export const usePartiesStore = defineStore('parties', {
  state: () => ({
    parties: [] as Party[],
    loading: false,
    error: null as string | null,
    isOffline: !navigator.onLine,
  }),
  getters: {
    activeParties: (state) => state.parties.filter(p => p._offlineStatus !== 'deleted')
  },
  actions: {
    initOfflineListener() {
      window.addEventListener('online', async () => {
        this.isOffline = false;
        await this.syncOfflineData();
        this.fetchParties();
      });
      window.addEventListener('offline', () => {
        this.isOffline = true;
      });
    },
    saveToLocalCache() {
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(this.parties));
    },
    loadFromLocalCache() {
      const cached = localStorage.getItem(OFFLINE_KEY);
      if (cached) {
        this.parties = JSON.parse(cached);
      }
    },
    async syncOfflineData() {
      const drafts = this.parties.filter(p => p._offlineStatus);
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
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'updated') {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties/${originalId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'deleted') {
             await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties/${originalId}`, {
              method: 'DELETE',
            });
          }
        } catch (e) {
          console.error("Failed to sync offline draft", draft);
        }
      }
    },
    async fetchParties() {
      this.loading = true;
      try {
        if (this.isOffline) {
          this.loadFromLocalCache();
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties`);
        if (!response.ok) throw new Error('Failed to fetch');
        this.parties = await response.json();
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
        this.loadFromLocalCache();
      } finally {
        this.loading = false;
      }
    },
    async createParty(party: Omit<Party, 'id' | '_offlineStatus'>) {
      if (this.isOffline) {
        const newParty = {
          id: crypto.randomUUID(),
          ...party,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _offlineStatus: 'created' as const
        };
        this.parties.push(newParty as Party);
        this.saveToLocalCache();
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(party),
        });
        if (!response.ok) throw new Error('Failed to create');
        const newParty = await response.json();
        this.parties.push(newParty);
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async updateParty(id: string, updates: Partial<Party>) {
      if (this.isOffline) {
        const index = this.parties.findIndex(p => p.id === id);
        if (index !== -1) {
          const currentStatus = this.parties[index]._offlineStatus;
          this.parties[index] = {
            ...this.parties[index],
            ...updates,
            updatedAt: new Date().toISOString(),
            _offlineStatus: currentStatus === 'created' ? 'created' : 'updated'
          };
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update');
        const updatedParty = await response.json();
        const index = this.parties.findIndex(p => p.id === id);
        if (index !== -1) {
          this.parties[index] = updatedParty;
          this.saveToLocalCache();
        }
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async deleteParty(id: string) {
      if (this.isOffline) {
        const index = this.parties.findIndex(p => p.id === id);
        if (index !== -1) {
          if (this.parties[index]._offlineStatus === 'created') {
             this.parties = this.parties.filter(p => p.id !== id);
          } else {
             this.parties[index]._offlineStatus = 'deleted';
          }
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/parties/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        this.parties = this.parties.filter(p => p.id !== id);
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
      }
    }
  }
});
