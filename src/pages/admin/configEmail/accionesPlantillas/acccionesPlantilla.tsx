import React from "react"
import { Button, ButtonGroup, Container, Input, InputGroup, InputGroupText } from "reactstrap"
import { TypeUtilities } from "../../../../utilities/TypeUtilities"
import { Fetcher as FetcherAcciones, Selector as SelectorAcciones, Action as ActionAcciones } from "../../../../store/slices/accionesPlantilla"
import { INIT } from "../../../../store/slices/accionesPlantilla"
import { useDispatch, useSelector } from "../../../../store"
import { Tables } from "../../../../components/commons/tables/tables"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonPrimary, ButtonSecondary } from "../../../../components/shared/buttons"
import Swal from "sweetalert2"

type AccionesInfo = {
    idAccionPlantilla: number;
    accion: string;
    plantillaCorreoId: number;
    acciones?: JSX.Element
}

export default function AccionesPlantillas() {
    const dispatch = useDispatch();
    const acciones = useSelector(SelectorAcciones.getAccionPlantillas);
    const isUpdatedAccion = useSelector(SelectorAcciones.getSavedAccionPlantillaState);
    const [accionesPlantillas, setAccionesPlantillas] = React.useState<AccionesInfo[]>([])
    const [accionToEdit, setAccionToEdit] = React.useState<AccionesInfo>(INIT.accionPlantilla)
    const [editAccion, setEditAccion] = React.useState(false);
    const [isDispatched, setIsDispatched] = React.useState(false);

    React.useEffect(() => {
        const data: TypeUtilities = {
            url: "/plantillaAccion/getAllData"
        };
        dispatch(FetcherAcciones.getAcciontesPlantillas(data));
    }, []);

    React.useEffect(() => {
        const accionesMapped: AccionesInfo[] = []
        acciones.forEach(accion => {
            accionesMapped.push({
                idAccionPlantilla: accion.idAccionPlantilla,
                accion: accion.accion,
                plantillaCorreoId: accion.plantillaCorreoId,
                acciones: renderAccionesButtons(accion.idAccionPlantilla)
            })
        })
        setAccionesPlantillas(accionesMapped)
    }, [acciones]);

    React.useEffect(() => {
        if (isDispatched) {
            if (isUpdatedAccion) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "La accion-plantilla se ha actualizado exitosamente.",
                    icon: "success",
                });
                const data: TypeUtilities = {
                    url: "/plantillaAccion/getAllData"
                };
                dispatch(FetcherAcciones.getAcciontesPlantillas(data));
                dispatch(ActionAcciones.cleanStore);
            }
            if (!isUpdatedAccion) {
                Swal.fire({
                    title: "Error al Guardar!",
                    text: "La accion-plantilla no se ha actualizado exitosamente.",
                    icon: "error",
                });
            }
            dispatch(ActionAcciones.cleanStore);
            setIsDispatched(false);
            onClickCancel();
        }
    }, [dispatch, isDispatched, isUpdatedAccion]);

    function renderAccionesButtons(idAccion: number) {
        return <ButtonGroup>
            <Button color="success" onClick={() => editAccionPlantilla(idAccion)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
        </ButtonGroup>
    }

    function editAccionPlantilla(idAccionPlantilla: number) {
        setAccionToEdit(acciones.find(accion => accion.idAccionPlantilla === idAccionPlantilla))
        setEditAccion(true)
    }

    function onClickCancel() {
        setAccionToEdit(INIT.accionPlantilla);
        setEditAccion(false);
    }

    function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        setAccionToEdit({ ...accionToEdit, [e.target.name]: e.target.value })
    }

    function onClickSave() {
        const data: TypeUtilities = {
            url: "/plantillaAccion/update",
            data: accionToEdit
        };
        dispatch(FetcherAcciones.updateAccion(data));
        setIsDispatched(true);
    }

    return <React.Fragment>
        <blockquote className="blockquote">Configurar la accion de notificación</blockquote>
        <figcaption className="blockquote-footer">En este panel podra configurar las acciones correspondientes al envío de correo y las plantillas correspondientes a cada acción.</figcaption>
        <Container>
            {accionesPlantillas.length > 0 && <Tables
                data={accionesPlantillas}
                headers={["Id Accion", "Accion", "Id Plantilla", "Acciones"]}
                paginated={false}
                firstColumnIndex={0} />
            }
        </Container>
        {editAccion && <Container className="d-flex flex-column align-items-center w-50 mt-4">
            <h5>Ingrese los nuevos valores para la plantilla.</h5>
            <InputGroup className="w-100">
                <InputGroupText>Id Accion</InputGroupText>
                <Input readOnly value={accionToEdit.idAccionPlantilla} />
            </InputGroup>
            <InputGroup className="w-100">
                <InputGroupText>Accion</InputGroupText>
                <Input readOnly value={accionToEdit.accion} />
            </InputGroup>
            <InputGroup className="w-100">
                <InputGroupText>Id de la Plantilla</InputGroupText>
                <Input name="plantillaCorreoId" value={accionToEdit.plantillaCorreoId} onChange={onChangeInput} />
            </InputGroup>
            <ButtonGroup className="w-50">
                <ButtonPrimary onClick={onClickSave}>Guardar</ButtonPrimary>
                <ButtonSecondary onClick={onClickCancel}>Cancelar</ButtonSecondary>
            </ButtonGroup>
        </Container>
        }
    </React.Fragment>
}