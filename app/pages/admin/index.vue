<template>
  <div>
    <AppBreadcrumb :breadcrumb-items="breadcrumbItems" />
    <ThailandFlowMap />
    <div class="py-4">
      <div class="flex items-center justify-between my-3">
        <div class="flex flex-col">
          <div class="text-[40px] font-bold text-primary-800">
            Dashboard Administrator
          </div>
          <div class="text-sm font-medium">
            ภาพรวมและสถานะดำเนินงานของระบบวิจัย
          </div>
        </div>
        <div>
          <span>ล่าสุดอัพเดท</span>
          {{ formatDateTime(new Date(), true) }}
        </div>
      </div>
      <div class="p-4 bg-red-100 border-l-4 border-red-700 text-red-700">
        <div class="flex justify-between items-center ">
          <div class="flex items-center gap-2 ">
            <span 
              class="inline-flex items-center justify-center rounded-lg bg-red-200 "
              style="width:2.65rem;height:2.65rem;">
              <Icon name="material-symbols:warning-outline-rounded" class="text-2xl"/>
            </span>
            <div>
              <div class="font-medium">
                Urgent Attention Required
              </div>
              <div class="text-xs font-light">
                บันทึกความร่วมมือวิจัย (MOU) จำนวน 3 ฉบับ กำลังจะหมดอายุภายใน 30 วัน - 3 MOUs expiring within 30 day.
              </div>
            </div>
          </div>
          <div class="font-blod text-red-700">
            REVIEW NOW
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="relative col-span-2 p-4 rounded-3xl bg-white shadow-lg ">
        <div class=" absolute -bottom-6 -right-4 text-gray-200/60">
          <Icon name="material-symbols:history-edu-outline-rounded" class="text-[120px]"/>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex font-light text-gray-400 tracking-widest">
            TOTAL MANAGED ARCHIVES
          </div>
          <div class="font-bold text-[48px] text-green-900">
            {{ formatComma(1284) }}
          </div>
          <div class="text-xs text-green-800">
            +12% from last quarter
          </div>
        </div>
        <div class="flex mt-5 gap-3 text-xs">
          <Chip>
            INTERNATIONAL: 452
          </Chip>
          <Chip>
            DOMESTIC: 832
          </Chip>
        </div>
      </div>
      <div class="p-4 rounded-3xl bg-blue-50 shadow-lg">
        <div class="flex flex-col justify-between h-full">
          <div>
            <span 
              class="inline-flex items-center justify-center rounded-lg bg-white text-gray-600 shadow"
              style="width:2.65rem;height:2.65rem;">
              <Icon name="material-symbols:edit-note-rounded" class="text-2xl"/>
            </span>
            <div class="flex font-light text-gray-400 tracking-widest">
              DRAFTING
            </div>
            <div class="text-[36px] font-medium">
              24
            </div>
          </div>
          <div class="text-xs font-light">
            รอดำเนินการตรวจสอบ - Pending initial review
          </div>
        </div>
      </div>
      <div class="p-4 rounded-3xl bg-gray-200 shadow-lg ">
        <div class="flex flex-col justify-between  h-full">
          <div>
            <span 
              class="inline-flex items-center justify-center rounded-lg bg-white text-green-800 shadow"
              style="width:2.65rem;height:2.65rem;">
              <Icon name="material-symbols:policy-outline-rounded" class="text-2xl"/>
            </span>
            <div class="flex font-light text-gray-400 tracking-widest">
              UNDER REVIEW
            </div>
            <div class="text-[36px] font-medium">
              12
            </div>
          </div>  
          <div class="text-xs font-light">
            กำลังตรวจสอบทางกฏหมาย - Legal department vetting
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-flow-col grid-rows-3 gap-4 my-4">
      <div class="row-span-3 ...">
        <div class="card bg-white shadow-lg flex flex-col rounded-2xl p-0 pb-3 h-full">
          <div class="flex justify-between items-center px-4 py-3">
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:history-rounded" class="text-2xl"/>
              การอัปเดตล่าสุดในระบบ
            </div>
            <Button variant="link">
              ดูประวัติทั้งหมด
              <Icon name="material-symbols:chevron-right-rounded" class="text-2xl"/>
            </Button>
          </div>
          <TableData :data-table="dataTable" :is-header="false" 
            :tab-option="{ class:'baseTable-customers baseTable-header-none baseTable-border-none' }">
            <Column header="ประเภทรายการ"/>
            <Column header="โครงการ/หน่วยงาน"/>
            <Column header="ผู่ดำเนินการ"/>
            <Column header="สถานะ"/>
            <Column header="เวลา" />
          </TableData>
        </div>
      </div>
      <div class="col-span-2 row-span-2 ...">
        <div class="card relative bg-blue-900/80 text-white shadow-lg flex flex-col rounded-2xl p-0 pb-3 h-full">
          <div class="flex flex-col justify-between p-4 h-full">
            <div class="flex justify-end">
              <Button
                rounded 
                variant="text"
                severity="secondary">
                <Icon name="material-symbols:open-in-new-rounded" class="text-xl md:text-2xl" />
              </Button>
            </div>
            <div class="flex items-center justify-end h-fit opacity-20">
              <Icon name="gis:earth-network-o" class="text-[15rem] text-white" />
            </div>
          </div>
          <div class=" absolute bottom-4 left-4">
            <div class="font-medium text-md">
              สำรวจแผนที่เครือข่ายวิจัยแบบ Interactive
            </div>
            <div class="font-light text-sm">
              ดูความเชื่อมโยงระว่างสถาบันและโครงการวิจัย
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-2 ...">
        <div class="card bg-slate-200 shadow-lg flex flex-col rounded-2xl p-0 pb-3 h-full">
          <div class="flex flex-col p-4 gap-4">
            <div class="font-medium">
              ทางลัดการตั้งต่าระบบ
            </div>
            <div class="flex bg-white/80 items-center justify-center rounded-lg py-2 h-full gap-2">
              <Button variant="link">
                <Icon name="material-symbols:manage-accounts-rounded" />
                จัดการผู้ใช้งาน
              </Button>
              <Button variant="link">
                <Icon name="material-symbols:upload-rounded" />
                นำเข้าข้อมูล
              </Button>
            </div>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
  layout: 'sidebar-layout'
});
const breadcrumbItems = ref<any[]>([
  { name: 'หน้าหลัก',
    href: '/admin',
    icon: 'material-symbols:home-app-logo',
  }
]);
const dataTable = computed(() => {
  return [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ]
});
// material-symbols:tenancy
</script>

<style>

</style>