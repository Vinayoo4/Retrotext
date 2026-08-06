import { defineStore } from 'pinia';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  paymentMode: string;
  partyId?: string;
  notes: string;
  status: 'active' | 'voided';
  isRecurring: boolean;
  recurrenceRule?: string;
  tags: string[];
  attachmentRef?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  _offlineStatus?: 'created' | 'updated' | 'deleted';
}

const OFFLINE_KEY = 'jarvis_expenses_offline_cache';

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [] as Expense[],
    loading: false,
    error: null as string | null,
    isOffline: !navigator.onLine,
  }),
  getters: {
    activeExpenses: (state) => state.expenses.filter(e => e._offlineStatus !== 'deleted' && e.status !== 'voided'),
    totalActiveAmount: (state) => {
        // Simplified assuming single currency for MVP, but easily extensible
        return state.expenses
            .filter(e => e._offlineStatus !== 'deleted' && e.status !== 'voided')
            .reduce((sum, exp) => sum + exp.amount, 0);
    }
  },
  actions: {
    initOfflineListener() {
      window.addEventListener('online', async () => {
        this.isOffline = false;
        await this.syncOfflineData();
        this.fetchExpenses();
      });
      window.addEventListener('offline', () => {
        this.isOffline = true;
      });
    },
    saveToLocalCache() {
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(this.expenses));
    },
    loadFromLocalCache() {
      const cached = localStorage.getItem(OFFLINE_KEY);
      if (cached) {
        this.expenses = JSON.parse(cached);
      }
    },
    async syncOfflineData() {
      const drafts = this.expenses.filter(e => e._offlineStatus);
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
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'updated') {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses/${originalId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else if (status === 'deleted') {
            // Mapping delete to void in the backend
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses/${originalId}`, {
              method: 'DELETE',
            });
          }
        } catch (e) {
          console.error("Failed to sync offline draft", draft);
        }
      }
    },
    async fetchExpenses() {
      this.loading = true;
      try {
        if (this.isOffline) {
          this.loadFromLocalCache();
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses`);
        if (!response.ok) throw new Error('Failed to fetch');
        this.expenses = await response.json();
        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
        this.loadFromLocalCache();
      } finally {
        this.loading = false;
      }
    },
    async createExpense(expense: Omit<Expense, 'id' | '_offlineStatus'>) {
      const newId = crypto.randomUUID();
      if (this.isOffline) {
        const newExp = {
          id: newId,
          ...expense,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _offlineStatus: 'created' as const,
          version: 1
        };
        this.expenses.push(newExp as Expense);
        this.saveToLocalCache();
        return;
      }
      try {
        const payload = { id: newId, ...expense };
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create');
        const newExp = await response.json();

        // Dedupe logic on client side to prevent double adding if same ID was successfully created
        const exists = this.expenses.findIndex(e => e.id === newExp.id);
        if(exists === -1) {
            this.expenses.push(newExp);
        } else {
            this.expenses[exists] = newExp;
        }

        this.saveToLocalCache();
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async updateExpense(id: string, updates: Partial<Expense>) {
      if (this.isOffline) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
          const currentStatus = this.expenses[index]._offlineStatus;
          this.expenses[index] = {
            ...this.expenses[index],
            ...updates,
            updatedAt: new Date().toISOString(),
            _offlineStatus: currentStatus === 'created' ? 'created' : 'updated'
          };
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update');
        const updatedExp = await response.json();
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
          this.expenses[index] = updatedExp;
          this.saveToLocalCache();
        }
      } catch (e: any) {
        this.error = e.message;
      }
    },
    async voidExpense(id: string) {
      if (this.isOffline) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
          if (this.expenses[index]._offlineStatus === 'created') {
             this.expenses = this.expenses.filter(e => e.id !== id);
          } else {
             this.expenses[index]._offlineStatus = 'deleted'; // acts as void offline
             this.expenses[index].status = 'voided';
          }
          this.saveToLocalCache();
        }
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/expenses/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to void');
        const updatedExp = await response.json();

        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
          this.expenses[index] = updatedExp;
          this.saveToLocalCache();
        }
      } catch (e: any) {
        this.error = e.message;
      }
    }
  }
});
