<template>
  <div>
    <div class="flex flex-wrap gap-3 items-end p-4 rounded-t-xl border border-slate-100" style="background: var(--color-card);">
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">ค้นหา</label>
        <InputText v-model="filterCond.keywords" type="text" placeholder="ค้นหาโครงการ สถาบัน PI..." class="w-92" size="small"  />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">Theme</label>
        <Select v-model="filterCond.theme" :options="opts.themes" optionLabel="label" optionValue="value" placeholder="เลือก Theme" class="w-48" size="small" />
      </div>
      
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">สถานะ</label>
        <Select v-model="filterCond.status" :options="opts.status" optionLabel="label" optionValue="value" placeholder="เลือกสถานะ" class="w-40" size="small" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">ประเภท</label>
        <Select v-model="filterCond.type" :options="opts.type" optionLabel="label" optionValue="value" placeholder="เลือกประเภท" class="w-40" size="small" />
      </div>

      <div class="flex gap-2 ml-auto">
        <Button size="small" class="mb-0.5" @click="onAdd">
          <Icon name="material-symbols:add-rounded" />
          เพิ่มโครงการ
        </Button>
        <Button variant="outlined" severity="secondary" size="small" class="mb-0.5">
          📤 Bulk Upload
        </Button>
      </div>
    </div>

    <TableData :data-table="dataTable" :is-header="false" :search="filterCond.keywords" :is-selection-mode="'single'"
      data-key="id"
      :tab-option="{ class:'baseTable-customers baseTable-header-none baseTable-border-none' }"
      @row-select="onSelected">
      <Column field="name" header="โครงการ" headerStyle="font-size: 14px;" body-class="font-semibold" />
      <Column field="inst" header="สถานบัน" headerStyle="font-size: 14px;"/>
      <Column field="theme" header="Theme" header-class="uppercase" headerStyle="font-size: 14px;">
        <template #body="{ data }">
          <span class="tag text-[14px]" :style="{ color: TC(data.theme), background: `${TC(data.theme)}12`}">
            {{ TI(data.theme) }}
            {{ data.theme }}
          </span>
        </template>
      </Column>
      <Column field="type" header="ประเภท" headerStyle="font-size: 14px;">
        <template #body="{ data }">
          <span class="tag text-[14px]" :style="{ color: 'var(--color-t2)', background: `var(--color-b0)`}">
            {{ data.type }}
          </span>
        </template>
      </Column>
      <Column field="status" header="สถานะ" headerStyle="font-size: 14px;">
        <template #body="{ data }">
          <span class="tag text-[14px]"
            :class="{
              'badge-a':  data.status === 'active',
              'badge-p':  data.status === 'planning',
              'badge-d':  data.status === 'done',
              'badge-h':  data.status === 'paused',
            }">
            {{ data.status }}
          </span>
        </template>
      </Column>
      
      <Column field="year" header="ปี" headerStyle="font-size: 14px;"/>
      <Column field="budget" header="งบ (M$):" headerStyle="font-size: 14px;" body-class="text-center mono" body-style="color: var(--am)" sortable />
      <Column field="pi_name" header="PI" headerStyle="font-size: 14px;"/>
      <Column field="mou" header="MOU" headerStyle="font-size: 14px;"/>
      <Column header="จัดการ">
        <template #body="{ data }">
          <Button severity="danger" variant="text" size="small">
            <Icon name="material-symbols:delete-outline-rounded" />
          </Button>
        </template>
      </Column>
    </TableData>
    <Modal 
      name="ModalFormProject" 
      ref="ModalFormProjectRef" 
      class-name="modalForms" 
      :width-display="'500px'" >
      <template #header>
        <div class="flex flex-col w-fit">
            <h6 class="text-lg font-bold dm-0">เพิ่มโครงการวิจัยใหม่</h6>
            <span class="text-sm">กรอกข้อมูลให้ครบถ้วน</span>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-3 pt-4">
        <div class="col-span-2">
          <label for="">สถาบันหลัก</label>
          <InputText v-model="formObj.name" placeholder="ระบุชื่อโครงการ..." size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">ชื่อโครงการ</label>
          <InputText v-model="formObj.inst" placeholder="สถาบัน..." size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">PI (Researcher ID)</label>
          <Select v-model="formObj.pi" :options="RESEARCHERS || []" optionLabel="name" optionValue="id" placeholder="เลือก PI" size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">Theme</label>
          <Select v-model="formObj.theme" :options="THEMES ? Object.keys(THEMES) : []" placeholder="เลือก Theme" size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">ประเภท</label>
          <Select v-model="formObj.type" :options="opts.type" optionLabel="label" optionValue="value" placeholder="เลือกประเภท" size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">สถานะ</label>
          <Select v-model="formObj.status" :options="['active', 'planning', 'done', 'paused']" placeholder="เลือกสถานะ" size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">ปี</label>
          <InputText v-model="formObj.year" placeholder="ปี..." size="small" fluid />
        </div>
        <div class="field mb-0">
          <label for="">งบประมาณ (ล้าน ฿)</label>
          <InputText v-model="formObj.budget" placeholder="0.00" size="small" fluid />
        </div>
        <div class="col-span-2">
          <label for="">MOU ที่เชื่อมโยง</label>
          <Select v-model="formObj.mou_id" :options="opts.mous" optionLabel="name" optionValue="id" placeholder="เลือก MOU" size="small" fluid />
        </div>
        <div class="col-span-2">
          <label for="">รายละเอียดโครงการ</label>
          <Textarea v-model="formObj.desc" rows="2" placeholder="รายละเอียดโดยย่อ..." fluid />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-center items-center mt-3 gap-2 w-full">
          <Button outlined severity="secondary" variant="outlined" class="w-32" @click.once="modal.close()" >
            <Icon name="material-symbols:close-rounded" />
            ยกเลิก
          </Button>
          <Button autofocus>
            <Icon name="mdi:content-save-check" />
            บันทึกข้อมูล
          </Button>
        </div>
      </template>
    </Modal>
    <Drawer v-model:visible="visibleRight" position="right" style="width: 370px">
      <template #header>
        <div v-if="selectedItem" class="flex flex-col">
          <div class="text-base font-bold">
            {{ selectedItem.name }}
          </div>
          <div class="text-[11px]">
            Quantum · {{ selectedItem.year }}
          </div>
        </div>
      </template>
      <div v-if="selectedItem" class="space-y-4">
        <div class="flex flex-col gap-3">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Project Info
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)" >สถาบัน</div>
              <div class="font-bold">
                {{ selectedItem.inst }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">PI</div>
              <div class="font-bold">
                {{ selectedItem.pi }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">Theme</div>
              <div>
                <span class="tag text-xs" :style="{ color: TC(selectedItem.theme), background: `${TC(selectedItem.theme)}12`}">
                  {{ TI(selectedItem.theme) }}
                  {{ selectedItem.theme }}
                </span>
              </div>            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">ประเภท</div>
              <div class="font-bold">
                {{ selectedItem.type }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">สถานะ</div>
              <div>
                <span class="tag text-xs"
                  :class="{
                    'badge-a':  selectedItem.status === 'active',
                    'badge-p':  selectedItem.status === 'planning',
                    'badge-d':  selectedItem.status === 'done',
                    'badge-h':  selectedItem.status === 'paused',
                  }">
                  {{ selectedItem.status }}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">งบประมาณ</div>
              <div class="font-bold mono" style="color: var(--am)">
                {{ selectedItem.budget }}M ฿
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">MOU</div>
              <div class="font-bold">
                {{ selectedItem.mou }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Description
          </div>
          <p style="font-size:12px;color:var(--color-t2);line-height:1.7">
            {{ selectedItem?.desc ?? '' }}
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Historical Records {{ selectedItem?.hist?.length ? `(${selectedItem.hist.length})` : '' }}
          </div>
          <div class="flex flex-col">
            <div v-for="item in (selectedItem?.hist || [])" :key="item.id"  style="background:var(--color-bg2); border-radius:var(--r6); padding:8px; margin-bottom:5px; font-size:11px">
              <div style="color:var(--color-t0);font-weight:600">{{ item?.output ?? '' }}</div>
              <div style="color:var(--color-t3)">
                {{ item?.role ?? '' }} · Citations: {{ item?.citation_gain ?? '0'  }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Actions
          </div>
          <div class="flex gap-2">
            <Button severity="warn" size="small">
              <Icon name="material-symbols:edit-outline-rounded" />
              แก้ไขข้อมูล
            </Button>
            <Button severity="danger" size="small">
              <Icon name="material-symbols:delete-outline-rounded" />
              ลบข้อมูล
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { clone, filter } from 'lodash-es';
const modal = useModal();
const toast = useToast();
const filterCond = ref({
  keywords: '',
  theme: '',
  status: '',
  type: ''
});
const formObj = ref<any>({
  name: null,
  inst: null,
  pi: null,
  theme: null,
  type: null,
  status: null,
  year: null,
  budget: null,
  mou_id: null,
  desc: null,
})
const visibleRight = ref(false);
const selectedItem = ref<any>(null);

const dataTable = computed(() => {
  if (!PROJECTS) return [];
  const arr = PROJECTS.map(p => {
    const { flag, inst } = (MOUS || []).find(m => m.id === p.mou_id) ?? {};
    const mou_name = flag ? `${flag} ${inst}` : `${inst ?? '-'}`;
    const pi_name = (RESEARCHERS || []).find(r => r.id === p.pi)?.name ?? '-';
    return {
      ...p,
      mou: mou_name,
      pi_name
    }
  });
  const { theme, status, type } = filterCond.value;
  
  return arr.filter(item => {
    const matchTheme = !theme || item.theme === theme;
    const matchStatus = !status || item.status === status;
    const matchType = !type || item.type === type;
    return matchTheme && matchStatus && matchType;
  });
});

const opts = computed(() =>{  
  const themelist = THEMES ? Object.keys(THEMES).map((k)=> ({ value: k, label: k })) : [];
  const mous = (MOUS || []).map(m => ({ value: m.id, label: `${m.flag||''} ${m.inst || ''} ${m.country ? `(${m.country})` :''}` }));
  const status = [
    { value: '', label: 'ทุกสถานะ'},
    { value: 'active', label: 'active' },
    { value: 'planning', label: 'planning' },
    { value: 'done', label: 'done' },
    { value: 'paused', label: 'paused' },
  ]
  const type = [
    { value: '', label: 'ทุกประเภท'},
    { value: 'นานาชาติ', label: 'นานาชาติ' },
    { value: 'ระดับชาติ', label: 'ระดับชาติ' },
    { value: 'อุตสาหกรรม', label: 'อุตสาหกรรม' }
  ]
  
  return {
    themes: [{ value: '', label: 'ทุก Theme'}].concat(themelist),
    status,
    type,
    mous: [{ value: '', label: 'ไม่มี MOU'}].concat(mous)
  }
})

const onSelected = (val:any) => {
  if(val?.id) {
    const pi= (RESEARCHERS || []).find(r => r.id === val.pi);
    const mou= (MOUS || []).find(m => m.id=== val.mou_id);
    const hist= (HISTORY || []).filter(h=> h.project_id=== val.id);
    selectedItem.value = {
      ...val,
      hist,
      mouData: mou,
      researchersPI: pi
    }
    visibleRight.value = true;
  }
}
const onAdd = () => {
  formObj.value = {
    name: null,
    inst: null,
    pi: null,
    theme: null,
    type: null,
    status: null,
    year: null,
    budget: null,
    mou_id: null,
    desc: null,
  }
  modal.open();
}
</script>

<style>

</style>