import { setActivePinia, createPinia } from 'pinia';
import { useCatalogueStore } from '../stores/catalogueStore';
import { usePartiesStore } from '../stores/partiesStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Catalogue Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('can create an item while offline', async () => {
    const store = useCatalogueStore();
    store.isOffline = true;

    await store.createItem({
      name: 'Test Item',
      description: 'Desc',
      price: 10,
      category: 'Cat'
    });

    expect(store.items).toHaveLength(1);
    expect(store.activeItems).toHaveLength(1);
    expect(store.items[0].name).toBe('Test Item');
    expect(store.items[0]._offlineStatus).toBe('created');
    expect(localStorage.getItem('jarvis_catalogue_offline_cache')).toBeTruthy();
  });

  it('can update and delete items offline', async () => {
    const store = useCatalogueStore();
    store.isOffline = true;
    store.items = [{ id: '1', name: 'Item', description: 'Desc', price: 10, category: 'Cat' }];
    store.saveToLocalCache();

    await store.updateItem('1', { name: 'Updated' });

    let cached = JSON.parse(localStorage.getItem('jarvis_catalogue_offline_cache')!);
    expect(cached[0].name).toBe('Updated');
    expect(cached[0]._offlineStatus).toBe('updated');

    await store.deleteItem('1');
    cached = JSON.parse(localStorage.getItem('jarvis_catalogue_offline_cache')!);
    expect(cached[0]._offlineStatus).toBe('deleted');

    // Crucial fix: The item should remain in the cache array with 'deleted' status
    expect(store.items).toHaveLength(1);
    // But it should be hidden from the activeItems getter used by the UI
    expect(store.activeItems).toHaveLength(0);
  });
});
