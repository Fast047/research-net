<template>
<div class="scroll-pane p-5">
    <div class="ph">
        <div>
            <div class="ph-title">Admin Dashboard</div>
            <div class="ph-sub">ภาพรวมระบบ — อัปเดต {{ formatDateShort(new Date(), true) }}</div>
        </div>
        <div class="ph-actions">
            <button class="btn-p" @click="navigateTo('/admin/dataMgmts')">+ เพิ่มโครงการ</button>
            <button class="btn-s" @click="handleExport">📥 Export</button>
        </div>
    </div>
    <div class="kpi-row kpi-row-5">
        <div class="kpi ck">
            <div class="kpi-icon">🏛</div>
            <div class="kpi-lbl">Research Groups</div>
            <div class="kpi-val">{{ GROUPS.length }}</div>
            <div class="kpi-trend up">▲ 2 กลุ่มใหม่ ปี 67</div>
        </div>
        <div class="kpi cg">
            <div class="kpi-icon">👩‍🔬</div>
            <div class="kpi-lbl">Researchers</div>
            <div class="kpi-val">{{ RESEARCHERS.length }}</div>
            <div class="kpi-trend up">▲ 14% YoY</div>
        </div>
        <div class="kpi ca">
            <div class="kpi-icon">📋</div>
            <div class="kpi-lbl">โครงการทั้งหมด</div>
            <div class="kpi-val">{{ PROJECTS.length }}</div>
            <div class="kpi-trend">{{ activeProjectsCount }} active</div>
        </div>
        <div class="kpi cv">
            <div class="kpi-icon">🌐</div>
            <div class="kpi-lbl">MOU ทั้งหมด</div>
            <div class="kpi-val">{{ MOUS.length }}</div>
            <div class="kpi-trend">8 ประเทศ</div>
        </div>
        <div class="kpi cr">
            <div class="kpi-icon">💰</div>
            <div class="kpi-lbl">งบประมาณรวม</div>
            <div class="kpi-val">{{ formattedTotalBudget }}B</div>
            <div class="kpi-trend up">▲ 8.4% YoY</div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-14">
        <div class="card-custom card-p">
            <div class="card-hd">
                <div class="card-title">Activity Log (7 วันล่าสุด)</div>
            </div>
            <div class="flex-col-gap-6">
                <div v-for="(act, idx) in activityLog" :key="idx" class="activity-item">
                    <div class="dot" :style="{ backgroundColor: act.c }"></div>
                    <div class="act-text">{{ act.a }}</div>
                    <span class="act-user">{{ act.u }}</span>
                    <span class="act-time">{{ act.t }}</span>
                </div>
            </div>
        </div>

        <div class="card-custom card-p">
            <div class="card-hd">
                <div class="card-title">สถานะโครงการ</div>
            </div>
            <div v-for="status in statusList" :key="status.name" class="status-row">
                <div class="flex-center-gap-8">
                    <div class="dot" :style="{ backgroundColor: status.color }"></div>
                    <span class="status-name">{{ status.name }}</span>
                </div>
                <div class="status-val" :style="{ color: status.color }">
                    {{ getStatusCount(status.name) }}
                </div>
            </div>
            <div class="mt-12">
                <button class="btn-p w-full text-12" @click="navigateTo('/admin/dataMgmts')">
                    จัดการโครงการทั้งหมด →
                </button>
            </div>
        </div>
    </div>


    <div class="card-custom card-p border-l-warn">
        <div class="card-hd">
            <div class="card-title">⚠ Data Quality Alerts</div>
            <button class="btn-s text-11" @click="navigateTo('/admin/dq')">ดูรายละเอียด</button>
        </div>
        <div class="grid-cols-3-gap-8">
            <div v-for="alert in alerts" :key="alert.t" class="alert-box">
                <div class="alert-val text-[20px] font-bold" :style="{ color: alert.c, fontFamily: 'var(--font-mono)' }">{{ alert.n }}</div>
                <div class="alert-label text-[10px]">{{ alert.t }}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
    layout: 'sidebar-layout'
});
// Calculated Values
const activeProjectsCount = computed(() =>
    PROJECTS.filter(p => p.status === 'active').length
)

const formattedTotalBudget = computed(() => {
    const total = PROJECTS.reduce((s, p) => s + p.budget, 0)
    return (total / 1000).toFixed(1)
})

const getStatusCount = (status: any) =>
    PROJECTS.filter(p => p.status === status).length

// Mock Data for Loops
const activityLog = [
    { a: 'เพิ่มโครงการ P09 Thai LLM', u: 'Admin', t: '2 ชม.', c: 'var(--c)' },
    { a: 'อัปเดต MOU M01 Quantum Lab', u: 'Officer', t: '5 ชม.', c: 'var(--em)' },
    { a: 'เพิ่มนักวิจัย R16 Prof. James Chen', u: 'Admin', t: '1 วัน', c: 'var(--am)' },
    { a: 'ลบโครงการซ้ำกัน', u: 'Admin', t: '2 วัน', c: 'var(--ro)' },
    { a: 'เพิ่ม MOU M07 กับ KAIST', u: 'Officer', t: '3 วัน', c: 'var(--vi)' }
]

const statusList = [
    { name: 'active', color: '#00e5a0' },
    { name: 'planning', color: '#f5a623' },
    { name: 'done', color: '#475569' },
    { name: 'paused', color: '#ff4d6d' }
]

const alerts = [
    { t: 'Missing PI', n: 2, c: 'var(--am)' },
    { t: 'Orphan Projects (no MOU)', n: 3, c: 'var(--ro)' },
    { t: 'Stale Records (>2yr)', n: 1, c: 'var(--vi)' }
]

// Methods
const handleExport = () => {
    // Use a Nuxt notification system or the toast logic we built earlier
    console.log('Exporting report...')
}
</script>

<style scoped>
/* KPI */
.kpi-row {
    display: grid;
    gap: 10px;
    margin-bottom: 18px
}

.kpi-row-4 {
    grid-template-columns: repeat(4, 1fr)
}

.kpi-row-5 {
    grid-template-columns: repeat(5, 1fr)
}

.kpi {
    background: var(--color-card);
    border: 1px solid var(--color-b1);
    border-radius: var(--r10);
    padding: 15px;
    position: relative;
    overflow: hidden;
    transition: all .2s
}

.kpi:hover {
    border-color: var(--color-b2);
    transform: translateY(-1px)
}

.kpi::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px
}

.kpi.ck::before {
    background: linear-gradient(90deg, var(--c), var(--c3))
}

.kpi.cg::before {
    background: linear-gradient(90deg, var(--em), var(--em2))
}

.kpi.ca::before {
    background: linear-gradient(90deg, var(--am), var(--am2))
}

.kpi.cr::before {
    background: linear-gradient(90deg, var(--ro), var(--ro2))
}

.kpi.cv::before {
    background: linear-gradient(90deg, var(--vi), var(--vi2))
}

.kpi-lbl {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-t3);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 7px
}

.kpi-val {
    font-size: 26px;
    font-weight: 800;
    color: var(--color-t0);
    line-height: 1;
    font-family: var(--font-mono)
}

.kpi-trend {
    font-size: 10px;
    color: var(--color-t3);
    margin-top: 5px
}

.kpi-trend.up {
    color: var(--em)
}

.kpi-icon {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 22px;
    opacity: .2
}

.flex-col-gap-6 {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.flex-center-gap-8 {
    display: flex;
    align-items: center;
    gap: 8px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px;
    background: var(--color-bg2);
    border-radius: var(--r8);
}

.status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 0;
    border-bottom: 1px solid var(--color-b0);
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.grid-cols-3-gap-8 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
}

.alert-box {
    background: var(--color-bg2);
    border-radius: var(--r8);
    padding: 11px;
    text-align: center;
}

.border-l-warn {
    border-left: 2px solid var(--am);
}

.mb-14 {
    margin-bottom: 14px;
}

.mt-12 {
    margin-top: 12px;
}

.w-full {
    width: 100%;
}

.text-11 {
    font-size: 11px;
}

.text-12 {
    font-size: 12px;
}
</style>
