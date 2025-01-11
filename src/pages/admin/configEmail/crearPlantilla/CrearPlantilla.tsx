import React from "react";
import { useDispatch, useSelector } from "../../../../store";

import { Type as TypePlantillaEmail, INIT as INIT_PLANTILLA } from '../../../../store/slices/plantillas/_namespace';

import { InputGroup, InputGroupText, Input, Container } from "reactstrap";
import { ButtonSecondary } from "../../../../components/shared/buttons";
import { Fetcher as FetcherPlantillas, Selector as SelectorPlantillas, Action as ActionPlantillas } from '../../../../store/slices/plantillas'
import { TypeUtilities } from "../../../../utilities/TypeUtilities";
import { modules } from "../editorConfig";
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import '../../../admin/crearTernas/_ternas.css'
import './crearPlantilla.css';

export default function CrearPlantilla() {
    const dispatch = useDispatch();

    const [state, setState] = React.useState<TypePlantillaEmail.PlantillaInfo>(INIT_PLANTILLA.plantilla);
    const [isDispatched, setIsDispatched] = React.useState(false);
    const isSavedPlantilla = useSelector(SelectorPlantillas.getSavedPlantilla)

    const inputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setState({
            ...state,
            [name]: value
        });
    };

    const changeText = (value) => {
        setState((prevState) => ({
            ...prevState,
            [value.name]: value.value
        }));
    }

    React.useEffect(() => {
        const plantillaInfo: TypeUtilities = {
            url: '/correo/obtenerPlantillas',
        };
        if (isSavedPlantilla && isDispatched) {
            Swal.fire({
                title: "¡Plantilla Guardada Exitosamente!",
                text: "La plantilla fue creada exitosamente",
                icon: "success",
            });
            dispatch(FetcherPlantillas.getPlantillas(plantillaInfo));
            dispatch(ActionPlantillas.cleanStore);
            setState(INIT_PLANTILLA.plantilla);
            setIsDispatched(false);
        } else if (!isSavedPlantilla && isDispatched) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Hubo un error al guardar plantilla.`,
            });
            dispatch(FetcherPlantillas.getPlantillas(plantillaInfo));
            dispatch(ActionPlantillas.cleanStore);
            setState(INIT_PLANTILLA.plantilla);
            setIsDispatched(false);
        }
    }, [dispatch, isSavedPlantilla, isDispatched]);

    const handleSavePlantilla = async () => {
        if (state) {
            const plantillaInfo: TypeUtilities = {
                url: '/correo/crearPlantilla',
                data: state,
            };

            if (!state.correo_origen.includes("@")) {
                const emailWithDomain = state.correo_origen + '@unicah.edu';
                plantillaInfo.data = { ...state, correo_origen: emailWithDomain }
            }

            dispatch(FetcherPlantillas.savePlantilla(plantillaInfo));
            setIsDispatched(true);
        }
    };

    return (
        <Container tag="div">
            <h5 className="mb-4">Creacion de una Nueva Plantilla</h5>
            <InputGroup className="w-100">
                <InputGroupText>
                    Asunto
                </InputGroupText>
                <Input value={state.asunto} onChange={inputFunction} name="asunto" id="asunto" className="asunto" placeholder="Ingrese el asunto del correo" />
            </InputGroup>
            <InputGroup className="w-100">
                <InputGroupText>
                    Correo de Origen
                </InputGroupText>
                <Input value={state.correo_origen} onChange={inputFunction} name="correo_origen" id="correo_origen" className="correo_origen" placeholder="correoorigen@unicah.edu" />
            </InputGroup>
            <InputGroup className="w-100">
                <InputGroupText>
                    Contraseña
                </InputGroupText>
                <Input type="password" value={state.correo_password} onChange={inputFunction} name="correo_password" id="correo_password" className="correo_password" placeholder="Contraseña" />
            </InputGroup>
            <InputGroup className="w-100 mb-4">
                <ReactQuill className="editor-custom" modules={modules} theme="snow" value={state.cuerpo} onChange={(value) => changeText({ name: "cuerpo", value })} placeholder="Ingrese el contenido de su correo aquí..." />
            </InputGroup>
            <InputGroup className="w-100 mt-4 mb-4">
                <div className="plantilla-preview mt-4" dangerouslySetInnerHTML={{ __html: state.cuerpo }}></div>
            </InputGroup>
            <InputGroup className="w-50 mt-4">
                <ButtonSecondary onClick={handleSavePlantilla} disabled={false}>Guardar Datos</ButtonSecondary>
            </InputGroup>
        </Container >
    );
}
