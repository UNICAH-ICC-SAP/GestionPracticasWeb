import React from "react";
import { WhatsappButton } from "@components/shared/buttons";

type TernaDetail = {
    docente: DocenteInfoType;
};

export type DocenteInfoType = {
    detalleTernaId?: number;
    ternaId: number;
    docenteId: string;
    docenteNombre: string;
    docenteTelefono: string;
    docenteEmail: string;
    rol: string
}
export default function DocenteInfo(props: TernaDetail) {
    const { docente } = props;
    return <div key={docente.docenteId}>
        <p><strong>Nombre:</strong> {docente.docenteNombre}</p>
        <p><WhatsappButton telefono={docente.docenteTelefono} /></p>
        <p><strong>Email:</strong> {docente.docenteEmail}</p>
        <p><strong>Rol:</strong> {docente.rol}</p>
        <hr />
    </div>
}