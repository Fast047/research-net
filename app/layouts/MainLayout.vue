<template>
<div class="flex flex-col min-h-screen">
    <div class="land-bg">
        <div class="land-grid"></div>
        <div class="land-glow"></div>
    </div>
    <app-nav class="flex-none" />
    <div class="flex-1 flex flex-col">
        <slot />
    </div>
</div>
</template>

<script lang="ts" setup>
const { isLight } = useTheme();
useHead({
    bodyAttrs: {
        class: computed(() => isLight.value ? 'light-mode' : 'dark-mode')
    }
});
</script>

<style>

</style>
