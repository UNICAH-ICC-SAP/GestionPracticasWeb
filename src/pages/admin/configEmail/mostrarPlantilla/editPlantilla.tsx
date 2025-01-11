import React from 'react';

import type { PlantillaDetailPreview } from './MostrarPlantilla';

import { modules } from "../editorConfig";
import { DEF, Props } from '../../../../Api/typesProps';

import { Label, Input, FormGroup, ButtonGroup, Button } from "reactstrap";
import ReactQuill from "react-quill";
import './editPlantilla.css'

type PropsForm = {
    state: PlantillaDetailPreview;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    changePass: boolean;
    changeText: (value: object) => void;
    isSaveDisabled: () => boolean;
    handleClickCancel?: React.MouseEventHandler<HTMLButtonElement>;
    handleUpdatePlantilla?: React.MouseEventHandler<HTMLButtonElement>;
    setChangePass: () => void;
}

export default function EditForm(props: Props<PropsForm, typeof DEF>) {
    const { state, onChange, changePass, changeText, handleUpdatePlantilla, handleClickCancel, isSaveDisabled, setChangePass } = props;

    return <div>
        <div className="mb-3">
            <Label for="asunto" className="text-left">Asunto Correo</Label>
            <Input
                id="asunto"
                type="text"
                value={state.asunto}
                onChange={onChange}
                placeholder="Nombre"
            />
        </div>
        <div className="mb-3">
            <Label for="pass" className="text-left">Pass</Label>
            <Input
                id="pass"
                type={changePass ? "text" : "password"}
                disabled={!changePass}
                value={state.correo_password}
                onChange={onChange}
                placeholder="Nombre"
            />
            <FormGroup className='mt-1' switch>
                <Label className='w-100 text-start' check>Modificar Password</Label>
                <Input type="switch" checked={changePass} onChange={setChangePass} />
            </FormGroup>
        </div>
        <div className="mb-3">
            <Label for="correo_origen" className="text-left">Correo Origen</Label>
            <Input
                id="correo_origen"
                type="email"
                value={state.correo_origen}
                onChange={onChange}
                placeholder="Email"
            />
        </div>
        <div className="mb-3">
            <Label for="cuerpo" className="text-left">Contenido</Label>
            <ReactQuill className="text-editor-custom" modules={modules} theme="snow" value={state.cuerpo} onChange={(value) => changeText({ name: "cuerpo", value: value })} placeholder="Ingrese el contenido de su correo aquí..." />
        </div>
        <div className="mb-3">
            <Label for="estado" className="text-left">Estado</Label>
            <Input
                id="estado"
                type="text"
                value={state.estado}
                onChange={onChange}
                placeholder="Teléfono"
            />
        </div>
        <ButtonGroup className="w-50 mb-3">
            <Button color="primary" onClick={handleUpdatePlantilla} disabled={isSaveDisabled()}>Guardar Cambios</Button>
            <Button color="warning" onClick={handleClickCancel}>Cancelar</Button>
        </ButtonGroup>
    </div>
}