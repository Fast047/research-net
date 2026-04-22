<template>
  <div>
    <div class="map-wrapper p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
      <h2 class="text-xl text-cyan-400 mb-4 font-bold">โครงข่ายโลจิสติกส์ประเทศไทย (ตัวอย่าง)</h2>
      
      <ClientOnly>
        <VChart class="chart" :option="chartOption" :autoresize="true" />
      </ClientOnly>
  </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
// import VChart, { THEME_KEY } from 'vue-echarts';
const { data: worldData } = await useAsyncData<any>('world-map', () => 
  $fetch('https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json')
);

const geoCoordMap = {
  'กรุงเทพฯ': [100.5018, 13.7563],
  'เชียงใหม่': [98.9817, 18.7883],
  'ระยอง': [101.2816, 12.6814],
  'ภูเก็ต': [98.3923, 7.8804],
  'ขอนแก่น': [102.8236, 16.4322]
};

// ข้อมูลเส้นทาง (จาก -> ไป)
const lineData = [
  { fromName: 'กรุงเทพฯ', toName: 'เชียงใหม่', coords: [geoCoordMap['กรุงเทพฯ'], geoCoordMap['เชียงใหม่']], value: 100 },
  { fromName: 'กรุงเทพฯ', toName: 'ระยอง', coords: [geoCoordMap['กรุงเทพฯ'], geoCoordMap['ระยอง']], value: 150 },
  { fromName: 'เชียงใหม่', toName: 'ขอนแก่น', coords: [geoCoordMap['เชียงใหม่'], geoCoordMap['ขอนแก่น']], value: 80 },
  { fromName: 'กรุงเทพฯ', toName: 'ภูเก็ต', coords: [geoCoordMap['กรุงเทพฯ'], geoCoordMap['ภูเก็ต']], value: 120 },
  { fromName: 'ขอนแก่น', toName: 'กรุงเทพฯ', coords: [geoCoordMap['ขอนแก่น'], geoCoordMap['กรุงเทพฯ']], value: 90 },
];

// ตั้งค่า ECharts Option
const chartOption = ref({
  backgroundColor: '#0a0a0a', // สีพื้นหลังมืด
  geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: 'transparent',
          borderColor: 'rgba(0, 255, 255, 0.1)',
          borderWidth: 5,
          shadowColor: '#00ccff',
          shadowBlur: 20
        }
      },
      // {
      //   map: 'world',
      //   roam: true,
      //   emphasis: { disabled: true },
      //   itemStyle: {
      //     areaColor: '#08121a', // สีพื้นทวีปมืดๆ
      //     borderColor: '#162d4a', // สีเส้นขอบประเทศ
      //     borderWidth: 1
      //   }
      // }
    // {
    //   map: 'thailandMap', // ชื่อเดียวกับที่ลงทะเบียนไว้
    //   roam: true, // ซูม/ย้ายได้
    //   label: { show: false },
    //   itemStyle: {
    //     areaColor: '#121212', // สีพื้นที่จังหวัด
    //     borderColor: '#00ccff', // สีเส้นขอบจังหวัด (ฟ้าสว่าง)
    //     borderWidth: 0.5
    //   },
    //   emphasis: {
    //     itemStyle: {
    //       areaColor: '#1a1a1a'
    //     }
    //   }
    // }],
  series: [
    // 1. เส้นทาง (Lines with effects)
    {
      type: 'lines',
      coordinateSystem: 'geo',
      effect: {
        show: true,
        period: 4, // เวลาครบรอบของแสงวิ่ง (วินาที)
        trailLength: 0.6, // ความยาวหางแสง
        color: '#ffcc00', // สีแสงไฟวิ่ง (เหลือง/ส้ม)
        symbolSize: 3
      },
      lineStyle: {
        color: '#00ccff', // สีเส้นหลัก (ฟ้า)
        width: 1,
        curveness: 0.3 // ความโค้งของเส้น
      },
      data: lineData
    },
    // 2. จุดปลายทางที่มีเอฟเฟกต์กระพริบ (EffectScatter)
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke' },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: '#eee',
        fontSize: 12
      },
      symbolSize: function (val:any) {
        return Math.log10(val[2]) * 2; // ขนาดจุดสัมพันธ์กับข้อมูล
      },
      itemStyle: {
        color: '#00ccff'
      },
      data: [
         { name: 'เชียงใหม่', value: [...geoCoordMap['เชียงใหม่'], 80000] },
         { name: 'ระยอง', value: [...geoCoordMap['ระยอง'], 120000] },
         { name: 'ขอนแก่น', value: [...geoCoordMap['ขอนแก่น'], 60000] },
         { name: 'ภูเก็ต', value: [...geoCoordMap['ภูเก็ต'], 90000] },
         { name: 'กรุงเทพฯ', value: [...geoCoordMap['กรุงเทพฯ'], 200000] }
      ]
    }
  ]
});



onMounted(async () => {
  if (worldData.value) {
    echarts.registerMap('world', worldData.value);
  }
  
  // ดึงไฟล์ GeoJSON จากโฟลเดอร์ /public
  const thJson = await $fetch<any>('/thailand.json');
  echarts.registerMap('thailandMap', thJson.value);
});

</script>

<style scoped>
.chart {
  width: 100%;
  height: 600px; /* ปรับขนาดความสูงตามต้องการ */
}
</style>