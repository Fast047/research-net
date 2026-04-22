<template>
<div>
    <Dialog 
        v-model:visible="myModal.visible" 
        :header="title" 
        :showHeader="showHeader" 
        :position="position" 
        :closable="closable"
        :maximizable="maximizable" 
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" 
        :class="className"
        :style="{ width: widthDisplay }"
        :pt="pt"
        modal 
        @hide="emitAction('close')"
        >
        <template #header>
            <slot name="header"></slot>
        </template>
            <slot name="default"></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </Dialog>
    <Dialog 
        v-model:visible="loading" modal :showHeader="false" :closable="false" :style="{ width: '480px' }" >
        <div class="flex flex-col justify-center items-center pt-5 gap-5" style="min-height: 30vh; max-height: 35vh">
            <ProgressSpinner style="width: 120px; height: 120px" strokeWidth="4" fill="transparent" animationDuration="1.5s" aria-label="Modal ProgressSpinner"/>
            <h6 class="m-0">ระบบกำลังประมวลผล กรุณารอสักครู่...</h6>
        </div>
    </Dialog>
    <ModalConfimPopup 
        :name="'ConfimPopup'+name" 
        ref="modalPopup"
        @accept="(val) => emitAction('accept', val)"
        @reject="(val) => emitAction('reject', val)"
        @success="(val) => emitAction('success', val)"
        @cancel="(val) => emitAction('cancel', val)"
    />
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  closable: {
    type: Boolean,
    default: true,
  },
  maximizable: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  widthDisplay: {
    type: String,
    default: '30%',
  },
  position: {
    type: String,
    default: null,
  },
  className: {
    type: String,
    default: null,
  },
  pt: {
    type: Object,
    default: null,
  }
});
const emit = defineEmits(["success", "accept", "reject", "cancel", "close"]);
const modal = useModal();
const loading = ref(false);
const myModal = ref({
  visible: false,
  modal: true,
  style: null,
});

watch(() => modal.options.value,
(newValue) => {
    if(newValue) {
        // ใช้ Object.assign เพื่ออัปเดตค่าเฉพาะฟิลด์ที่มีใน myModal
        Object.assign(myModal.value, newValue);
    }
});
watch(() => modal.isLoading.value,
(newValue) => {
    loading.value = newValue ?? false;
});
const emitAction = (value: any, cond?: any) => {
  emit(value, cond ? {...cond} : true);
  switch (value) {
      case 'close':
          modal.close();
          break;
  
      default:
          break;
  }
};

const modalPopup = ref<ComponentAction>();

const openModal = () => {
  myModal.value.visible = true;
};
const closeModal = () => {
  myModal.value.visible = false;
};
const startLoading = () => {
  loading.value = true;
};
const endLoading = () => {
  loading.value = false;
};
const success = (msg: string|undefined = undefined) => {
  if(modalPopup.value && typeof modalPopup.value['createPopup'] === 'function') {
    modalPopup.value.createPopup({
      visible: true,
      mode: 'success',
      header: "บันทึกข้อมูลสำเร็จ",
      message: msg || "ระบบได้บันทึกข้อมูลของคุณเป็นที่เรียบร้อยแล้ว",
      icon: "material-symbols:verified-rounded",
    })
  }
};
const warn = (msg: string|undefined = undefined) => {
  if(modalPopup.value && typeof modalPopup.value['createPopup'] === 'function') {
    modalPopup.value.createPopup({
      visible: true,
      mode: 'warn',
      header: "แจ้งเตือน",
      message: msg || "ข้อมูลที่ท่านกรอกมีความสำคัญ โปรดตรวจสอบให้ถูกต้องก่อนยืนยัน",
      icon: "material-symbols:notification-sound-rounded",
    })
  }
};
const error = (msg: string|undefined = undefined) => {
  if(modalPopup.value && typeof modalPopup.value['createPopup'] === 'function') {
    modalPopup.value.createPopup({
      visible: true,
      mode: 'error',
      header: "เกิดข้อผิดพลาด",
      message: msg || "เพื่อความถูกต้องของข้อมูล โปรดตรวจสอบรายละเอียดและลองทำรายการใหม่อีกครั้ง",
      icon: "material-symbols:priority-high",
    })
  }  
};
const confirmDelete = (cond:any) => {
  if(modalPopup.value && typeof modalPopup.value['createPopup'] === 'function') {
    modalPopup.value.createPopup({
      visible: true,
      mode: 'delete',
      header: "คุณต้องการลบข้อมูลใช่หรือไม่",
      message: cond?.message || "ข้อมูลที่คุณลบจะเปลี่ยนกลับไม่ได้",
      icon: "material-symbols:delete-forever-rounded",
      options: cond ? {...cond} : null
    })
  }
};
const confirmCancel = (cond:any) => {
  if(modalPopup.value && typeof modalPopup.value['createPopup'] === 'function') {
    modalPopup.value.createPopup({
      visible: true,
      mode: 'delete',
      header: "คุณต้องการยกเลิกเอกสารนี้ใช่หรือไม่",
      message: cond?.message || "เอกสารที่คุณยกเลิกจะเปลี่ยนกลับไม่ได้",
      icon: "mdi:file-document-remove",
      options: cond ? {...cond, submitLabel: 'ใช่, ยกเลิกเอกสารนี้' } : null
    })
  }
};

defineExpose({
    openModal,
    closeModal,
    success,
    warn,
    error,
    confirmDelete,
    confirmCancel,
    startLoading,
    endLoading
}) 

</script>


<style lang="scss">
.p-dialog.modalForms {
  > .p-dialog-header {
    border-bottom: 1px solid var(--p-surface-border) !important;
  }

  > .p-dialog-footer {
    border-top: 1px solid var(--p-surface-border) !important;
  }
}
.p-dialog-content {
  overflow: auto;
}
.p-dialog-content::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background: none;
}

.p-dialog-content::-webkit-scrollbar-thumb {
  background: #B9B9C3;
  -webkit-border-radius: 1ex;
  /* -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75); */
}
</style>