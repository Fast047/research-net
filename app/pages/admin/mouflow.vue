<template>
  <div class="scroll-pane space-y-8 p-6" :class="{ 'is-light': isLight }">
    <div class="ph mb-4">
      <div>
        <div class="ph-title text-2xl font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">MOU Network Flow & Global Strategy</div>
        <div class="ph-sub" :class="isLight ? 'text-slate-500' : 'text-slate-400'">วิเคราะห์โครงสร้างเครือข่ายความร่วมมือและโอกาสในการขยายพันธมิตรทางยุทธศาสตร์ทั่วโลก</div>
      </div>
    </div>


    <!-- Primary Network Flow Visualization -->
    <div :class="[isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-950 border-slate-900 shadow-2xl', 'rounded-3xl border overflow-hidden h-[650px] relative transition-all duration-300']">
      <FlowMapCMU />
    </div>

    <!-- Country Coverage Heatmap & Partner Recommendations -->
     
    <!-- Theme Selector -->
    <div class="flex flex-wrap gap-2">
      <button 
        v-for="(t, k) in THEMES" 
        :key="k"
        @click="selectedTheme = k.toString()"
        class="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2"
        :class="[
          selectedTheme === k 
            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : (isLight ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800')
        ]"
      >
        <span class="text-sm">{{ t.icon }}</span>
        {{ t.name }}
      </button>
    </div>
    <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800 shadow-xl', 'rounded-3xl border transition-all duration-300 overflow-hidden']">
      <PartnerRecommender :theme="selectedTheme" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { THEMES } from '~/utils/mockData';

const { isLight } = useTheme();
const selectedTheme = ref('AI');

definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
</script>