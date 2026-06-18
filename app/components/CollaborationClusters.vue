<script setup lang="ts">
import { ref, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { RESEARCHERS, GROUPS } from '../utils/mockData';
import { TI, TN, TC } from '../utils';

const { isLight } = useTheme();
use([CanvasRenderer, GraphChart, TooltipComponent]);
const hoveredClusterName = ref<string | null>(null);

// ข้อมูลจำลองสำหรับ Clustering และ Path Highlight
const clusterData = computed(() => {
  return [
    { id: 'c1', name: 'Digital Health Ecosystem', theme: 'AI', size: 12, activity: 85 },
    { id: 'c2', name: 'Smart Agri-Tech', theme: 'Agri', size: 8, activity: 72 },
    { id: 'c3', name: 'Sustainable Policy', theme: 'Social', size: 6, activity: 64 },
    { id: 'c4', name: 'Biotech Innovation', theme: 'Health', size: 15, activity: 91 }
  ];
});

const potentialCollabs = [
  {
    from: { name: 'Dr. Sarah Chen', group: 'AI & Robotics Lab' },
    to: { name: 'Prof. Somchai P.', group: 'Biomedical Center' },
    reason: 'Neural Networks expertise meets clinical imaging requirements.',
    score: 94,
    path: ['Deep Learning', 'Medical Imaging', 'Diagnostic AI']
  },
  {
    from: { name: 'James Wilson', group: 'Clean Energy' },
    to: { name: 'Anong S.', group: 'Social Innovation' },
    reason: 'Policy framework needed for community smart grid adoption.',
    score: 87,
    path: ['Grid Tech', 'Public Policy', 'Community Engagement']
  }
];

// ECharts Graph Configuration for Visualization
const graphOption = computed(() => {
  const colorMode = isLight.value ? '#1e293b' : '#f8fafc';
  const isAnyHovered = hoveredClusterName.value !== null;

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      shadowBlur: 0,
      extraCssText: 'box-shadow: none;',
      formatter: (params: any) => {
        if (params.dataType !== 'node') return '';
        const data = params.data;
        const color = TC(data.theme);
        const bg = isLight.value ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)';
        const borderColor = isLight.value ? '#e2e8f0' : '#1e293b';
        const textColor = isLight.value ? '#1e293b' : '#f8fafc';
        const labelColor = isLight.value ? '#64748b' : '#94a3b8';
        
        return `
            <div style="background: ${bg}; border: 1px solid ${borderColor}; border-bottom-color: transparent; border-right-color: transparent; backdrop-filter: blur(12px); padding: 16px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); min-width: 240px; font-family: 'Plus Jakarta Sans', sans-serif;">            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 12px; background: ${color}15; color: ${color}; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid ${color}30;">
                ${TI(data.theme)}
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 900; color: ${textColor}; line-height: 1.2;">${data.name}</div>
                <div style="font-size: 10px; font-weight: 800; color: ${color}; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">${TN(data.theme)} Cluster</div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px dashed ${borderColor};">
              <div>
                <div style="font-size: 9px; font-weight: 700; color: ${labelColor}; text-transform: uppercase; margin-bottom: 2px; tracking: 0.05em;">Community Size</div>
                <div style="font-size: 15px; font-weight: 900; color: ${textColor}; font-family: monospace;">${data.size} <span style="font-size: 10px; font-weight: 600; color: ${labelColor};">Nodes</span></div>
              </div>
              <div>
                <div style="font-size: 9px; font-weight: 700; color: ${labelColor}; text-transform: uppercase; margin-bottom: 2px; tracking: 0.05em;">Active Pulse</div>
                <div style="font-size: 15px; font-weight: 900; color: ${color}; font-family: monospace;">${data.activity}%</div>
              </div>
            </div>
          </div>
        `;
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      animation: true,
      data: clusterData.value.map(c => ({
        name: c.name,
        value: c.activity,
        symbolSize: c.size * 4.5,
        theme: c.theme,
        size: c.size,
        activity: c.activity,
        itemStyle: { 
          color: TC(c.theme),
          opacity: !isAnyHovered || hoveredClusterName.value === c.name ? 1 : 0.2
        },
        label: { 
          show: c.size > 7,
          opacity: !isAnyHovered || hoveredClusterName.value === c.name ? 1 : 0.1
        }
      })),
      links: [
        { source: 'Digital Health Ecosystem', target: 'Biotech Innovation', lineStyle: { width: 4, curveness: 0.2, color: '#3b82f6', opacity: 0.3 } },
        { source: 'Smart Agri-Tech', target: 'Digital Health Ecosystem', lineStyle: { width: 2, opacity: 0.1 } }
      ],
      force: { repulsion: 800, edgeLength: 100 },
      label: {
        position: 'bottom',
        color: colorMode,
        fontSize: 9,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '700',
        distance: 5,
        formatter: '{b}'
      },
      emphasis: { focus: 'adjacency', lineStyle: { width: 10 } }
    }]
  };
});
</script>

<template>
  <div class="collaboration-clusters p-6 space-y-8" :class="{ 'is-light': isLight }">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black tracking-tight" :class="isLight ? 'text-slate-900' : 'text-white'">
          Collaboration <span class="text-blue-500">Clusters</span>
        </h2>
        <p class="text-sm mt-1" :class="isLight ? 'text-slate-500' : 'text-slate-400'">
          Identifying emergent research communities and interdisciplinary potential.
        </p>
      </div>
      <div class="flex gap-2">
        <div v-for="c in clusterData" :key="c.id" class="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors"
             :class="isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'">
          <div class="w-2 h-2 rounded-full" :style="{ background: TC(c.theme) }"></div>
          <span class="opacity-70">{{ TN(c.theme) }}</span>
        </div>
      </div>
    </div>

    <!-- Visualization Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 min-h-[450px] h-full rounded-[2.5rem] border relative overflow-hidden transition-all duration-500"
           :class="isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'">
        <div class="absolute top-6 left-6 z-10">
           <div class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Network Discovery</div>
           <div class="h-1 w-12 bg-blue-500 rounded-full"></div>
        </div>
        <VChart :option="graphOption" autoresize class="w-full h-full" />
      </div>

      <!-- Metrics Side Panel -->
      <div class="space-y-3">
        <div v-for="cluster in clusterData" :key="cluster.id"
             @mouseenter="hoveredClusterName = cluster.name"
             @mouseleave="hoveredClusterName = null"
             class="p-5 rounded-[1.5rem] border transition-all duration-300 cursor-default group"
             :class="[
                isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800',
                hoveredClusterName === cluster.name 
                  ? (isLight ? 'ring-2 ring-blue-500/10 border-blue-200 -translate-y-1' : 'ring-2 ring-blue-500/20 border-blue-900/50 -translate-y-1') 
                  : 'hover:border-slate-400/30'
             ]">
          <div class="flex justify-between items-start mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg" :style="{ background: TC(cluster.theme) + '15', color: TC(cluster.theme) }">
              <!-- <Icon :name="TI(cluster.theme)" /> -->
               {{ TI(cluster.theme) }}
            </div>
            <div class="text-right">
              <div class="text-xs font-black" :class="isLight ? 'text-slate-900' : 'text-slate-100'">{{ cluster.activity }}%</div>
              <div class="text-[9px] uppercase font-bold text-slate-400">Activity</div>
            </div>
          </div>
          <div class="font-black text-sm mb-3 tracking-tight" :class="isLight ? 'text-slate-800' : 'text-slate-100'">{{ cluster.name }}</div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000" :style="{ width: cluster.activity + '%', background: TC(cluster.theme) }"></div>
            </div> 
            <span class="text-[10px] font-bold text-slate-400">{{ cluster.size }} Nodes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Potential Collabs Section -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Icon name="ph:magic-wand-bold" class="text-amber-500 text-xl" />
        </div>
        <h3 class="font-black text-lg uppercase tracking-tight" :class="isLight ? 'text-slate-800' : 'text-slate-100'">AI-Powered <span class="text-amber-500">Matches</span></h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(collab, idx) in potentialCollabs" :key="idx"
             class="group rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
             :class="isLight ? 'bg-white border-slate-200 hover:shadow-blue-500/5' : 'bg-slate-900 border-slate-800 hover:border-slate-700'">
          
          <div class="p-6">
            <!-- Collab Match Header -->
            <div class="flex items-center justify-between mb-8">
              <div class="text-center flex-1">
                <div class="text-sm font-black" :class="isLight ? 'text-slate-900' : 'text-white'">{{ collab.from.name }}</div>
                <div class="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{{ collab.from.group }}</div>
              </div>
              
              <div class="px-6 flex flex-col items-center">
                <div class="text-2xl font-mono font-black text-amber-500">{{ collab.score }}%</div>
                <div class="flex items-center gap-1">
                  <div class="w-8 h-px bg-slate-200 dark:bg-slate-800"></div>
                  <Icon name="ph:link-bold" class="text-slate-300" />
                  <div class="w-8 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>
              </div>

              <div class="text-center flex-1">
                <div class="text-sm font-black" :class="isLight ? 'text-slate-900' : 'text-white'">{{ collab.to.name }}</div>
                <div class="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">{{ collab.to.group }}</div>
              </div>
            </div>

            <!-- Reason Bubble -->
            <div class="relative p-5 rounded-2xl mb-6 transition-colors"
                 :class="isLight ? 'bg-blue-50/50 text-slate-600' : 'bg-blue-900/10 text-slate-400'">
              <Icon name="ph:sparkle-fill" class="absolute -top-2 -left-2 text-blue-500 text-xl" />
              <p class="text-[11px] leading-relaxed font-medium">"{{ collab.reason }}"</p>
            </div>

            <!-- Path Highlight -->
            <div class="space-y-2">
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <div class="w-1 h-1 rounded-full bg-blue-500"></div> Connection Bridge Path
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <template v-for="(path, pIdx) in collab.path" :key="pIdx">
                  <span class="px-3 py-1 rounded-lg text-[9px] font-black border transition-colors shadow-sm"
                        :class="isLight ? 'bg-white border-slate-100 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'">
                    {{ path }}
                  </span>
                  <Icon v-if="pIdx < collab.path.length - 1" name="ph:arrow-right-bold" class="text-[10px] text-slate-400" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>