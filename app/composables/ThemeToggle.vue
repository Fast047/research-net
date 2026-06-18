<script setup lang="ts">
const { isLight, toggleTheme } = useTheme()
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner overflow-hidden"
    :class="isLight ? 'bg-slate-200' : 'bg-slate-800'"
    aria-label="Toggle Dark Mode"
  >
    <!-- Background Decorative Icons -->
    <div class="absolute inset-0 flex justify-between items-center px-3 pointer-events-none">
      <Icon 
        name="ph:moon-stars-fill" 
        class="text-slate-600 transition-opacity duration-300"
        :class="isLight ? 'opacity-100' : 'opacity-0'"
      />
      <Icon 
        name="ph:sun-fill" 
        class="text-amber-400 transition-opacity duration-300"
        :class="isLight ? 'opacity-0' : 'opacity-100'"
      />
    </div>

    <!-- Sliding Knob -->
    <span
      class="z-10 inline-block h-8 w-8 transform rounded-full bg-white shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center"
      :class="isLight ? 'translate-x-11 scale-100' : 'translate-x-1 scale-100'"
    >
      <Icon 
        :name="isLight ? 'ph:sun-bold' : 'ph:moon-stars-bold'" 
        class="text-xl transition-transform duration-500"
        :class="[
          isLight ? 'text-amber-500 rotate-0' : 'text-slate-700 -rotate-[360deg]'
        ]"
      />
    </span>
  </button>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}

/* เอฟเฟกต์ Glow เมื่อเป็น Dark Mode */
.dark button {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 15px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>