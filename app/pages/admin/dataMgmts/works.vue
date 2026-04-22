<template>
  <div>
    <div class="ph">
        <div>
            <div class="ph-title">Featured Works</div>
            <div class="ph-sub">ผลงานเด่น {{ WORKS.length }} รายการ — Patents, Awards, Papers, Projects</div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="w in WORKS" :key="w.title" class="border border-slate-200 rounded-xl p-5 flex flex-col transition-all hover:-translate-y-1" :style="{ borderTop: `2px solid ${TC(w.theme)}`, background: 'var(--color-card)' }">
            <div class="flex items-center gap-2 mb-3">
                <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1" :style="{ 
                    backgroundColor: getWorkTypeMeta(w.type).color + '18', 
                    color: getWorkTypeMeta(w.type).color 
                  }">
                    <span>{{ getWorkTypeMeta(w.type).icon }}</span>
                    {{ w.type }}
                </span>

                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200" style="color: var(--color-t1)">
                    {{ TN(w.theme) }}
                </span>
            </div>

            <h3 class="text-sm font-bold mb-1.5 leading-snug"  style="color: var(--color-t0)">
                {{ w.title }}
            </h3>

            <div class="text-xs text-blue-400/80 mb-2 font-medium">
                {{ getResearcherName(w.researcher) }}
            </div>

            <p class="text-[11px] text-slate-400 leading-relaxed mb-4 grow italic">
                {{ w.award }}
            </p>

            <div class="mt-auto pt-3 border-t border-slate-200 flex justify-between items-center">
                <span class="text-[11px] text-slate-500" :style="{ fontFamily: 'var(--font-mono)' }">{{ w.year }}</span>

                <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold" :style="{ fontFamily: 'var(--font-mono)', color: TC(w.theme) }">
                        IF {{ w.impact }}
                    </span>
                    <span v-if="w.citations" class="text-[11px] text-slate-500 font-mono">
                        · 📖 {{ w.citations }}
                    </span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// definePageMeta({
//     title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
//     layout: 'sidebar-layout'
// });
const getWorkTypeMeta = (type: string) => {
    const meta: Record < string, { color: string;icon: string } > = {
        patent: { color: '#f5a623', icon: '⚗' }, // Amber
        award: { color: '#a78bfa', icon: '🏆' }, // Violet
        paper: { color: '#3b82f6', icon: '📄' }, // Blue
        project: { color: '#00e5a0', icon: '🚀' } // Emerald
    };
    return meta[type] || { color: '#94a3b8', icon: '📦' };
};
const getResearcherName = (id: string) => RESEARCHERS.find(r => r.id === id)?.name || '—';
</script>

<style scoped>

</style>
