<template>
  <div class="wrap">
    <ClientOnly>
      <div ref="chartRef" class="chart"></div>
    </ClientOnly>
    <!-- 🔥 Legend -->
    <div class="legend">
      <div class="lg-title">Legend</div>

      <div class="lg-row">
        <span class="dot cmu"></span> CMU (Hub)
      </div>

      <div class="lg-row">
        <span class="dot uni"></span> Universities
      </div>

      <div class="lg-row">
        <span class="line"></span> MOU Flow
      </div>

      <div class="lg-note">Arrow = Collaboration Flow</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import thailandJson from '~/assets/map/thailand.json'

const chartRef = ref()
const { isLight } = useTheme()
let chart: echarts.ECharts

/* =========================
   🔹 Mock Data (inline)
========================= */
const THEMES: any = {
  AI: { color: '#00d4ff', name: 'AI & Data' },
  Health: { color: '#00e5a0', name: 'Healthcare' },
  Energy: { color: '#f5a623', name: 'Energy' },
  Env: { color: '#2dd4bf', name: 'Environment' },
  Agri: { color: '#84cc16', name: 'Agriculture' },
  Social: { color: '#a78bfa', name: 'Social Science' },
  Edu: { color: '#60a5fa', name: 'Education' },
  Bio: { color: '#10b981', name: 'Biotech' },
  Nano: { color: '#ff4d6d', name: 'Nanotech' },
  Quantum: { color: '#38bdf8', name: 'Quantum' }
}

const CMU =  {
  name: 'มหาวิทยาลัยเชียงใหม่',
  short: 'CMU',
  coord: [98.9793, 18.7961]
}

const THAI_UNIS = [
  // กรุงเทพ
  { name: 'จุฬาลงกรณ์มหาวิทยาลัย', coord: [100.533, 13.736] },
  { name: 'มหาวิทยาลัยมหิดล', coord: [100.322, 13.794] },
  { name: 'มหาวิทยาลัยเกษตรศาสตร์', coord: [100.571, 13.847] },
  { name: 'มหาวิทยาลัยธรรมศาสตร์', coord: [100.486, 14.074] },
  { name: 'สถาบันเทคโนโลยีพระจอมเกล้าฯลาดกระบัง', coord: [100.778, 13.727] },
  { name: 'สถาบันเทคโนโลยีพระจอมเกล้าพระนครเหนือ', coord: [100.514, 13.820] },

  // ภาคเหนือ
  { name: 'มหาวิทยาลัยแม่ฟ้าหลวง', coord: [99.832, 20.044] },
  { name: 'มหาวิทยาลัยนเรศวร', coord: [100.203, 16.821] },
  { name: 'มหาวิทยาลัยพะเยา', coord: [100.040, 19.028] },
  { name: 'มหาวิทยาลัยราชภัฏเชียงราย', coord: [99.845, 19.910] },

  // อีสาน
  { name: 'มหาวิทยาลัยขอนแก่น', coord: [102.835, 16.441] },
  { name: 'มหาวิทยาลัยมหาสารคาม', coord: [103.264, 16.246] },
  { name: 'มหาวิทยาลัยอุบลราชธานี', coord: [104.871, 15.120] },
  { name: 'มหาวิทยาลัยเทคโนโลยีสุรนารี', coord: [102.119, 14.879] },

  // ใต้
  { name: 'มหาวิทยาลัยสงขลานครินทร์', coord: [100.501, 7.006] },
  { name: 'มหาวิทยาลัยวลัยลักษณ์', coord: [99.899, 8.641] },

  // ตะวันออก / กลาง
  { name: 'มหาวิทยาลัยบูรพา', coord: [100.925, 13.283] },
  { name: 'มหาวิทยาลัยศิลปากร', coord: [100.044, 13.819] },
  { name: 'มหาวิทยาลัยรังสิต', coord: [100.618, 13.964] },
  { name: 'มหาวิทยาลัยศรีนครินทรวิโรฒ', coord: [100.565, 13.744] }
]

const CMU_MOUS = [
  { target: 'จุฬาลงกรณ์มหาวิทยาลัย', theme: 'AI', budget: 120 },
  { target: 'มหาวิทยาลัยมหิดล', theme: 'Health', budget: 200 },
  { target: 'มหาวิทยาลัยเกษตรศาสตร์', theme: 'Agri', budget: 90 },
  { target: 'มหาวิทยาลัยธรรมศาสตร์', theme: 'Social', budget: 70 },
  { target: 'สถาบันเทคโนโลยีพระจอมเกล้าฯลาดกระบัง', theme: 'AI', budget: 110 },
  { target: 'สถาบันเทคโนโลยีพระจอมเกล้าพระนครเหนือ', theme: 'Nano', budget: 85 },

  { target: 'มหาวิทยาลัยแม่ฟ้าหลวง', theme: 'Health', budget: 60 },
  { target: 'มหาวิทยาลัยนเรศวร', theme: 'AI', budget: 80 },
  { target: 'มหาวิทยาลัยพะเยา', theme: 'Env', budget: 65 },
  { target: 'มหาวิทยาลัยราชภัฏเชียงราย', theme: 'Edu', budget: 40 },

  { target: 'มหาวิทยาลัยขอนแก่น', theme: 'Env', budget: 75 },
  { target: 'มหาวิทยาลัยมหาสารคาม', theme: 'Social', budget: 55 },
  { target: 'มหาวิทยาลัยอุบลราชธานี', theme: 'Agri', budget: 68 },
  { target: 'มหาวิทยาลัยเทคโนโลยีสุรนารี', theme: 'Energy', budget: 95 },

  { target: 'มหาวิทยาลัยสงขลานครินทร์', theme: 'Health', budget: 110 },
  { target: 'มหาวิทยาลัยวลัยลักษณ์', theme: 'Bio', budget: 72 },

  { target: 'มหาวิทยาลัยบูรพา', theme: 'Energy', budget: 60 },
  { target: 'มหาวิทยาลัยศิลปากร', theme: 'Social', budget: 50 },
  { target: 'มหาวิทยาลัยรังสิต', theme: 'Edu', budget: 45 },
  { target: 'มหาวิทยาลัยศรีนครินทรวิโรฒ', theme: 'Health', budget: 88 }
]

/* =========================
   🔹 Build Data
========================= */
const geoMap: any = {
  [CMU.name]: CMU.coord
}
THAI_UNIS.forEach(u => geoMap[u.name] = u.coord)

const buildLines = () => {
  return CMU_MOUS.map(m => ({
    fromName: CMU.name,
    toName: m.target,
    coords: [geoMap[CMU.name], geoMap[m.target]],
    value: m.budget,
    lineStyle: {
      width: Math.max(1.5, m.budget / 40),
      color: THEMES[m.theme].color,
      opacity: 0.85
    }
  }))
}

const buildPoints = () => [
  {
    name: CMU.name,
    value: [...CMU.coord, 300],
    symbolSize: 18,
    itemStyle: { color: '#ff4d6d' }
  },
  ...THAI_UNIS.map(u => ({
    name: u.name,
    value: [...u.coord, 100],
    symbolSize: 10,
    itemStyle: { color: '#38bdf8' }
  }))
]

/* =========================
   🔥 Chart Option
========================= */
const getOption = () => ({
  backgroundColor: isLight.value ? '#ffffff' : '#020617',

  geo: {
    map: 'TH',
    roam: true,
    zoom: 1.2,
    center: [100.5, 13.5],
    itemStyle: {
      areaColor: isLight.value ? '#e5e7eb' : '#0b1e2d',
      borderColor: isLight.value ? '#94a3b8' : '#00d4ff',
      borderWidth: 0.5
    },

    emphasis: {
      itemStyle: {
        areaColor: '#163a59'
      }
    }
  },

  tooltip: {
    trigger: 'item',
    backgroundColor: isLight.value ? 'rgba(255,255,255,0.9)' : '#0f172a',
    borderColor: isLight.value ? '#e2e8f0' : '#334155',
    textStyle: { color: isLight.value ? '#1e293b' : '#fff' },

    formatter: (p: any) => {
      if (p.data?.fromName) {
        return `
          <div style="font-size:12px">
            <b>${p.data.fromName} → ${p.data.toName}</b><br/>
            Budget: <span style="color:#00d4ff">${p.data.value}M</span>
          </div>
        `
      }
      return `<b>${p.name}</b>`
    }
  },

  series: [
    {
      type: 'lines',
      coordinateSystem: 'geo',
      zlevel: 2,

      effect: {
        show: true,
        symbol: 'arrow',
        symbolSize: 6,
        trailLength: 0.25
      },

      lineStyle: {
        curveness: 0.3
      },

      data: buildLines()
    },

    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 3,

      rippleEffect: { brushType: 'stroke' },

      label: {
        show: true,
        position: 'right',
        color: isLight.value ? '#64748b' : '#fff',
        fontSize: 10
      },

      data: buildPoints()
    }
  ]
})

/* =========================
   🚀 Init
========================= */
onMounted(async () => {
  echarts.registerMap('TH', thailandJson as any)

  await nextTick()
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  chart.setOption(getOption())

  window.addEventListener('resize', () => chart.resize())
})

watch(isLight, () => {
  if (chart) chart.setOption(getOption())
})
</script>

<style scoped>
.wrap {
  position: relative;
}

.chart {
  width: 100%;
  height: 90dvh;
  border-radius: 12px;
  background: var(--color-surface);
}

/* 🔥 Legend */
.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: var(--color-stats);
  border: 1px solid var(--color-b1);
  padding: 12px;
  border-radius: 10px;
  font-size: 12px;
  color: var(--color-t0);
  backdrop-filter: blur(6px);
}

.lg-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.lg-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cmu { background: #ff4d6d; }
.uni { background: #38bdf8; }

.line {
  width: 20px;
  height: 2px;
  background: #00d4ff;
}

.lg-note {
  margin-top: 6px;
  font-size: 10px;
  opacity: 0.7;
}
</style>