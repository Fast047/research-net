<template>
  <div class="scroll-pane space-y-10 pb-20" :class="{ 'is-light': isLight }">
    <!-- Header Section -->
    <div class="ph">
      <div>
        <div class="ph-title" :class="isLight ? 'text-slate-900' : 'text-white'">Collaboration Clusters</div>
        <div class="ph-sub" :class="isLight ? 'text-slate-500' : 'text-slate-400'">
          นักวิจัยที่มีความสนใจใกล้เคียงกันแต่ยังไม่เคยร่วมงาน — โอกาสสร้างความร่วมมือใหม่ผ่านการวิเคราะห์ AI
        </div>
      </div>
    </div>

    <!-- Community Detection Visualization -->
    <section class="px-6">
      <CollaborationClusters />
    </section>

    <!-- Potential Collaboration Cards -->
    <section class="hidden px-6 space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:sparkle-bold" class="text-amber-500 text-xl" />
          <h2 class="text-xl font-black uppercase tracking-tight" :class="isLight ? 'text-slate-800' : 'text-white'">
            Matchmaking <span class="text-blue-500">Insights</span>
          </h2>
        </div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          {{ clusters.length }} High-Potential Connections
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div 
          v-for="(cl, i) in clusters" 
          :key="`${cl.a.id}-${cl.b.id}`"
          class="border rounded-[2rem] p-8 transition-all duration-500 hover:shadow-2xl group relative overflow-hidden"
          :class="isLight ? 'bg-white border-slate-100 hover:border-blue-200/50 hover:shadow-blue-500/5' : 'bg-slate-900/40 border-slate-800 hover:border-blue-900/30'"
        >
          <!-- Theme Accent Strip -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5 opacity-60" :style="{ backgroundColor: TC(cl.shared[0]) }"></div>

          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md transition-transform duration-500 group-hover:rotate-[360deg]"
                :style="{ background: `linear-gradient(135deg, ${TC(cl.shared[0])}, ${TC(cl.shared[0])}aa)` }"
              >
                {{ i + 1 }}
              </div>
            
              <div>
                <h3 class="text-lg font-black tracking-tight" :class="isLight ? 'text-slate-800' : 'text-white'">
                  {{ lastName(cl.a.name) }} <span class="text-slate-400 opacity-40 mx-1">&</span> {{ lastName(cl.b.name) }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-[9px] font-black uppercase tracking-[0.1em] text-blue-500">Cross-Disciplinary Discovery</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Match Score</div>
              <div class="text-3xl font-black font-mono leading-none" :style="{ color: cl.potential >= 70 ? '#10b981' : '#f59e0b' }">
                {{ cl.potential }}%
              </div>
            </div>
          </div>

          <!-- Connection Bridge Visualization -->
          <div class="relative flex items-center justify-between mb-8 px-4">
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px border-t border-dashed transition-colors duration-500" :class="isLight ? 'border-slate-200' : 'border-slate-700'">
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[8px] font-black uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700">
                {{ cl.expOverlap }} Overlap
              </div>
            </div>

            <div v-for="r in [cl.a, cl.b]" :key="r.id" class="relative z-10 text-center w-[40%]">
              <div class="text-[11px] font-black truncate mb-0.5" :class="isLight ? 'text-slate-800' : 'text-white'">{{ r.name }}</div>
              <div class="text-[9px] font-bold text-slate-400 truncate mb-3">{{ r.inst }}</div>
              <div class="flex items-center justify-center gap-2">
                <div class="flex flex-col">
                  <span class="text-[8px] uppercase font-bold text-slate-500">H-Index</span>
                  <span class="text-xs font-black text-blue-500">{{ r.hindex }}</span>
                </div>
                <div class="w-px h-4 bg-slate-100 dark:bg-slate-800"></div>
                <div class="flex flex-col">
                  <span class="text-[8px] uppercase font-bold text-slate-500">Impact</span>
                  <span class="text-xs font-black text-emerald-500">{{ r.exp_score }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="h-px flex-1" :class="isLight ? 'bg-slate-100' : 'bg-slate-800/50'"></div>
                <span class="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Synergetic Themes</span>
                <div class="h-px flex-1" :class="isLight ? 'bg-slate-100' : 'bg-slate-800/50'"></div>
              </div>
              <div class="flex flex-wrap gap-2 justify-center">
                <span v-for="t in cl.shared" :key="t" 
                      class="px-3 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-sm transition-all hover:scale-105"
                      :style="{ color: TC(t), borderColor: TC(t) + '40', backgroundColor: TC(t) + '10' }" >
                 {{ TI(t) }} {{ TN(t) }}
                </span>
              </div>
            </div>
          </div>
          
          <Button class="w-full shadow-md group-hover:shadow-xl transition-all duration-500" 
            :severity="cl.potential >= 70 ? 'success' : 'primary'"
            :pt="{
              root: {
                style: {
                  fontSize: '11px',
                  fontWeight: '900',
                  borderRadius: '16px',
                  padding: '14px 4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }
              }
            }">
            <Icon name="ph:paper-plane-tilt-bold" class="mr-2" /> 📨 เชิญร่วมโครงการ / Invite
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});

const { isLight } = useTheme();
const { clusters } = useClusterAnalysis();

// Helper to get last name (matches your JS logic)
const lastName = (full: string) => full.split(' ').slice(-1)[0];
// Helper to get first names
const firstName = (full: string) => full.split(' ').slice(0, -1).join(' ');
</script>

<style scoped>
.font-mono {
  font-family: var(--font-mono);
}
.scroll-pane {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
</style>