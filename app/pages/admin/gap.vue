<template>
  <div class="scroll-pane space-y-8 p-6" :class="{ 'is-light': isLight }">
    <div class="ph mb-4">
      <div>
        <div class="ph-title text-2xl font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">Network Strategic Gap Analysis</div>
        <div class="ph-sub" :class="isLight ? 'text-slate-500' : 'text-slate-400'">วิเคราะห์ความสมดุลระหว่างทรัพยากรบุคคลและเป้าหมายยุทธศาสตร์เพื่อปิดช่องว่างความร่วมมือ</div>
      </div>
    </div>

    <!-- Coverage Heatmap Section -->
    <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800 shadow-xl', 'rounded-3xl border transition-all duration-300 overflow-hidden']">
      <div class="p-6 border-b" :class="isLight ? 'border-slate-100' : 'border-slate-800'">
        <h2 class="text-lg font-bold" :class="isLight ? 'text-slate-800' : 'text-white'">Thematic Coverage Heatmap</h2>
      </div>
      <GapAnalysisReport />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Detailed Metrics & Theme Analysis -->
      <div class="xl:col-span-2">
        <DashboardGap />
      </div>

      <!-- Skill Gap Section -->
      <div class="space-y-6">
        <div :class="[isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800', 'p-6 rounded-3xl border shadow-sm']">
          <h3 class="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <Icon name="ph:magnifying-glass-plus-bold" class="text-rose-500" />
            Top Skill Scarcity
          </h3>
          
          <div class="space-y-4">
            <div v-for="skill in skillGaps" :key="skill.name" class="group">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold" :class="isLight ? 'text-slate-700' : 'text-slate-300'">{{ skill.name }}</span>
                <span class="text-[10px] font-mono font-bold text-rose-500">{{ skill.deficit }} deficit</span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-rose-500 rounded-full" :style="{ width: skill.percent + '%' }"></div>
              </div>
            </div>
          </div>

          <div :class="[isLight ? 'bg-rose-50' : 'bg-rose-900/10', 'mt-8 p-4 rounded-2xl border border-rose-500/20']">
            <p class="text-[11px] leading-relaxed text-rose-600 dark:text-rose-400 italic">
              "Critical shortage identified in Quantum and Social-Innovation sectors. Strategic recruitment recommended."
            </p>
          </div>
        </div>

        <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800', 'p-6 rounded-3xl border transition-all']">
           <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resource Capacity</h3>
           <div class="space-y-3">
              <div v-for="item in capacity" :key="item.label" class="flex items-center justify-between">
                <span class="text-[11px] text-slate-500">{{ item.label }}</span>
                <span class="text-[11px] font-bold" :class="isLight ? 'text-slate-800' : 'text-slate-200'">{{ item.value }}%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { isLight } = useTheme();

definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});

const skillGaps = [
  { name: 'Quantum Computing', deficit: 4, percent: 80 },
  { name: 'Carbon Capture', deficit: 3, percent: 60 },
  { name: 'Precision Medicine', deficit: 5, percent: 90 },
  { name: 'Social Innovation', deficit: 2, percent: 45 }
];

const capacity = [
  { label: 'Active Engagement', value: 72 },
  { label: 'Latent Capacity', value: 28 },
  { label: 'Specialist Overhead', value: 15 }
];
</script>