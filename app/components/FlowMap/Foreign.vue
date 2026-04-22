<template>
  <ClientOnly>
    <VChart
      ref="chartRef"
      :option="option"
      autoresize
      :style="{ width, height }"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
import world from '~/assets/map/world.json'

// ---------------- PROPS ----------------
const props = defineProps<{
  // isLight?: boolean
  width?: string | number
  height?: string | number
}>()
const { isLight: onLight } = useTheme();
const width = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : (props.width || '100%')
)

const height = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : (props.height || '600px')
)

// ---------------- DATA ----------------
const CMU = {
  name: 'Chiang Mai University',
  coord: [98.9793, 18.7961]
}

const countries = [
  { name: 'USA', value: 28, coord: [-95.7129, 37.0902] },
  { name: 'Japan', value: 24, coord: [138.2529, 36.2048] },
  { name: 'Germany', value: 19, coord: [10.4515, 51.1657] },
  { name: 'China', value: 22, coord: [104.1954, 35.8617] },
  { name: 'UK', value: 16, coord: [-3.4, 55.3] },
  { name: 'Korea', value: 18, coord: [127.7, 35.9] },
  { name: 'France', value: 12, coord: [2.2, 46.2] },
  { name: 'Singapore', value: 21, coord: [103.8, 1.35] }
]

// ---------------- OPTION ----------------
const option = ref<any>({})

// ---------------- LOAD MAP ----------------
const loadMap = async () => {
  echarts.registerMap('world', world as any)
}

// ---------------- BUILD OPTION ----------------
const buildOption = () => {
  const isLight = onLight.value ?? false
  const max = Math.max(...countries.map(c => c.value))

  return {
    backgroundColor: isLight ? '#ffffff' : '#020617',

    tooltip: {
      trigger: 'item',
      formatter: (p: any) => {
        if (p.seriesType === 'lines') {
          return `${p.data.fromName} → ${p.data.toName}<br/>MOU: ${p.data.value}`
        }
        if (p.seriesType === 'scatter') {
          return `${p.name}<br/>MOU: ${p.value[2]}`
        }
      }
    },

    geo: {
      map: 'world',
      roam: true,
      zoom: 1.2,
      itemStyle: {
        areaColor: isLight ? '#e5e7eb' : '#0f172a',
        borderColor: '#334155'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#60a5fa'
        }
      }
    },

    series: [
      // 🌊 FLOW
      {
        type: 'lines',
        coordinateSystem: 'geo',

        effect: {
          show: true,
          period: 3,
          trailLength: 0.5,
          symbol: 'arrow',
          symbolSize: 8
        },

        lineStyle: {
          width: 2,
          curveness: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#38bdf8' }, // start
            { offset: 1, color: '#22c55e' }  // end
          ])
        },

        data: countries.map(c => ({
          fromName: c.name,
          toName: 'CMU',
          // coords: [c.coord, CMU.coord],
          coords: [CMU.coord, c.coord],
          value: c.value
        }))
      },

      // 🌍 COUNTRY
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: (val: any) => 6 + (val[2] / max) * 12,
        itemStyle: { color: '#fbbf24' },
        data: countries.map(c => ({
          name: c.name,
          value: [...c.coord, c.value]
        }))
      },

      // 💓 CMU
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        rippleEffect: { scale: 6 },
        symbolSize: 14,
        itemStyle: { color: '#ef4444' },
        data: [
          {
            name: CMU.name,
            value: [...CMU.coord, 999]
          }
        ]
      }
    ]
  }
}

// ---------------- INIT ----------------
onMounted(async () => {
  await loadMap()
  option.value = buildOption()
})

// 🌗 theme switch
watch(() => onLight.value, () => {
  option.value = buildOption()
})
</script>