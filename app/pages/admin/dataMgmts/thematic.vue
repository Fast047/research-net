<template>
  <div>
    <div class="ph">
        <div>
            <div class="ph-title">Thematic Mapping</div>
            <div class="ph-sub">เชื่อมโยง Theme → Research Groups → Researchers — คลิก Theme เพื่อดูการเชื่อมโยง</div>
        </div>
        <button
        class="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        @click="clearTheme"
      >
        ✕ Clear
      </button>
    </div>
     <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      <div
        v-for="(t, k) in THEMES"
        :key="k"
        @click="selectTheme(k.toString())"
        class="bg-white border-2 rounded-lg p-3 text-center cursor-pointer transition-all"
        :class="selTheme === k ? 'translate-y-[-4px]' : ''"
        :style="{
          borderColor: selTheme === k ? t.color : '#e5e7eb'
        }"
      >
        <div class="text-xl mb-1">{{ t.icon }}</div>
        <div class="text-xs font-bold truncate">
          {{ t.name.split(' ').slice(0, 2).join(' ') }}
        </div>
        <div class="font-mono font-extrabold" :style="{ color: t.color }">
          {{ t.mou_count }}
        </div>
      </div>
    </div>
    <Transition mode="out-in" enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2">
      <div :key="selTheme ?? 'none'">
        <!-- Empty -->
        <div v-if="!selTheme" class="text-center py-10 text-gray-400">
          ← เลือก Theme
        </div>

        <!-- Result -->
        <div v-else class="grid md:grid-cols-3 gap-4">
          <!-- MOU -->
          <div class="bg-white rounded-xl p-4 shadow">
            <h2 class="font-bold mb-3" :style="{ color: TC(selTheme!) }">
              {{ selectedThemeData?.t.icon }} MOU ({{ selectedThemeData?.ms.length }})
            </h2>

            <div v-for="m in selectedThemeData?.ms" :key="m.id"
              class="bg-gray-50 p-3 rounded mb-2 border-l-2 cursor-pointer" :style="{ borderColor: TC(m.theme) }">
              <div class="flex items-center gap-2 text-xs font-bold">
                <span>{{ m.flag }}</span>
                <span class="truncate">{{ m.inst }}</span>
                <span class="ml-auto font-mono text-[10px]">
                  {{ m.budget }}M
                </span>
              </div>
              <div class="text-[10px] text-gray-500">
                {{ m.desc.slice(0, 45) }}...
              </div>
            </div>
          </div>
          <!-- Groups -->
          <div class="bg-white rounded-xl p-4 shadow">
            <h2 class="font-bold mb-3">🏛 Groups ({{ selectedThemeData?.gs.length }})</h2>

            <div v-for="(g, i) in selectedThemeData?.gs.slice(0, 5)" :key="g.id"
              class="bg-gray-50 p-3 rounded mb-2 cursor-pointer hover:border-l-2"
              :style="{ borderColor: TC(selTheme!) }">
              <div class="flex items-center gap-2 text-xs font-bold">
                <div class="w-5 h-5 flex items-center justify-center rounded text-[10px]" :style="{
                  background: TC(g.theme) + '22',
                  color: TC(g.theme)
                }">
                  {{ i + 1 }}
                </div>

                <div class="flex-1 truncate">{{ g.short }}</div>

                <div class="font-mono font-extrabold" :style="{ color: TC(selTheme!) }">
                  {{ g.exp_score }}
                </div>
              </div>

              <div class="h-1 bg-gray-200 mt-2 rounded">
                <div class="h-1 rounded sfill transition-all duration-500" :data-w="g.exp_score + '%'" :style="{
                  width: g.exp_score + '%',
                  background: TC(selTheme!)
                }" />
              </div>
            </div>
          </div>
          <!-- Researchers -->
          <div class="bg-white rounded-xl p-4 shadow">
            <h2 class="font-bold mb-3">👩‍🔬 Researchers</h2>
            <div v-for="(r, i) in selectedThemeData?.rs" :key="r.id" class="p-3 rounded mb-2 bg-gray-50 cursor-pointer"
            :style="{ animation: `fadeUp 0.3s ease ${i * 0.05}s both`}">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 flex items-center justify-center rounded font-bold text-xs" :style="{
                  background: TC(selTheme!) + '22',
                  color: TC(selTheme!)
                }">
                  {{ r.name.slice(0, 2) }}
                </div>

                <div class="flex-1">
                  <div class="text-xs font-bold truncate">
                    {{ r.name }}
                  </div>
                  <div class="text-[10px] text-gray-500">
                    H:{{ r.hindex }} · Exp:{{ r.exp_score }}
                  </div>
                </div>

                <div class="font-mono font-extrabold" :style="{ color: TC(selTheme!) }">
                  {{ r.score }}%
                </div>
              </div>

              <div class="h-1 bg-gray-200 mt-2 rounded">
                <div class="h-1 rounded sfill transition-all duration-500" :data-w="r.score + '%'" :style="{
                  width: r.score + '%',
                  background: TC(selTheme!)
                }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { THEMES, GROUPS, MOUS, rankForTheme } from '../../../utils/mockData';
import { TC } from '../../../utils';

const selTheme = ref<string | null>(null)

const selectTheme = async (k: string) => {
  selTheme.value = k
  await nextTick()

  // delay ให้ transition render ก่อน
  setTimeout(() => {
    animateBars()
  }, 200)
}

const clearTheme = () => {
  selTheme.value = null
}

const selectedThemeData = computed(() => {
  if (!selTheme.value) return null

  const t = (THEMES as any)[selTheme.value]

  const gs = GROUPS
    .filter((g: any) =>
      g.mou_themes?.includes(selTheme.value) || g.theme === selTheme.value
    )
    .sort((a: any, b: any) => b.exp_score - a.exp_score)

  const rs = rankForTheme(selTheme.value, [], 8)
  const ms = MOUS.filter((m: any) => m.theme === selTheme.value)

  return { t, gs, rs, ms }
})

const animateBars = () => {
  const bars = document.querySelectorAll('.sfill')
  bars.forEach((el: any) => {
    const w = el.dataset.w
    el.style.width = '0%'
    setTimeout(() => (el.style.width = w), 120)
  })
}
</script>

<style>

</style>