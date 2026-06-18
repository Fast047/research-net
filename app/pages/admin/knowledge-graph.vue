<template>
  <div class="admin-knowledge-graph">
    <ClientOnly>
      <KnowledgeGraphSigma />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
})
</script>