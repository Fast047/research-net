<template>
  <div class="scroll-pane space-y-6">
    <div class="ph">
      <div>
            <div class="ph-title">Collaboration Clusters</div>
            <div class="ph-sub">นักวิจัยที่มีความสนใจใกล้เคียงกันแต่ยังไม่เคยร่วมงาน — โอกาสสร้างความร่วมมือใหม่</div>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div 
        v-for="(cl, i) in clusters" 
        :key="`${cl.a.id}-${cl.b.id}`"
        class="border border-slate-200 rounded-xl p-5 transition-all hover:border-slate-400"
        :style="{ borderLeft: `3px solid ${TC(cl.shared[0])}` }"
      >
        <div class="flex items-center gap-3 mb-4">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
            :style="{ 
              background: `linear-gradient(135deg, ${TC(cl.a.themes[0])}, ${TC(cl.b.themes[0])})` 
            }"
          >
            {{ i + 1 }}
          </div>
          
          <div class="flex-1">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-tight">
              {{ lastName(cl.a.name) }} <span class="text-slate-500 mx-1">↔</span> {{ lastName(cl.b.name) }}
            </h3>
            <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Collab Potential: 
              <span :style="{ color: cl.potential >= 60 ? '#00e5a0' : '#f5a623' }">
                {{ cl.potential }}%
              </span>
            </p>
          </div>

          <div class="text-right">
            <div 
              class="text-2xl font-black font-mono leading-none"
              :style="{ color: cl.potential >= 60 ? '#00e5a0' : '#f5a623' }"
            >
              {{ cl.potential }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-4">
          <div v-for="r in [cl.a, cl.b]" :key="r.id" class="rounded-lg p-3 bg-slate-300/50">
            <div class="text-[11px] font-bold text-slate-800 truncate">{{ r.name }}</div>
            <div class="text-[10px] text-slate-500 truncate mb-2">{{ r.inst }}</div>
            <div class="text-[10px] font-mono text-blue-400 font-bold">
              H:{{ r.hindex }} · Exp:{{ r.exp_score }}
            </div>
          </div>
        </div>

        <div class="space-y-3 mb-4">
          <div>
            <div class="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Shared Themes</div>
            <div class="flex flex-wrap gap-1">
              <span v-for="t in cl.shared" :key="t" class="px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-700"
              :style="{ color: TC(t), border: `1px solid ${TC(t)}`}" >
               {{ TI(t) }} {{ TN(t) }}
              </span>
            </div>
          </div>
          
          <div class="text-[10px] text-slate-500 font-medium">
            Expertise Overlap: <span class="text-slate-600">{{ cl.expOverlap }} tags</span>
          </div>
        </div>
        <Button class="w-full" :pt="{
            root: {
              style: {
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '10px 4px'
              }
            }
          }">
          📨 เชิญร่วมโครงการ
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
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
</style>