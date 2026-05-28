<template>
  <div class="min-h-screen flex flex-col items-center justify-center transition-colors duration-300" style="background-color: #1e1e1e; color: #d4d4d4">
    <div class="p-8 rounded-xl shadow-2xl bg-black/40 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Code Canvas Login</h1>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <label class="block mb-1 text-sm">Username</label>
          <input v-model="username" type="text" class="w-full p-2 rounded bg-black/20 outline-none border border-transparent focus:border-blue-500 transition-colors" required>
        </div>

        <div>
          <label class="block mb-1 text-sm">Password</label>
          <input v-model="password" type="password" class="w-full p-2 rounded bg-black/20 outline-none border border-transparent focus:border-blue-500 transition-colors" required>
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button type="submit" class="w-full p-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors disabled:opacity-50" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="text-center text-sm mt-4">
          Need an account?
          <a href="#" @click.prevent="isRegistering = true" class="text-blue-400 hover:underline">Register</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const isRegistering = ref(false); // In a full app, map to a different route

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const endpoint = isRegistering.value ? '/api/auth/register' : '/api/auth/login';
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    // Remove the /api part if the VITE_API_URL already has it to prevent duplicate like /api/api/auth
    const apiPath = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) + endpoint : baseUrl + endpoint;

    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');

    // In a real app we would store the token/session and update a userStore.
    // For MVP, if we get an ID, we're authed.
    localStorage.setItem('code_canvas_user', JSON.stringify(data));
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
