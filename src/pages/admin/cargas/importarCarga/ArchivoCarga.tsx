import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

type Props = {
    disabled: boolean;
    onChange: (file: File | null) => void;
};

export default function ArchivoCarga({ disabled, onChange }: Props) {
    return <FormGroup>
        <Label for="archivo-carga">Archivo de carga académica</Label>
        <Input id="archivo-carga" type="file" accept=".pdf,.xlsx" disabled={disabled}
            onChange={event => onChange(event.target.files?.[0] || null)} />
        <small className="text-muted">PDF SAP con texto o Excel .xlsx. Máximo 10 MB. Puedes descargar un formato Excel vacío.</small>
    </FormGroup>;
}
