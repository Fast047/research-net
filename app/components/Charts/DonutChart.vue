<template>
  <div class="card">
    <div class="title">{{ title }}
      <slot name="title" />
    </div>
    <ClientOnly>
      <v-chart :option="option" autoresize class="chart" @click="onClick" />
    </ClientOnly>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
const props = defineProps({ seriesName: String, title: String, data: Array })
const emit = defineEmits(['clickItem'])

const option = computed(() => ({
  tooltip: { trigger: 'item' },
  textStyle: {
    fontFamily: 'Noto Sans Thai, Plus Jakarta Sans, sans-serif'
  },
  legend: { bottom: 0 },
  series: [
    {
      name: props.seriesName || 'Access From',
      type: 'pie',
      radius: ['50%', '70%'],
      data: props.data,
      label: {
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center'
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4
          }
        }
      }
    }
  ]
}))

const onClick = (params) => {
  emit('clickItem', params.name)
}
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