<script setup lang="ts">
import { useGraphQuery } from '~/composables/useGraphQuery'
import { getGraphDensity, getAverageClusteringCoefficient } from '~/utils/graph-algorithms'
import { getGroupRanking, getGroupStrengthProfile } from '~/utils/centrality-ranking'

definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
})

const { graph, getCentralNodes } = useGraphQuery()
const { isLight } = useTheme()

// 1. Network Statistics
const networkStats = computed(() => {
  const g = graph.value
  return [
    { label: 'Network Density', value: getGraphDensity(g).toFixed(4), icon: '🕸', desc: 'ความหนาแน่นของเส้นเชื่อม' },
    { label: 'Avg. Clustering', value: getAverageClusteringCoefficient(g).toFixed(4), icon: '🏘', desc: 'ดัชนีการเกาะกลุ่ม' },
    { label: 'Total Nodes', value: g.nodes.size, icon: '📍', desc: 'จำนวนเอนทิตีทั้งหมด' },
    { label: 'Total Edges', value: g.edges.length, icon: '🔗', desc: 'จำนวนความสัมพันธ์' }
  ]
})

// 2. Centrality Leaders
const metric = ref<'pagerank' | 'betweenness'>('pagerank')
const centralityLeaders = computed(() => getCentralNodes(metric.value, 10))

// 3. Group Ranking & Radar
const groupRankings = computed(() => getGroupRanking('exp_score').slice(0, 5))
const selectedGroupId = ref(groupRankings.value[0]?.id)
const strengthProfile = computed(() => selectedGroupId.value ? getGroupStrengthProfile(selectedGroupId.value) : null)

const radarOption = computed(() => {
  if (!strengthProfile.value || !strengthProfile.value.datasets?.[0]) return {}
  const data = strengthProfile.value;
  if(!data.datasets?.[0]) return {}
  const dataset = data.datasets[0]
  
  return {
    backgroundColor: 'transparent',
    radar: {
      indicator: data.labels.map(l => ({ name: l, max: 100 })),
      splitArea: { show: false },
      axisLine: { lineStyle: { color: isLight.value ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: dataset.data,
        name: dataset.label,
        itemStyle: { color: dataset.borderColor },
        areaStyle: { color: dataset.backgroundColor }
      }]
    }]
  }
})

const getTypeSeverity = (type: string) => {
  const map: Record<string, string> = { Researcher: 'success', Group: 'info', MOU: 'warn', Project: 'secondary' }
  return (map[type] as any) || 'contrast'
}
</script>

<template>
  <div class="p-6 space-y-6" :class="{ 'is-light': isLight }">
    <header>
      <h1 class="text-2xl font-bold" :class="isLight ? 'text-slate-900' : 'text-white'">Graph Analytics</h1>
      <p class="text-slate-500 text-sm">การวิเคราะห์โครงสร้างเครือข่ายและลำดับความสำคัญ</p>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="stat in networkStats" :key="stat.label" :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'border p-4 rounded-xl transition-all']">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-xl">{{ stat.icon }}</span>
          <span :class="[isLight ? 'text-slate-500' : 'text-slate-400', 'text-xs font-bold uppercase tracking-wider']">{{ stat.label }}</span>
        </div>
        <div class="text-2xl font-mono font-bold text-primary">{{ stat.value }}</div>
        <div :class="[isLight ? 'text-slate-400' : 'text-slate-500', 'text-[10px] mt-1']">{{ stat.desc }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Centrality Leaders -->
      <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'lg:col-span-2 border rounded-xl overflow-hidden transition-all']">
        <div :class="[isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-800/30 border-slate-800', 'p-4 border-b flex justify-between items-center transition-colors']">
          <h2 :class="[isLight ? 'text-slate-800' : 'text-white', 'font-bold flex items-center gap-2']">
            <Icon name="ph:crown-simple-bold" class="text-amber-400" />
            Centrality Leaders
          </h2>
          <div :class="[isLight ? 'bg-slate-100' : 'bg-slate-900', 'flex rounded-lg p-1 transition-colors']">
            <button 
              v-for="m in ['pagerank', 'betweenness']" :key="m"
              @click="metric = m as any"
              :class="['px-3 py-1 text-xs rounded-md transition-all', metric === m ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300']"
            >
              {{ m === 'pagerank' ? 'Influence' : 'Bridge' }}
            </button>
          </div>
        </div>
        <DataTable :value="centralityLeaders" size="small" class="p-datatable-sm">
          <Column field="rank" header="#" style="width: 4rem">
            <template #body="slotProps">
              <span class="font-mono text-slate-500">#{{ slotProps.index + 1 }}</span>
            </template>
          </Column>
          <Column header="Entity">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Tag :value="data.node.type" :severity="getTypeSeverity(data.node.type)" size="small" />
                <span :class="[isLight ? 'text-slate-700' : 'text-slate-200', 'font-medium']">{{ data.node.label }}</span>
              </div>
            </template>
          </Column>
          <Column field="score" header="Score">
            <template #body="{ data }">
              <span class="font-mono text-primary-400 font-bold">{{ data.score.toFixed(4) }}</span>
            </template>
          </Column>
          <Column header="Institution" class="text-slate-500 text-sm">
            <template #body="{ data }">{{ data.node.data?.inst || '-' }}</template>
          </Column>
        </DataTable>
      </div>

      <!-- Group Rankings & Radar -->
      <div class="space-y-6">
        <div :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'border rounded-xl p-4 transition-all']">
          <h2 :class="[isLight ? 'text-slate-800' : 'text-white', 'font-bold mb-4 flex items-center gap-2']">
            <Icon name="ph:medal-bold" class="text-blue-400" />
            Top Research Groups
          </h2>
          <div class="space-y-2">
            <div 
              v-for="g in groupRankings" :key="g.id"
              @click="selectedGroupId = g.id"
              :class="['p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center', selectedGroupId === g.id ? (isLight ? 'bg-primary/5 border-primary' : 'bg-primary/10 border-primary/50') : (isLight ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500')]"
            >
              <div :class="isLight ? 'text-slate-800' : 'text-white'">
                <div class="font-bold text-sm">{{ g.short }}</div>
                <div class="text-[10px] text-slate-500">{{ g.inst }}</div>
              </div>
              <div class="font-mono text-primary font-bold">{{ g.exp_score }}</div>
            </div>
          </div>
        </div>

        <!-- Strength Radar -->
        <div v-if="strengthProfile && strengthProfile.datasets?.[0]" :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800', 'border rounded-xl p-4 transition-all']">
          <h3 :class="[isLight ? 'text-slate-500' : 'text-slate-400', 'text-xs font-bold uppercase mb-4']">Strength Profile: {{ strengthProfile.datasets[0].label }}</h3>
          <div class="h-[280px]">
            <VChart :option="radarOption" autoresize />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped> 
:deep(.p-datatable-thead > tr > th) { background: transparent; border-color: rgba(255,255,255,0.05); font-size: 11px; text-transform: uppercase; color: #64748b; } 
:deep(.p-datatable-tbody > tr) { background: transparent; border-color: rgba(255,255,255,0.05); } 

/* Light Mode Specifics for PrimeVue DataTable */
.is-light :deep(.p-datatable-thead > tr > th),
.is-light :deep(.p-datatable-tbody > tr) { border-color: #f1f5f9; }
</style>