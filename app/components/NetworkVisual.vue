<template>
  <div class="network-container">
    <!-- Toolbar -->
    <Toolbar style="border-radius: 0; padding: 1rem; background:var(--color-surface); border: 1px solid var(--color-b1);">
        <template #start>
          <div class="flex items-center gap-3">
            <!-- <Button outlined severity="secondary" size="small" :pt="{
              root: {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all .15s',
                  boxShadow: ' 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .04)'
                }
              }
            }">
              ⊕ Force
            </Button>
            <Button outlined severity="secondary" size="small" :pt="{
              root: {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all .15s',
                  boxShadow: ' 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .04)'
                }
              }
            }">
              ◎ Radial
            </Button>
            <div style="width:1px;height:16px;background:var(--color-b1)"></div> -->
            <!-- <Button outlined severity="secondary" size="small" class="h-full" :pt="{
              root: {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all .15s',
                  boxShadow: ' 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .04)'
                }
              }
            }">
              <Icon name="material-symbols:add-rounded" style="font-size: 12px;"/>
            </Button>
            <Button outlined severity="secondary" size="small" class="h-full" :pt="{
              root: {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all .15s',
                  boxShadow: ' 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .04)'
                }
              }
            }">
              <Icon name="material-symbols:check-indeterminate-small-rounded"  style="font-size: 12px;"/>
            </Button>
            <Button outlined severity="secondary" size="small" class="h-full" :pt="{
              root: {
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all .15s',
                  boxShadow: ' 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .04)'
                }
              }
            }">
              <Icon name="material-symbols:replay-rounded"  style="font-size: 12px;"/>
            </Button> 
            <div style="width:1px;height:16px;background:var(--color-b1)"></div> -->
            <Select 
              v-model="selectedTheme"
              :options="options.theme"
              option-label="label"
              option-value="value"
              placeholder="เลือก Theme"
              class="w-40" size="small" />
            <Select 
              v-model="selectedType"
              :options="options.type"
              option-label="label"
              option-value="value"
              placeholder="เลือก Type"
              class="w-40" size="small" />
          </div>
      </template>
        <template #end>
          <div style="margin-left:auto;font-size:10px;color:var(--t3)">คลิก = Drill-down · ลาก = เลื่อน · Scroll = Zoom</div>
        </template>
    </Toolbar>
    <!-- Canvas -->
    <div ref="chartRef" class="chart"></div>
    <div class="map-legend">
      <div class="leg-title">NODE TYPES</div>

      <div class="leg-item">
        <span class="box group"></span>
        Research Group
      </div>

      <div class="leg-item">
        <span class="box res"></span>
        Researcher
      </div>

      <div class="leg-item">
        <span class="box mou"></span>
        MOU
      </div>

      <div class="divider"></div>

      <div class="leg-item">
        <span class="line member"></span>
        Membership
      </div>

      <div class="leg-item">
        <span class="line partner"></span>
        Partnership
      </div>

      <div class="leg-item">
        <span class="line expert"></span>
        Expertise Match
      </div>
    </div>
    <Drawer v-model:visible="visibleRight" position="right" style="width: 370px; background:var(--color-surface); border: 1px solid var(--color-b1);">
      <template #header>
        <div v-if="selectedItem" class="flex flex-col" style="color: var(--color-t0)">
          <div v-if="selectedItem.category === 0">
            <div class="text-base font-bold">{{ selectedItem.name }}</div>
            <div class="text-xs">{{ selectedItem.inst ?? '' }} · {{ selectedItem.theme ?? '' }}</div>
          </div>
          <div v-else-if="selectedItem.category === 1">
            <div class="text-base font-bold">{{ selectedItem.name }}</div>
            <div class="text-xs">{{ selectedItem.group?.name ?? '' }} · {{ selectedItem.group?.inst ?? '' }}</div>
          </div>
          <div v-else-if="selectedItem.category === 2">
            <div class="text-base font-bold">{{ selectedItem.flag ?? '' }} {{ selectedItem.inst ?? '' }}</div>
            <div class="text-xs">{{ selectedItem.country ?? '' }} · {{ selectedItem.theme ?? '' }}</div>
          </div>
        </div>
      </template>
      <Transition name="fade" mode="out-in">
        <div v-if="selectedItem?.category === 0" :key="0" class="space-y-4">
          <div class="flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Group Metrics
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)" >Lead</div>
                <div class="font-bold">
                  {{ selectedItem.inst }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Theme</div>
                <div>
                  <span class="tag text-xs" :style="{ color: TC(selectedItem.theme), background: `${TC(selectedItem.theme)}12`}">
                    {{ TI(selectedItem.theme) }}
                    {{ selectedItem.theme }}
                  </span>
                </div>            
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">H-index</div>
                <div class="font-bold text-emerald-400">
                  {{ selectedItem?.hindex ?? '' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Publications</div>
                <div class="font-bold">
                  {{ selectedItem.pubs ?? ''}}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Projects</div>
                <div class="font-bold">
                  {{ selectedItem.projects ?? ''}}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Budget</div>
                <div class="font-bold mono" style="color: var(--am)">
                  {{ selectedItem?.budget ?? '0' }}M ฿
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Experience Score</div>
                <div class="font-bold mono text-base" :style="{ color: TC(selectedItem.theme)}">
                  {{ selectedItem?.exp_score ?? '0' }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Expertise Tags
            </div>
            <div class="flex flex-wrap gap-1">
              <span  v-for="(t, i) in selectedItem.expertise" :key="`${selectedItem.id}-tag${i}`" class="tag" 
                :style="{ color: TC(selectedItem.theme), background: `${TC(selectedItem.theme)}12` }" >
                {{ t }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Members {{ selectedItem?.members?.length > 0 ? `(${selectedItem.members.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.members" :key="item.id" 
                class="cursor-pointer"
                style="background:var(--color-bg2); border:1px solid var(--color-b1); border-radius:var(--r8); padding:11px; margin-bottom:6px; font-size:11px; transition: all .15s;"
                @click="viewData(item.id, 1)">
                <div class="flex justify-between items-center gap-2">
                  <div>
                    <div class="text-xs" style="color:var(--color-t0);font-weight:600">{{ item?.name ?? '' }}</div>
                    <div class="text-[10px]" style="color:var(--color-t3)">
                      {{ item?.inst ?? ''  }}{{ item?.hindex ? ` · H:${item.hindex}` : '' }}{{ item?.exp_score ? ` · Exp:${item.exp_score}` : '' }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span  v-for="(t,i) in item.expertise" :key="`${item.id}-tag${i}`" class="tag" 
                    :style="{ color: TC(selectedItem.theme), background: `${TC(selectedItem.theme)}12` }" >
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              MOU Links {{ selectedItem?.mous?.length > 0 ? `(${selectedItem.mous.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.mous" :key="item.id"  
                class="cursor-pointer"
                style="background:var(--color-bg2); border:1px solid var(--color-b1); border-radius:var(--r8); padding:11px; margin-bottom:6px; font-size:11px; transition: all .15s;"
                @click="viewData(item.id, 2)">
                <div class="flex items-center justify-between">
                  <div class="flex gap-2">
                    <span class="flex items-center justify-center w-8.5 h-8.5 rounded-[9px] font-bold shrink-0"
                      :style="{ fontSize: '12px', color: TC(item.theme), background: `${TC(item.theme)}18` }" >
                      {{ item?.flag ?? '' }}
                    </span>
                    <div>
                      <div class="text-xs" style="color:var(--color-t0);font-weight:600">{{ item?.inst ?? '' }}</div>
                      <div class="text-[10px]" style="color:var(--color-t3)">
                        {{ item?.country ?? '' }} · Budget:{{ item?.budget ?? '0'  }}M
                      </div>
                    </div>
                  </div>
                  <span v-if="item?.status" class="tag text-xs"
                    :class="{
                      'badge-a':  item.status === 'active',
                      'badge-p':  item.status === 'planning',
                      'badge-d':  item.status === 'done',
                      'badge-h':  item.status === 'paused',
                    }">
                    {{ item.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="selectedItem?.category === 1" :key="1" class="space-y-4">
          <div class="flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Profile
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)" >สถาบัน</div>
                <div class="font-bold">
                  {{ selectedItem?.inst }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">กลุ่มวิจัย</div>
                <div class="font-bold">
                  {{ selectedItem?.group?.short ?? '-' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">H-Index</div>
                <div class="font-bold mono text-emerald-400">
                  {{ selectedItem?.hindex ?? '-' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Publications</div>
                <div class="font-bold mono">
                  {{ selectedItem?.pubs ?? '-' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Projects</div>
                <div class="font-bold mono">
                  {{ selectedItem?.projects ?? '-' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Experience Score</div>
                <div class="font-bold mono text-emerald-400 text-[14px]">
                  {{ selectedItem?.exp_score ?? '-' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Collaborators</div>
                <div class="font-bold mono">
                  {{ selectedItem?.collabs ?? '0' }} คน
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Theme Alignment Scores
            </div>
            <div class="flex flex-col gap-3">
              <div v-for="(value, key, index) in selectedItem?.score_by_theme" :key="key">
                <div class="flex justify-between text-[11px] mb-0.75">
                  <span style="color:var(--color-t2)">{{ TN(key.toString()) }}</span>
                  <span class="mono font-semibold" :style="{ color: TC(key.toString())}">{{value ?? 0}}%</span>
                </div>
                <div class="strack">
                  <div class="sfill" :style="{ background: TC(key.toString()), width: `${value}%` }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Expertise
            </div>
            <div class="flex flex-wrap gap-1">
              <span  v-for="item in selectedItem.expertise" :key="item.id" class="tag" style="background:var(--c-d);color:var(--c)">
                {{ item }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Featured Works {{ selectedItem?.works?.length > 0 ? `(${selectedItem.works.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.works" :key="item.id"  style="background:var(--color-bg2); border-radius:var(--r6); padding:8px; margin-bottom:5px; font-size:11px">
                <div style="color:var(--color-t0);font-weight:700">{{ item?.title ?? '' }}</div>
                <div class="mt-0.5" style="color:var(--am);font-weight:600">{{ item?.award ?? '' }}</div>
                <div style="color:var(--color-t3)">
                  {{ item?.year ?? '' }} · IF {{item?.impact ?? 0 }} · {{ item?.citations ??  0}} cit. 
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              MOU Experience {{ selectedItem?.hist?.length > 0 ? `(${selectedItem.hist.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.hist" :key="item.id"
                style="background:var(--color-bg2); border-radius:var(--r6); padding:8px; margin-bottom:5px; font-size:11px">
                <div style="color:var(--color-t0);font-weight:600">{{ item?.mou?.flag ?? '' }} {{ item?.mou?.inst ?? '' }}</div>
                <div style="color:var(--color-t3)">
                  {{ item?.role ? `${item?.role} · `  :'' }}{{ item?.year ? `${item?.year}` : '' }}{{ item?.output ? ` · ${item.output}` : ''  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="selectedItem?.category === 2" :key="2" class="space-y-4">
          <div class="flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              MOU Details
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)" >สถาบัน</div>
                <div class="font-bold">
                  {{ selectedItem.inst }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">ประเทศ</div>
                <div class="font-bold">
                  {{ selectedItem?.country ?? '' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Theme</div>
                <div>
                  <span class="tag text-xs" :style="{ color: TC(selectedItem.theme), background: `${TC(selectedItem.theme)}12`}">
                    {{ TI(selectedItem.theme) }}
                    {{ selectedItem.theme }}
                  </span>
                </div>            
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">ประเภท</div>
                <div class="font-bold">
                  {{ selectedItem.type }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">สถานะ</div>
                <div>
                  <span class="tag text-xs"
                    :class="{
                      'badge-a':  selectedItem.status === 'active',
                      'badge-p':  selectedItem.status === 'planning',
                      'badge-d':  selectedItem.status === 'done',
                      'badge-h':  selectedItem.status === 'paused',
                    }">
                    {{ selectedItem.status }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">งบประมาณ</div>
                <div class="font-bold mono" style="color: var(--am)">
                  {{ selectedItem?.budget ?? '0' }}M ฿
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">ปี</div>
                <div class="font-bold">
                  {{ selectedItem?.year ?? '' }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">Experience Score</div>
                <div class="font-bold" style="color: var(--c)">
                  {{ selectedItem?.exp_score ?? 0 }}
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div style="color: var(--color-t3)">โครงการที่เชื่อม</div>
                <div class="font-bold">
                  {{ selectedItem?.projects_count ?? 0 }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Description
            </div>
            <p style="font-size:12px;color:var(--color-t2);line-height:1.7">
              {{ selectedItem?.desc ?? '' }}
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              Research Groups ที่เชื่อมโยง {{ selectedItem?.matched_groups?.length > 0 ? `(${selectedItem.matched_groups.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.matched_groups" :key="item.id"  
                style="background:var(--color-bg2); border:1px solid var(--color-b1); border-radius:var(--r8); padding:11px; margin-bottom:6px; font-size:11px; transition: all .15s;">
                <div class="flex gap-2">
                  <span class="flex items-center justify-center w-8.5 h-8.5 rounded-[9px] font-bold shrink-0"
                    :style="{ fontSize: '12px', color: TC(item.theme), background: `${TC(item.theme)}18` }" >
                    {{ item?.short?.slice(0,3) || '' }}
                  </span>
                  <div>
                    <div class="text-xs" style="color:var(--color-t0);font-weight:600">{{ item?.name ?? '' }}</div>
                    <div class="text-[10px]" style="color:var(--color-t3)">
                      Exp: {{ item?.exp_score ?? '0' }} · H: {{ item?.hindex ?? '0'  }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
              นักวิจัยที่เหมาะสม (Top Match) {{ selectedItem?.ranks?.length > 0 ? `(${selectedItem.ranks.length})` : '' }}
            </div>
            <div class="flex flex-col">
              <div v-for="item in selectedItem.ranks" :key="item.id" 
                class="cursor-pointer"
                style="background:var(--color-bg2); border:1px solid var(--color-b1); border-radius:var(--r8); padding:11px; margin-bottom:6px; font-size:11px; transition: all .15s;"
                @click="viewData(item.id, 1)">
                <div class="flex justify-between items-center gap-2">
                  <div>
                    <div class="text-xs" style="color:var(--color-t0);font-weight:600">{{ item?.name ?? '' }}</div>
                    <div class="text-[10px]" style="color:var(--color-t3)">
                      {{ item?.inst ?? ''  }}
                    </div>
                  </div>
                  <div 
                  class="font-bold text-sm"
                  :style="{ color: TC(selectedItem.theme) }">
                    {{ item?.score ?? 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { clone } from 'lodash-es'
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const { isLight } = useTheme()

const layout = ref<'force' | 'circular'>('force')
const selectedTheme = ref<string | null>(null)
const selectedType = ref<string | null>(null)
const selectedItem = ref<any>(null)
const visibleRight = ref(false);
const currentNodes = ref<any[]>([])

const filterTheme = ref('')
const themeKeys = Object.keys(THEMES)

const options = computed(() => {
  return {
    type: [
      { label: 'ทุกประเภท', value: null },
      { label: 'Groups', value: 'group' },
      { label: 'Researchers', value: 'res' },
      { label: 'MOU', value: 'mou' }
    ],
    theme: [
      { label: 'ทุก Theme', value: null },
      ...themeKeys.map(t => ({ label: t, value: t }))
    ]
  }
});


/* ---------------- BUILD GRAPH ---------------- */
function buildGraph() {
  const nodes:any[] = []
  const links:any[] = []

  // 🔹 FILTER LOGIC
  const groups = clone(GROUPS).filter(g =>
    !selectedTheme.value || g.theme === selectedTheme.value
  )

  const researchers = clone(RESEARCHERS).filter(r =>
    !selectedTheme.value || r.themes.includes(selectedTheme.value)
  )

  const mous = clone(MOUS).filter(m =>
    !selectedTheme.value || m.theme === selectedTheme.value
  )

  // 🔹 TYPE FILTER
  const allow = (type: string) =>
    !selectedType.value || selectedType.value === type
    
    // GROUPS
  if (allow('group')) {
    groups.forEach(g => {
      // if (filterTheme.value && g.theme !== filterTheme.value) return
      nodes.push({
        id: g.id,
        name: g.short,
        category: 0,
        symbol: 'roundRect',
        symbolSize: 26 + g.hindex / 3,
        itemStyle: {
          color: THEMES[g.theme].color,
          borderColor: '#fff',
          borderWidth: 1.5,
          shadowBlur: 12,
          shadowColor: THEMES[g.theme].color
        },
        label: { fontWeight: 700 },
        raw: g
      })
    })
  }

  // RESEARCHERS
  if (allow('res')) {
    researchers.forEach(r => {
      // if (filterTheme.value && !r.themes.includes(filterTheme.value)) return
      nodes.push({
        id: r.id,
        name: r.name.split(' ')[0],
        category: 1,
        symbol: 'circle',
        symbolSize: 10 + r.hindex / 4,
        itemStyle: {
          color: THEMES[r.themes[0] as any].color,
          opacity: 0.85
        },
        label: { show: false },
        emphasis: {
          label: { show: true }
        },
        raw: r
      })
      
      if (groups.find(g => g.id === r.group)) {
        links.push({
          source: r.group,
          target: r.id,
          lineStyle: { 
            color: '#00d4ff',
            width: 1,
            opacity: 0.4,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10,
              opacity: 1
            }
          }
        })
      }
      // member edge
    })

  }

  // MOUS
  if (allow('mou')) {
    mous.forEach(m => {
      // if (filterTheme.value && m.theme !== filterTheme.value) return
  
      nodes.push({
        id: m.id,
        name: m.flag,
        category: 2,
        symbol: 'diamond',
        symbolSize: 16,
        itemStyle: {
          color: THEMES[m.theme].color,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: { show: false },
        emphasis: {
          label: { show: true }
        },
        raw: m
      })
  
      // group ↔ mou
      m.matched_groups.forEach(gid => {
        if (groups.find(g => g.id === gid)) {
          links.push({
            source: gid,
            target: m.id,
            lineStyle: { color: '#00e5a0', width: 1.5, opacity: 0.5 },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 4,
                opacity: 1
              }
            }
          })
        }
      })
    })
  }

  // EXPERTISE EDGE
  researchers.forEach(r => {
    groups.forEach(m => {
      const score = (r.score_by_theme as any)[m.theme] || 0
      if (score >= 80) {
        links.push({
          source: r.id,
          target: m.id,
          lineStyle: {
            type: 'dashed',
            color: '#f5a623',
            width: 1,
            opacity: 0.5
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3,
              opacity: 1,
              type: 'dashed'
            }
          }
        })
      }
    })
  })

  return { nodes, links }
}

/* ---------------- OPTION ---------------- */
function buildOption() {
  const { nodes, links } = buildGraph();
  currentNodes.value = nodes 

  const bodyStyle = getComputedStyle(document.body);
  // const themeBgColor = bodyStyle.getPropertyValue('--color-bg1').trim();
  const colorbg3 = bodyStyle.getPropertyValue('--color-bg3').trim();
  const colorSurface = bodyStyle.getPropertyValue('--color-surface').trim();
  const colort0 = bodyStyle.getPropertyValue('--color-t0').trim();
  const colort3 = bodyStyle.getPropertyValue('--color-t3').trim();
  const colortC = bodyStyle.getPropertyValue('--c').trim();
  const fontmono = bodyStyle.getPropertyValue('--font-mono').trim();
  return {
    backgroundColor: isLight.value ? '#ffffff' : '#020617',
    textStyle: {
      fontFamily: 'Noto Sans Thai, Plus Jakarta Sans, sans-serif'
    },
    tooltip: {
      trigger: 'item',
      // borderWidth: 0,
      // extraCssText: 'box-shadow:none;padding:0;',
      formatter: (params: any) => {
        const d = params.data.raw
        if (!d) return ''

        const color = THEMES[d.theme]?.color || '#999'

        if (params.data.category === 0) {
          return `
            <div class="tt-card" style="background:${colorSurface}; max-width:220px; opacity: 0.96;">
              <div class="tt-n" style="color:${colort0}; font-weight:800; font-size:13px; margin-bottom:2px">${d.name}</div>
              <div class="tt-s" style="color:${colort3}; font-size:10px; margin-bottom:7px">${d.inst} · ${d.theme}</div>
              <div class="tt-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">H-index</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.hindex ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Pubs</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.pubs ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Exp Score</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.exp_score ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Members</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.members?.lenght ?? 0}</div>
                </div>
              </div>
            </div>`
        }

        if (params.data.category === 1) {
          return `
            <div class="tt-card" style="background:${colorSurface}; max-width:220px; opacity: 0.96;">
              <div class="tt-n" style="color:${colort0}; font-weight:800; font-size:13px; margin-bottom:2px">${d.name}</div>
              <div class="tt-s" style="color:${colort3}; font-size:10px; margin-bottom:7px">${d.inst}</div>
              <div class="tt-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">H-index</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.hindex ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Pubs</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.pubs ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Exp Score</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.exp_score ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Collabs</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.collab_ids?.lenght ?? 0}</div>
                </div>
              </div>
            </div>`
        }

        return `
          <div class="tt-card" style="background:${colorSurface}; max-width:220px; opacity: 0.96;">
            <div class="tt-n" style="color:${colort0}; font-weight:800; font-size:13px; margin-bottom:2px">${d.flag} ${d.inst}</div>
            <div class="tt-s" style="color:${colort3}; font-size:10px; margin-bottom:7px">${d.country}</div>
            <div class="tt-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Budget</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.budget ?? 0}</div>
                </div>
                <div style="background:${colorbg3};padding:5px 7px; border-radius:5px;">
                  <div style="font-size: 9px; color:${colort3};">Exp Score</div>
                  <div style="color:${colortC}; font-weight:700; font-size:12px; font-family:${fontmono};">${d.exp_score ?? 0}</div>
                </div>
            </div>
          </div>`
      }
    },

    // legend: [{
    //   data: ['Group', 'Researcher', 'MOU'],
    //   textStyle: { color: '#fff' }
    // }],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut' as const,
    series: [{
      type: 'graph',
      layout: layout.value,
      roam: true,
      draggable: true,

      data: nodes,
      links: links,

      categories: [
        { name: 'Group' },
        { name: 'Researcher' },
        { name: 'MOU' }
      ],

      label: {
        show: true,
        color: '#fff',
        fontSize: 10
      },

      force: {
        repulsion: 250,
        edgeLength: 120
      },

      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10
        }
      }
    }]
  }
}
const viewData = (id:any, category:number) => {
  const data = currentNodes.value.find(n => n.id === id) || null;
  if(!data) return;
  openDrawr({
    raw: data?.raw || null,
    category,
  },  false)
} 

const openDrawr = (val:any, controled = true) => {
  const { raw, category } = val;
  if(!val || !raw || category === undefined) return;
  if(controled) visibleRight.value = true
  switch (category) {
    case 0:
      const lead = raw?.lead ? RESEARCHERS.find(r => r.id === raw.lead) : null;
      const members = raw?.members?.map((m:any) => RESEARCHERS.find(r => r.id === m)) ?? [];
      const mous = raw?.mou_ids?.map((m:any) => MOUS.find(r => r.id === m)) ?? [];
      selectedItem.value = {
        ...raw,
        category,
        lead,
        members,
        mous
      }
      break;
    case 1:
      if(raw?.id) {
        const works= raw.works.map((w:any) => {
          return WORKS.find(r => r.id === w);
        })
        const group = raw?.group ? GROUPS.find(g => g.id === raw.group) : null
        const hist= HISTORY.filter(h=> h.researcher_id=== raw.id)?.map((h)=> {
          const mou = MOUS.find(m => m.id === h.mou_id)
            return {
              ...h,
              mou
            }
        });
        selectedItem.value = {
          ...raw,
          category,
          group,
          hist,
          works
        }
      }
      break;
    case 2:
      const matched_groups = raw.matched_groups.map((mg:any) => GROUPS.find(g => g.id === mg)) ?? [];
      const rs = rankForTheme(raw.theme, [], 4) ?? []
      selectedItem.value = {
        ...raw,
        category,
        matched_groups,
        ranks: rs
      }
      break;
    default:
      break;
  }
}


/* ---------------- INIT ---------------- */
function init() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)

  chart.setOption(buildOption())

  chart.on('click', (p:any) => {
    // console.log('CLICK:', p)
    if(p.dataType === 'node' && p.data) openDrawr(p.data)
  });
}

function update() {
  chart?.setOption(buildOption())
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(async () => {
  await nextTick()
  init()
  window.addEventListener('resize', () => chart?.resize())
})

onBeforeUnmount(() => {
  chart?.dispose()
  chart = null
})

watch([layout, selectedTheme, selectedType], update)

// 🌗 theme switch
watch(() => isLight.value, async () => {
  await nextTick()
  if (chart) update()
})
</script>

<style scoped>
/* แอนิเมชันจางเข้าออก */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.network-container {
  width: 100%;
  height: 100%;
  background: var(--color-card);
}

.chart {
  width: 100%;
  height: 100%;
  background: var(--color-card);
}

.map-legend {
  position: absolute;
  left: 250px;
  bottom: 3%;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 12px;
  color: #334155;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.leg-title {
  font-weight: 700;
  font-size: 11px;
  color: #6366f1;
  margin-bottom: 8px;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

/* node */
.box {
  width: 12px;
  height: 12px;
}

.group {
  background: #38bdf8;
  border-radius: 3px;
}

.res {
  background: #22c55e;
  border-radius: 50%;
}

.mou {
  background: #f59e0b;
  transform: rotate(45deg);
}

/* line */
.line {
  width: 18px;
  height: 2px;
  background: #999;
}

.member {
  background: #38bdf8;
}

.partner {
  background: #22c55e;
}

.expert {
  border-bottom: 2px dashed #f59e0b;
  height: 0;
}

/* divider */
.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* ===== TOOLTIP ===== */
.tt-card {
  background: var(--color-card);
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.tt-title { font-weight:700; }
.tt-sub { font-size:11px; color:#94a3b8; margin-bottom:6px; }

.tt-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:6px;
}

.tt-grid div {
  display:flex;
  justify-content:space-between;
}

.tt-grid .em {
  color:#22c55e;
}
</style>