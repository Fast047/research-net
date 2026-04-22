<template>
<div>
    <div class="ph">
      <div>
            <div class="ph-title">Gap Analysis</div>
            <div class="ph-sub">วิเคราะห์ความเพียงพอของนักวิจัยเทียบกับจำนวน MOU ในแต่ละหัวข้อ</div>
        </div>
    </div>
    <div class="card-custom card-p" style="margin-bottom:16px">
      <div class="card-hd">
        <div class="card-title">Coverage vs Demand — นักวิจัยที่มี Score ≥ 65% เทียบกับจำนวน MOU</div>
      </div>
      <div class="space-y-4">
        <div v-for="g in gaps" :key="g.theme" class="flex items-center gap-3 py-2 border-b border-slate-200/50 last:border-0">
            <div class="w-40 flex items-center gap-2 font-medium">
                <span>{{ g.icon }}</span>
                <span class="text-sm truncate">{{ g.name }}</span>
            </div>
  
            <div class="flex-1 h-2 bg-slate-200 rounded-full relative overflow-hidden">
                <div class="absolute left-[60%] top-0 bottom-0 w-0.5 bg-amber-500/50 z-10"></div>
                <div class="h-full rounded-full transition-all duration-1000 ease-out" :style="{ 
                    width: `${Math.min(100, g.coverage)}%`, 
                    backgroundColor: getStatusColor(g.status) 
                  }">
                </div>
              </div>
              <div class="w-10 text-right font-mono font-bold" :style="{ color: getStatusColor(g.status) }">
                  {{ g.researchers }}
              </div>
    
              <div class="w-20 py-1 text-[10px] font-bold text-center rounded-full" :style="{ 
                  backgroundColor: getStatusColor(g.status) + '15', 
                  color: getStatusColor(g.status) 
                }">
                {{ g.status === 'ok' ? '✓ OK' : g.status === 'warn' ? '⚠ WARN' : '✗ GAP' }}
              </div>
          </div>
      </div>
    
      <div class="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex gap-4">
          <span class="flex items-center gap-1">
              <span class="w-2 h-0.5 bg-amber-500"></span>เส้นสีเหลือง = Threshold 60%
          </span>
          <span>•</span>
          <span>คอลัมน์ = จำนวนนักวิจัยที่มี Alignment Score ≥ 65%</span>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border border-slate-200 rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-4 text-rose-400 flex items-center gap-2">
              <span class="i-lucide-alert-triangle"></span> Themes ที่มี Gap
          </h3>
  
          <div v-if="gaps.filter(g => g.status === 'gap').length > 0" class="space-y-3">
              <div v-for="g in gaps.filter(g => g.status === 'gap')" :key="g.theme" class="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-2">
                      <span class="font-bold text-rose-400">{{ g.icon }} {{ g.name }}</span>
                      <span class="px-2 py-0.5 bg-rose-500 text-white text-[9px] rounded font-black">GAP</span>
                  </div>
                  <p class="text-xs text-slate-400">
                      มีนักวิจัย {{ g.researchers }} คน — ต้องการอย่างน้อย {{ g.needed }} คน
                  </p>
                  <Button size="small" class="mt-3"  :pt="{
                      root: {
                          style: {
                              fontSize: '11px',
                              fontWeight: '600',
                              borderRadius: '12px',
                              padding: '12px 6px'
                          },
                          class: 'font-semibold bg-primary/50'
                      }
                    }">
                    ⚡ หาผู้เชี่ยวชาญทดแทน
                  </Button>
                  <!-- <button class="mt-3 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] rounded transition-colors">
                      
                  </button> -->
              </div>
          </div>
          <div v-else class="text-center py-10 text-emerald-400 text-sm">
              ✓ ทุก Theme มีสัดส่วนนักวิจัยเพียงพอต่อ MOU
          </div>
      </div>
  
      <div class="border border-slate-200 rounded-xl p-5">
          <h3 class="text-sm font-semibold mb-4 text-sky-400">คำแนะนำเพื่อปิด Gap</h3>
          <div class="space-y-2">
              <div v-for="rec in [
                'รับสมัครนักวิจัยด้าน Social Sciences เพิ่ม 2-3 คน',
                'เพิ่ม MOU ด้าน Quantum กับสถาบันที่มีผู้เชี่ยวชาญ',
                'จัด Cross-training ระหว่าง AI Lab กับ Health Group',
                'พิจารณาจ้าง Visiting Researcher สำหรับ Nano Theme'
              ]" :key="rec" 
              class="flex gap-3 p-3 bg-slate-300/40 rounded-lg text-xs text-slate-800 items-start">
                  <span class="text-sky-500 mt-0.5">→</span>
                  {{ rec }}
              </div>
          </div>
      </div>
  </div>
</div>
</template>

<script lang="ts" setup>
const { gaps } = useGapAnalysis();

// Theme Icon Helper (matching your TI logic)
const getIcon = (themeKey: string) => THEMES[themeKey as keyof typeof THEMES]?.icon;
const getThemeName = (themeKey: string) => THEMES[themeKey as keyof typeof THEMES]?.name;

// Status Color Helper
const getStatusColor = (status: string) => {
    if (status === 'ok') return '#00e5a0'; // Green
    if (status === 'warn') return '#f5a623'; // Amber
    return '#ff4d6d'; // Rose
};
</script>

<style scoped>
.gap-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-b0)
}

.gap-theme {
    width: 120px;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-t1);
    flex-shrink: 0
}

.gap-meter {
    flex: 1;
    height: 8px;
    background: var(--color-b0);
    border-radius: 99px;
    overflow: hidden;
    position: relative
}

.gap-fill {
    height: 100%;
    border-radius: 99px
}

.gap-threshold {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--am)
}

.gap-label {
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    width: 36px;
    text-align: right;
    flex-shrink: 0
}

.gap-status {
    font-size: 10px;
    font-weight: 700;
    width: 60px;
    text-align: center;
    flex-shrink: 0;
    padding: 2px 0;
    border-radius: 99px
}
</style>
