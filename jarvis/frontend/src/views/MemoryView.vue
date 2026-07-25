<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const memories = ref<any[]>([])

const fetchMemories = async () => {
  try {
    const res = await axios.get('/api/v1/memory?limit=100')
    memories.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchMemories)
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-white">System Memory</h2>
      <button @click="fetchMemories" class="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white">Refresh</button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-400">
        <thead class="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Time</th>
            <th scope="col" class="px-6 py-3">Type</th>
            <th scope="col" class="px-6 py-3">Key</th>
            <th scope="col" class="px-6 py-3">Content</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="memories.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">No memory entries found.</td>
          </tr>
          <tr v-for="mem in memories" :key="mem.id" class="border-b border-gray-800 hover:bg-gray-750">
            <td class="px-6 py-4 whitespace-nowrap">{{ new Date(mem.timestamp * 1000).toLocaleString() }}</td>
            <td class="px-6 py-4 font-mono text-blue-400">{{ mem.memory_type }}</td>
            <td class="px-6 py-4 text-xs">{{ mem.key || 'N/A' }}</td>
            <td class="px-6 py-4 font-mono text-xs break-all max-w-md whitespace-pre-wrap">
              {{ mem.content }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
