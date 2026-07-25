<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref<any[]>([])

const fetchLogs = async () => {
  try {
    const res = await axios.get('/api/v1/audit?limit=100')
    logs.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchLogs)
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-white">System Audit Logs</h2>
      <button @click="fetchLogs" class="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white">Refresh</button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-400">
        <thead class="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Time</th>
            <th scope="col" class="px-6 py-3">Action</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" class="border-b border-gray-800 hover:bg-gray-750">
            <td class="px-6 py-4 whitespace-nowrap">{{ new Date(log.timestamp * 1000).toLocaleString() }}</td>
            <td class="px-6 py-4 font-mono text-blue-400">{{ log.action }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs" :class="{'bg-green-900/50 text-green-400': log.status === 'success', 'bg-red-900/50 text-red-400': log.status === 'error', 'bg-yellow-900/50 text-yellow-400': log.status === 'blocked'}">
                {{ log.status }}
              </span>
            </td>
            <td class="px-6 py-4 font-mono text-xs break-all max-w-md">
              {{ log.details }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
