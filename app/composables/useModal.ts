// composables/useModalLocal.ts
export const useModal = () => {
  const isLoading = useState<boolean>('modalLoanding', () => false);
  const visible = useState<boolean>('modalVisible', () => false);
  const defaultOpt = {
    visible: false,
    modal: true,
    style: null,
  };
  const defaultOptConf = {
    visible: false,
    mode: null,
    header: null,
    message: null,
    icon: null,
  }
  const options = useState<any>('modalOptions', () => defaultOpt);
  const modalPopup = useState<any>('modalPopupOptions', () => defaultOptConf);
  const open = (cond?: any) => {
    visible.value = true;
    options.value = {
      ...cond,
      visible: true,
    };

  };
  const close = (cond?: any) => {
    visible.value = false;
    options.value = {
      ...cond,
      visible: false,
    };
  };

  const success = (msg?: any) => {
    close();
    modalPopup.value = {
      visible: true,
      mode: 'success',
      header: "บันทึกข้อมูลสำเร็จ",
      message: msg || "ระบบได้บันทึกข้อมูลของคุณเป็นที่เรียบร้อยแล้ว",
      icon: "material-symbols:verified-rounded",
    };
  };
  const error = (msg?: any) => {
    close();
    modalPopup.value = {
      visible: true,
      mode: 'error',
      header: "เกิดข้อผิดพลาด",
      message: msg || "เพื่อความถูกต้องของข้อมูล โปรดตรวจสอบรายละเอียดและลองทำรายการใหม่อีกครั้ง",
      icon: "material-symbols:priority-high",
    };

  };
  const confirmDelete = (cond: any) => {
    close();
    modalPopup.value = {
      visible: true,
      mode: 'delete',
      header: "คุณต้องการลบข้อมูลใช่หรือไม่",
      message: cond?.message || "ข้อมูลที่คุณลบจะเปลี่ยนกลับไม่ได้",
      icon: "material-symbols:delete-forever-rounded",
      options: cond ? { ...cond } : null
    };
  };
  const confirmCancel = (cond: any) => {
    close();
    modalPopup.value = {
      visible: true,
      mode: 'delete',
      header: "คุณต้องการยกเลิกเอกสารนี้ใช่หรือไม่",
      message: cond?.message || "เอกสารที่คุณยกเลิกจะเปลี่ยนกลับไม่ได้",
      icon: "material-symbols:file-save-off-rounded",
      ooptions: cond ? { ...cond, submitLabel: 'ใช่, ยกเลิกเอกสารนี้' } : null
    };
  };
  const warn = (msg?: any) => {
    close();
    modalPopup.value = {
      visible: true,
      mode: 'warn',
      header: "แจ้งเตือน",
      message: msg || "ข้อมูลที่ท่านกรอกมีความสำคัญ โปรดตรวจสอบให้ถูกต้องก่อนยืนยัน",
      icon: "material-symbols:notification-sound-rounded",
    }

  };
  const reset = () => {
    options.value = defaultOpt;
  };
  const resetModalPopup = () => {
    modalPopup.value = defaultOptConf;
  };
  const warning = (msg?: any) => {

  };

  return {
    isLoading,
    visible,
    open,
    close,
    success,
    error,
    warn,
    confirmDelete,
    confirmCancel,
    warning,
    reset,
    resetModalPopup,
    options,
    modalPopup
  }
}
