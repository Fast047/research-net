export {};

declare global {
    interface ModalAction {
        openModal?: () => void;
        closeModal?: () => void;
        startLoading?: () => void;
        endLoading?: () => void;
        confirmDelete?: (option?: object|string) => void;
        confirmCancel?: (option?: object|string) => void;
        success?: (message?: object|string) => void;
        error?: (message?: object|string) => void;
        warn?: (message?: object|string) => void;
        loading?: (message?: object|string) => void;
        warning?: () => void;
        exportFile?: (option?: object|string, path?: string|null) => void;
    }

    interface ComponentAction {
        onAdd?: () => void,
        onSubmit?: () => void,
        createPopup?: (conde?: any) => void,
    }

    interface ApiResponse {
        success: boolean,
        message: string|any
        data: any
        Success?: boolean,
        Messsage?: string|any
        file?: any
    }
}