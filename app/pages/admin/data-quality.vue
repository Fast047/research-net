<template>
  <div class="scroll-pane space-y-6">
    <div class="ph">
      <div>
            <div class="ph-title">Data Quality & Integrity</div>
            <div class="ph-sub">ตรวจสอบสุขภาพข้อมูล Schema Coverage และ Consistency</div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="d in dqMetrics" 
        :key="d.t" 
        class="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all group"
      >
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ d.t }}</div>
        <div class="flex items-baseline gap-2 mb-1">
          <span class="text-3xl font-black font-mono" :style="{ color: d.c }">{{ d.s }}%</span>
        </div>
        <div class="text-[11px] text-slate-400 mb-4">{{ d.sub }}</div>
        
        <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
            :style="{ width: d.s + '%', backgroundColor: d.c }"
          ></div>
        </div>
      </div>
    </div>
    <div class="border border-slate-200 rounded-xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-sm font-bold flex items-center gap-2">
          ⚠ Issues Detected ({{ detectedIssues.length }})
        </h2>
      </div>
  
      <div class="space-y-3">
        <div 
          v-for="issue in detectedIssues" 
          :key="issue.id"
          class="flex items-center gap-4 p-4 bg-slate-200/50 border-l-4 rounded-r-lg transition-transform hover:scale-[1.005]"
          :style="{ borderColor: issue.color }"
        >
          <div class="text-xl">{{ issue.icon }}</div>
          <div class="flex-1">
            <div class="text-sm font-bold">{{ issue.msg }}</div>
            <div class="text-[11px] text-slate-400 leading-relaxed">{{ issue.sub }}</div>
          </div>
          <Button :label="issue.action" severity="danger" variant="text" size="small" :pt="{
            root: {
              style: {
                fontSize: '11px',
                borderRadius: '12px',
                padding: '12px 6px'
              }
            }
          }"  />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
const { dqMetrics, detectedIssues } = useDataQuality();

const handleScan = () => {
  // Mocking the "Full Scan" action
  console.log('Scanning database schema...');
};
</script>
<style scoped>
/* Scoped adjustments for pixel-perfect alignment with your design system */
.font-mono {
  font-family: var(--font-mono);
}

/* ═══ ADMIN DATA MGMT ═══ */
.dq-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px
}

.dq-card {
  background: var(--color-card);
  border: 1px solid var(--color-b1);
  border-radius: var(--r10);
  padding: 14px;
  transition: border-color .2s
}

.dq-card:hover {
  border-color: var(--color-b2)
}

.dq-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px
}

.dq-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-t1)
}

.dq-score {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 2px
}

.dq-sub {
  font-size: 10px;
  color: var(--color-t3)
}

.health-bar {
  height: 4px;
  background: var(--color-b0);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px
}

.health-fill {
  height: 100%;
  border-radius: 2px
}

.issue-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px;
  background: var(--color-bg2);
  border-radius: var(--r8);
  margin-bottom: 5px;
  border-left: 2px solid
}

.issue-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px
}

.issue-msg {
  font-size: 12px;
  color: var(--color-t1)
}

.issue-sub {
  font-size: 10px;
  color: var(--color-t3);
  margin-top: 1px
}
</style>