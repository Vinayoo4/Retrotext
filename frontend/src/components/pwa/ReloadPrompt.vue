<template>
  <div v-if="offlineReady || needRefresh" class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-50">
    <div>
      <p v-if="offlineReady" class="font-bold">App ready to work offline</p>
      <p v-else class="font-bold">New Update Available</p>
      <p v-if="needRefresh" class="text-sm">Click to update and reload the application.</p>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()" class="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-gray-100 transition">
      Update
    </button>
    <button @click="close" class="text-white hover:text-gray-200">
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>
