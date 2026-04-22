<template>
  <div>
      <div class="flex justify-between items-center my-3">
        <div class="flex flex-col">
          <div class="text-[40px] font-bold text-primary-800">
            ทำเนียบนักวิจัย
          </div>
          <div class="text-sm font-medium">
            ศูนย์รวมข้อมูลบุคลากรวิจัยที่มีความเชี่ยงชาญระดับสูง เพื่อการขับเคลื่อนนวัตกรรมและความร่วมมือทางวิชาการในระดับสากล
          </div>
        </div>
      </div>
      <DataView :value="dataTable" layout="grid" paginator :rows="9">
        <template #grid="{items}">
          <div class="grid grid-cols-12 gap-4">
            <div v-for="(item, index) in items" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2">
              <div class="p-6 border border-surface-200 bg-surface-0 rounded-3xl flex flex-col justify-between gap-4 h-full">
                <div class="flex items-start gap-3">
                  <span class="bg-primary p-2 rounded-2xl">
                    <img
                        :src="`${item.image_url}`"
                        class="profile-image border-circle"
                        alt="profile-image"
                        width="50px"
                      />
                  </span>
                  <div class="flex flex-col text-sm md:text-base ">
                    <div class="text-md md:text-lg font-bold text-primary">
                      {{ item.name }}
                    </div>
                    <div class="text-gray-400 text-base">
                      {{ item.faculty }}
                    </div>
                    <div>
                      {{ item.department }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                  <Tag v-for="data in item.tags" :value="data" style="font-size: 12px;" ></Tag>
                </div>
                <div class="flex justify-between items-center">
                  <div class="italic text-xs text-gray-400">
                    {{ item.highlight }}
                  </div>
                  <Button variant="link" size="small">
                    ดูข้อมูลเพิ่มเติม
                    <Icon name="material-symbols:chevron-right-rounded" class="text-2xl"/>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>    
      </DataView>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
const breadcrumbItems = ref<any[]>([
  {
    name: 'ฐานข้อมูล',
    href: '/admin/settings',
  }, {
    name: 'บันทึกข้อตกลง (MOU)',
    href: '/admin/databank',
  }
]);
const dataTable = computed(() => 
[
  { "id": 1, "name": "รศ.ดร. นลินี รัตนประเสริฐ", "faculty": "FACULTY OF SCIENCE", "department": "ภาควิชาชีวเคมีและจุลชีววิทยา", "h_index": 42, "tags": ["GENOMICS", "BIO-INFORMATICS", "MOLECULAR"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Nalinee", "highlight": "ผู้เชี่ยวชาญระดับ 12+" },
  { "id": 2, "name": "ศ.ดร. ธนวัฒน์ ยิ่งรุ่งเรือง", "faculty": "ENGINEERING", "department": "วิศวกรรมคอมพิวเตอร์และ AI", "h_index": 38, "tags": ["MACHINE LEARNING", "DATA ARCHITECTURE", "NLP"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Thanawat", "highlight": "ผลงานตีพิมพ์ 142 รายการ" },
  { "id": 3, "name": "ดร. พรมิมล อารีจิตสัมพันธ์", "faculty": "SOCIAL SCIENCES", "department": "เศรษฐศาสตร์และการพัฒนาสังคม", "h_index": 29, "tags": ["SUSTAINABILITY", "URBAN PLANNING", "ECONOMETRICS"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Pornmimon", "highlight": "ผู้เชี่ยวชาญที่ปรึกษาองค์กร" },
  { "id": 4, "name": "ศ.ดร. มานพ เทวาสถิต", "faculty": "MEDICINE", "department": "อายุรศาสตร์และระบาดวิทยา", "h_index": 51, "tags": ["VIROLOGY", "PUBLIC HEALTH", "IMMUNOLOGY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Manop", "highlight": "ได้รับรางวัลนักวิจัยดีเด่น 2023" },
  { "id": 5, "name": "รศ.ดร. สิรินธร พงษ์ไพศาล", "faculty": "ARTS & HUMANITIES", "department": "ภาษาศาสตร์และวรรณคดีเปรียบเทียบ", "h_index": 31, "tags": ["LINGUISTICS", "CULTURAL STUDIES", "HERITAGE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sirintorn", "highlight": "หัวหน้าภาควิชา" },
  { "id": 6, "name": "ศ.ดร. อภิชาติ วรจักร", "faculty": "ENVIRONMENT", "department": "เทคโนโลยีพลังงานสะอาด", "h_index": 45, "tags": ["SOLAR CELL", "RENEWABLE", "HYDROGEN"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Apichat", "highlight": "ผู้อำนวยการศูนย์วิจัยพลังงาน" },
  { "id": 7, "name": "ดร. อลิสา มั่นคงดี", "faculty": "BUSINESS", "department": "การจัดการนวัตกรรมดิจิทัล", "h_index": 18, "tags": ["E-COMMERCE", "BLOCKCHAIN", "FINTECH"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alisa", "highlight": "ผลงานจดสิทธิบัตร 3 รายการ" },
  { "id": 8, "name": "รศ.ดร. กิตติพงษ์ แก้วเรือง", "faculty": "AGRICULTURE", "department": "เทคโนโลยีการเกษตรแม่นยำ", "h_index": 34, "tags": ["SMART FARMING", "DRONE TECH", "IRRIGATION"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kittipong", "highlight": "ความร่วมมือกับภาคอุตสาหกรรม" },
  { "id": 9, "name": "ผศ.ดร. ณัฐริกา ทรงธรรม", "faculty": "ARCHITECTURE", "department": "การออกแบบผังเมือง", "h_index": 15, "tags": ["SMART CITY", "LANDSCAPE", "DESIGN"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Nutthrika", "highlight": "ที่ปรึกษาโครงการรัฐบาล" },
  { "id": 10, "name": "ศ.ดร. วิจิตร อนันตชัย", "faculty": "LAW", "department": "กฎหมายมหาชนและนโยบาย", "h_index": 22, "tags": ["CONSTITUTIONAL", "POLICY", "ETHICS"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Wichit", "highlight": "ผู้พิพากษาสมทบ" },
  { "id": 11, "name": "ดร. สรัญ วงศ์ทิพย์", "faculty": "NURSING", "department": "การพยาบาลผู้สูงอายุ", "h_index": 12, "tags": ["GERIATRIC CARE", "TELEHEALTH", "REHAB"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Saran", "highlight": "นวัตกรรมดูแลผู้ป่วยติดเตียง" },
  { "id": 12, "name": "รศ.ดร. ภาสกร เมืองทอง", "faculty": "POLITICAL SCIENCE", "department": "ความสัมพันธ์ระหว่างประเทศ", "h_index": 27, "tags": ["GEOPOLITICS", "ASEAN", "SECURITY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Pasakorn", "highlight": "ผู้วิเคราะห์นโยบายความร่วมมือ" },
  { "id": 13, "name": "ผศ.ดร. เบญจมาศ เลิศล้ำ", "faculty": "EDUCATION", "department": "เทคโนโลยีการศึกษา", "h_index": 19, "tags": ["E-LEARNING", "GAMIFICATION", "EDTECH"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamas", "highlight": "ผู้พัฒนาสื่อการสอน AR/VR" },
  { "id": 14, "name": "ศ.ดร. เกียรติศักดิ์ อมรพรต", "faculty": "ENGINEERING", "department": "วิศวกรรมโยธาและโครงสร้าง", "h_index": 48, "tags": ["STRUCTURAL", "MATERIALS", "EARTHQUAKE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiattisak", "highlight": "ผลงานวิจัยโครงสร้างสะพานแขวน" },
  { "id": 15, "name": "ดร. จารุวรรณ สินทวี", "faculty": "PHARMACY", "department": "เภสัชกรรมอุตสาหกรรม", "h_index": 24, "tags": ["DRUG DELIVERY", "NANOTECH", "PHARMA"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaruwan", "highlight": "หัวหน้าแล็บวิจัยนาโนยา" },
  { "id": 16, "name": "รศ.ดร. ธราธร สุขวิไล", "faculty": "SCIENCE", "department": "เคมีวิเคราะห์และสิ่งแวดล้อม", "h_index": 33, "tags": ["WATER QUALITY", "POLLUTION", "CHEMISTRY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tharathorn", "highlight": "ที่ปรึกษาด้านมลพิษทางน้ำ" },
  { "id": 17, "name": "ผศ.ดร. มนตรี ปัญญาสาร", "faculty": "VETERINARY", "department": "สัตวแพทย์สาธารณสุข", "h_index": 21, "tags": ["ZOONOSIS", "EPIDEMIOLOGY", "ANIMAL"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Montree", "highlight": "วิจัยโรคระบาดในสัตว์" },
  { "id": 18, "name": "ศ.ดร. นิตยา พิพัฒน์", "faculty": "ECONOMICS", "department": "เศรษฐศาสตร์มหภาค", "h_index": 39, "tags": ["MACROECONOMICS", "MONETARY", "TRADE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Nittaya", "highlight": "อดีตคณะกรรมการธนาคารแห่งชาติ" },
  { "id": 19, "name": "ดร. อานนท์ ทวีศิลป์", "faculty": "FINE ARTS", "department": "ทัศนศิลป์และสื่อสร้างสรรค์", "h_index": 8, "tags": ["DIGITAL ART", "NFT", "CREATIVE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arnon", "highlight": "ศิลปินร่วมสมัยระดับอาเซียน" },
  { "id": 20, "name": "รศ.ดร. รุ่งนภา ทองดี", "faculty": "SOCIAL SCIENCES", "department": "มานุษยวิทยาและการพัฒนา", "h_index": 26, "tags": ["ANTHROPOLOGY", "ETHNICITY", "COMMUNITY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rungnapha", "highlight": "ผู้เชี่ยวชาญกลุ่มชาติพันธุ์" },
  { "id": 21, "name": "ผศ.ดร. เอกชัย สันติสุข", "faculty": "ENGINEERING", "department": "วิศวกรรมไฟฟ้าอัจฉริยะ", "h_index": 30, "tags": ["SMART GRID", "AUTOMATION", "IOT"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ekachai", "highlight": "ผลงานสิทธิบัตรระบบ Smart Home" },
  { "id": 22, "name": "ศ.ดร. วิลาสินี รัตนโชติ", "faculty": "MEDICINE", "department": "รังสีวิทยาและมะเร็งวิทยา", "h_index": 55, "tags": ["ONCOLOGY", "RADIOLOGY", "GENE THERAPY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Wilasinee", "highlight": "รางวัลนักวิทยาศาสตร์ดีเด่น" },
  { "id": 23, "name": "ดร. วีระศักดิ์ ใจกว้าง", "faculty": "PHYSICAL EDUCATION", "department": "วิทยาศาสตร์การกีฬา", "h_index": 14, "tags": ["BIOMECHANICS", "NUTRITION", "PHYSIOLOGY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Weerasak", "highlight": "โค้ชและนักวิจัยสมรรถภาพ" },
  { "id": 24, "name": "รศ.ดร. สุภาวดี มหานคร", "faculty": "DENTISTRY", "department": "ทันตกรรมประดิษฐ์", "h_index": 23, "tags": ["DENTAL IMPLANT", "BIOMATERIALS", "ORAL"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Supawadee", "highlight": "วิจัยฟันเทียมระบบดิจิทัล" },
  { "id": 25, "name": "ผศ.ดร. ธีรภัทร์ รัตนวารี", "faculty": "SCIENCE", "department": "ฟิสิกส์พลังงานสูง", "h_index": 36, "tags": ["QUANTUM", "PARTICLE", "SPACE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Teerapat", "highlight": "ร่วมวิจัยกับโครงการ CERN" },
  { "id": 26, "name": "ศ.ดร. พรเทพ มณีสร", "faculty": "AGRICULTURE", "department": "พฤกษศาสตร์ป่าไม้", "h_index": 41, "tags": ["FORESTRY", "BIODIVERSITY", "PLANT"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Pornthep", "highlight": "ค้นพบพืชชนิดใหม่ของโลก" },
  { "id": 27, "name": "ดร. กมลวรรณ ประสิทธิโชค", "faculty": "MASS COMM", "department": "วารสารศาสตร์ดิจิทัล", "h_index": 10, "tags": ["SOCIAL MEDIA", "JOURNALISM", "FAKE NEWS"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamonwan", "highlight": "ผู้เชี่ยวชาญวิเคราะห์สื่อสังคม" },
  { "id": 28, "name": "รศ.ดร. สมชาย รักไทย", "faculty": "HUMANITIES", "department": "ประวัติศาสตร์เอเชียตะวันออกเฉียงใต้", "h_index": 28, "tags": ["HISTORY", "ARCHAEOLOGY", "MUSEOLOGY"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai", "highlight": "ภัณฑารักษ์กิตติมศักดิ์" },
  { "id": 29, "name": "ผศ.ดร. จิรายุ เลิศวิริยะ", "faculty": "INFORMATION TECH", "department": "วิทยาการข้อมูล", "h_index": 25, "tags": ["DATA SCIENCE", "BIG DATA", "PREDICTIVE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jirayu", "highlight": "หัวหน้าทีมวิเคราะห์ข้อมูลเมือง" },
  { "id": 30, "name": "ศ.ดร. สดใส รุ่งเรือง", "faculty": "PSYCHOLOGY", "department": "จิตวิทยาคลินิก", "h_index": 32, "tags": ["MENTAL HEALTH", "THERAPY", "COGNITIVE"], "image_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sodsai", "highlight": "ที่ปรึกษาสุขภาพจิตพนักงาน" }
]);
</script>

<style>

</style>