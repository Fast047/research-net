<template>
  <div class="scroll-pane space-y-8 p-6" :class="{ 'is-light': isLight }">
    <div class="ph mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <div class="ph-title text-2xl font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">Expertise Skill Gap Analysis</div>
        <div class="ph-sub" :class="isLight ? 'text-slate-500' : 'text-slate-400'">
          Identify missing research competencies and prioritize talent acquisition across strategic themes.
        </div>
      </div>
      <div class="flex gap-2">
         <button :class="[isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700', 'px-4 py-2 rounded-xl border text-sm font-bold transition-all flex items-center gap-2']">
           <Icon name="ph:export-bold" />
           Export Report
         </button>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in summaryStats" :key="stat.label" :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800 shadow-xl', 'p-6 rounded-3xl border']">
        <div class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{{ stat.label }}</div>
        <div class="text-3xl font-black" :class="stat.color">{{ stat.value }}</div>
        <div class="text-[10px] mt-2 text-slate-400">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Main Report Table -->
    <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800 shadow-xl', 'rounded-3xl border transition-all duration-300 overflow-hidden']">
      <div class="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" :class="isLight ? 'border-slate-100' : 'border-slate-800'">
        <h2 class="text-lg font-bold" :class="isLight ? 'text-slate-800' : 'text-white'">Thematic Skill Gaps</h2>
        <div class="flex items-center gap-2 text-xs text-slate-500 italic">
          <Icon name="ph:info-bold" class="text-amber-500" />
          Priorities are calculated based on the number of missing required competencies.
        </div>
      </div>
      <SkillGapReport />
    </div>

    <!-- Bottom Advisory -->
    <div :class="[isLight ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-950/20 border-indigo-900/50', 'p-6 rounded-3xl border flex gap-6 items-start']">
      <div class="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl shrink-0 shadow-lg shadow-indigo-500/20">
        <Icon name="ph:lightbulb-bold" />
      </div>
      <div>
        <h3 class="font-bold text-indigo-600 dark:text-indigo-400 mb-1">Strategic Recommendation</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The network shows a significant coverage gap in certain strategic themes. 
          Cross-institutional collaboration with partners who possess these missing expertise keywords
          should be prioritized in the next MOU planning cycle to strengthen the national research infrastructure.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from '~/composables/useTheme';
import { useAnalytics } from '~/composables/useAnalytics';

const { isLight } = useTheme();
const { getAnalytics } = useAnalytics();

definePageMeta({
  title: 'Skill Gap Analysis',
  layout: 'sidebar-layout'
});

const report = computed(() => getAnalytics('skill-gap') || []);

const summaryStats = computed(() => {
  const r = report.value as any[];
  if (!r.length) return [];
  
  const totalMissing = r.reduce((acc: number, curr: any) => acc + curr.missingCount, 0);
  const avgCoverage = Math.round(r.reduce((acc: number, curr: any) => acc + curr.coverage, 0) / r.length);
  const highPriorityCount = r.filter((i: any) => i.priority === 'High').length;

  return [
    { label: 'Total Skill Gaps', value: totalMissing, color: 'text-rose-500', sub: 'Missing required competencies' },
    { label: 'Avg Network Coverage', value: avgCoverage + '%', color: 'text-indigo-500', sub: 'Across all strategic themes' },
    { label: 'High Priority Themes', value: highPriorityCount, color: 'text-amber-500', sub: 'Requires immediate recruitment' },
  ];
});
</script>

<style scoped>
.ph-title {
  letter-spacing: -0.025em;
}
.ph-sub {
  max-width: 600px;
}
</style>