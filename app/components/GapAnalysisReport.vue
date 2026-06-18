<script setup lang="ts">
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { getGapReport } from '../utils/gap-analysis';

use([CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent]);

const { isLight } = useTheme();
const report = computed(() => getGapReport());

const stats = computed(() => {
  const items = report.value;
  return {
    total: items.length,
    gap: items.filter(i => i.status === 'gap').length,
    warn: items.filter(i => i.status === 'warn').length,
    ok: items.filter(i => i.status === 'ok').length,
  };
});

// ECharts for Coverage Heatmap (Visualized as a color-coded bar chart)
const heatmapOption = computed(() => ({
  title: { 
    text: 'Thematic Coverage Heatmap (%)', 
    left: 'center', 
    textStyle: { color: isLight.value ? '#1e293b' : '#94a3b8', fontSize: 14, fontWeight: 500 } 
  },
  tooltip: { 
    trigger: 'axis', 
    formatter: (params: any) => {
      const data = Array.isArray(params) ? params[0] : params;
      return `${data.name}: ${Number(data.value).toFixed(2)}%`;
    }
  },
  grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', max: 100, splitLine: { show: false }, axisLabel: { color: isLight.value ? '#64748b' : '#94a3b8' } },
  yAxis: { 
    type: 'category', 
    data: report.value.map(i => i.name),
    axisLabel: { color: isLight.value ? '#475569' : '#94a3b8' }
  },
  series: [
    {
      name: 'Coverage',
      type: 'bar',
      data: report.value.map(i => ({
        value: i.coverage,
        itemStyle: {
          color: i.status === 'gap' ? '#ef4444' : i.status === 'warn' ? '#f59e0b' : '#10b981'
        }
      })),
      label: { 
        show: true, 
        position: 'right', 
        formatter: (params: any) => `${Number(params.value).toFixed(2)}%`,
        color: isLight.value ? '#475569' : '#94a3b8' 
      }
    }
  ]
}));

// ECharts for Researcher-to-MOU Ratio (Comparing supply vs demand)
const ratioOption = computed(() => ({
  title: { 
    text: 'Researcher Supply vs. Strategic Demand', 
    left: 'center', 
    textStyle: { color: isLight.value ? '#1e293b' : '#94a3b8', fontSize: 14, fontWeight: 500 } 
  },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: isLight.value ? '#64748b' : '#94a3b8' } },
  grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  xAxis: { 
    type: 'category', 
    data: report.value.map(i => i.name),
    axisLabel: { color: isLight.value ? '#475569' : '#94a3b8', rotate: 45 }
  },
  yAxis: { type: 'value', axisLabel: { color: isLight.value ? '#64748b' : '#94a3b8' } },
  series: [
    {
      name: 'Qualified Researchers',
      type: 'bar',
      data: report.value.map(i => i.researchers),
      itemStyle: { color: '#3b82f6' }
    },
    {
      name: 'Strategic Target (Demand)',
      type: 'line',
      data: report.value.map(i => i.needed),
      itemStyle: { color: '#f59e0b' },
      symbolSize: 8,
      lineStyle: { width: 3, type: 'dashed' }
    }
  ]
}));
</script>

<template>
  <div class="space-y-6 p-4" :class="{ 'is-light': isLight }">
    <!-- Gap Severity Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/50 border-slate-700', 'p-4 rounded-xl border transition-all']">
        <div :class="isLight ? 'text-slate-500' : 'text-slate-400'" class="text-xs uppercase tracking-wider mb-1 font-medium">Themes Analyzed</div>
        <div :class="isLight ? 'text-slate-900' : 'text-white'" class="text-2xl font-bold">{{ stats.total }}</div>
      </div>
      <div :class="[isLight ? 'bg-red-50 border-red-100 shadow-sm' : 'bg-red-500/10 border-red-500/20', 'p-4 rounded-xl border transition-all']">
        <div class="text-red-500 dark:text-red-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-2 font-medium">
          Critical Gaps <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </div>
        <div class="text-2xl font-bold text-red-500">{{ stats.gap }}</div>
      </div>
      <div :class="[isLight ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-amber-500/10 border-amber-500/20', 'p-4 rounded-xl border transition-all']">
        <div class="text-amber-600 dark:text-amber-400 text-xs uppercase tracking-wider mb-1 font-medium">Under-Resourced</div>
        <div class="text-2xl font-bold text-amber-500">{{ stats.warn }}</div>
      </div>
      <div :class="[isLight ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-emerald-500/10 border-emerald-500/20', 'p-4 rounded-xl border transition-all']">
        <div class="text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1 font-medium">Optimal Coverage</div>
        <div class="text-2xl font-bold text-emerald-500">{{ stats.ok }}</div>
      </div>
    </div>

    <!-- Charts Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'p-6 rounded-2xl border h-[450px] transition-all']">
        <VChart class="h-full" :option="heatmapOption" autoresize />
      </div>
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'p-6 rounded-2xl border h-[450px] transition-all']">
        <VChart class="h-full" :option="ratioOption" autoresize />
      </div>
    </div>
  </div>
</template>