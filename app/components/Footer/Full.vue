<template>
  <div>
    <div class="flex flex-col bg-primary-300 text-primary-800 gap-4 py-6">
      <div class="flex justify-between items-center w-full max-w-300 mx-auto ">
        <div class="grid grid-cols-4 gap-8 px-5 pb-3">
            <div class="flex flex-col gap-6">
                <div class="text-xl text-white font-bold">
                    RLS
                </div>
                <div class="text-sm">
                    Research Intelligence System<br />
                    ระบบจัดการฐานข้อมูลและเครือข่ายวิจัยเชิงรุก เพื่อขับเคลื่อนนวัตกรรมสู่ระดับสากล
                </div>
            </div>
            <div class="flex flex-col gap-5">
              <div class="font-bold">
                  MENU
              </div>
              <div class="flex flex-col text-sm text-primary-700 gap-2">
                <div>
                  แดชบอร์ดหลัก
                </div>
                <div>
                  ค้นหาพันธมิตร
                </div>
                <div>
                  คลังข้อมูลความร่วมมือ
                </div>
                <div>
                  รายงานข้อมูล
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <div class="font-bold">
                INSTITUTIONAL LINKS
              </div>
              <div class="flex flex-col text-sm text-primary-700 gap-2">
                <div>
                  ผ่ายวิเทศสัมพันธ์
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <div class="font-bold">
                  CONTACT
              </div>
              <div class="flex flex-col text-sm text-primary-700 gap-2">
                <div>
                  คณะสังคมศาสตร์ มหาวิทยาลัยเชียงใหม่ 239 ถ.ห้วยแก้ว ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200
                </div>
                <div>
                  <div>
                    โทร: +66 5394 3511
                  </div>
                  <div>
                    อีเมล: soc.info@cmu.ac.th
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <Divider class="border border-primary-700" />
      <div class="flex justify-center items-center">
        <div>
          Copyright ©{{ new Date().getFullYear() }} Research Intelligence System. All rights reserved.
        </div>
        <!-- <div class="flex items-center text-2xl gap-4">
          <Icon name="tabler:world" />
          <Icon name="material-symbols:info-rounded" />
          <Icon name="material-symbols:help-rounded" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>
