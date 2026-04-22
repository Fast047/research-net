<template>
  <div class="border rounded-xl p-4">
    <div class="text-xs text-gray-400">{{ title }}</div>
    <div class="text-2xl font-bold">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({ title: String, value: [String, Number] })
</script>