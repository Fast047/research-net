<template>
  <div class="scroll-pane space-y-6" :class="{ 'is-light': isLight }">
    <div class="ph">
      <div>
            <div class="ph-title" :class="isLight ? 'text-slate-900' : 'text-white'">MOU Feasibility Analysis Engine</div>
            <div class="ph-sub">กรอกธีมและ Keywords → ระบบวิเคราะห์และแนะนำนักวิจัยที่ดีที่สุดสำหรับ MOU ใหม่</div>
        </div>
      </div>
      <div :class="['wizard', isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800']">
      <div class="wiz-steps">
        <div :class="['wstep', currentStep >= 1 ? 'on' : '']"><div class="wnum">1</div>ข้อมูล MOU</div><div class="wline"></div>
        <div :class="['wstep', currentStep >= 2 ? 'on' : '']"><div class="wnum">2</div>Theme & Keywords</div><div class="wline"></div>
        <div :class="['wstep', currentStep >= 3 ? 'on' : '']"><div class="wnum">3</div>Weight Tuning</div><div class="wline"></div>
        <div class="wstep"><div class="wnum">4</div>Results</div>
      </div>

      <!-- Step 1: MOU Info -->
      <div v-if="currentStep === 1" class="space-y-4">
        <div class="chart-grid cg2" style="margin-bottom:14px">
          <div>
            <label class="fl block mb-1.5">ชื่อ MOU ที่วางแผน</label>
            <InputText id="fw-name" v-model="formData.name" placeholder="เช่น MOU ด้าน AI กับ University of Tokyo" size="small" class="fi" fluid />
          </div>
          <div>
            <label class="fl block mb-1.5">สถาบันคู่ MOU</label>
            <InputText id="fw-inst" v-model="formData.inst" placeholder="เช่น UTokyo, Stanford, Osaka" size="small" class="fi" fluid />
          </div>
          <div>
            <label class="fl block mb-1.5">ประเทศ</label>
            <InputText id="fw-country" v-model="formData.country" placeholder="ญี่ปุ่น, สหรัฐฯ..." size="small" class="fi" fluid />
          </div>
          <div>
            <label class="fl block mb-1.5">งบประมาณ (ล้าน ฿)</label>
            <InputText id="fw-budget" v-model="formData.budget" placeholder="150" size="small" class="fi" fluid />
          </div>
          <div style="grid-column:1/-1">
            <label class="fl block mb-1.5">วัตถุประสงค์</label>
            <Textarea id="fw-obj" v-model="formData.obj" rows="2" placeholder="อธิบายเป้าหมาย..." class="fi" fluid/>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button text size="small" @click="fillFeasDemo">💡 ข้อมูลตัวอย่าง</Button>
          <Button size="small" @click="currentStep = 2">Next: Theme & Keywords →</Button>
        </div>
      </div>

      <!-- Step 2: Theme & Keywords -->
      <div v-if="currentStep === 2" class="space-y-4">
        <label class="fl block mb-2">Theme หลักของ MOU</label>
        <div class="flex flex-wrap gap-1.5 mb-4" id="fw-themes" >
          <button v-for="(k,t) in THEMES" :id="`fwt-${t}`" :class="['tag-btn', formData.theme === k?.value ? 'sel' : '']" @click="selectFeasTheme(k?.value ?? '')" :key="t">
              {{ k?.icon ?? '' }} {{ k.name }}
          </button>
        </div>
        <label class="fl block mb-2">Keywords ที่เกี่ยวข้อง</label>
        <div class="flex flex-wrap gap-1.5 mb-4" id="fw-themes" >
          <button v-for="(k,t) in keywords" :id="`fw-kws-${t}`" :class="['tag-btn', formData.keywords.includes(k) ? 'sel' : '']" :key="k" @click="toggleFKW(k ?? '')">
              {{ k }}
          </button>
        </div>
        <div class="flex justify-between">
          <Button text size="small" @click="currentStep = 1">← Back</Button>
          <Button size="small" @click="currentStep = 3">Next: Weight Tuning →</Button>
        </div>
      </div>

      <!-- Step 3: Weight Tuning -->
      <div v-if="currentStep === 3" class="space-y-6">
        <label class="fl block mb-2 font-bold">ปรับแต่งค่าน้ำหนักการคำนวณ (Weight Tuning)</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(val, key) in weights" :key="key" class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>{{ key }} Importance</span>
              <span>{{ val }}%</span>
            </div>
            <Slider v-model="weights[key]" :min="0" :max="100" class="w-full" />
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <Button text size="small" @click="currentStep = 2">← Back</Button>
          <!-- <div class="flex gap-2">
            <Button text size="small" @click="fillFeasDemo">💡 ข้อมูลตัวอย่าง</Button>
          </div> -->
          <Button size="small" @click="runFeas">⚡ วิเคราะห์ Feasibility →</Button>
        </div>
      </div>
    </div>

    <!-- Step 4: Results -->
    <div v-if="results && currentStep === 4" class="space-y-6">
      <Transition name="slide-up" appear>
      <div 
        class="rounded-2xl p-6 flex items-center gap-6 border"
        :style="{ backgroundColor: `${getThemeColor(form.selectedTheme)}15`, borderColor: `${getThemeColor(form.selectedTheme)}40` }"
      >
        <div class="text-4xl">{{ results.themeData.icon }}</div>
        <div class="flex-1">
          <h2 class="text-sm font-black uppercase tracking-tight" :style="{ color: getThemeColor(form.selectedTheme) }">
            ผลการวิเคราะห์: {{ results.mouName }}
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Theme: {{ results.themeData.name }} · Keywords: {{ form.selectedKeywords.slice(0, 3).join(', ') }} · Budget: {{ form.budget || '—' }}M ฿
          </p>
        </div>
        <div class="text-right">
          <div class="text-[10px] text-slate-500 font-bold uppercase">Overall Feasibility</div>
          <div class="text-3xl font-black text-emerald-400 font-mono">HIGH ✓</div>
        </div>
      </div>
      </Transition>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- Detailed Visualization Components -->
          <div v-if="!compareMode">
            <FeasibilityReport 
              :mouInput="formData" 
              :reportData="results.researchers.map((r:any) => ({ 
                researcher: r, 
                score: r.score, 
                breakdown: r.breakdown || { themeAlignment: 85, expertiseOverlap: 90, historicalSuccess: 70, networkCentrality: 60, budgetFit: 80 } 
              }))" 
            />
          </div>

          <!-- Compare Mode Matrix -->
          <div v-else :class="[isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800 shadow-xl', 'p-8 border rounded-3xl overflow-x-auto relative transition-all']">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Icon name="ph:scales-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="text-lg font-black uppercase tracking-tight" :class="isLight ? 'text-slate-800' : 'text-white'">Talent Matrix Comparison</h3>
                <p class="text-[10px] font-bold uppercase tracking-wider" :class="isLight ? 'text-slate-500' : 'text-slate-400'">Side-by-side analysis of top candidates</p>
              </div>
            </div>

            <table class="w-full text-left border-separate border-spacing-x-4 min-w-[500px]">
              <thead>
                <tr>
                  <th class="py-4 text-[10px] font-black uppercase tracking-[0.2em] w-1/4" :class="isLight ? 'text-slate-400' : 'text-slate-500'">Metric</th>
                  <th v-for="r in results.researchers.slice(0, 3)" :key="r.id" class="text-center pb-6">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold transition-colors" :class="isLight ? 'bg-slate-100' : 'bg-slate-800'" :style="{ color: TC(form.selectedTheme) }">
                      {{ r.name.slice(0, 2) }}
                    </div>
                    <div class="text-xs font-black truncate max-w-[100px] mx-auto" :class="isLight ? 'text-slate-900' : 'text-white'">{{ r.name }}</div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isLight ? 'divide-slate-100' : 'divide-slate-800/50'">
                <tr v-for="dim in comparisonDimensions" :key="dim.key" class="group">
                  <td class="py-4 text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-500 transition-colors" :class="isLight ? 'text-slate-500' : 'text-slate-400'">{{ dim.label }}</td>
                  <td v-for="r in results.researchers.slice(0, 3)" :key="r.id" class="py-4 text-center">
                    <div v-if="dim.key === 'score'" class="text-lg font-black font-mono" :style="{ color: getScoreColor(r[dim.key]) }">
                      {{ r[dim.key] }}%
                    </div>
                    <div v-else class="text-sm font-mono font-bold" :class="isLight ? 'text-slate-700' : 'text-slate-300'">
                      {{ r[dim.key] ?? '0' }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="py-4 text-[10px] font-bold uppercase tracking-widest" :class="isLight ? 'text-slate-500' : 'text-slate-400'">Expertise</td>
                  <td v-for="r in results.researchers.slice(0, 3)" :key="r.id" class="py-4">
                    <div class="flex flex-wrap gap-1 justify-center">
                      <span v-for="ex in r.expertise.slice(0, 2)" :key="ex" class="px-2 py-0.5 rounded-md text-[9px] font-bold border transition-colors" :class="isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-800/40 border-slate-800 text-slate-400'">
                        {{ ex }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div :class="[isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800', 'flex items-center justify-between p-4 border rounded-xl']">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="ph:columns-bold" />
              </div>
              <div>
                <div class="text-sm font-bold">Compare Mode</div>
                <div class="text-[10px] text-slate-500">เปรียบเทียบนักวิจัยในมิติต่างๆ</div>
              </div>
            </div>
            <InputSwitch v-model="compareMode" />
          </div>
        </div>

        <div class="space-y-6">
      <section class="space-y-4">
        <h3 class="text-sm font-bold flex items-center gap-2" style="color: var(--color-t0);">👩‍🔬 นักวิจัยที่แนะนำ (Top {{ results.researchers.length }})</h3>
        <div v-for="(r, i) in results.researchers" :key="r.id" 
          :class="[isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800', 'relative border rounded-xl overflow-hidden group hover:border-slate-300 transition-all']"
        >
          <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: TC(form.selectedTheme) }"></div>
          <div class="p-4 pl-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="mc-rank"
                :class="Number(i) < 3 ? `r${Number(i)+1}` : 'rn'">
                {{ Number(i) + 1 }}
              </div>
              <div class="flex-1">
                <div class="mc-name" :class="isLight ? 'text-slate-900' : 'text-white'">{{ r.name }}</div>
                <div class="mc-inst">{{ r.inst }}</div>
              </div>
              <div class="text-xl font-black font-mono" :style="{ color: getScoreColor(r.score) }">
                {{ r.score }}%
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2 mb-4 mc-body rounded-lg ">
              <div v-for="stat in [{l:'H-Index', v:r.hindex, c:'#00e5a0'}, {l:'Pubs', v:r.pubs, c:'#3b82f6'}, {l:'Exp Score', v:r.exp_score, c:'#f5a623'}, {l:'MOU Exp', v:r.mouExp, c:'#a78bfa'}]" 
                class="mc-dim text-center">
                <div class="text-[8px] text-slate-500 uppercase">{{ stat.l }}</div>
                <div class="text-xs font-bold font-mono" :style="{ color: stat.c }">{{ stat.v ?? '-' }}</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="ex in r.expertise.slice(0,3)" class="tag" :style="{ background: `${TC(form.selectedTheme)}10` , color: TC(form.selectedTheme) }">
                {{ ex }}
              </span>
              <span v-if="r.works > 0" class="exp-badge">
                🏆 {{ r.works }} works
              </span>
              <span v-if="r.expBonus > 0" class="exp-badge" style="background:var(--color-violet-dim);color:var(--color-violet)">
                🏆 {{ r.expBonus }} hist
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="space-y-4">
          <h3 class="text-sm font-bold flex items-center gap-2" style="color: var(--color-t0);">🏛 กลุ่มวิจัยที่แนะนำ
          </h3>
          <div v-for="(g, i) in results.groups" :key="g.id"
            :class="[isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800', 'border rounded-xl p-4 flex items-center gap-4 hover:bg-slate-300/40 cursor-pointer transition-colors']">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] text-white"
              :style="{ backgroundColor: g.color || getThemeColor(form.selectedTheme) }">
              {{ g.short }}
            </div>
            <div class="flex-1">
              <div class="mc-name" :class="isLight ? 'text-slate-900' : 'text-white'">{{ g.name }}</div>
              <div class="mc-inst">{{ g.inst }}</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-black font-mono text-emerald-400">{{ g.exp_score }}</div>
              <div class="text-[8px] text-slate-600 uppercase">Group Score</div>
            </div>
          </div>
        </div>


        <div :class="[isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-800', 'border rounded-xl p-4 transition-colors']">
          <h4 class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">📋 Feasibility Summary</h4>
          <div class="space-y-3">
            <div v-for="item in summaryItems" :key="item.label" class="flex justify-between text-[11px]"
              style="padding:5px 0; border-bottom: 1px solid var(--color-b0)">
              <span class="font-medium" style="color:var(--t3)">{{ item.label }}</span>
              <span class="font-bold" :style="{ color: item.color }">
                {{ item.value }}
              </span>
            </div>
          </div>
          
          <button
            class="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-lg transition-all shadow-lg shadow-blue-900/40">
            📥 Export Feasibility Report
          </button>
        </div>
    </section>
        </div>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
const toast = useToast();
const { isLight } = useTheme();
const { form, results, calculateFeasibility } = useFeasibility();

const currentStep = ref(1);
const compareMode = ref(false);
const weights = reactive<Record<string, number>>({
  hindex: 25,
  publications: 25,
  network: 30,
  history: 20
});

const comparisonDimensions = [
  { label: 'Alignment', key: 'score' },
  { label: 'H-Index', key: 'hindex' },
  { label: 'Papers', key: 'pubs' },
  { label: 'Impact', key: 'exp_score' },
  { label: 'MOU History', key: 'mouExp' }
];

const analysisResults = ref<any>(null);
const formData = ref<any>({
  name: null,
  inst: null,
  country: null,
  obj: null,
  theme: null,
  keywords: [],
  budget: null
});
const keywords = ref<string[]>(
  ['Machine Learning','Deep Learning','Computer Vision','NLP','Drug Discovery','Genomics','Nanomaterials','Quantum Computing','Solar Energy','Precision Farming','Climate Change','Carbon Capture','Robotics','Semiconductor','Bioinformatics','IoT','Vaccine','Immunology']
);

const summaryItems = computed(() => {
  const theme = form.selectedTheme || formData.value.theme;
  const { researchers, groups} = results.value;
  const highPerformers = researchers.filter((r:any) => r.score >= 70).length ?? 0;
  const topTierCount = researchers.filter((r:any) => r.score >= 80).length ?? 0;
  
  // Calculate Historical Data specific to this theme
  const themeHistory = HISTORY.filter(h => {
    const r = RESEARCHERS.find(res => res.id === h.researcher_id);
    return (r?.score_by_theme as any)?.[theme] >= 70;
  }).length;

  return [
    { label: 'Feasibility', value: 'HIGH (Strong match)', color: 'var(--em)' },
    { label: 'แนะนำ Researchers', value: `${highPerformers} คน`, color: 'var(--c)' },
    { label: 'กลุ่มวิจัย', value: `${groups?.length ?? 0} กลุ่ม`, color: 'var(--am)' },
    { 
      label: 'Gap Risk', 
      value: topTierCount >= 3 ? 'Low ✓' : 'Medium ⚠', 
      color: topTierCount >= 3 ? 'var(--em)' : 'var(--am)' 
    },
    { label: 'Historical Data', value: `${themeHistory} records`, color: 'var(--vi)' }
  ];
});

const selectFeasTheme = (val: string) => {
  formData.value.theme = val
};
const toggleFKW = (key: string) => {
  if (formData.value.keywords.includes(key)) {
    formData.value.keywords = formData.value.keywords.filter((k: string) => k !== key);
  } else {
    formData.value.keywords.push(key);
  }
};
const fillFeasDemo = () => {
  formData.value.name = 'MOU ด้าน AI in Healthcare กับ University of Tokyo';
  formData.value.inst = 'University of Tokyo (UTokyo)';
  formData.value.country = 'ญี่ปุ่น';
  formData.value.obj = 'วิจัยและพัฒนา AI สำหรับการวิเคราะห์ภาพทางการแพทย์ เชื่อมกับ Quantum Computing เพื่อการค้นหายา แลกเปลี่ยนนักวิจัยทั้งสองประเทศ';
  formData.value.theme = 'AI';
  formData.value.keywords = ['Machine Learning', 'Computer Vision', 'Drug Discovery', 'Genomics'];
  formData.value.budget = 150;
  toast.add({
    severity: 'info',
    summary: 'ข้อมูลตัวอย่าง',
    detail: 'ใส่ข้อมูลตัวอย่าง AI Healthcare — กดวิเคราะห์ได้เลย',
    life: 5000
  })
};
const runFeas = () => { 
  currentStep.value = 4;
  calculateFeasibility(formData.value);
};
const getScoreColor = (n: number) => n >= 85 ? '#00e5a0' : n >= 70 ? '#3b82f6' : '#f5a623';
const getThemeColor = (themeKey: string) => TC(themeKey);
</script>

<style scoped>
.wizard {
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.wiz-steps {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  gap: 8px;
}

.wstep {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-t3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex: 1;
  transition: color 0.3s ease;
}

.wstep.on { color: var(--c); }
.wstep.done { color: var(--em); }

.wnum {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg2); 
  border: 2px solid var(--color-b1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wstep.on .wnum {
  background: var(--c);
  border-color: var(--c);
  color: #ffffff;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
}

.wstep.done .wnum {
  background: var(--em);
  border-color: var(--em);
  color: #ffffff;
}

.wline {
  flex: 1;
  height: 2px;
  background: var(--color-b1);
  margin: 0 8px;
  border-radius: 2px;
}

/* Interactive Tag Buttons */
.tag-btn {
  font-size: 11px;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid var(--color-b1);
  color: var(--color-t2);
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg2);
  white-space: nowrap;
}

.tag-btn:hover {
  border-color: var(--color-b2);
  color: var(--color-t0);
  transform: translateY(-1px);
}

.tag-btn.sel {
  border-color: var(--c);
  color: var(--c);
  background: rgba(59, 130, 246, 0.1);
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
}

/* Match Card Components (from runFeas) */
.match-card {
  position: relative;
  background: var(--color-bg2);
  border: 1px solid var(--color-b1);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.match-card:hover {
  border-color: var(--b2);
  transform: translateX(4px);
}


</style>