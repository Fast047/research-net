<template>
  <div>
    <main>
      <section class="bg-custom">
        <div class="container mx-auto">
          <div class="relative mb-5">
            <div class="flex flex-col flex-1 items-center h-[30dvh]">
              <div class="flex flex-col text-center my-auto gap-5">
                <div class="flex-1 text-primary-800 text-6xl font-semibold">
                  THE INTELLECTUAL CARTOGRAPHER
                </div>
                <div class="flex-1 text-xl font-medium my-auto">
                  ค้นหาและเชื่องเครือข่ายงานวิจัย เข้าถึงฐานข้อมูล MOU และนักวิจัยเชิงรุก
                </div>
                <div class="flex flex-col flex-1" >
                  <InputGroup>
                    <IconField>
                      <InputIcon>
                        <Icon name="material-symbols:search-rounded" />
                      </InputIcon>
                      <InputText v-model="serachInput" placeholder="ค้นหา MOU, รายชื่อนักวิจัย, หรือเครือข่ายวิจัย..." size="large" />
                    </IconField>
                    <Button label="ค้นหา" size="large" class="px-4" />
                  </InputGroup>
                </div>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="grid grid-cols-4 place-items-stretch gap-2">
                <div v-for="(item, index) in sumTotal" :key="index">
                  <div class="flex flex-col items-start p-4 w-auto h-full bg-white rounded-lg gap-3" 
                    :style="`border-bottom: 4px solid ${item.color};`">
                    {{ item.label }} 
                    <div class="flex items-end gap-2">
                      <div class="text-3xl font-bold text-primary-800">
                        {{ formatComma(item.value) ?? '0' }}
                      </div>
                      <div class="text-sm font-medium" :style="`color: ${item.color};`">
                        {{ item.trend }} {{ item.unit }}
                      </div>
                    </div>
                    <div class="text-sm font-light">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="container mx-auto my-5">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between item-center">
            <div class="flex flex-col gap-1">
              <div class="text-primary font-medium text-xs md:text-sm">CURATION</div>
              <div class="text-3xl text-primary-900 font-bold">
                FEATURED RESEARCH COLLABORATIONS
              </div>
            </div>
            <Button variant="text" class="text-primary-900 hover:text-primary">
              ดูทั้งหมด
              <Icon name="material-symbols:chevron-right-rounded" class="text-2xl"/>
            </Button>
          </div>
          <Carousel :value="researchItems" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="3000" content-class="h-full">
            <template #item="{ data }">
              <div class="border-[0.5px] border-surface-700 dark:border-surface-300 rounded-lg h-full min-w-[20dvw] mx-2">
                <div class="">
                  <div class="relative bg-primary-300 w-full h-48 rounded-t-lg mx-auto">
                    <span></span>
                      <!-- <img :src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-full rounded" /> -->
                      <Tag :value="data.category" :severity="'success'" class="absolute bg-white text-primary-800 font-bold rounded-xl" style="left:5px; top: 5px"/>
                  </div>
                </div>
                <div class="flex flex-col gap-3 p-4 md:p-6">
                  <div class="text-xl text-primary-900 text-clamp-2 font-bold">
                    {{ data.title }}
                  </div>
                  <p class="text-sm font-light text-clamp-2">
                    {{ data.description }}
                  </p>
                  <div class="flex justify-between items-center">
                    <div>
                      <AvatarGroup>
                        <Avatar v-for="item in data.participants" class=" bg-slate-300 text-white border-white">
                          <!-- <template #icon>
                          </template> -->
                          <Icon name="material-symbols:person-rounded" />
                        </Avatar>
                        <Avatar label="+1" class=" bg-slate-300 text-black border-white" />
                      </AvatarGroup>
                    </div>
                    <div>
                      <div class="flex items-center text-primary-600 text-xs font-medium gap-2">
                        {{ data.status }}•{{ data.period }}
                      </div>
                    </div>
                </div>
                </div>
              </div>
            </template>
          </Carousel>
        </div>
      </section>
      <section class="container mx-auto">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <div class="text-warn font-medium text-xs md:text-sm">NETWORK VISUALIZATION</div>
              <div class="text-3xl text-primary-900 font-bold">
                VISUALIZATION THE FUTURE OF RESEARCH
              </div>
            </div>
            <div class="text-md">
              ระบบอัจฉริยะของเราช่วยแสดงลความเชื่อมโยงระหว่างนักวิจัยสถาบัน 
              และหัวข้อวิจัยที่กำลังเป็นที่สนใจทั่วโลกแบบ Real-time
            </div>
            <div class="flex items-center gap-2 surface-card p-3">
              <span class="inline-flex items-center justify-center rounded-lg h-12 w-12 p-1 bg-primary-200 text-primary-600">
                <Icon name="material-symbols-light:network-intel-node" class="text-4xl" />
              </span>
              <div>
                <div class="text-md md:text-lg font-semibold text-primary-600">แผนที่เครือข่ายอัจฉริยะ</div>
                <div class="text-sm md:text-base">วิเคราะห์ความสัมพันธ์ผ่านกราฟข้อมูลที่ซับซ่อน</div>
              </div>
            </div>
            <div class="flex items-center gap-2 surface-card p-3">
              <span class="inline-flex items-center justify-center rounded-lg h-12 w-12 p-1 bg-primary-200 text-primary-600">
                <Icon name="stash:chart-trend-up-duotone" class="text-4xl" />
              </span>
              <div>
                <div class="text-md md:text-lg font-semibold text-primary-600">แนวโน้มงานวิจัยโลก</div>
                <div class="text-sm md:text-base">ติดตามประเด็นร้อนที่นักวิจัยทั่วโลกกำลังให้ความสำคัญ</div>
              </div>
            </div>
          </div>
          <div class="relative rounded-2xl bg-primary-950/50">
            <div class=" absolute bottom-5 left-5 rounded-lg p-5 bg-primary-200">
              <div class="flex flex-col text-white  mb-3">
                <div class="font-medium">LIVEMAP DATA</div>
                <div class="text-2xl font-semibold">
                  Global Connenction Node
                </div>
              </div>
              <Button variant="text" raised  class="bg-white rounded-xl">
                <span class="text-primary-600 font-medium">EXPLORE MAP</span>
              </Button>
            </div>
            <div class="flex items-center justify-end w-full h-full">
              <Icon name="gis:earth-network-o" class="text-[15rem] text-white" />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'main-layout'
});
const serachInput = ref('');
const researchItems = ref<any[]>([
  {
    "id": 1,
    "category": "MEDICAL SCIENCE",
    "title": "โครงการความร่วมมือวิจัยวัคซีนรุ่นใหม่กับมหาวิทยาลัยเคมบริดจ์",
    "description": "ความร่วมมือทางวิชาการเพื่อพัฒนาแพลตฟอร์มวัคซีน mRNA สำหรับโรคอุบัติใหม่ในเขตร้อน...",
    "status": "ACTIVE MOU",
    "period": "2024-2027",
    "participants": [
      { "name": "Prof. Sarah Jenkins", "role": "Lead Researcher", "image": "https://i.pravatar.cc/150?u=1" },
      { "name": "ดร. สมชาย รักดี", "role": "Project Coordinator", "image": "https://i.pravatar.cc/150?u=2" }
    ],
    "members": ["University of Cambridge", "CGI Research Unit", "Ministry of Public Health"],
    "partners": ["https://link-to-logo1.png", "https://link-to-logo2.png"]
  },
  {
    "id": 2,
    "category": "QUANTUM AI",
    "title": "เครือข่ายวิจัยความปลอดภัยทางไซเบอร์และควอนตัมคอมพิวเตอร์",
    "description": "การสร้างพันธมิตรวิจัยระหว่างไทยและสถาบันเทคโนโลยีแห่งโตเกียว เพื่อความมั่นคงทางข้อมูล...",
    "status": "ACTIVE NETWORK",
    "period": "2023-2025",
    "participants": [
      { "name": "Dr. Kenji Tanaka", "role": "Technical Director", "image": "https://i.pravatar.cc/150?u=3" },
      { "name": "ผศ.ดร. นภา สายชล", "role": "Data Scientist", "image": "https://i.pravatar.cc/150?u=4" }
    ],
    "members": ["Tokyo Tech", "DEPA Thailand", "Quantum Intelligence Lab"],
    "partners": ["https://link-to-logo3.png", "https://link-to-logo4.png"]
  },
  {
    "id": 3,
    "category": "CLEAN ENERGY",
    "title": "ความร่วมมือเชิงกลยุทธ์ด้านพลังงานสะอาดกับกลุ่มประเทศนอร์ดิก",
    "description": "วิจัยและถ่ายทอดเทคโนโลยีระบบกักเก็บพลังงานประสิทธิภาพสูงเพื่อมุ่งสู่ Net Zero...",
    "status": "GLOBAL PARTNER",
    "period": "2024-2028",
    "participants": [
      { "name": "Erik Nordmann", "role": "Energy Consultant", "image": "https://i.pravatar.cc/150?u=5" },
      { "name": "คุณวิชัย กุลธร", "role": "Policy Analyst", "image": "https://i.pravatar.cc/150?u=6" }
    ],
    "members": ["Nordic Energy Research", "EGAT", "Innovation Norway"],
    "partners": ["https://link-to-logo5.png", "https://link-to-logo6.png"]
  },
  {
    "id": 4,
    "category": "SMART AGRICULTURE",
    "title": "การพัฒนาเกษตรแม่นยำด้วยเทคโนโลยี IoT ร่วมกับ Wageningen",
    "description": "โครงการแลกเปลี่ยนนักวิจัยเพื่อเพิ่มผลผลิตทางการเกษตรอย่างยั่งยืนในภูมิภาคอาเซียน",
    "status": "ACTIVE MOU",
    "period": "2025-2029",
    "participants": [
      { "name": "Dr. Maria Garcia", "role": "Agronomist", "image": "https://i.pravatar.cc/150?u=7" }
    ],
    "members": ["Wageningen University", "Kasetsart University"],
    "partners": ["https://link-to-logo7.png"]
  },
  {
    "id": 5,
    "category": "ROBOTICS",
    "title": "ศูนย์นวัตกรรมหุ่นยนต์ทางการแพทย์ร่วมกับสถาบันวิจัยเยอรมนี",
    "description": "พัฒนาแขนกลอัจฉริยะสำหรับการผ่าตัดทางไกลผ่านเครือข่าย 5G ประสิทธิภาพสูง",
    "status": "ACTIVE NETWORK",
    "period": "2024-2026",
    "participants": [
      { "name": "Hans Müller", "role": "Systems Architect", "image": "https://i.pravatar.cc/150?u=8" },
      { "name": "นพ. ธนาวินท์ สุขุม", "role": "Medical Advisor", "image": "https://i.pravatar.cc/150?u=9" }
    ],
    "members": ["Fraunhofer Institute", "Siriraj Hospital", "AIS 5G Lab"],
    "partners": ["https://link-to-logo8.png", "https://link-to-logo9.png"]
  },
  {
    "id": 6,
    "category": "BIOTECHNOLOGY",
    "title": "โครงการถอดรหัสพันธุกรรมพืชสมุนไพรหายากร่วมกับ NUS",
    "description": "ศึกษาคุณสมบัติทางยาของพืชท้องถิ่นเพื่อนำไปใช้ในอุตสาหกรรมยาและเวชสำอาง",
    "status": "RESEARCH GRANT",
    "period": "2023-2026",
    "participants": [
      { "name": "Dr. Li Wei", "role": "Geneticist", "image": "https://i.pravatar.cc/150?u=10" }
    ],
    "members": ["National University of Singapore", "CGI Biotech Center"],
    "partners": ["https://link-to-logo10.png"]
  },
  {
    "id": 7,
    "category": "SPACE TECH",
    "title": "เครือข่ายสังเกตการณ์วัตถุใกล้โลกและเทคโนโลยีดาวเทียมขนาดเล็ก",
    "description": "ความร่วมมือกับ NASA ในการแบ่งปันข้อมูลและวิจัยวัสดุศาสตร์สำหรับชิ้นส่วนอวกาศ",
    "status": "GLOBAL PARTNER",
    "period": "2025-2030",
    "participants": [
      { "name": "James Sterling", "role": "Mission Manager", "image": "https://i.pravatar.cc/150?u=11" },
      { "name": "ดร. อรอนงค์ รัศมี", "role": "Satellite Engineer", "image": "https://i.pravatar.cc/150?u=12" }
    ],
    "members": ["NASA Ames Research Center", "GISTDA Thailand"],
    "partners": ["https://link-to-logo11.png", "https://link-to-logo12.png"]
  },
  {
    "id": 8,
    "category": "FINTECH",
    "title": "ระบบบริหารจัดการสินทรัพย์ดิจิทัลและ Blockchain สำหรับภาครัฐ",
    "description": "วิจัยระบบจัดซื้อจัดจ้างที่โปร่งใสด้วยเทคโนโลยีบัญชีแยกประเภทแบบกระจายศูนย์",
    "status": "ACTIVE MOU",
    "period": "2024-2025",
    "participants": [
      { "name": "คุณปรีชา จิตมั่น", "role": "Blockchain Developer", "image": "https://i.pravatar.cc/150?u=13" }
    ],
    "members": ["Comptroller General's Department", "ETDA"],
    "partners": ["https://link-to-logo13.png"]
  },
  {
    "id": 9,
    "category": "ENVIRONMENT",
    "title": "การจัดการขยะพลาสติกในมหาสมุทรและเศรษฐกิจหมุนเวียน",
    "description": "โครงการร่วมกับมหาวิทยาลัยแห่งออสเตรเลียเพื่อสร้างแบบจำลองการไหลเวียนของขยะ",
    "status": "ACTIVE NETWORK",
    "period": "2024-2027",
    "participants": [
      { "name": "Dr. Chloe Smith", "role": "Marine Biologist", "image": "https://i.pravatar.cc/150?u=14" },
      { "name": "อ. สมฤดี วงศ์สวัสดิ์", "role": "Environmental Expert", "image": "https://i.pravatar.cc/150?u=15" }
    ],
    "members": ["University of Queensland", "Marine Dept. Thailand"],
    "partners": ["https://link-to-logo14.png", "https://link-to-logo15.png"]
  },
  {
    "id": 10,
    "category": "SOCIAL INNOVATION",
    "title": "โครงการพัฒนาเมืองอัจฉริยะเพื่อสังคมผู้สูงวัยร่วมกับมหาวิทยาลัยโซล",
    "description": "การออกแบบสถาปัตยกรรมและสิ่งอำนวยความสะดวกที่เชื่อมต่อด้วย AI เพื่อคุณภาพชีวิต",
    "status": "ACTIVE MOU",
    "period": "2025-2028",
    "participants": [
      { "name": "Park Ji-Sung", "role": "Smart City Architect", "image": "https://i.pravatar.cc/150?u=16" }
    ],
    "members": ["University of Seoul", "Department of Older Persons"],
    "partners": ["https://link-to-logo16.png"]
  }
]);
const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

const sumTotal = ref<any[]>([
  {
    "id": 1,
    "label": "TOTAL MOUS",
    "value": 1248,
    "unit": "",
    "trend": "+12%",
    "description": "ข้อตกลงความร่วมมือทั้งหมด",
    "color": "#1E3A8A",
    "icon": "pi pi-file-pdf"
  },
  {
    "id": 2,
    "label": "ACTIVE RESEARCHERS",
    "value": 4892,
    "unit": "",
    "trend": "+5.4%",
    "description": "นักวิจัยที่กำลังดำเนินการ",
    "color": "#0369A1",
    "icon": "pi pi-users"
  },
  {
    "id": 3,
    "label": "GLOBAL PARTNERS",
    "value": 315,
    "unit": "32 Countries",
    "trend": null,
    "description": "พันธมิตรระดับนานาชาติ",
    "color": "#F97316",
    "icon": "pi pi-globe"
  },
  {
    "id": 4,
    "label": "ACTIVE NETWORKS",
    "value": 86,
    "unit": "Nodes",
    "trend": null,
    "description": "เครือข่ายวิจัยที่เชื่อมโยงอยู่",
    "color": "#1E40AF",
    "icon": "pi pi-sitemap"
  }
])
</script>

<style scoped>
.text-clamp-2 {
  overflow: hidden;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.bg-custom{
    height: fit-content;
    position: relative;
    overflow: hidden;
    background: none;
}
.bg-custom::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 85%;
    background: linear-gradient(300deg,#ffb870,#ff8c1a,#b35900);
    background-size: 180% 180%;
    animation: gradient-animation 18s ease infinite;
}
</style>