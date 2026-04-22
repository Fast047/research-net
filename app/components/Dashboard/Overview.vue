<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900">
          ภาพรวมเครือข่ายวิจัย
        </h1>
        <p class="text-xs text-gray-500">
          Real-time Network Intelligence — อัปเดต 18 เม.ย. 68
        </p>
      </div>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          @click="router.push('/admin/feasibility')"
        >
          ⚡ MOU Feasibility
        </button>

        <button
          class="px-3 py-1 text-xs font-semibold bg-gray-200 rounded-lg"
          @click="router.push('/admin/network')"
        >
          🕸 Network Map
        </button>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard icon="🏛" label="Research Groups" :value="groups.length" trend="▲ 2 ใหม่ ปี 67" class-name="ck" />
      <KpiCard icon="👩‍🔬" label="Researchers" :value="researchers.length" trend="▲ 14% YoY" class-name="cg" />
      <KpiCard icon="🌐" label="MOU Active" :value="activeMou" :trend="mous.length + ' ทั้งหมด'" class-name="ca" />
      <KpiCard icon="💰" label="งบประมาณ" :value="budgetFormatted" trend="฿ รวม" class-name="cv" />
    </div>

    <!-- Charts -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- THEMES -->
      <div class="card-custom card-p">
        <h2 class="font-semibold text-sm mb-3">MOU Themes Distribution</h2>

        <div
          v-for="(t, key) in themes"
          :key="key"
          class="flex items-center gap-2 py-2 cursor-pointer"
          style="border-bottom: 1px solid var(--color-b1);"
          @click="router.push('/admin/thematic')"
        >
          <span>{{ t.icon }}</span>

          <span class="text-xs text-gray-600 flex-1">
            {{ t.name }}
          </span>

          <div class="strack">
            <div class="sfill" :style="{ background: t.color, width: `${Math.round(t.mou_count/22*100)}%` }"></div>
          </div>

          <span
            class="text-xs font-bold w-5 text-right"
            :style="{ color: t.color }"
          >
            {{ t.mou_count }}
          </span>
        </div>
      </div>

      <!-- TOP GROUPS -->
      <div class="card-custom card-p">
        <h2 class="font-semibold text-sm mb-3">Top Research Groups</h2>

        <div
          v-for="(g, i) in topGroups"
          :key="g.id"
          class="flex items-center gap-2 py-2 cursor-pointer"
          style="border-bottom: 1px solid var(--color-b1);"
          @click="openGroupDrilldown(g.id)"
        >
          <div
            class="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded"
            :style="{
              background: TC(g.theme) + '20',
              color: TC(g.theme)
            }"
          >
            {{ i + 1 }}
          </div>

          <div class="flex-1 overflow-hidden">
            <div class="text-xs font-semibold truncate">
              {{ g.short }}
            </div>
            <div class="text-[10px] text-gray-400">
              {{ g.inst }}
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs font-mono" style="color: var(--c)">
              Exp: {{ g.exp_score }}
            </div>
            <div class="text-[10px]" style="color: var(--color-t3)">
              H: {{ g.hindex }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI SECTION -->
     
    <div
      class="flex items-center gap-4 p-4"
      style="background:linear-gradient(135deg,var(--c-d),rgba(0,212,255,.05)); border:1px solid rgba(0,212,255,.2); border-radius:var(--r12);"
    >
      <div class="text-3xl">⚡</div>

      <div class="flex-1">
        <div class="text-sm font-bold mb-1" style="color: var(--c);">
          MOU Feasibility AI Engine
        </div>
        <p class="text-xs leading-relaxed" style="color: var(--color-t3)"> 
          กรอก Theme และ Keywords → ระบบวิเคราะห์และแนะนำนักวิจัยที่ดีที่สุดสำหรับ MOU ใหม่
        </p>
      </div>

      <button
        class="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-lg"
        @click="router.push('/admin/feasibility')"
      >
        เริ่มวิเคราะห์ →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
// --- computed ---
const groups = computed(() => GROUPS ?? [])
const researchers = computed(() => RESEARCHERS ?? [])
const mous = computed(() => MOUS ?? [])
const themes = computed(() => THEMES ?? {})

const totalBudget = computed(() =>
  PROJECTS?.reduce((s: number, p: any) => s + p.budget, 0) || 0
)

const budgetFormatted = computed(() =>
  (totalBudget.value / 1000).toFixed(1) + 'B'
)

const activeMou = computed(() =>
  mous.value.filter((m: any) => m.status === 'active').length
)

const topGroups = computed(() =>
  [...groups.value]
    .sort((a: any, b: any) => b.exp_score - a.exp_score)
    .slice(0, 6)
)

// --- methods ---
const percent = (val: number) => Math.round((val / 22) * 100)

const themeColor = (theme: string) => {
  return themes.value[theme]?.color || '#999'
}

const switchView = (view: string) => {
  console.log('switchView:', view)
}

const openGroupDrilldown = (id: string) => {
  console.log('openGroup:', id)
}
</script>