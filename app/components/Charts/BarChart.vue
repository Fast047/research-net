<template>
  <div class="card">
    <div class="title">{{ title }}
      <slot name="title" />
    </div>
    <ClientOnly>
      <VChart :option="option" autoresize class="chart" @click="onClick" />
    </ClientOnly>
    <!-- <v-chart :option="option" autoresize @click="onClick" /> -->
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
const props = defineProps({
  title: String,
  data: Array
})

const emit = defineEmits(['clickItem'])

const option = computed(() => ({
  tooltip: {},
  textStyle: {
    fontFamily: 'Noto Sans Thai, Plus Jakarta Sans, sans-serif'
  },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.name)
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: props.data.map(d => d.value)
    }
  ]
}))

const onClick = (params) => {
  emit('clickItem', params.name)
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%
  ; /* ปรับขนาดความสูงตามต้องการ */
}
</style>