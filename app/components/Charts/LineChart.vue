<template>
  <div class="card">
    <div class="title">{{ title }}
      <slot name="title" />
    </div>
    <ClientOnly>
      <VChart :option="option" autoresize class="chart" />
    </ClientOnly>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
const props = defineProps({ title: String, data: Array })

const option = computed(() => ({
  tooltip: {},
  textStyle: {
    fontFamily: 'Noto Sans Thai, Plus Jakarta Sans, sans-serif'
  },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.year)
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      itemStyle: {
        color: '#00d4ff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(0, 212, 255, 0.8)' // High opacity at the top
          },
          {
            offset: 1,
            color: 'rgba(0, 212, 255, 0.1)' // Fades out toward the bottom
          }
        ])
      },
      data: props.data.map(d => d.value),
      label: {
        show: true,
        position: 'top'
      },
      smooth: true
    }
  ]
}))
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chart {
  width: 100%;
  flex: 1;
  min-height: 0;
}
</style>