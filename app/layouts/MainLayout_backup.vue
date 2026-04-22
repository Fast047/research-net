<template>
<div>
    <div class="relative flex flex-col min-h-screen">
        <div class="sticky top-0 z-1">
            <div class="flex gap-2 px-3 py-2 bg-white">
                <span class="inline-flex items-center justify-center rounded-lg h-14 w-14 p-1 bg-primary">
                    <div class="text-xl text-white font-bold">
                        RLS
                    </div>
                </span>
                <div>
                    <div class="text-[20px] text-primary-900 font-bold">RESEARCH INTELLGENCE SYSTEM</div>
                    <div class="text-primary-900 font-medium">ระบบจัดการฐานข้อมูลและเครือข่ายวิจัยเชิงรุก</div>
                </div>
            </div>
        </div>
        <slot />
    </div>
    <div class="mt-8 layout-footer">
        <FooterFull />
    </div>
</div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>
