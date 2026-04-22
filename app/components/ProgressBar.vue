<template>
  <div class="mb-2">
    <div class="flex justify-between text-xs text-slate-400 mb-1">
      <span>{{ label }}</span>
      <span>{{ value }}</span>
    </div>

    <div class="w-full h-2 bg-slate-800 rounded">
      <div
        class="h-2 rounded transition-all duration-500"
        :style="{
          width: (value / max) * 100 + '%',
          background: color
        }"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: Number,
  max: Number,
  color: String
})
</script>