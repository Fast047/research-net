<template>
<div>
    <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li v-if="!breadcrumbItems" class="inline-flex items-center">
                <a href="#" class="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
                    <svg class="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
                    หน้าหลัก
                </a>
            </li>
            <li v-else v-for="(item, index) in breadcrumbItems" :key="index">
                <div class="flex items-center space-x-1.5">  
                  <svg v-if="Number(index) > 0" class="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                  <NuxtLink
                    v-if="item"
                    v-ripple
                    :to="item.href"
                    :class="[
                        isNavItemActive(pathname, item.href)
                        ? 'text-primary-800 hover:text-primary'
                        : 'text-gray-950/70 group-hover/item:text-primary hover:bg-slate-200',
                        'inline-flex items-center text-sm text-body hover:text-fg-brand font-medium cursor-pointer'
                    ]">
                    <div class="flex items-center gap-2">
                      <Icon
                          v-if="item.icon"
                          :name="item.icon"
                          class="text-[20px]"/>
                      {{ item.name }}
                    </div>
                  </NuxtLink>
                </div>  
            </li>
            <!-- <li>
                <div class="flex items-center space-x-1.5">
                    <svg class="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Projects</a>
                </div>
            </li>
            <li aria-current="page">
                <div class="flex items-center space-x-1.5">
                    <svg class="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                    <span class="inline-flex items-center text-sm font-medium text-body-subtle">Flowbite</span>
                </div>
            </li> -->
        </ol>
    </nav>

</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  breadcrumbItems?:any, 
}>();
const route = useRoute();

const pathname = computed(() => route.path);
const isNavItemActive = (pathname: string, nav: string) => {
  return pathname.includes(nav);
}
</script>

<style>

</style>
