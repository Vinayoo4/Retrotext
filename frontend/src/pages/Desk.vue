<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">OS</div>
        <h1 class="text-xl font-bold tracking-tight text-gray-900">Desk</h1>
      </div>
      <div class="flex items-center gap-4 text-sm font-medium text-gray-600">
        <span class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full" :class="isOffline ? 'bg-red-500' : 'bg-green-500'"></div>
            {{ isOffline ? 'Offline Mode' : 'Online' }}
        </span>
        <button @click="$router.push('/settings')" class="hover:text-black">Settings</button>
      </div>
    </header>

    <main class="flex-grow p-8 max-w-7xl mx-auto w-full">
      <div class="mb-8">
        <h2 class="text-2xl font-light text-gray-700">Good to see you.</h2>
        <p class="text-gray-500">Select a module to manage your operations.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <router-link to="/catalogue" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">📦</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">Catalogue</h3>
            <p class="text-sm text-gray-500 flex-grow">Manage your product offerings, pricing, and descriptions.</p>
            <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-blue-500 flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/parties" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">🤝</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600">Parties</h3>
            <p class="text-sm text-gray-500 flex-grow">Track relationships, customers, suppliers, and partners.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-indigo-500 flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/expenses" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">💸</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600">Expenses</h3>
            <p class="text-sm text-gray-500 flex-grow">Log and void spend, track recurring costs.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-red-500 flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

         <router-link to="/insights" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">📊</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600">Insights</h3>
            <p class="text-sm text-gray-500 flex-grow">Read-only aggregations and analytics across all modules.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-green-500 flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/daysheet" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">📅</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-black">Day Sheet</h3>
            <p class="text-sm text-gray-500 flex-grow">Auto-organized notes, gaps, and daily enlightenment.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-black flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/campaigns" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">📢</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-black">Campaigns</h3>
            <p class="text-sm text-gray-500 flex-grow">Generate and approve 365-day scale content plans.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-black flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/missions" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">🚀</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-black">Missions</h3>
            <p class="text-sm text-gray-500 flex-grow">Dispatch agent commands and monitor parallel workstreams.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-black flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

        <router-link to="/editor" class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all flex flex-col h-full">
            <div class="text-3xl mb-4">📝</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600">Code Canvas</h3>
            <p class="text-sm text-gray-500 flex-grow">Draft and edit code with offline persistence.</p>
             <div class="mt-4 pt-4 border-t text-xs font-semibold text-gray-400 group-hover:text-purple-500 flex justify-between">
                <span>OPEN MODULE</span>
                <span>→</span>
            </div>
        </router-link>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOffline = ref(!navigator.onLine);

const updateOnlineStatus = () => {
    isOffline.value = !navigator.onLine;
};

onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
});
</script>
