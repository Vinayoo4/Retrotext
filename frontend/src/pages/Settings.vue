<template>
  <div class="p-8 max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Settings</h1>
      <p class="text-gray-600">Manage your system preferences and data.</p>
    </header>

    <div class="space-y-8">
      <!-- Data Management -->
      <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Data Management</h3>
        <p class="text-sm text-gray-600 mb-4">Your data is stored locally. You can clear the offline cache if you experience synchronization issues.</p>

        <div class="flex items-center gap-4">
          <button @click="clearCache" class="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded shadow-sm hover:bg-red-100 transition-colors font-medium">
            Clear Local Cache
          </button>
          <span v-if="cacheCleared" class="text-green-600 text-sm font-medium">Cache cleared successfully.</span>
        </div>
      </section>

      <!-- Advanced Settings Placeholder -->
      <section class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-75">
        <h3 class="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Advanced (Coming Soon)</h3>
        <div class="space-y-4">
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Theme Preference</label>
             <select disabled class="w-full md:w-1/2 border rounded p-2 bg-gray-50 text-gray-500 cursor-not-allowed">
               <option>System Default</option>
               <option>Light</option>
               <option>Dark</option>
             </select>
          </div>
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
             <select disabled class="w-full md:w-1/2 border rounded p-2 bg-gray-50 text-gray-500 cursor-not-allowed">
               <option>USD ($)</option>
               <option>EUR (€)</option>
               <option>GBP (£)</option>
             </select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cacheCleared = ref(false);

const clearCache = () => {
    // Explicit destructive action requires user trigger (Tier 4 equivalent for local data)
    if(confirm("Are you sure you want to clear the local cache? Any unsynced offline drafts will be permanently lost.")) {
        localStorage.removeItem('jarvis_catalogue_offline_cache');
        localStorage.removeItem('jarvis_parties_offline_cache');
        localStorage.removeItem('jarvis_expenses_offline_cache');
        cacheCleared.value = true;
        setTimeout(() => cacheCleared.value = false, 3000);

        // Force reload to cleanly reset stores state from backend
        window.location.reload();
    }
};
</script>
