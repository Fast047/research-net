<template>
  <div class="h-full">
    <Transition name="fade" mode="out-in">
      <div class="p-4">
        <KeepAlive>
          <NuxtPage />
        </KeepAlive>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
    layout: 'sidebar-layout'
});
</script>

<style>

</style>