<template>
  <div class="p-8">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Insights</h1>
      <p class="text-gray-600">Cross-module analytics and read-only reports</p>
    </header>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Expenses Summary -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold mb-4 flex items-center text-gray-700">
          <span class="mr-2">💸</span> Financial
        </h3>
        <div v-if="expensesStore.loading" class="text-sm text-gray-500">Calculating...</div>
        <div v-else>
            <p class="text-sm text-gray-600 mb-1">Total Active Spend</p>
            <p class="text-3xl font-bold text-red-600 mb-4">{{ formatCurrency(expensesStore.totalActiveAmount, 'USD') }}</p>
            <div class="text-sm">
                <p class="font-medium text-gray-700 mb-2">Top Categories:</p>
                <ul class="space-y-1 text-gray-600">
                    <li v-for="cat in topCategories" :key="cat.name" class="flex justify-between">
                        <span>{{ cat.name }}</span>
                        <span class="font-medium">{{ formatCurrency(cat.amount, 'USD') }}</span>
                    </li>
                    <li v-if="topCategories.length === 0" class="italic text-gray-400">No data available</li>
                </ul>
            </div>
        </div>
      </div>

      <!-- Parties Summary -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold mb-4 flex items-center text-gray-700">
          <span class="mr-2">🤝</span> Relationships
        </h3>
        <div v-if="partiesStore.loading" class="text-sm text-gray-500">Calculating...</div>
        <div v-else>
            <div class="grid grid-cols-2 gap-4 text-center mb-4">
                <div class="bg-indigo-50 p-3 rounded">
                    <p class="text-2xl font-bold text-indigo-700">{{ partiesStore.activeParties.length }}</p>
                    <p class="text-xs text-indigo-600 uppercase tracking-wider font-semibold">Total Parties</p>
                </div>
                 <div class="bg-indigo-50 p-3 rounded">
                    <p class="text-2xl font-bold text-indigo-700">{{ partiesByRole['Customer'] || 0 }}</p>
                    <p class="text-xs text-indigo-600 uppercase tracking-wider font-semibold">Customers</p>
                </div>
            </div>
        </div>
      </div>

       <!-- Catalogue Summary -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold mb-4 flex items-center text-gray-700">
          <span class="mr-2">📦</span> Catalogue
        </h3>
        <div v-if="catalogueStore.loading" class="text-sm text-gray-500">Calculating...</div>
        <div v-else>
            <p class="text-sm text-gray-600 mb-1">Total Offerings</p>
            <p class="text-3xl font-bold text-blue-600 mb-4">{{ catalogueStore.activeItems.length }}</p>
            <p class="text-sm text-gray-600">
                Average Price: <span class="font-medium text-gray-800">{{ formatCurrency(avgCataloguePrice, 'USD') }}</span>
            </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useExpensesStore } from '../stores/expensesStore';
import { usePartiesStore } from '../stores/partiesStore';
import { useCatalogueStore } from '../stores/catalogueStore';
import { formatCurrency } from '../common/utils';

const expensesStore = useExpensesStore();
const partiesStore = usePartiesStore();
const catalogueStore = useCatalogueStore();

onMounted(() => {
    // Read-only initialization. Data ownership remains with the domain modules.
    if(expensesStore.expenses.length === 0) expensesStore.fetchExpenses();
    if(partiesStore.parties.length === 0) partiesStore.fetchParties();
    if(catalogueStore.items.length === 0) catalogueStore.fetchItems();
});

const topCategories = computed(() => {
    const sums: Record<string, number> = {};
    expensesStore.activeExpenses.forEach(e => {
        sums[e.category] = (sums[e.category] || 0) + e.amount;
    });
    return Object.entries(sums)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);
});

const partiesByRole = computed(() => {
    return partiesStore.activeParties.reduce((acc, p) => {
        acc[p.role] = (acc[p.role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
});

const avgCataloguePrice = computed(() => {
    const items = catalogueStore.activeItems;
    if(items.length === 0) return 0;
    const sum = items.reduce((acc, i) => acc + i.price, 0);
    return sum / items.length;
});
</script>
