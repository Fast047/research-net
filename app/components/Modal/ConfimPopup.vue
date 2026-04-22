<template>
  <div>
    <ConfirmDialog ref="modalConfirm" :group="groupName" key="myDialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" >
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-900" style="min-width: 25vw">
                <div class="rounded-full inline-flex justify-center items-center h-24 w-24 -mt-8" :class="{
                    'bg-red-500 text-white': ['delete', 'error'].includes(message.mode),
                    'bg-orange-500 text-white': ['warn'].includes(message.mode),
                    'bg-primary text-primary-contrast': !['delete', 'error', 'warn'].includes(message.mode),
                    }">
                    <Icon :name="message.icon" class="text-6xl" />
                </div>
                <div class="text-center px-2 py-3">
                    <span class="font-bold text-2xl lg:text-4xl block mb-2 mt-4">{{ message.header }}</span>
                    <!-- <p class="my-0 max-w-28rem text-wrap">{{ message.message }}</p> -->
                     <div 
                        v-html="message.message" 
                        class="my-0 max-w-28rem text-wrap text-surface-600 dark:text-surface-400"
                     ></div>
                </div>
                <div v-if="['success', 'error'].includes(message.mode)" class="flex items-center gap-2 mt-4">
                    <Button :label="message?.options?.submitLabel ?? 'รับทราบ'" class="w-36" severity="secondary" outlined @click="acceptCallback" />
                </div>
                <div v-else-if="message?.mode === 'warn'" class="flex items-center gap-2 mt-4">
                    <Button :label="message?.options?.submitLabel ?? 'ใช่, ยืนยันข้อมูล'" class="w-36" severity="warn" @click="acceptCallback"/>
                    <Button label="ยกเลิก" class="w-36" severity="secondary" outlined @click="rejectCallback"/>
                </div>
                <div v-else-if="message?.mode === 'delete'" class="flex items-center gap-2 mt-4">
                    <Button :label="message?.options?.submitLabel ?? 'ใช่, ต้องการลบ'" class="min-w-36" severity="danger" @click="acceptCallback" />
                    <Button label="ยกเลิก" class="w-36" severity="secondary" outlined @click="rejectCallback"/>
                </div>
            </div>
        </template>
    </ConfirmDialog>
    
  </div>
</template>

<script lang="ts" setup>
interface PopupCondition {
    visible: boolean;
    mode: 'success' | 'error' | 'warn' | 'delete' | 'headless';
    header?: string;
    message?: string;
    icon?: string;
    options?: {
        url?: string;
        method?: string;
        submitLabel?: string;
        [key: string]: any;
    };
    accept?: () => void;
    reject?: () => void;
}

const confirm = useConfirm();
const { modalPopup, error, resetModalPopup } = useModal();
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});
const groupName = computed(() => props.name ?? 'headless');
const emit = defineEmits(["success", "accept", "reject", "cancel", "close"]);

watch(() => modalPopup.value,
(newValue) => {
    if(newValue?.visible) {
        const cond = toRaw(newValue);
        createPopup(cond);
    }
});

const createPopup = (cond: PopupCondition) => {
    confirm.require({
        ...cond,
        group: groupName.value,
        accept: () => {
            switch (cond.mode) {
                case 'success':
                    emit("success", {
                        mode: cond.mode,
                        success: true
                    });
                    break;
                case 'error':
                    emit("cancel", {
                        mode: cond.mode,
                        success: true
                    });
                    break;
                case 'delete':
                    if(cond?.options?.url) deleteData(cond.options);
                    break;
            
                default:
                    emit("accept", {
                        mode: cond.mode,
                        success: true
                    });
                    break;
            }
            resetModalPopup();
        },
        reject: () => {
            emit("reject", {
                mode: cond.mode,
                success: false
            });
            resetModalPopup();
        },

    });
}

const deleteData = async (obj:any) => {
    const { url, method, ...option} = obj;
    const { data, error: errorFalse } = await useFetch(`${url}`, { method: method ?? 'DELETE', ...option});
    const res = data.value as ApiResponse; 
    if (errorFalse.value) {
        createPopup({
            visible: true,
            mode: 'error',
            header: "เกิดข้อผิดพลาด",
            message: errorFalse.value?.message || "เพื่อความถูกต้องของข้อมูล โปรดตรวจสอบรายละเอียดและลองทำรายการใหม่อีกครั้ง",
            icon: "material-symbols:priority-high",
        });
        return;
    }

    if (res?.success || res?.Success) {
        emit("success", {
            mode: "delete",
            success: true
        });
    } else {
        createPopup({
            visible: true,
            mode: 'error',
            header: "เกิดข้อผิดพลาด",
            message: res?.message || "เพื่อความถูกต้องของข้อมูล โปรดตรวจสอบรายละเอียดและลองทำรายการใหม่อีกครั้ง",
            icon: "material-symbols:priority-high",
        });
    }
}

defineExpose({
    createPopup,
    deleteData
})

</script>

<style>

</style>