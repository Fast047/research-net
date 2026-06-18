<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b" :class="isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'">
          <th class="py-4 px-4 font-semibold text-xs uppercase tracking-wider">Theme</th>
          <th class="py-4 px-4 font-semibold text-xs uppercase tracking-wider">Coverage</th>
          <th class="py-4 px-4 font-semibold text-xs uppercase tracking-wider">Missing Expertise</th>
          <th class="py-4 px-4 font-semibold text-xs uppercase tracking-wider">Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in (report as any[])" :key="item.theme" class="border-b transition-colors" :class="isLight ? 'border-slate-50 hover:bg-slate-50/50 text-slate-700' : 'border-slate-800/50 hover:bg-slate-800/30 text-slate-300'">
          <td class="py-4 px-4">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ getThemeIcon(item.theme) }}</span>
              <span class="font-bold">{{ getThemeName(item.theme) }}</span>
            </div>
          </td>
          <td class="py-4 px-4">
            <div class="flex items-center gap-2">
              <div class="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-1000" :class="getCoverageClass(item.coverage)" :style="{ width: item.coverage + '%' }"></div>
              </div>
              <span class="text-xs font-mono font-bold">{{ item.coverage }}%</span>
            </div>
          </td>
          <td class="py-4 px-4">
            <div class="flex flex-wrap gap-1">
              <span v-for="skill in item.missing" :key="skill" class="px-2 py-0.5 rounded-full text-[10px] font-medium" :class="isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'">
                {{ skill }}
              </span>
              <span v-if="item.missing.length === 0" class="text-emerald-500 text-xs italic font-medium">Fully Covered</span>
            </div>
          </td>
          <td class="py-4 px-4">
            <span class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight" :class="getPriorityClass(item.priority)">
              {{ item.priority }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '~/composables/useAnalytics';
import { useTheme } from '~/composables/useTheme';
import { THEMES } from '~/utils/mockData';

const { getAnalytics } = useAnalytics();
const { isLight } = useTheme();

const report = computed(() => getAnalytics('skill-gap') || []);

const getThemeName = (key: string) => THEMES[key]?.name || key;
const getThemeIcon = (key: string) => THEMES[key]?.icon || '📄';

const getCoverageClass = (val: number) => {
  if (val >= 80) return 'bg-emerald-500';
  if (val >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    case 'Medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    case 'Low': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    default: return 'bg-slate-500/10 text-slate-500';
  }
};
</script>

<style scoped>
/* Custom table styles if needed */
</style>