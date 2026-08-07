<template>
  <div class="p-8 max-w-5xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Mission Control</h1>
      <p class="text-gray-600">Parallel agent execution and command queue.</p>
    </header>

    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 class="text-lg font-bold mb-4">Start a Mission</h2>
        <div class="flex gap-4">
            <input v-model="command" placeholder="e.g. 'build me a PWA for a catering business'" class="flex-1 border p-3 rounded shadow-inner outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm">
            <button @click="start" :disabled="!command || loading" class="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 disabled:opacity-50">
                Execute
            </button>
        </div>
    </div>

    <div class="space-y-6">
        <h2 class="text-lg font-bold text-gray-700">Active & Past Missions</h2>
        <div v-for="mission in missions" :key="mission.id" class="border rounded-lg p-6 bg-white shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-mono text-sm font-bold text-gray-900 mb-1">❯ {{ mission.command }}</h3>
                    <p class="text-xs text-gray-500">Started: {{ new Date(mission.createdAt).toLocaleString() }}</p>
                </div>
                <span class="px-3 py-1 text-xs font-bold rounded-full"
                      :class="{'bg-yellow-100 text-yellow-800': mission.status === 'pending', 'bg-blue-100 text-blue-800': mission.status === 'running', 'bg-green-100 text-green-800': mission.status === 'completed'}">
                    {{ mission.status.toUpperCase() }}
                </span>
            </div>

            <div class="grid gap-4 mt-6">
                <div v-for="ws in mission.workstreams" :key="ws.id" class="border p-4 rounded bg-gray-50 flex items-center justify-between">
                    <div>
                        <p class="font-bold text-sm text-gray-700 uppercase tracking-wide">{{ ws.type }} WORKSTREAM</p>
                        <p class="text-xs text-gray-500 mt-1">Status: {{ ws.status }}</p>
                    </div>
                    <div class="w-1/3">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-black h-2.5 rounded-full transition-all duration-500" :style="{ width: ws.progress + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="mission.report" class="mt-6 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs whitespace-pre-wrap">
                {{ mission.report }}
            </div>
        </div>
        <div v-if="missions.length === 0 && !loading" class="text-gray-500 text-center py-8">
            No missions found. Send a command to begin.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const command = ref('');
const missions = ref<any[]>([]);
const loading = ref(false);

const loadMissions = async () => {
    loading.value = true;
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions`);
        missions.value = await res.json();
        // Sort descending by date
        missions.value.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } finally {
        loading.value = false;
    }
};

const start = async () => {
    loading.value = true;
    try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/missions`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ command: command.value, goal: 'Execute Command' })
        });
        command.value = '';
        await loadMissions();
    } finally {
        loading.value = false;
    }
};

onMounted(loadMissions);
</script>
