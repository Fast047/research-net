<template>
  <div v-if="reportData" class="feasibility-report space-y-6 transition-all duration-300" :class="{ 'is-light': isLight }">
    <!-- Executive Summary: Score + Risk Level -->
    <div :class="[isLight ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-slate-950 border-slate-900 shadow-xl', 'card-custom text-white p-6 rounded-xl border overflow-hidden relative transition-all duration-300']">
      <div class="absolute top-0 right-0 p-8 opacity-10 text-8xl pointer-events-none">
        {{ TI(mouInput.theme) }}
      </div>
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <span class="text-blue-400">Analysis Report:</span> {{ TN(mouInput.theme) }}
          </h2>
          <p class="text-slate-400 text-sm mt-1">Proposed Budget: <span class="text-white font-mono">฿{{ mouInput.budget }}M</span></p>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="text-center">
            <div class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Expertise Match</div>
            <div class="text-4xl font-black" :style="{ color: scoreColor }">{{ averageScore }}%</div>
          </div>
          <div class="w-px h-10 bg-slate-800"></div>
          <div class="text-center">
            <div class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Risk Assessment</div>
            <div class="text-lg font-bold px-3 py-1 rounded bg-slate-800/40 border border-slate-800" :style="{ color: riskColor }">
              {{ overallRisk }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Score Breakdown: Radar Chart (5 factors) -->
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800', 'card-custom p-6 rounded-xl border transition-all duration-300']">
        <h3 :class="isLight ? 'text-slate-400' : 'text-slate-500'" class="text-xs font-bold uppercase tracking-widest mb-4">Alignment Breakdown</h3>
        <div class="h-64">
          <v-chart class="chart" :option="radarOption" autoresize />
        </div>
      </div>

      <!-- Network Position: Mini graph -->
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800', 'card-custom p-6 rounded-xl border transition-all duration-300']">
        <h3 :class="isLight ? 'text-slate-400' : 'text-slate-500'" class="text-xs font-bold uppercase tracking-widest mb-4">Network Connectivity Mapping</h3>
        <div :class="[isLight ? 'bg-slate-50' : 'bg-slate-950', 'h-64 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800']">
          <v-chart class="chart" :option="miniGraphOption" autoresize />
        </div>
      </div>
    </div>

    <!-- Researcher Ranking: Bar Chart + Cards -->
    <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800', 'card-custom p-6 rounded-xl border transition-all duration-300']">
      <div class="flex items-center justify-between mb-6">
        <h3 :class="isLight ? 'text-slate-400' : 'text-slate-500'" class="text-xs font-bold uppercase tracking-widest">Candidate Rankings</h3>
        <div class="text-[10px] text-slate-500">N={{ reportData.length }} candidates screened</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div v-for="(rec, idx) in topCandidates" :key="rec.researcher.id" 
             class="p-4 border rounded-xl transition-all duration-300"
             :class="idx === 0 
                ? (isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/10 border-blue-800') 
                : (isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-800/50 border-slate-800')">
          <div class="flex justify-between items-start mb-2">
            <span :class="isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'" class="text-[9px] font-bold px-1.5 py-0.5 rounded border shadow-sm">
              TOP {{ idx + 1 }}
            </span>
            <span :class="isLight ? 'text-blue-600' : 'text-blue-400'" class="text-xs font-black">{{ rec.score }}%</span>
          </div>
          <div :class="isLight ? 'text-slate-800' : 'text-slate-200'" class="font-bold text-sm truncate mb-1">{{ rec.researcher.name }}</div>
          <div class="text-[10px] text-slate-500 truncate mb-3">{{ rec.researcher.inst }}</div>
          <div class="flex flex-wrap gap-1">
            <span v-for="kw in rec.researcher.expertise.slice(0, 2)" :key="kw" 
              :class="isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'"
              class="text-[8px] px-1.5 py-0.5 rounded border">
              {{ kw }}
            </span>
          </div>
        </div>
      </div>

      <div class="h-48">
        <v-chart class="chart" :option="barOption" autoresize />
      </div>
    </div>

    <!-- Gap Analysis: Missing expertise -->
    <div :class="[isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-900/10 border-amber-900/30', 'card-custom p-6 rounded-xl border transition-all duration-300']">
      <div class="flex gap-4">
        <div :class="[isLight ? 'bg-amber-100' : 'bg-amber-900/40', 'w-10 h-10 rounded-full flex items-center justify-center text-xl']">🔍</div>
        <div class="flex-1">
          <h3 :class="isLight ? 'text-amber-900' : 'text-amber-200'" class="font-bold mb-1">Expertise Gap & Dependency Analysis</h3>
          <p :class="isLight ? 'text-amber-700' : 'text-amber-400'" class="text-xs mb-4">Automatic identification of talent scarcity within the internal network.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div :class="isLight ? 'text-amber-900/40' : 'text-amber-400/30'" class="text-[9px] font-black uppercase mb-2">Network Voids (Unmet Keywords)</div>
              <div v-if="gaps.length === 0" :class="isLight ? 'text-amber-600' : 'text-amber-500'" class="text-xs italic">No expertise gaps detected for these keywords.</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="gap in gaps" :key="gap" :class="isLight ? 'bg-white border-amber-200 text-amber-700' : 'bg-slate-900 border-amber-800 text-amber-300'" class="px-2 py-1 rounded text-[10px] font-bold border shadow-sm">
                  {{ gap }}
                </span>
              </div>
            </div>
            <div>
              <div :class="isLight ? 'text-amber-900/40' : 'text-amber-400/30'" class="text-[9px] font-black uppercase mb-2">High Dependency Risk</div>
              <p :class="isLight ? 'text-amber-800' : 'text-amber-300'" class="text-[11px] leading-relaxed">
                The top candidate account for <span class="font-bold">{{ props.reportData[0].breakdown.expertiseOverlap }}%</span> of unique keyword coverage. 
                <span v-if="gaps.length > 2" class="mt-1 block">Consider cross-thematic recruitment to bridge these voids.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { RadarChart, BarChart, GraphChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { TC, TI, TN } from '../utils';

use([CanvasRenderer, RadarChart, BarChart, GraphChart, TooltipComponent, GridComponent, LegendComponent]);
const { isLight } = useTheme();

const props = defineProps<{
  mouInput: any;
  reportData: any[]; // Array from analyzeMOU: { researcher, score, breakdown }
}>();

const topCandidates = computed(() => props.reportData.slice(0, 3));

const averageScore = computed(() => {
  if (!props.reportData.length) return 0;
  const top5 = props.reportData.slice(0, 5);
  return Math.round(top5.reduce((sum, r) => sum + r.score, 0) / top5.length);
});

const overallRisk = computed(() => {
  if (averageScore.value > 80) return 'Low';
  if (averageScore.value > 65) return 'Medium';
  return 'High';
});

const scoreColor = computed(() => averageScore.value > 75 ? '#10b981' : (averageScore.value > 60 ? '#f59e0b' : '#ef4444'));
const riskColor = computed(() => overallRisk.value === 'Low' ? '#10b981' : (overallRisk.value === 'Medium' ? '#f59e0b' : '#ef4444'));

const radarOption = computed(() => {
  const top = props.reportData[0]?.breakdown;
  if (!top) return {};
  const textColor = isLight.value ? '#64748b' : '#94a3b8';
  const splitLineColor = isLight.value ? '#e2e8f0' : '#334155';
  return {
    radar: {
      indicator: [
        { name: 'Theme Alignment', max: 100 },
        { name: 'Expertise Match', max: 100 },
        { name: 'Success Hist.', max: 100 },
        { name: 'Network Power', max: 100 },
        { name: 'Budget Sync', max: 100 }
      ],
      radius: '65%',
      axisName: { color: textColor, fontSize: 10 },
      splitLine: { lineStyle: { color: splitLineColor } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [top.themeAlignment, top.expertiseOverlap, top.historicalSuccess, top.networkCentrality, top.budgetFit],
        name: 'Primary Candidate Match',
        itemStyle: { color: TC(props.mouInput.theme) },
        areaStyle: { color: TC(props.mouInput.theme) + '33' }
      }]
    }]
  };
});

const barOption = computed(() => {
  const items = [...props.reportData].slice(0, 6).reverse();
  const textColor = isLight.value ? '#64748b' : '#94a3b8';

  return {
    grid: { top: 10, bottom: 20, left: 80, right: 40 },
    xAxis: { type: 'value', max: 100, splitLine: { show: false } },
    yAxis: { 
      type: 'category', 
      data: items.map(r => r.researcher.name.split(' ').pop()),
      axisLabel: { color: textColor, fontSize: 10 }
    },
    series: [{
      type: 'bar',
      data: items.map(r => r.score),
      barWidth: '50%',
      itemStyle: { 
        color: TC(props.mouInput.theme),
        borderRadius: [0, 4, 4, 0]
      },
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10, color: textColor }
    }]
  };
});

const miniGraphOption = computed(() => {
  const mainColor = TC(props.mouInput.theme);
  const textColor = isLight.value ? '#475569' : '#94a3b8';
  
  const nodes = [
    { id: 'mou', name: 'MOU', symbolSize: 30, itemStyle: { color: mainColor }, x: 0, y: 0 },
    ...topCandidates.value.map((c, i) => ({
      id: c.researcher.id,
      name: c.researcher.name.split(' ').pop(),
      symbolSize: 15,
      itemStyle: { color: '#64748b' },
      x: Math.cos(i * 1.5) * 80,
      y: Math.sin(i * 1.5) * 80
    }))
  ];

  return {
    series: [{
      type: 'graph',
      layout: 'none',
      data: nodes,
      links: topCandidates.value.map(c => ({ source: 'mou', target: c.researcher.id })),
      lineStyle: { color: isLight.value ? '#cbd5e1' : '#334155', width: 1, opacity: 0.5 },
      label: { show: true, fontSize: 8, position: 'bottom', color: textColor }
    }]
  };
});

const gaps = computed(() => {
  const inputKws = (props.mouInput.keywords || []).map((k: string) => k.toLowerCase());
  const topExpertise = new Set();
  topCandidates.value.forEach(c => {
    c.researcher.expertise.forEach((e: string) => topExpertise.add(e.toLowerCase()));
  });
  
  return inputKws.filter((kw: string) => {
    return !Array.from(topExpertise).some((te: any) => te.includes(kw));
  });
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
.card-custom {
  transition: transform 0.2s ease;
}
.feasibility-report {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>