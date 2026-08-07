import { setActivePinia, createPinia } from 'pinia';
import { useExpensesStore } from '../stores/expensesStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Expenses Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('can create an expense while offline', async () => {
    const store = useExpensesStore();
    store.isOffline = true;

    await store.createExpense({
      date: '2023-10-01',
      amount: 100,
      currency: 'USD',
      category: 'Software',
      paymentMode: 'Credit Card',
      notes: 'Test',
      status: 'active',
      isRecurring: false,
      tags: []
    });

    expect(store.expenses).toHaveLength(1);
    expect(store.activeExpenses).toHaveLength(1);
    expect(store.totalActiveAmount).toBe(100);
    expect(store.expenses[0]._offlineStatus).toBe('created');
  });

  it('voids expenses instead of hard deleting', async () => {
    const store = useExpensesStore();
    store.isOffline = true;
    store.expenses = [{
        id: '1', date: '2023-10-01', amount: 100, currency: 'USD',
        category: 'Software', paymentMode: 'Credit Card', notes: 'Test',
        status: 'active', isRecurring: false, tags: []
    }];
    store.saveToLocalCache();

    expect(store.totalActiveAmount).toBe(100);

    await store.voidExpense('1');

    const cached = JSON.parse(localStorage.getItem('jarvis_expenses_offline_cache')!);

    expect(cached[0]._offlineStatus).toBe('deleted'); // sync flag
    expect(cached[0].status).toBe('voided');          // business flag

    expect(store.expenses).toHaveLength(1);
    expect(store.activeExpenses).toHaveLength(0); // active getter hides voided
    expect(store.totalActiveAmount).toBe(0);      // totals ignore voided
  });
});
