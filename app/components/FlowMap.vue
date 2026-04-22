<template>
  <div class="flow-container">
    <ClientOnly>
      <div ref="chartRef" class="chart" />
    </ClientOnly>
    <!-- 🔻 Legend -->
    <div class="legend">
      <div class="title">FLOW MAP</div>

      <div class="item">
        <span class="dot source"></span>
        Source (Beijing)
      </div>

      <div class="item">
        <span class="dot dest"></span>
        Destination
      </div>

      <div class="item">
        <span class="line"></span>
        Migration Flow
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

// 👉 โหลด geojson
import chinaJson from '~/assets/map/100000_full.json'

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts

// ================= DATA =================
const flows = [
  { from: 'Beijing', to: 'Shanghai', value: 95 },
  { from: 'Beijing', to: 'Guangzhou', value: 80 },
  { from: 'Beijing', to: 'Chengdu', value: 70 },
  { from: 'Beijing', to: 'Wuhan', value: 65 },
  { from: 'Beijing', to: 'XiAn', value: 60 },
  { from: 'Beijing', to: 'Kunming', value: 50 }
]

const geoCoordMap: Record<string, [number, number]> = {
  Beijing: [116.40, 39.90],
  Shanghai: [121.47, 31.23],
  Guangzhou: [113.27, 23.13],
  Chengdu: [104.06, 30.67],
  Wuhan: [114.31, 30.52],
  XiAn: [108.93, 34.27],
  Kunming: [102.71, 25.04]
}

// ================= UTILS =================
function convertData(data: typeof flows) {
  return data.map(d => ({
    fromName: d.from,
    toName: d.to,
    coords: [geoCoordMap[d.from], geoCoordMap[d.to]] as number[][],
    value: d.value
  }))
}

// ================= OPTION =================
function buildOption(): echarts.EChartsOption {
  return {
    backgroundColor: '#031525',

    tooltip: {
      trigger: 'item',
      formatter: (p: any) => {
        if (p.seriesType === 'lines') {
          return `
            <div class="tt">
              <b>${p.data.fromName} → ${p.data.toName}</b><br/>
              Flow: ${p.data.value}
            </div>`
        }
        return `${p.name}`
      }
    },

    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,

      itemStyle: {
        areaColor: '#072c4c',
        borderColor: '#2b6c9c'
      },

      emphasis: {
        itemStyle: {
          areaColor: '#0b4f78'
        }
      }
    },

    series: [
      // ✈️ FLOW LINE
      {
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 2,

        effect: {
          show: true,
          period: 6,
          trailLength: 0.4,
          symbol: 'arrow',
          symbolSize: 6
        },

        lineStyle: {
          color: '#00e5ff',
          width: 1.2,
          opacity: 0.6,
          curveness: 0.3,
          shadowBlur: 10,
          shadowColor: '#00e5ff'
        },

        data: convertData(flows)
      },

      // 🔵 DESTINATION
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 3,

        rippleEffect: {
          brushType: 'stroke'
        },

        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#fff'
        },

        symbolSize: (val: any) => val[2] / 8,

        itemStyle: {
          color: '#00d4ff'
        },

        data: flows.map(d => ({
          name: d.to,
          value: [...(geoCoordMap[d.to] || [0, 0]), d.value]
        }))
      },

      // 🔴 SOURCE (Beijing)
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 4,

        symbolSize: 12,

        itemStyle: {
          color: '#ff4d6d'
        },

        label: {
          show: true,
          formatter: '{b}',
          color: '#fff',
          position: 'top'
        },

        data: [
          {
            name: 'Beijing',
            value: geoCoordMap['Beijing']
          }
        ]
      }
    ]
  }
}

// ================= INIT =================
onMounted(() => {
  echarts.registerMap('china', chinaJson as any)

  chart = echarts.init(chartRef.value!)
  chart.setOption(buildOption())

  window.addEventListener('resize', () => chart.resize())
})
</script>

<style scoped>
.flow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #031525;
}

.chart {
  width: 100%;
  height: 100%;
}

/* ===== LEGEND ===== */
.legend {
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: rgba(0,0,0,0.6);
  padding: 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}

.title {
  font-weight: bold;
  margin-bottom: 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.source { background: #ff4d6d; }
.dest { background: #00d4ff; }

.line {
  width: 18px;
  height: 2px;
  background: #00e5ff;
}

/* ===== TOOLTIP ===== */
.tt {
  background: rgba(0,0,0,0.8);
  padding: 6px 8px;
  border-radius: 6px;
  color: #fff;
}
</style>