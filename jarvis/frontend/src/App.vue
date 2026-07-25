<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-800 border-b border-gray-700 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-widest text-xs">SH</div>
        <h1 class="text-xl font-bold tracking-tight text-white">JARVIS <span class="text-xs text-gray-400 font-normal ml-2 tracking-widest uppercase">Kernel v1</span></h1>
      </div>
      <nav class="flex gap-4">
        <router-link to="/memory" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" active-class="bg-gray-900 text-white">Memory</router-link>
        <router-link to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" active-class="bg-gray-900 text-white">Dashboard</router-link>
        <router-link to="/knowledge" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" active-class="bg-gray-900 text-white">Knowledge</router-link>
        <router-link to="/audit" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" active-class="bg-gray-900 text-white">Audit</router-link>
      </nav>
    </header>

    <main class="flex-grow p-6 max-w-7xl w-full mx-auto">
      <RouterView />
    </main>
  </div>
</template>
