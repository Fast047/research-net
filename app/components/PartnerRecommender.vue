<script setup lang="ts">
import { computed } from 'vue';
import { MOUS } from '../utils/mockData';
import { 
  recommendCountryForTheme, 
  getCountryCoverage, 
  findBestPartnerInstitution 
} from '../utils/partner-recommender';
import { TI, TN, TC } from '../utils';

const props = defineProps<{
  theme: string
}>();

const { isLight } = useTheme();

// Helper to determine reason for recommendation
const getReason = (country: string, theme: string, hasMOU: boolean) => {
  if (hasMOU) {
    return `Strengthen existing ties in ${country} for ${TN(theme)}. Strategic expansion with current partners or new institutions.`;
  }
  const leads: Record<string, string> = {
    'AI': 'pioneering AI research and high-tech infrastructure',
    'Health': 'advanced biomedical research and healthcare systems',
    'Energy': 'leading sustainable energy solutions and policy',
    'Env': 'innovative environmental conservation technologies',
    'Agri': 'smart agriculture and food security excellence',
    'Social': 'strong social science research and policy framework',
    'Nano': 'cutting-edge nanotechnology and materials science',
    'Quantum': 'quantum computing leadership and physics research'
  };
  return `${country} is known for ${leads[theme] || 'research excellence'}. Establishing a new MOU would bridge our coverage gap.`;
};

const coverage = computed(() => getCountryCoverage());

const recommendations = computed(() => {
  const countries = recommendCountryForTheme(props.theme);
  return countries.map(country => {
    const hasMOU = MOUS.some(m => m.country === country);
    const bestPartner = findBestPartnerInstitution(props.theme, country);
    return {
      name: country,
      hasMOU,
      partner: bestPartner,
      reason: getReason(country, props.theme, hasMOU)
    };
  });
});

// ECharts configuration for the World Map
const mapOption = computed(() => {
  const activeCountries = Array.from(new Set(MOUS.map(m => m.country)));
  const data = activeCountries.map(c => ({ name: c, value: 1 }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: isLight.value ? ['#e2e8f0', '#3b82f6'] : ['#1e293b', '#3b82f6']
      }
    },
    series: [
      {
        name: 'MOU Presence',
        type: 'map',
        map: 'world',
        roam: true,
        emphasis: {
          label: { show: true, color: isLight.value ? '#1e293b' : '#ffffff' },
          itemStyle: { areaColor: isLight.value ? '#60a5fa' : '#2563eb' }
        },
        data: data
      }
    ]
  };
});
</script>

<template>
  <div class="partner-recommender p-6 space-y-8" :class="{ 'is-light': isLight }">
    <!-- Header & Coverage Metrics -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black flex items-center gap-3" :class="isLight ? 'text-slate-900' : 'text-white'">
          <span class="text-3xl">{{ TI(theme) }}</span>
          <span :style="{ color: TC(theme) }">Strategic Partnering:</span> {{ TN(theme) }}
        </h2>
        <p class="text-sm mt-1" :class="isLight ? 'text-slate-500' : 'text-slate-400'">Analysis of global collaboration opportunities and existing network coverage.</p>
      </div>
      
      <div class="flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300"
           :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'">
        <div class="text-center">
          <div class="text-2xl font-black text-blue-600">{{ coverage.percentage }}%</div>
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-tighter text-nowrap">Global Reach</div>
        </div>
        <div class="h-8 w-px" :class="isLight ? 'bg-slate-200' : 'bg-slate-800'"></div>
        <div class="text-center">
          <div class="text-2xl font-black text-green-600">{{ coverage.covered.length }}</div>
          <div class="text-[10px] uppercase font-bold text-slate-400 tracking-tighter text-nowrap">Active Hubs</div>
        </div>
      </div>
    </div>

    <!-- Map Visualization Section -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 h-[450px] rounded-3xl border overflow-hidden relative transition-all duration-300"
           :class="isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'">
        <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
           <div class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm transition-colors"
                :class="isLight ? 'text-slate-500 bg-white/80 border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'">
             <div class="w-2 h-2 rounded-full bg-blue-500"></div> Active MOU Hubs
           </div>
           <div class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm transition-colors"
                :class="isLight ? 'text-slate-500 bg-white/80 border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'">
             <div class="w-2 h-2 rounded-full" :class="isLight ? 'bg-slate-300' : 'bg-slate-700'"></div> Potential Areas
           </div>
        </div>
        <VChart :option="mapOption" autoresize class="w-full h-full" />
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex-1 p-5 rounded-3xl border transition-all duration-300"
             :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Icon name="ph:check-circle-bold" class="text-green-500" />
            Network Presence
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="c in coverage.covered" :key="c" 
                  class="px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-300"
                  :class="isLight ? 'bg-green-50 text-green-700 border-green-100 shadow-sm' : 'bg-green-900/20 text-green-400 border-green-800/30'">
              {{ c }}
            </span>
          </div>
        </div>
        
        <div class="flex-1 p-5 rounded-3xl border transition-all duration-300"
             :class="isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Icon name="ph:rocket-launch-bold" class="text-amber-500" />
            Strategic Gaps
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="c in coverage.missing" :key="c" 
                  class="px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-300"
                  :class="isLight ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-sm' : 'bg-amber-900/20 text-amber-400 border-amber-800/30'">
              {{ c }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations Grid -->
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="h-px flex-1" :class="isLight ? 'bg-slate-200' : 'bg-slate-800'"></div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Partner Recommendations</span>
        <div class="h-px flex-1" :class="isLight ? 'bg-slate-200' : 'bg-slate-800'"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="item in recommendations.slice(0, 6)" :key="item.name" 
             class="group border rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
             :class="isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors"
                   :class="isLight ? 'bg-slate-50 group-hover:bg-blue-50' : 'bg-slate-800 group-hover:bg-blue-900/20'">
                <span :class="{ 'filter grayscale brightness-125': !isLight }">📍</span>
              </div>
              <div>
                <h4 class="font-bold text-lg" :class="isLight ? 'text-slate-800' : 'text-slate-100'">{{ item.name }}</h4>
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full" :class="item.hasMOU ? 'bg-blue-500' : (isLight ? 'bg-slate-200' : 'bg-slate-700')"></div>
                  <span class="text-[10px] font-bold uppercase tracking-wider" :class="item.hasMOU ? 'text-blue-500' : 'text-slate-400'">
                    {{ item.hasMOU ? 'Active Network' : 'Expansion Candidate' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Recommended Lead</div>
              <div class="text-sm font-bold px-3 py-2 rounded-xl border transition-colors"
                   :class="isLight ? 'text-slate-700 bg-slate-50 border-slate-100' : 'text-slate-300 bg-slate-800/40 border-slate-800'">
                {{ item.partner || 'Exploring Institutional Match...' }}
              </div>
            </div>

            <div class="relative p-4 rounded-2xl border overflow-hidden transition-all duration-300"
                 :class="isLight ? 'bg-blue-50/50 border-blue-100/50' : 'bg-blue-900/10 border-blue-900/30'">
              <Icon name="ph:quotes-fill" class="absolute -top-1 -right-1 text-blue-500/10 text-4xl" />
              <p class="text-xs leading-relaxed relative z-10" :class="isLight ? 'text-slate-600' : 'text-slate-400'">
                {{ item.reason }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.partner-recommender {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>