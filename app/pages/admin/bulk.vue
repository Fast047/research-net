<template>
  <div class="scroll-pane space-y-6">
    <div class="ph">
      <div>
            <div class="ph-title">Bulk Upload / Import</div>
            <div class="ph-sub">อัปโหลดข้อมูลจาก CSV, Excel หรือ JSON เข้าสู่ระบบ</div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="cat in uploadCategories" 
        :key="cat.title"
        @click="handleUploadClick(cat.title)"
        class="group relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
      >
        <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {{ cat.icon }}
        </div>
        
        <h3 class="card-title">{{ cat.title }}</h3>
        <p class="text-[11px] text-slate-500 mb-4">ลากไฟล์มาวาง หรือคลิกเพื่อเลือก</p>
        
        <div class="flex gap-2 justify-center">
          <span 
            v-for="fmt in cat.formats" 
            :key="fmt"
            class="px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase"
            :class="{
              'bg-blue-500/10 text-blue-400': fmt === 'CSV',
              'bg-emerald-500/10 text-emerald-400': fmt === 'Excel',
              'bg-purple-500/10 text-purple-400': fmt === 'JSON'
            }"
          >
            {{ fmt }}
          </span>
        </div>
      </div>
    </div>
    <section class="border border-slate-200 rounded-xl p-6">
      <h2 class="text-xs font-bold uppercase tracking-widest mb-4" style="color: var(--color-t0)">Template Downloads</h2>
      <div class="flex flex-wrap gap-3">
        <button 
          v-for="file in templates" 
          :key="file"
          @click="downloadTemplate(file)"
          class="flex items-center gap-2 px-4 py-2 bg-slate-300/50 hover:bg-slate-400 border border-slate-300 rounded-lg text-xs text-slate-800 transition-colors cursor-pointer"
        >
          <span class="text-blue-400">📥</span>
          {{ file }}
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
const uploadCategories = [
  { title: 'Researchers', formats: ['CSV', 'Excel'], icon: '👥' },
  { title: 'Research Groups', formats: ['CSV'], icon: '🏢' },
  { title: 'MOU Data', formats: ['Excel'], icon: '📜' },
  { title: 'Projects', formats: ['CSV', 'JSON'], icon: '🚀' },
  { title: 'Featured Works', formats: ['JSON'], icon: '🏆' },
  { title: 'Historical Records', formats: ['CSV'], icon: '⏳' }
];
const templates = [
  'Researcher Template.xlsx',
  'Research Group Template.csv',
  'MOU Template.xlsx',
  'Project Template.csv',
  'Works Template.json'
];

const handleUploadClick = (title: string) => {
  // Replace your showToast with your actual notification logic or dialog trigger
  console.log(`Opening Upload Dialog for: ${title}`);
};

const downloadTemplate = (name: string) => {
  console.log(`Downloading template: ${name}`);
};
</script>

<style scoped>
.group:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
}
</style>