<template>
<div>
    <div class="flex flex-col gap-3">
      <!-- KPI -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="โครงการทั้งหมด" :value="projects.length" trend="▲ 12% จากปีที่แล้ว" class-name="ck" />
          <KpiCard label="งบประมาณรวม" :value="budgetFormatted" trend="▲ 8.4% จากปีที่แล้ว" class-name="cv" />
          <KpiCard label="กำลังดำเนินการ" :value="activeCount" :trend="`${Math.round(activeCount/filtered.length*100) || 0}%  ของทั้งหมด`" class-name="ca" />
          <KpiCard label="ความร่วมมือนานาชาติ" :value="intlCount" trend="▲ 19% จากปีที่แล้ว" class-name="cg" />
      </div>
  
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="card-custom card-p min-h-75 h-full">
          <div class="flex justify-between items-center">
            <h2 class="font-semibold text-[16px] mb-3">โครงการตามสาขาวิชา</h2>
            <span class="text-xs">สัดส่วนการกระจาย</span>
          </div>
          <div class="flex flex-col gap-2.5">
            <div v-for="([f, n], i) in resultSorted" :key="`${f}-${i}`" class="flex items-center cursor-pointer" @click.once="onThemeClick(f)">
              <!-- <span>{{ t.icon }}</span> -->
              <span class="text-xs w-30 shrink-0 truncate" style="color: var(--color-t2)">
                {{ TN(f) }}
              </span>
              <div class="strack h-1.5">
                <div class="sfill" :style="{ background: TC(f), width: `${Math.round(Number(n || 0)/maxField * 100)}%` }">
                </div>
              </div>
              <span class="text-xs font-bold w-9 text-right shrink-0" :style="{ color: TC(f) }">
                {{ n || 0 }}
              </span>
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <div class="card-custom card-p h-full flex flex-col">
              <ChartsDonutChart v-if="typeChart" :data="typeChart" :series-name="'ประเภท'" class="flex-1"  @clickItem="onTypeClick">
                <template #title>
                  <div class="flex justify-between items-center">
                    <h2 class="font-semibold text-[16px] mb-3">สัดส่วนประเภทความร่วมมือ</h2>
                    <span class="text-xs">{{ projects.length || 0 }} โครงการ</span>
                  </div>
                </template>
              </ChartsDonutChart>
              <!-- <ChartsBarChart :data="themeChart" @clickItem="onThemeClick" /> -->
          </div>
        </div>
        <div class="card-custom card-p min-h-75 h-full">
          <div class="flex justify-between items-center">
            <h2 class="font-semibold text-[16px] mb-3">งบประมาณสูงสุดตามสถาบัน</h2>
            <span class="text-xs">ล้านบาท</span>
          </div>
          <div class="flex flex-col gap-2.5">
            <div v-for="([f, n], i) in instSorted" :key="`${f}-${i}`" class="flex items-center cursor-pointer" @click.once="onInstClick(f)">
              <!-- <span>{{ t.icon }}</span> -->
              <span class="text-xs w-30 shrink-0 truncate" style="color: var(--color-t2)">
                {{ f }}
              </span>
              <div class="strack h-1.5">
                <div class="sfill" :style="{ background: 'var(--c)', width: `${Math.round(Number(n || 0) / maxInst * 100)}%` }">
                </div>
              </div>
              <span class="text-xs font-bold w-9 text-right shrink-0" :style="{ color: TC(f) }">
                {{ n || 0 }}
              </span>
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <div class="card-custom card-p h-full">
            <ChartsLineChart v-if="trendChart" :data="trendChart" class="flex-1" >
              <template #title>
                <div class="flex justify-between items-center">
                  <h2 class="font-semibold text-[16px] mb-3">แนวโน้มงบประมาณรายปี</h2>
                  <span class="text-xs">พันล้านบาท</span>
                </div>
              </template>
            </ChartsLineChart>
          </div>
        </div>
      </div>
    </div>
    <Drawer v-model:visible="visibleRight" position="right" style="width: 370px">
      <template #header>
        <div class="flex flex-col">
          <div class="text-base font-bold">
            {{ tilteType }}
          </div>
          <div class="text-[11px]">
          </div>
        </div>
      </template>
      <div class="flex flex-col">
        <div v-for="item in drill" :key="item.id"
          style="background:var(--color-bg2); border:1px solid var(--color-b1); border-radius:var(--r8); padding:11px; margin-bottom:6px; font-size:11px; transition: all .15s;">
          <div class="flex gap-2">
            <span class="flex items-center justify-center w-8.5 h-8.5 rounded-[9px] font-bold shrink-0"
              :style="{ fontSize: '12px', color: TC(item.theme), background: item?.theme ? `${TC(item.theme)}18` : 'transparent' }">
              {{ item?.theme?.slice(0, 3) || '' }}
            </span>
            <div>
              <div class="text-xs" style="color:var(--color-t0);font-weight:600">{{ item?.name ?? '' }}</div>
              <div class="text-[10px]" style="color:var(--color-t3)">
                {{ item?.inst ?? '' }} • {{ item?.type ?? '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
</div>
</template>

<script lang="ts" setup>
// ===== STATE =====
const filter = reactive({
    theme: '',
    type: '',
    status: ''
})

const drill = ref <any[]>([]);
const maxField = ref<any>(1);
const maxInst = ref<any>(1);
const visibleRight = ref(false);
const tilteType = ref('');
// ===== computed =====
const projects = PROJECTS

// ===== FILTER =====
const filtered = computed(() => {
    return PROJECTS;
    // return PROJECTS.filter(p => {
    //   return (
    //     (!filter.theme || p.theme === filter.theme) &&
    //     (!filter.type || p.type === filter.type) &&
    //     (!filter.status || p.status === filter.status)
    //   )
    // })
})

// รวบรวมการประมวลผลข้อมูลไว้ใน Computed เดียวเพื่อลดจำนวนการวนลูป PROJECTS
const analyticsData = computed(() => {
  const fieldCount: Record<string, number> = {};
  const instBudget: Record<string, number> = {};
  const typeMap: Record<string, number> = {};
  const themeMap: Record<string, number> = {};
  const trendMap: Record<string, number> = {};
  let totalBudget = 0;

  filtered.value.forEach(p => {
    fieldCount[p.field] = (fieldCount[p.field] || 0) + 1;
    instBudget[p.inst] = (instBudget[p.inst] || 0) + p.budget;
    typeMap[p.type] = (typeMap[p.type] || 0) + 1;
    themeMap[p.theme] = (themeMap[p.theme] || 0) + 1;
    trendMap[p.year] = (trendMap[p.year] || 0) + p.budget;
    totalBudget += p.budget;
  });

  return { fieldCount, instBudget, typeMap, themeMap, trendMap, totalBudget };
});

const resultSorted = computed(() => {
  const fieldCount: any = {};
  PROJECTS.forEach(p => { fieldCount[p.field] = (fieldCount[p.field]||0)+1; });
  const fieldsSorted = Object.entries(fieldCount).sort((a:any,b:any)=>b[1]-a[1]);
  maxField.value = fieldsSorted[0] ? fieldsSorted[0][1] : 1;
  return fieldsSorted;
});

const instSorted = computed(() => {
  const instBudget: any = {};
  PROJECTS.forEach(p => { instBudget[p.inst] = (instBudget[p.inst]||0) + p.budget; });
  const instSorted = Object.entries(instBudget).sort((a:any,b:any)=>b[1]-a[1]).slice(0,7);
  maxInst.value = instSorted[0] ? instSorted[0][1] : 1;
  return instSorted
});
// ===== KPI =====
const budgetFormatted = computed(() =>
    (filtered.value.reduce((s, p) => s + p.budget, 0) / 1000).toFixed(1) + 'B'
)

const activeCount = computed(() =>
    filtered.value.filter(p => p.status === 'active').length
)

const intlCount = computed(() =>
    filtered.value.filter(p => p.type === 'นานาชาติ').length
)

// ===== CHART DATA =====
const themes = Object.values(THEMES)

const themeChart = computed(() => {
    return themes.map((t: any) => ({
        name: t.name,
        value: filtered.value.filter(p => p.theme === t.value).length
    }))
})

const typeChart = computed(() => {
    const map: any = {}
    filtered.value.forEach(p => {
        map[p.type] = (map[p.type] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
})

const trendChart = computed(() => {
    const map: any = {}
    filtered.value.forEach(p => {
        map[p.year] = (map[p.year] || 0) + p.budget
    })

    return Object.entries(map)
        .map(([year, value]) => ({ year, value }))
        .sort((a: any, b: any) => a.year - b.year)
})

// ===== DRILLDOWN =====
const onThemeClick = (theme: string) => {
  if(!visibleRight.value) visibleRight.value = true;
  tilteType.value = theme;
  drill.value = filtered.value.filter(p => p.theme === theme)
}
const onInstClick = (inst: string) => {
  if(!visibleRight.value) visibleRight.value = true;
  tilteType.value = inst;
  drill.value = filtered.value.filter(p => p.inst === inst)
}
const onTypeClick = (type: string) => {
  if(!visibleRight.value) visibleRight.value = true;
  tilteType.value = type;
  drill.value = filtered.value.filter(p => p.type === type)
}
</script>

<style scoped>
</style>
