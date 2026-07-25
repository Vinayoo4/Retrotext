<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const taskInput = ref('')
const selectedAgent = ref('auto')
const agents = ref<any[]>([])
const tasks = ref<any[]>([])
const loading = ref(false)

const fetchAgents = async () => {
  try {
    const res = await axios.get('/api/v1/agents')
    agents.value = res.data
  } catch (e) {
    console.error('Failed to fetch agents', e)
  }
}

const fetchTasks = async () => {
  try {
    const res = await axios.get('/api/v1/tasks?limit=10')
    tasks.value = res.data
  } catch (e) {
    console.error('Failed to fetch tasks', e)
  }
}

const runTask = async () => {
  if (!taskInput.value.trim()) return
  loading.value = true
  try {
    await axios.post('/api/v1/tasks/run', {
      task: taskInput.value,
      agent_override: selectedAgent.value === 'auto' ? null : selectedAgent.value
    })
    taskInput.value = ''
    await fetchTasks()
  } catch (e) {
    console.error('Task failed', e)
    alert('Task failed to execute.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAgents()
  fetchTasks()
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Task Composer -->
    <div class="lg:col-span-2 space-y-6">
      <section class="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-sm">
        <h2 class="text-lg font-semibold mb-4 text-white flex items-center"><svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Execute Task</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">Select Agent</label>
          <select v-model="selectedAgent" class="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="auto">Auto-route (Kernel decision)</option>
            <option v-for="a in agents" :key="a.name" :value="a.name">{{ a.name }} - {{ a.description }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">Task Description</label>
          <textarea v-model="taskInput" rows="4" placeholder="Enter task instructions..." class="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono"></textarea>
        </div>

        <button @click="runTask" :disabled="loading || !taskInput.trim()" class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center">
          <span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full mr-2"></span>
          {{ loading ? 'Executing...' : 'Run Task' }}
        </button>
      </section>

      <!-- Task History -->
      <section class="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-sm">
        <h2 class="text-lg font-semibold mb-4 text-white">Recent Tasks</h2>
        <div v-if="tasks.length === 0" class="text-gray-500 text-sm py-4 text-center">No tasks executed yet.</div>
        <div class="space-y-4">
          <div v-for="t in tasks" :key="t.id" class="border-l-2 border-gray-700 pl-4 py-2">
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-mono text-gray-400">{{ t.id.substring(0, 8) }}</span>
              <span class="text-xs px-2 py-1 rounded bg-gray-900 border border-gray-700" :class="{'text-green-400': t.status==='completed', 'text-red-400': t.status==='failed'}">{{ t.status }}</span>
            </div>
            <p class="text-sm text-gray-300 font-medium mb-2">{{ t.task_input }}</p>
            <div class="bg-gray-900 rounded p-3 text-xs font-mono text-gray-400 whitespace-pre-wrap border border-gray-800">{{ t.result_summary }}</div>
            <div class="text-xs text-gray-500 mt-2 flex justify-between">
              <span>Agent: <span class="text-blue-400">{{ t.agent_used }}</span></span>
              <span>{{ new Date(t.created_at * 1000).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Side Panel -->
    <div class="space-y-6">
      <section class="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-sm">
        <h2 class="text-lg font-semibold mb-4 text-white flex items-center"><svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> System Status</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between border-b border-gray-700 pb-2">
            <span class="text-gray-400">Kernel Core</span>
            <span class="text-green-400 font-medium">Online</span>
          </div>
          <div class="flex justify-between border-b border-gray-700 pb-2">
            <span class="text-gray-400">Memory DB</span>
            <span class="text-green-400 font-medium">Connected</span>
          </div>
          <div class="flex justify-between border-b border-gray-700 pb-2">
            <span class="text-gray-400">Vector Store</span>
            <span class="text-green-400 font-medium">Active</span>
          </div>
          <div class="flex justify-between pb-2">
            <span class="text-gray-400">Cybersecurity Agent</span>
            <span class="text-blue-400 font-medium">Defensive Mode</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
