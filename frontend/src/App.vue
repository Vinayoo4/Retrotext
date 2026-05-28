<template>
  <router-view />
  <ReloadPrompt />
</template>

<script setup lang="ts">
import ReloadPrompt from './components/pwa/ReloadPrompt.vue'
</script>

<style>
@import './styles/main.css';
</style>
