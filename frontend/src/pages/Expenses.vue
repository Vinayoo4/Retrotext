<template>
  <div class="p-8">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Expenses</h1>
        <p class="text-gray-600 mt-1">Total Active: <span class="font-bold text-red-600">{{ formatCurrency(store.totalActiveAmount, 'USD') }}</span></p>
      </div>
      <button @click="showAddModal = true" class="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">Add Expense</button>
    </header>

    <div v-if="store.loading" class="text-gray-500">Loading expenses...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else>
      <div class="mb-4 flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input v-model="filters.search" placeholder="Search notes/category..." class="border p-2 rounded flex-1">
        <select v-model="filters.paymentMode" class="border p-2 rounded">
          <option value="">All Payment Modes</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="expense in filteredExpenses" :key="expense.id" class="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm text-gray-500">{{ new Date(expense.date).toLocaleDateString() }}</span>
            <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{{ expense.category }}</span>
          </div>
          <div class="text-2xl font-bold text-red-600 mb-2">
            {{ formatCurrency(expense.amount, expense.currency) }}
          </div>
          <div class="text-sm text-gray-600 flex-grow mb-4">
            <p v-if="expense.notes" class="italic mb-1">"{{ expense.notes }}"</p>
            <p><span class="font-medium">Mode:</span> {{ expense.paymentMode }}</p>
            <p v-if="expense.isRecurring" class="text-blue-600 mt-1">⟳ Recurring</p>
          </div>
          <div class="flex justify-end gap-2 border-t pt-3">
            <button @click="editExpense(expense)" class="text-sm text-blue-600 hover:underline">Edit</button>
            <button @click="store.voidExpense(expense.id)" class="text-sm text-red-600 hover:underline">Void</button>
          </div>
        </div>
        <div v-if="filteredExpenses.length === 0" class="text-gray-500 col-span-full py-8 text-center bg-gray-50 rounded-lg border border-dashed">
          No active expenses found matching criteria.
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showAddModal || editingExpense" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-bold mb-4">{{ editingExpense ? 'Edit Expense' : 'Add Expense' }}</h2>
        <form @submit.prevent="saveExpense" class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" step="0.01" v-model.number="formData.amount" required class="w-full border rounded p-2 focus:ring outline-none">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" v-model="formData.date" required class="w-full border rounded p-2 focus:ring outline-none">
            </div>
          </div>
          <div class="flex gap-4">
             <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="formData.category" required class="w-full border rounded p-2 focus:ring outline-none">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select v-model="formData.paymentMode" class="w-full border rounded p-2 focus:ring outline-none">
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="formData.notes" class="w-full border rounded p-2 focus:ring outline-none"></textarea>
          </div>
          <div class="flex items-center gap-2">
             <input type="checkbox" v-model="formData.isRecurring" id="recurring" class="rounded">
             <label for="recurring" class="text-sm font-medium text-gray-700">Is Recurring</label>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useExpensesStore, Expense } from '../stores/expensesStore';
import { formatCurrency } from '../common/utils';

const store = useExpensesStore();

const showAddModal = ref(false);
const editingExpense = ref<Expense | null>(null);

const filters = ref({
    search: '',
    paymentMode: ''
});

const defaultForm = {
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  currency: 'USD',
  category: '',
  paymentMode: 'Credit Card',
  notes: '',
  status: 'active' as const,
  isRecurring: false,
  tags: []
};

const formData = ref({ ...defaultForm });

onMounted(() => {
  store.initOfflineListener();
  store.fetchExpenses();
});

const filteredExpenses = computed(() => {
    return store.activeExpenses.filter(e => {
        const matchSearch = (e.notes || '').toLowerCase().includes(filters.value.search.toLowerCase()) ||
                            (e.category || '').toLowerCase().includes(filters.value.search.toLowerCase());
        const matchMode = filters.value.paymentMode ? e.paymentMode === filters.value.paymentMode : true;
        return matchSearch && matchMode;
    });
});

const editExpense = (expense: Expense) => {
  editingExpense.value = expense;
  formData.value = {
    date: expense.date,
    amount: expense.amount,
    currency: expense.currency,
    category: expense.category,
    paymentMode: expense.paymentMode,
    notes: expense.notes,
    status: expense.status,
    isRecurring: expense.isRecurring,
    tags: expense.tags
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingExpense.value = null;
  formData.value = { ...defaultForm };
};

const saveExpense = async () => {
  if (editingExpense.value) {
    await store.updateExpense(editingExpense.value.id, formData.value);
  } else {
    await store.createExpense(formData.value);
  }
  closeModal();
};
</script>
