import React, { useEffect } from "react";
import { InputGroup, InputGroupText, Input, ButtonGroup, Label, Alert, Toast, ToastBody, ToastHeader } from "reactstrap";
import { TypeUtilities } from "../../../../utilities/TypeUtilities";
import { useDispatch, useSelector } from "../../../../store";
import { Type as TernaType } from '../../../../store/slices/ternas/_namespace'
import { INIT as InitState } from '../../../../store/slices/ternas';
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from "../../../../store/slices/docentes";
import { ButtonPrimary, ButtonSecondary } from "../../../../components/shared/buttons";
import { Tables } from "../../../../components/commons/tables/tables";
import { Action as ActionTernas, Selector as SelectorTerna } from "../../../../store/slices/ternas";
import '../index'

type Docente = {
    docenteId: string;
    nombre: string;
    coordina: string;
}

const INITDocente: TernaType.DetalleTernaInfo = {
    detalleTernaId: 0,
    ternaId: 0,
    docenteId: '',
    coordina: ''
}

export default function Step2() {
    const dispatch = useDispatch();
    const [enableButton, setEnableButton] = React.useState<boolean>(false)
    const [hasChange, setHasChange] = React.useState<boolean>(false);
    const [state, setState] = React.useState<TernaType.DetalleTernaInfo>(INITDocente);
    const [noIsValid, setNoIsValid] = React.useState<boolean>(false)
    const [hasCoor, setHasCoor] = React.useState<boolean>(false)
    const [docentesInfo, setDocentesInfo] = React.useState<Array<Docente>>([])
    const docentes = useSelector(SelectorDocentes.getDocentes)
    const detalleTernas = useSelector(SelectorTerna.getDetalleTernas)
    const selectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "default" || e.currentTarget.value !== "") {
            setState({
                ...state,
                [e.target.name]: Boolean(e.target.value) === true ? "Si" : "No"
            })
            setHasChange(true)
        }
    }
    React.useEffect(() => {
        const utils: TypeUtilities = {
            url: '/docente/getDocentes'
        }
        dispatch(FetcherDocentes.getDocentes(utils))
        if (detalleTernas.length === 3) { setEnableButton(true) }
    }, [dispatch])

    useEffect(() => {
        const hasItem = detalleTernas.find(item => item.coordina === 'Si')
        console.log(hasItem, detalleTernas.length)
        if (!hasItem && detalleTernas.length > 0) {
            setHasCoor(true);
            setTimeout(() => {
                setHasCoor(false)
            }, 3000)
        }
        if (detalleTernas.length === 3) { setEnableButton(true) }
    }, [detalleTernas])
    useEffect(() => {
        if (detalleTernas.length === 3) {
            const items: Array<Docente> = detalleTernas.map(detalle => {
                const item = docentes.find(docente => docente.docenteId === detalle.docenteId)
                if (item) {
                    return {
                        docenteId: item.docenteId,
                        nombre: item.nombre,
                        coordina: detalle.coordina
                    }
                } else {
                    return {
                        docenteId: '',
                        nombre: '',
                        coordina: ''
                    }
                }
            });
            setDocentesInfo(items)
        }
    }, [])
    const handleClick = () => {
        if (detalleTernas.length <= 2 && state.docenteId !== "") {
            const ternaInfo: TernaType.DetalleTernaInfo = { ...state };
            const itemDocente = docentes.find(docente => docente.docenteId === state.docenteId)
            if (itemDocente) {
                setDocentesInfo([
                    ...docentesInfo,
                    {
                        docenteId: itemDocente?.docenteId,
                        nombre: itemDocente?.nombre,
                        coordina: state.coordina
                    }
                ])
            }
            dispatch(ActionTernas.setDetalleTerna(ternaInfo))
            setState(INITDocente)
        } else {
            setNoIsValid(true)
            setTimeout(() => {
                setNoIsValid(false)
            }, 3000)
        }
        if (detalleTernas.length === 3) { setEnableButton(true) }
    };
    const handleClickBack = () => {
        dispatch(ActionTernas.setStep1(true));
    }
    const handleClickNext = () => {
        dispatch(ActionTernas.setResumen(true));
    }
    return <div className="form-group">
        <h5 className="mb-4">Creacion de Nueva Terna</h5>
        <InputGroup>
            <InputGroupText>
                Docente
            </InputGroupText>
            <Input
                id="docenteId"
                name="docenteId"
                type="select"
                value={state.docenteId} onChange={selectedChange} defaultValue={"default"}>
                <option key="defaultValue" value="default">Seleccione el Docente para la Terna</option>
                {docentes && docentes.map((docente) => {
                    return <option key={docente.docenteId} title={docente.nombre} value={docente.docenteId}>{docente.docenteId}-{docente.nombre}</option>
                })
                }
            </Input>
        </InputGroup>
        <InputGroup>
            <Input disabled={hasChange}
                id="coordina"
                name="coordina"
                type="checkbox"
                onChange={handleCheck}
            />
            <Label check for="coordina">&nbsp;Es coordinador</Label>
        </InputGroup>
        <Alert isOpen={!hasChange} color="dark">Recuerde selecionar al menos un coordinador</Alert>
        <ButtonSecondary className="mb-4" onClick={handleClick} disabled={enableButton} >Agregar Docente</ButtonSecondary>
        {docentesInfo.length > 0 && <Tables data={docentesInfo} headers={["Id Docente", "Nombre", "Coordinador"]} firstColumnIndex={0} paginated={false} />}
        <ButtonGroup>
            <ButtonSecondary onClick={handleClickBack}>Atras</ButtonSecondary>
            <ButtonPrimary onClick={handleClickNext} disabled={!enableButton}>Siguiente</ButtonPrimary>
        </ButtonGroup>
        <Alert className="alert-color" color="danger" isOpen={noIsValid}>El ingreso no es correcto</Alert>
        <Alert className="alert-color" color="info" isOpen={hasCoor}>Debe seleccionar un coordinador</Alert>
    </div>
}