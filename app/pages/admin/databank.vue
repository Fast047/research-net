<template>
  <div>
    <AppBreadcrumb :breadcrumb-items="breadcrumbItems" />
    <div class="py-4">
      <div class="flex justify-between items-center my-3">
        <div class="flex flex-col">
          <div class="text-[40px] font-bold text-primary-800">
            จัดการข้อมูล MOU
          </div>
          <div class="text-sm font-medium">
            การบริหารจัดการและติดตามสถานะความร้วมมือทางวิชาการ
          </div>
        </div>
        <div class="flex gap-2">
          <Button severity="secondary" size="large">
            <Icon name="material-symbols:download-rounded" />ส่งออกข้อมูล
          </Button>
          <Button size="large">
            <Icon name="material-symbols:add-circle-rounded" /> เพิ่มข้อมูล
          </Button>
        </div>
      </div>
      <div class="card bg-white shadow-lg rounded-2xl flex flex-col gap-3 pb-2">
        <div class="flex justify-between items-center px-4 py-3">
          <div class="flex items-center gap-2">
            <Icon name="material-symbols:filter-list-rounded" class="text-2xl" />
            สถานะการตรวจสอบ
          </div>  
        </div>
        <TableData :data-table="dataTable" :is-header="false" 
          :tab-option="{ class:'baseTable-customers baseTable-header-none baseTable-border-none' }">
          <Column header="ชื่อโครงการ/องค์กรคู่สัญญา">
            <template #body="{data}">
              <div :class="{'opacity-70': data.status === 'EXPIRED'}">
                <div class="font-medium" :class="{'line-through': data?.status === 'EXPIRED'}">
                  {{ data.project_name }}
                </div>
                <div class="flex items-center gap-1 text-sm font-light text-gray-500">
                  <Icon name="material-symbols:domain" />
                  {{ data.partner_organization }}
                </div>
              </div>
            </template>
          </Column>
          <Column field="contract_number" header="เลขที่สัญญา">
            <template #body="{data}">
              <div :class="{'opacity-50': data.status === 'EXPIRED'}">
                {{ data.contract_number }}
              </div>
            </template>
          </Column>
          <Column header="วันที่เีริ่ม-สิ้นสุด">
            <template #body="{data}">
              <div>
                <div :class="{'text-gray-500': data.status === 'EXPIRED'}">
                  {{ data?.start_date ? formatDateShort(data.start_date) : ''}}
                </div>
                <div :class="{'text-gray-500': data.status !== 'EXPIRED'}">
                  {{ data?.end_date ? formatDateShort(data.end_date) : ''}}
                </div>
                <div v-if="data.status === 'EXPIRED'" class="text-xs">
                  (หมดอายุ)
                </div>
              </div>
            </template>  
          </Column>
          <Column header="สถานะ" header-class="text-center">
            <template #body="{data}">
              <div>
                <div
                  class="font-medium text-center rounded-2xl px-2 py-1"
                  :class="{
                    'bg-green-100 text-green-500 border-green-500 border': data.status === 'PUBLISHED',
                    'bg-yellow-100 text-yellow-500 border-yellow-500 border': data.status === 'DRAFT',
                    'bg-gray-100 text-gray-500 border-gray-500 border': !['PUBLISHED', 'DRAFT'].includes(data.status),
                  }">
                  {{ data.status }}
                </div>
              </div>
            </template>
          </Column>
          <Column header="จัดการ" />
        </TableData>
      </div>
      <!-- <div class="grid grid-cols-3 gap-4">
        <div class="card bg-white shadow-lg flex flex-col gap-4"></div>
        <div class="card bg-white shadow-lg flex flex-col gap-4"></div>
        <div class="card bg-white shadow-lg flex flex-col gap-4"></div>
      </div> -->
      <!-- <NuxtPage/> -->
    </div>
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
  { "id": 1, "project_name": "ความร่วมมือด้านนวัตกรรม AI เพื่อเกษตรกรรมยั่งยืน", "partner_organization": "มหาวิทยาลัยเทคโนโลยีแห่งรัฐบาล", "contract_number": "MOU-2024-00128", "start_date": "2024-01-01", "end_date": "2026-12-31", "status": "PUBLISHED", "fiscal_year": 2567 },
  { "id": 2, "project_name": "การวิจัยพัฒนาระบบคลังข้อมูลขนาดใหญ่ (Big Data)", "partner_organization": "บริษัท เทคโนแอนด์ จำกัด (มหาชน)", "contract_number": "Pending Assignment", "start_date": null, "end_date": null, "status": "DRAFT", "fiscal_year": 2567 },
  { "id": 3, "project_name": "โครงการแลกเปลี่ยนนักวิจัยไทย-ญี่ปุ่น ประจำปี 2565", "partner_organization": "Kyoto Global Research Institute", "contract_number": "MOU-2022-0450", "start_date": "2022-05-01", "end_date": "2024-04-30", "status": "EXPIRED", "fiscal_year": 2565 },
  { "id": 4, "project_name": "เครือข่ายความร่วมมือการจัดการลุ่มแม่น้ำโขง", "partner_organization": "สมาคมทรัพยากรน้ำนานาชาติ", "contract_number": "MOU-2023-09122", "start_date": "2023-06-15", "end_date": "2028-06-14", "status": "PUBLISHED", "fiscal_year": 2566 },
  { "id": 5, "project_name": "การพัฒนาบุคลากรด้าน Cybersecurity ระหว่างภูมิภาค", "partner_organization": "Cyber Security Agency (CSA)", "contract_number": "MOU-2024-00512", "start_date": "2024-03-20", "end_date": "2027-03-19", "status": "PUBLISHED", "fiscal_year": 2567 },
  { "id": 6, "project_name": "โครงการวิจัยร่วมด้านพลังงานสะอาดและโซลาร์เซลล์", "partner_organization": "กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน", "contract_number": "Pending Assignment", "start_date": null, "end_date": null, "status": "DRAFT", "fiscal_year": 2567 },
  { "id": 7, "project_name": "ความร่วมมือทางวิชาการเพื่อพัฒนาหลักสูตร Digital Marketing", "partner_organization": "มหาวิทยาลัยนวัตกรรมแห่งชาติ", "contract_number": "MOU-2021-00100", "start_date": "2021-01-10", "end_date": "2024-01-09", "status": "EXPIRED", "fiscal_year": 2564 },
  { "id": 8, "project_name": "โครงการสนับสนุนการเรียนรู้ภาษาที่สองสำหรับนักศึกษา", "partner_organization": "British Council (Thailand)", "contract_number": "MOU-2023-00881", "start_date": "2023-08-01", "end_date": "2025-07-31", "status": "PUBLISHED", "fiscal_year": 2566 },
  { "id": 9, "project_name": "ศูนย์วิจัยกัญชาเพื่อการแพทย์แผนไทย", "partner_organization": "โรงพยาบาลสมุนไพรเวชกรรม", "contract_number": "MOU-2024-11204", "start_date": "2024-02-15", "end_date": "2029-02-14", "status": "PUBLISHED", "fiscal_year": 2567 },
  { "id": 10, "project_name": "การพัฒนาระบบ Logistics อัจฉริยะในเขต EEC", "partner_organization": "บริษัท ขนส่งไทยไฮเทค จำกัด", "contract_number": "Pending Assignment", "start_date": null, "end_date": null, "status": "DRAFT", "fiscal_year": 2567 },
  { "id": 11, "project_name": "โครงการทุนการศึกษาเพื่อนักวิจัยหลังปริญญาเอก", "partner_organization": "Foundation of Global Education", "contract_number": "MOU-2022-07721", "start_date": "2022-10-01", "end_date": "2024-09-30", "status": "EXPIRED", "fiscal_year": 2565 },
  { "id": 12, "project_name": "ความร่วมมือด้านเทคโนโลยีอวกาศและดาวเทียมขนาดเล็ก", "partner_organization": "สถาบันวิจัยดาราศาสตร์แห่งชาติ", "contract_number": "MOU-2024-00993", "start_date": "2024-04-10", "end_date": "2027-04-09", "status": "PUBLISHED", "fiscal_year": 2567 },
  { "id": 13, "project_name": "การศึกษาผลกระทบของฝุ่น PM 2.5 ต่อสุขภาพชุมชน", "partner_organization": "กรมควบคุมมลพิษ", "contract_number": "MOU-2023-00125", "start_date": "2023-01-01", "end_date": "2025-12-31", "status": "PUBLISHED", "fiscal_year": 2566 },
  { "id": 14, "project_name": "โครงการส่งเสริมผู้ประกอบการ SMEs สู่ตลาดโลก", "partner_organization": "สภาหอการค้าแห่งประเทศไทย", "contract_number": "Pending Assignment", "start_date": null, "end_date": null, "status": "DRAFT", "fiscal_year": 2567 },
  { "id": 15, "project_name": "ความร่วมมือด้านวัฒนธรรมและภาษาเกาหลี", "partner_organization": "Seoul National University", "contract_number": "MOU-2020-00456", "start_date": "2020-05-20", "end_date": "2023-05-19", "status": "EXPIRED", "fiscal_year": 2563 },
  { "id": 16, "project_name": "การพัฒนาระบบจ่ายน้ำประปาอัจฉริยะ Smart Water", "partner_organization": "การประปาส่วนภูมิภาค", "contract_number": "MOU-2024-00670", "start_date": "2024-03-01", "end_date": "2026-02-28", "status": "PUBLISHED", "fiscal_year": 2567 },
  { "id": 17, "project_name": "ศูนย์บ่มเพาะนักสร้างสรรค์เกมรุ่นใหม่", "partner_organization": "บริษัท เกมมิ่งสตูดิโอ จำกัด", "contract_number": "MOU-2023-00998", "start_date": "2023-09-01", "end_date": "2025-08-31", "status": "PUBLISHED", "fiscal_year": 2566 },
  { "id": 18, "project_name": "โครงการความร่วมมือวิศวกรรมหุ่นยนต์เพื่ออุตสาหกรรม", "partner_organization": "มหาวิทยาลัยเทคโนโลยีนาโน", "contract_number": "Pending Assignment", "start_date": null, "end_date": null, "status": "DRAFT", "fiscal_year": 2567 },
  { "id": 19, "project_name": "การพัฒนาแอปพลิเคชันเพื่อการท่องเที่ยวชุมชน", "partner_organization": "การท่องเที่ยวแห่งประเทศไทย (ททท.)", "contract_number": "MOU-2021-00223", "start_date": "2021-06-01", "end_date": "2023-12-31", "status": "EXPIRED", "fiscal_year": 2564 },
  { "id": 20, "project_name": "ความร่วมมือด้านธนาคารหน่วยกิตระดับชาติ (Credit Bank)", "partner_organization": "กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม", "contract_number": "MOU-2024-00001", "start_date": "2024-01-01", "end_date": "2029-12-31", "status": "PUBLISHED", "fiscal_year": 2567 }
]);
</script>

<style>

</style>