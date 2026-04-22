<template>
  <div>
    <div class="ph">
        <div>
            <div class="ph-title">Research Groups / Clusters</div>
            <div class="ph-sub"></div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="g in GROUPS" :key="g.id" class="card-custom cursor-pointer" :style="`border-top: 2px solid ${TC(g.theme)}`" @click="openGroupDrilldown(g.id)">
            <div class="card-p">
                <div class="flex items-start gap-2.5 mb-3">
                    <div class="flex items-center justify-center w-9.5 h-9.5 rounded-[9px]" :style="`background:${TC(g.theme)}18; font-size:18px; flex-shrink:0`">
                        {{ TI(g.theme) }}
                    </div>
                    <div>
                        <div class="text-[13px] font-bold" style="color:var(--color-t0); line-height:1.3;">
                            {{ g.name }}
                        </div>
                        <div class="text-[10px] mt-1" style="color:var(--color-t3);">{{g.inst}}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px">
                    <div v-for="el in status">
                        <div class=" rounded-md p-1.75 text-center" style="background:var(--color-bg2)">
                            <div class="text-[15px] font-semibold" :style="{ color: el?.color ?? TC(g.theme), fontFamily: 'var(--font-mono)'}">
                                {{ Array.isArray(g[el.field as keyof typeof g]) ? (g[el.field as keyof typeof g] as any[]).length : (g[el.field as keyof typeof g] ?? '-') }}
                            </div>
                            <div class="text-[9px]" style="color: var(--color-t3)">
                                {{ el.label }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-0.75">
                    <span v-for="t in g.expertise.slice(0,3)" class="tag" :style="{ color: TC(g.theme), background: `${TC(g.theme)}12`}">
                        {{ t }}
                    </span>
                </div>
                <div class="flex items-center justify-between mt-2.5 pt-2" style="border-top:1px solid var(--color-b0)">
                    <div class="text-[10px]" style="color: var(--color-3);">
                        Experience Score
                    </div>
                    <div class="text-[13px] font-bold" :style="{ color: g?.exp_score >= 85 ? 'var(--em)' :g?.exp_score >= 70 ?'var(--c)':'var(--am)' , fontFamily: 'var(--font-mono)' }">
                        {{ g?.exp_score ?? '-' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
const status = ref<any[]>([
    { field: 'members', label: 'Members' },
    { field: 'hindex', label: 'H-Index', color: 'var(--c)' },
    { field: 'pubs', label: 'Pubs', color: 'var(--em)' },
])

const openGroupDrilldown = (id: string) => {
  console.log('Opening group:', id);
};
</script>

<style>

</style>
