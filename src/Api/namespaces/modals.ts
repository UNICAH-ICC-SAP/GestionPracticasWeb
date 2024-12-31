import type { Type as TypePensums } from "../../store/slices/pensums/_namespace"

export declare namespace Type {
    export type ModalType = 'create' | 'edit' | 'status' | 'createSeccion' | 'editSeccion' | 'deleteSeccion';
    type ModalState = {
        isOpen: boolean;
        type: Type.ModalType | null;
        currentClase?: TypePensums.ClaseInfo;
        currentBloque?: number;
        nestedModal?: 'statusSeccion';
    };
}
