<template>
  <div class="p-6 rounded-xl border transition-all duration-300"
       :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold" :class="isLight ? 'text-slate-800' : 'text-white'">Research Trends</h3>
        <p class="text-sm" :class="isLight ? 'text-slate-500' : 'text-slate-400'">Activity and output over the last 5 years</p>
      </div>
      <div v-if="growthRate !== null" :class="[
        'flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
        growthRate >= 0 
          ? (isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400') 
          : (isLight ? 'bg-rose-50 text-rose-700' : 'bg-rose-500/10 text-rose-400')
      ]">
        <span class="mr-1">{{ growthRate >= 0 ? '↗' : '↘' }}</span>
        {{ Math.abs(growthRate) }}% YoY Growth
      </div>
    </div>

    <div class="h-[350px] w-full">
      <VChart class="h-full w-full" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getActivityTimeline, getGrowthRate } from '../utils/trend-timeline';

const { isLight } = useTheme();
const timelineData = getActivityTimeline(5);
const growthRate = getGrowthRate();

const chartOption = computed(() => {
  const years = timelineData.map(d => d.year.toString());
  const mous = timelineData.map(d => d.mous);
  const outputs = timelineData.map(d => d.projects + d.works);

  // ปรับสีตามธีม
  const textColor = isLight.value ? '#64748b' : '#94a3b8';
  const lineColor = isLight.value ? '#e2e8f0' : '#1e293b';
  const splitLineColor = isLight.value ? '#f1f5f9' : '#1e293b';

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isLight.value ? '#ffffff' : '#0f172a',
      borderColor: isLight.value ? '#e2e8f0' : '#1e293b',
      textStyle: { color: isLight.value ? '#1e293b' : '#f8fafc' }
    },
    legend: {
      data: ['MOUs', 'Research Outputs'],
      bottom: 0,
      icon: 'circle',
      textStyle: { color: textColor }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: lineColor } },
      axisLabel: { color: textColor, fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'MOUs',
        nameTextStyle: { color: textColor },
        minInterval: 1,
        position: 'left',
        splitLine: { lineStyle: { type: 'dashed', color: splitLineColor } },
        axisLabel: { color: textColor }
      },
      {
        type: 'value',
        name: 'Outputs',
        nameTextStyle: { color: textColor },
        minInterval: 1,
        position: 'right',
        splitLine: { show: false },
        axisLabel: { color: textColor }
      }
    ],
    series: [
      {
        name: 'Research Outputs',
        type: 'bar',
        yAxisIndex: 1,
        data: outputs,
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '35%'
      },
      {
        name: 'MOUs',
        type: 'line',
        data: mous,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 3, color: '#f59e0b' }
      }
    ]
  };
});
</script>