<template>
  <div :class="className">
    <DataTable v-if="!treeTable" v-model:selection="selectedData" v-model:expandedRows="expandedRows" v-model:filters="filters" :value="dataTable" :selection-mode="isSelectionMode" :metaKeySelection="metaKey" :data-key="dataKey" scrollable :paginator="isFooterTemp ? tableOption.paginator : false" :rows="row" :rowsPerPageOptions="tableOption.rowsPerPageOptions"
        :globalFilterFields="filterFields"
        :paginatorTemplate="isFooterTemp ? 'RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink' : isPaginator ? 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink' : ''"
        :currentPageReportTemplate="isFooterTemp ? 'แสดง {first} ถึง {last} จากทั้งหมด {totalRecords} รายการ' : '' "
        :loading="loading" 
        :showGridlines="showGridlines"
        :rowGroupMode="tabOption?.rowGroupMode" :groupRowsBy="tabOption?.groupRowsBy"
        :tableStyle="tableOption.tableStyle"
        :row-class="rowClass"
        :class="tableOption.class"
        :scrollHeight="tableOption.scrollable && tableOption.scrollHeight ? tableOption.scrollHeight : '100%'"
        @row-select-all="onRowSelectAll" @row-unselect-all="onRowUnselectAll"
        @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" >
        <template #header>
            <div v-if="isHeader === true" class="flex justify-content-between items-center">
                <div class="flex sm:w-full xl:w-12 justify-content-start">
                    <slot name="headerLeft"></slot>
                </div>
                <div v-if="isFilter === true" class="flex sm:flex-col xl:flex-row justify-content-start sm:items-start xl:items-center w-fit">
                  <div class="flex items-center gap-2" style="font-size: 1.25rem;">
                    <IconField>
                        <InputIcon>
                          <Icon name="material-symbols:search-rounded" />
                        </InputIcon>
                        <InputText
                          v-model="filters['global'].value"
                          type="text"
                          class="p-inputtext-sm"
                          placeholder="ระบุคำค้นหา..." 
                          fluid />
                      </IconField>
                    <!-- <Icon name="material-symbols:search-rounded" />
                    <span class="m-0 font-semibold">ค้นหา</span>
                    <InputText v-model="filters['global'].value" placeholder="ระบุคำค้นหา..." /> -->
                  </div>
                    <slot name="headerRight"></slot>
                </div>
            </div>
            <slot v-else name="header"></slot>
        </template>
        <slot/>
        <Column v-if="btnActions?.length > 0" header="ตั้งต่า" body-class="text-center" header-class="text-center"> 
          <template #body="{ data }">
             <div class="flex flex-wrap gap-2">
                <Button v-if="!btnOptions" v-for="item in btnActions" v-tooltip.top="{ value: labelBtn(item) }"  :severity="severityBtn(item)" raised class="rounded-full p-2" @click="eventBtn(item, data)">
                  <i class="material-icons-round">{{ ['detail' , 'view'].includes(item) ? 'description' :  item }}</i>
                </Button>
                <Button v-else-if="btnOptions?.showLabel" v-for="item in btnActions" severity="secondary" @click="eventBtn(item, data)">
                  <i class="material-icons-round text-sm mr-1">{{ ['detail' , 'view'].includes(item) ? 'description' : item }}</i>
                  <span class="text-sm">{{ labelBtn(item) }}</span>
                </Button>
             </div>
              
          </template>
      </Column>
      <template #groupheader="{data}">
        <slot name="groupheader" :data="data"  />
      </template>
      <template #groupfooter="{data}">
        <slot name="groupfooter" :data="data"  />
      </template>
      <template #expansion="{data}">
        <slot name="expansion" :data="data"  />
      </template>
        <template #empty>
          <div class="flex items-center justify-center text-400 gap-2 py-8 w-full h-full">
              <Icon name="material-symbols:search-off-rounded" style="font-size: 3rem;" />
              <span>
                ไม่พบข้อมูล. 
              </span>
            </div>
        </template>
        <template #loading>
            <div class="py-8 w-full h-full text-center">
                กำลังโหลดข้อมูล กรุณารอสักครู่...
            </div>
        </template>
    </DataTable>
    <TreeTable 
      v-if="treeTable" 
      v-model:selectionKeys="selectedData" 
      :expandedKeys="isExpanded ? tableOption.expandedKeys : expandedKeys" 
      :value="treeData"
      :filters="filtersTree"
      :filterMode="filterMode"
      :selection-mode="isSelectionMode" 
      :metaKeySelection="metaKey" 
      :data-key="dataKey"
      :paginator="isFooterTemp ? tableOption.paginator : false" 
      :rows="row" 
      :rowsPerPageOptions="tableOption.rowsPerPageOptions"
      :paginatorTemplate="isFooterTemp ? 'RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink' : isPaginator ? 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink' : ''"
      :currentPageReportTemplate="isFooterTemp ? 'แสดง {first} ถึง {last} จากทั้งหมด {totalRecords} รายการ' : '' "
      :loading="loading" 
      :tableStyle="tableOption.tableStyle"
      :class="tableOption.class"
      scrollable
      :scrollHeight="tableOption.scrollable && tableOption.scrollHeight ? tableOption.scrollHeight : '100%'"
      @node-expand="nodeExpand"
      >
      <template #header>
        <div v-if="isHeader === true" class="flex justify-content-between items-center">
            <div class="flex sm:w-full xl:w-12 justify-content-start">
                <slot name="headerLeft"></slot>
            </div>
            <div v-if="isFilter === true" class="flex sm:flex-col xl:flex-row justify-content-start sm:items-start xl:items-center w-fit">
              <div class="flex items-center gap-2" style="font-size: 1.25rem;">
                <IconField>
                  <InputIcon>
                    <Icon name="material-symbols:search-rounded" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    type="text"
                    class="p-inputtext-sm"
                    placeholder="ระบุคำค้นหา..." 
                    fluid />
                </IconField>
                <!-- <Icon name="material-symbols:search-rounded" />
                <span class="m-0 font-semibold">ค้นหา</span>
                <InputText v-model="filtersTree['global']" placeholder="ระบุคำค้นหา" /> -->
              </div>
                <slot name="headerRight"></slot>
            </div>
        </div>
        <slot v-else name="header"></slot>
    </template>
      <slot/>
      <template #empty>
        <div class="flex items-center justify-center text-400 gap-2 py-8 w-full h-full">
          <Icon name="material-symbols:search-off-rounded" class=" text-white" style="font-size: 3rem;" />
          <span>
            ไม่พบข้อมูล. 
          </span>
        </div>
      </template>
  </TreeTable>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { TreeNode } from 'primevue/treenode';
import { FilterMatchMode } from '@primevue/core/api';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    dataTable: {
        type: Array,
        default: () => []
    },
    dataKey: {
      type: String,
      default: 'index',
    },
    isHeader: {
      type: Boolean,
      default: true,
    },
    isFilter: {
      type: Boolean,
      default: true,
    },
    isFilterFrom: {
      type: Boolean,
      default: false,
    },
    isFooterTemp: {
      type: Boolean,
      default: true,
    },
    filterFields: {
      type: Array as PropType<(string | ((data: any) => string))[]>,
      default: null
    },
    metaKey : {
      type: Boolean,
      default: false,
    },
    paginator : {
      type: Boolean,
      default: true,
    },
    btnActions: {
      type: Array as PropType<(string)[]>,
      default: null,
    },
    btnOptions: {
      type: Object,
      default: null
    },
    row: {
      type: Number,
      default: 10
    },
    isPaginator: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: ''
    },
    isSelectionMode: {
      type: String as PropType<'single' | 'multiple'>,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tabOption: {
      type: Object,
      default: null
    },
    treeTable: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type:  Array as PropType<TreeNode[]>,
      default: () => []
    },
    filterMode: {
      type: String,
      default: 'strict'
    },
    expandedKeys: {
      type: Object,
      default: null
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    rowClass: {
      type: Function as PropType<(data: any) => string | object | undefined>,
      default: () => {}
    },
    showGridlines : {
      type: Boolean,
      default: false
    },
    rowGroupMode: {
      type: String,
      default: null,
      required: false
    },
    groupRowsBy: {
      type: String,
      default: null
    },
    search: {
      type: String,
      default: null
    },
    syncSeleted: {
      type: Array,
      default: () => []
    }
})

const nodeExpand = (event:any) => {
  console.log('event', event.key);
}
// interface filtersType {
//     global: {
//       value: string | null;
//       matchMode: string;
//     };
// }
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const filtersTree = ref<any>({
  global: null,
});

const expandedRows = ref({});
const selectedData = ref();

const tableOption = ref({
  selectionMode: 'single',
  selectedData: [] as any[],
  paginator: props.paginator,
  rowsPerPageOptions: [5, 10, 25, 50, 100],
  tableStyle: 'min-width: 30rem',
  filterMode: { label: 'Lenient', value: 'lenient' },
  expandedKeys: {} as any,
  scrollable:false, 
  scrollHeight: "270px",
  class: 'baseTable-customers',
  rowGroupMode: props?.rowGroupMode ?? null,
  groupRowsBy: props?.groupRowsBy ?? null,
})
const setTable = (option: Partial<typeof tableOption.value>)=>{
  const keys = Object.keys(tableOption.value) as Array<keyof typeof tableOption.value>;
  keys.forEach((key) => {
    if (key in option) {
      (tableOption.value[key] as any) = option[key]!;
    }
  })
}

const expandAll = () => {
    const arrData = props.treeData ?? [];
      
    if(!arrData.length) return;
    for (const node of arrData) {
        expandNode(node)
    }
    tableOption.value.expandedKeys = {
        ...tableOption.value.expandedKeys
    }   
}
const expandNode = (node: any) => {
    if(!node) return;

    if(node?.children?.length > 0) {
        tableOption.value.expandedKeys[node.key] = true;
        for (const child of node.children) {
            expandNode(child)
        }
    }
}

watch(() => props.isExpanded,
(newValue) => {
    if(newValue && props.treeData?.length > 0) expandAll();
}, { immediate: true });

watch(() => props.treeData,
(newValue) => {
    if(newValue?.length > 0 && props.isExpanded) expandAll();
}, { immediate: true });

watch(() => props.isSelectionMode,
(newValue) => {
    if(newValue) {
      tableOption.value.selectionMode = newValue;
    }
    
}, { immediate: true });

watch(() => props.tabOption,
(newValue) => {
  // console.log('watch', newValue);
    if(newValue) {
      setTable(newValue);      
    }
}, { immediate: true });

watch(() => props.syncSeleted,
(newValue) => {
    if(newValue?.length > 0) {
      selectedData.value = cloneDeep(newValue);    
    }
}, { immediate: !!props.syncSeleted });

watch(() => props.search, 
(val) => {
  if(val) {
    filters.value.global.value = val as any;
  } else {
    filters.value.global.value = '' as any;
  }
}, { immediate: !!props.search})
// watchEffect(()=>{
//   if(props.tabOption){
//     setTable(props.tabOption);
//   }
// })

const addEmit = props.btnActions ?? [];

const emit = defineEmits(["rowSelect", "rowSelectAll", "rowUnselect", "rowUnselectAll", "add", "edit", "delete", "detail", "view"]);

const onRowSelectAll = () =>{
  emit("rowSelectAll", selectedData.value);
}
const onRowSelect = () =>{
  emit("rowSelect", selectedData.value);
}
const onRowUnselectAll = () =>{
  emit("rowUnselectAll", []);
}
const onRowUnselect = () =>{
  emit("rowUnselect", selectedData.value);
}
const labelBtn = (val:any) =>{
  let label;
  switch (val) {
    case 'add':
      label = 'เพิ่มข้อมูล'
      break;
    case 'edit':
      label = 'แก้ไข'
      break;
    case 'delete':
      label = 'ลบทิ้ง'
      break;
    default:
      label = val;
      break;
    }
  return label
}
const severityBtn = (val:any) =>{
  return ['detail', 'view', 'add'].includes(val) ? '' :
         val === 'edit' ? 'warning' :
         val === 'delete' ? 'danger' : 'secondary'
}
const eventBtn = (target: any, data: any) =>{
  emit(target, data);
}
const setSelectData = (val:any[]) => {
  selectedData.value = cloneDeep(val);
}
defineExpose({
  setTable,
  setSelectData
})

</script>

<style lang="scss" scoped>
 :deep(.p-iconfield){
     .p-inputicon{
         margin-top: calc(-1 * (1.5rem / 2)) !important;
     }
     .p-inputtext:not(.p-password-input){
         &:not(:last-child) {
             padding-inline-end: calc((var(--p-form-field-padding-x) * 2) + 1.5rem) !important;
         }
         &:not(:first-child){
             padding-inline-start: calc((var(--p-form-field-padding-x) * 2) + 1.5rem) !important;
         }
     }
     .p-password{
         .p-inputtext.p-password-input{
             min-width: 100% !important;
             padding-inline-end: calc((var(--p-form-field-padding-x) * 2) + 1.5rem) !important;
         }
     }
 
  }
/*:deep(.p-datatable.baseTable-customers) {
  color: #6E6B7B;
  border: 1px solid #f3f2f7;
  border-bottom: 0;
  background-color: #fff;
}*/
.baseTable-border-none {
  :deep(.baseTable-customers) {
    .p-datatable-header {
      border-width: 0px !important;
    }
    .p-datatable-paginator-bottom {
      border-width: 0px !important;
    }
  }
}
// datatable
:deep(.p-datatable.baseTable-customers .p-datatable-header){
  background-color: var(--p-surface-card);
}
:deep(.p-datatable.baseTable-customers.baseTable-header-none .p-datatable-header){
  display: none;
}

:deep(.p-datatable.baseTable-customers .p-datatable-thead > tr > th) {
  font-size: 1rem;
  background-color: var(--p-surface-hover);
  @media screen and (max-width: 1380px) {
      font-size: .9rem;
  }
}
:deep(.p-datatable.baseTable-customers .p-datatable-tfoot > tr > td) {
  font-size: 1rem;
  background-color: var(--p-surface-hover);
  @media screen and (max-width: 1380px) {
      font-size: .9rem;
  }
}

:deep(.p-datatable.baseTable-customers  .p-datatable-tbody > tr[data-p-selected="true"] ) {
  background: #e6f4ff;
  color: #003a8c;
}
:deep(.p-datatable.baseTable-customers  .p-datatable-tbody > tr[data-p-selected="true"]:hover ) {
  background: #d0e8ff;
}
:deep(.p-datatable.baseTable-customers  .p-datatable-tbody > tr >td) {
  font-size: .9rem;
  @media screen and (max-width: 1380px) {
      font-size: .825rem;
  }
}
:deep(.p-datatable.baseTable-customers .p-datatable-thead > tr > th.text-center .p-datatable-column-header-content) {
  justify-content: center;
}
:deep(.p-datatable.baseTable-customers) .p-paginator {
  padding: 0.75rem;
  /*display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border-top: 0 !important;
  border-bottom: 0;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;*/
}
:deep(.p-datatable.baseTable-customers.baseTable-border-none .p-datatable-header){
   border-width: 0px !important;
}
:deep(.p-datatable.baseTable-customers.baseTable-border-none .p-datatable-paginator-bottom){
   border-width: 0px !important;
}
:deep(.p-datatable.baseTable-customers .p-paginator .p-dropdown) {
  flex-shrink: 0;
}
:deep(.p-datatable.baseTable-customers) .p-paginator-content {
  width: 100% !important;
}

:deep(.p-datatable.baseTable-customers .p-paginator .p-paginator-content) .p-paginator-current {
  flex-shrink: 0;
  margin-right: auto !important;
}
:deep(.p-datatable.baseTable-customers  .p-datatable-tbody > tr >td.bg-glass-baseColor-light) {
  background-color: rgba(186, 191, 199, 0.125) !important;
}

:deep(.p-datatable.baseTable-customers.rowGroupFooter-none) .p-datatable-row-group-footer {
  display: none;
}

// TreeTable
:deep(.p-treetable.baseTable-customers .p-treetable-header){
  background-color: var(--p-surface-card);
}
:deep(.p-treetable.baseTable-customers.baseTable-header-none .p-treetable-header){
  display: none;
}
:deep(.p-treetable.baseTable-customers.baseTable-border-none .p-treetable-header){
   border-width: 0px !important;
}
:deep(.p-treetable.baseTable-customers.baseTable-border-none .p-treetable-paginator-bottom){
   border-width: 0px !important;
}
:deep(.p-treetable.baseTable-customers .p-treetable-thead > tr > th) {
  font-size: 1rem;
  background-color: var(--p-surface-hover);
  @media screen and (max-width: 1380px) {
      font-size: .9rem;
  }
}
:deep(.p-treetable.baseTable-customers .p-treetable-thead > tr > th.text-center .p-treetable-column-header-content) {
  justify-content: center;
}

:deep(.p-treetable.baseTable-customers  .p-treetable-tbody > tr.row-level0) {
   background-color: #F0E68C !important;
}
:deep(.p-treetable.baseTable-customers  .p-treetable-tbody > tr.row-level1) {
  background-color: #c8e6ee !important;
}
:deep(.p-treetable.baseTable-customers  .p-treetable-tbody > tr.row-level2) {
  background-color: #ffdbb8 !important;
}
/*:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr.row-level3) {
  background-color: rgba(72, 169, 197, 0.36);
}*/
:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr >td) {
  font-size: .9rem;
  @media screen and (max-width: 1380px) {
      font-size: .825rem;
  }
}
:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr > td .td-striped) {
  background-color: rgba(72, 169, 197, 0.1);
}
:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr > td .td-striped2) {
  background-color: rgba(72, 169, 197, 0.05);
}

:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr >td.text-td .p-treetable-body-cell-content) {
  max-width: 80%;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr > td.text-center .p-treetable-body-cell-content) {
    justify-content: center;
}
:deep(.p-treetable.baseTable-customers .p-treetable-tbody > tr > td.text-right .p-treetable-body-cell-content) {
    justify-content: end;
}
:deep(.p-treetable.baseTable-customers) .p-paginator {
  padding: 0.75rem;
}
:deep(.p-treetable.baseTable-customers .p-paginator .p-dropdown) {
  flex-shrink: 0;
}
:deep(.p-treetable.baseTable-customers) .p-paginator-content {
  width: 100% !important;
}
:deep(.p-treetable.baseTable-customers .p-paginator .p-paginator-content) .p-paginator-current {
  flex-shrink: 0;
  margin-right: auto !important;
}
</style>