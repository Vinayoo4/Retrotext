<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const filePath = ref('')
const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const msg = ref('')

const ingest = async () => {
  if (!filePath.value) return
  loading.value = true
  msg.value = ''
  try {
    const res = await axios.post('/api/v1/knowledge/ingest', { file_path: filePath.value })
    msg.value = res.data.message
    filePath.value = ''
  } catch (e: any) {
    msg.value = 'Error: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

const search = async () => {
  if (!query.value) return
  try {
    const res = await axios.post('/api/v1/knowledge/search', { query: query.value, limit: 5 })
    results.value = res.data.results
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold mb-4 text-white">Ingest Knowledge Source</h2>
      <div class="flex gap-4 mb-2">
        <input v-model="filePath" type="text" placeholder="Absolute path to file (.txt, .md, .pdf, .py)..." class="flex-grow bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500">
        <button @click="ingest" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:bg-gray-700">{{ loading ? 'Ingesting...' : 'Ingest' }}</button>
      </div>
      <p v-if="msg" class="text-sm text-blue-400 mt-2">{{ msg }}</p>
      <p class="text-xs text-gray-500 mt-2">Note: Files must be located within allowed directories defined in backend policy.</p>
    </div>

    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold mb-4 text-white">Search Knowledge</h2>
      <div class="flex gap-4 mb-4">
        <input v-model="query" @keyup.enter="search" type="text" placeholder="Search concept or keyword..." class="flex-grow bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500">
        <button @click="search" class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md">Search</button>
      </div>

      <div v-if="results.length > 0" class="space-y-4">
        <div v-for="(r, idx) in results" :key="idx" class="bg-gray-900 p-4 rounded-md border border-gray-700">
          <div class="flex justify-between mb-2 text-xs text-gray-400">
            <span>{{ r.metadata.file_path }} (Chunk: {{ r.metadata.chunk_index }})</span>
            <span>Distance: {{ r.distance.toFixed(4) }}</span>
          </div>
          <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ r.metadata.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
