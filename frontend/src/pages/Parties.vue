<template>
  <div class="p-8">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Parties</h1>
      <button @click="showAddModal = true" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add Party</button>
    </header>

    <div v-if="store.loading" class="text-gray-500">Loading parties...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="party in store.activeParties" :key="party.id" class="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg">{{ party.name }}</h3>
          <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">{{ party.role }}</span>
        </div>
        <div class="text-sm text-gray-600 space-y-1 mb-4 flex-grow">
          <p><span class="font-medium">Email:</span> {{ party.email || 'N/A' }}</p>
          <p><span class="font-medium">Phone:</span> {{ party.phone || 'N/A' }}</p>
          <p v-if="party.notes" class="mt-2 text-gray-500 italic">"{{ party.notes }}"</p>
        </div>
        <div class="flex justify-end gap-2 border-t pt-3">
          <button @click="editParty(party)" class="text-sm text-indigo-600 hover:underline">Edit</button>
          <button @click="store.deleteParty(party.id)" class="text-sm text-red-600 hover:underline">Delete</button>
        </div>
      </div>
      <div v-if="store.activeParties.length === 0" class="text-gray-500 col-span-full py-8 text-center bg-gray-50 rounded-lg border border-dashed">
        No parties found. Add a contact!
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showAddModal || editingParty" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4">{{ editingParty ? 'Edit Party' : 'Add Party' }}</h2>
        <form @submit.prevent="saveParty" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="formData.name" required class="w-full border rounded p-2 focus:ring focus:ring-indigo-200 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="formData.role" class="w-full border rounded p-2 focus:ring focus:ring-indigo-200 outline-none">
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
              <option value="Partner">Partner</option>
            </select>
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" v-model="formData.email" class="w-full border rounded p-2 focus:ring focus:ring-indigo-200 outline-none">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="formData.phone" class="w-full border rounded p-2 focus:ring focus:ring-indigo-200 outline-none">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="formData.notes" class="w-full border rounded p-2 focus:ring focus:ring-indigo-200 outline-none"></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePartiesStore, Party } from '../stores/partiesStore';

const store = usePartiesStore();

const showAddModal = ref(false);
const editingParty = ref<Party | null>(null);

const formData = ref({
  name: '',
  role: 'Customer' as 'Customer' | 'Supplier' | 'Partner',
  email: '',
  phone: '',
  notes: ''
});

onMounted(() => {
  store.initOfflineListener(); store.fetchParties();
});

const editParty = (party: Party) => {
  editingParty.value = party;
  formData.value = {
    name: party.name,
    role: party.role,
    email: party.email,
    phone: party.phone,
    notes: party.notes
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingParty.value = null;
  formData.value = { name: '', role: 'Customer', email: '', phone: '', notes: '' };
};

const saveParty = async () => {
  if (editingParty.value) {
    await store.updateParty(editingParty.value.id, formData.value);
  } else {
    await store.createParty(formData.value);
  }
  closeModal();
};
</script>
