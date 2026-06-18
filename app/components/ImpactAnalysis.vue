<template>
  <div class="space-y-6">
    <!-- Most Impactful Card -->
    <div v-if="topMOU" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        class="md:col-span-2 rounded-2xl p-6 border relative overflow-hidden transition-all duration-300"
        :class="isLight 
          ? 'bg-white border-slate-200 shadow-sm' 
          : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-xl'"
      >
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <span class="text-8xl">{{ TI(topMOU.theme) }}</span>
        </div>
        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1 uppercase">
              <i class="pi pi-star-fill text-[10px]"></i> Most Impactful MOU
            </span>
            <span :style="{ color: TC(topMOU.theme) }" class="text-sm font-medium uppercase tracking-wider">
              {{ TN(topMOU.theme) }}
            </span>
          </div>
          <h2 class="text-2xl font-bold mb-2" :class="isLight ? 'text-slate-900' : 'text-white'">{{ topMOU.inst }}</h2>
          <p class="mb-6 max-w-lg line-clamp-2" :class="isLight ? 'text-slate-500' : 'text-slate-400'">{{ topMOU.desc }}</p>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              v-for="(label, val, idx) in { 'Impact Score': formatNumber(topMOU.impactScore, 0), 'MOU Budget': topMOU.budget + 'M', 'Projects': topMOU.relatedProjects.length, 'Exp. Level': topMOU.exp_score + '%' }"
              :key="idx"
              class="rounded-xl p-3 border transition-colors"
              :class="isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-800/50 border-slate-700'"
            >
              <div class="text-slate-500 text-xs mb-1">Impact Score</div>
              <div 
                class="text-xl font-bold"
                :class="idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-emerald-400' : idx === 2 ? 'text-blue-400' : 'text-purple-400'"
              >{{ val }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats Sidebar / Dashboard Summary -->
      <div 
        class="rounded-2xl p-6 border flex flex-col justify-center transition-all duration-300"
        :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'"
      >
        <h3 class="text-slate-400 text-sm font-medium mb-4 uppercase tracking-tighter">Impact Portfolio Summary</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-end">
            <span class="text-slate-500 text-sm">Total Portfolio Budget</span>
            <span class="font-mono font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">{{ totalBudget }}M</span>
          </div>
          <div class="w-full h-1.5 rounded-full overflow-hidden" :class="isLight ? 'bg-slate-100' : 'bg-slate-800'">
             <div class="bg-emerald-500 h-full" :style="{ width: '75%' }"></div>
          </div>
          <div class="flex justify-between items-end">
            <span class="text-slate-500 text-sm">Institutional Reach</span>
            <span class="font-mono font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">{{ avgExp }}%</span>
          </div>
          <div class="w-full h-1.5 rounded-full overflow-hidden" :class="isLight ? 'bg-slate-100' : 'bg-slate-800'">
             <div class="bg-blue-500 h-full" :style="{ width: avgExp + '%' }"></div>
          </div>
          <div class="pt-4 mt-4 border-t" :class="isLight ? 'border-slate-100' : 'border-slate-800/50'">
            <p class="text-[10px] text-slate-500 leading-relaxed italic">
              * Strategic impact is calculated using budget weighted allocation across primary MOUs and secondary project developments.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- MOU Comparison List -->
    <div 
      class="rounded-2xl border overflow-hidden transition-all duration-300"
      :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'"
    >
      <div class="p-6 border-b flex justify-between items-center" :class="isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-800/20'">
        <h3 class="text-lg font-bold flex items-center gap-2" :class="isLight ? 'text-slate-900' : 'text-white'">
          <i class="pi pi-chart-line text-blue-400"></i>
          Cross-Institutional Comparison
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-slate-500 text-xs uppercase tracking-wider transition-colors"
                :class="isLight ? 'bg-slate-50/80' : 'bg-slate-800/40'">
              <th class="px-6 py-4 font-semibold">Partner Institution</th>
              <th class="px-6 py-4 font-semibold text-center">Projects</th>
              <th class="px-6 py-4 font-semibold text-right">Budget (M)</th>
              <th class="px-6 py-4 font-semibold">Impact Distribution</th>
              <th class="px-6 py-4 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isLight ? 'divide-slate-100' : 'divide-slate-800'">
            <tr v-for="mou in scoredMous" :key="mou.id" 
                class="transition-colors group"
                :class="isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/20'">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-colors" 
                    :class="isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-800 border-slate-700'"
                    :style="{ borderColor: TC(mou.theme) + '44' }"
                  >
                    {{ TI(mou.theme) }}
                  </div>
                  <div>
                    <div 
                      class="font-medium group-hover:text-blue-500 transition-colors flex items-center gap-2"
                      :class="isLight ? 'text-slate-700' : 'text-slate-200'"
                    >
                      {{ mou.inst }}
                      <span class="text-sm opacity-60">{{ mou.flag }}</span>
                    </div>
                    <div class="text-slate-500 text-xs flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: TC(mou.theme) }"></span>
                      {{ TN(mou.theme) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="px-2 py-1 rounded text-xs font-mono" :class="isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'">
                  {{ mou.relatedProjects.length }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-mono" :class="isLight ? 'text-slate-600' : 'text-slate-300'">
                {{ mou.budget }}
              </td>
              <td class="px-6 py-4 min-w-[200px]">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 rounded-full overflow-hidden" :class="isLight ? 'bg-slate-100' : 'bg-slate-800'">
                    <div 
                      class="h-full bg-blue-500 transition-all duration-1000" 
                      :style="{ width: (mou.impactScore / topMOU.impactScore * 100) + '%', backgroundColor: TC(mou.theme) }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-lg font-bold font-mono" :class="isLight ? 'text-slate-900' : 'text-white'">{{ mou.impactScore }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { MOUS, PROJECTS } from '../utils/mockData';
import { getImpactScore } from '../utils/impact-analysis';
import { TC, TI, TN } from '../utils';
import { formatNumber } from '../utils/number';
const { isLight } = useTheme();

const scoredMous = computed(() => {
  return (MOUS || []).map(m => ({
    ...m,
    impactScore: getImpactScore(m.id),
    relatedProjects: (PROJECTS || []).filter((p: any) => p.mou_id === m.id)
  })).sort((a, b) => b.impactScore - a.impactScore);
});

const topMOU = computed(() => scoredMous.value[0] || { 
  theme: '', 
  inst: '', 
  desc: '', 
  budget: 0, 
  exp_score: 0,
  impactScore: 0, 
  relatedProjects: [] 
});

const totalBudget = computed(() => {
  return MOUS.reduce((sum, m) => sum + (m.budget || 0), 0);
});

const avgExp = computed(() => {
  if (!MOUS.length) return 0;
  return Math.round(MOUS.reduce((sum, m) => sum + (m.exp_score || 0), 0) / MOUS.length);
});
</script>