<template>
  <div class="p-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Catalogue</h1>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Add Item</button>
    </header>

    <div v-if="store.loading" class="text-gray-500">Loading catalogue...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="item in store.activeItems" :key="item.id" class="border rounded-lg p-4 shadow-sm bg-white">
        <h3 class="font-bold text-lg mb-2">{{ item.name }}</h3>
        <p class="text-gray-600 mb-2">{{ item.description }}</p>
        <div class="flex justify-between items-center text-sm">
          <span class="font-bold text-blue-600">${{ item.price.toFixed(2) }}</span>
          <span class="bg-gray-100 px-2 py-1 rounded text-gray-600">{{ item.category }}</span>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="editItem(item)" class="text-sm text-blue-600 hover:underline">Edit</button>
          <button @click="store.deleteItem(item.id)" class="text-sm text-red-600 hover:underline">Delete</button>
        </div>
      </div>
      <div v-if="store.activeItems.length === 0" class="text-gray-500 col-span-full py-8 text-center bg-gray-50 rounded-lg border border-dashed">
        No items in the catalogue. Add one!
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showAddModal || editingItem" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h2>
        <form @submit.prevent="saveItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="formData.name" required class="w-full border rounded p-2 focus:ring focus:ring-blue-200 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="formData.description" required class="w-full border rounded p-2 focus:ring focus:ring-blue-200 outline-none"></textarea>
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" step="0.01" v-model.number="formData.price" required class="w-full border rounded p-2 focus:ring focus:ring-blue-200 outline-none">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="formData.category" required class="w-full border rounded p-2 focus:ring focus:ring-blue-200 outline-none">
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCatalogueStore, CatalogueItem } from '../stores/catalogueStore';

const store = useCatalogueStore();

const showAddModal = ref(false);
const editingItem = ref<CatalogueItem | null>(null);

const formData = ref({
  name: '',
  description: '',
  price: 0,
  category: ''
});

onMounted(() => {
  store.initOfflineListener(); store.fetchItems();
});

const editItem = (item: CatalogueItem) => {
  editingItem.value = item;
  formData.value = {
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingItem.value = null;
  formData.value = { name: '', description: '', price: 0, category: '' };
};

const saveItem = async () => {
  if (editingItem.value) {
    await store.updateItem(editingItem.value.id, formData.value);
  } else {
    await store.createItem(formData.value);
  }
  closeModal();
};
</script>
