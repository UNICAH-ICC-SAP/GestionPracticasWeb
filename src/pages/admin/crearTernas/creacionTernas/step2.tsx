import React, { useEffect } from "react";
import { InputGroup, InputGroupText, Input, ButtonGroup, Label, Alert } from "reactstrap";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { useDispatch, useSelector } from "@store/index";
import { Type as TernaType } from '@store/slices/ternas/_namespace'
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from "@store/slices/docentes";
import { ButtonDanger, ButtonPrimary, ButtonSecondary } from "@components/shared/buttons";
import { Tables } from "@components/commons/tables/tables";
import { Action as ActionTernas, Selector as SelectorTerna } from "@store/slices/ternas";
import '../index'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Docente = {
    docenteId: string;
    nombre: string;
    rol: string;
}

const INITDocente: TernaType.DetalleTernaInfo = {
    detalleTernaId: 0,
    ternaId: 0,
    docenteId: '',
    rol: '',
}

export default function Step2() {
    const dispatch = useDispatch();
    const [enableButton, setEnableButton] = React.useState<boolean>(false)
    const [hasChange, setHasChange] = React.useState({ coordina: false, estilo: false, tecnico: false });
    const [hasCoor, setHasCoor] = React.useState<boolean>(false)
    const [state, setState] = React.useState<TernaType.DetalleTernaInfo>(INITDocente);
    const [noIsValid, setNoIsValid] = React.useState<boolean>(false);
    const [isAdded, setIsAdded] = React.useState<boolean>(false);
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
                rol: e.target.name
            })
            setHasChange({
                ...hasChange,
                [e.target.name]: true
            })
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
        const hasItem = detalleTernas.find(item => item.rol === 'coordina');
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
                        rol: detalle.rol,
                    }
                } else {
                    return {
                        docenteId: '',
                        nombre: '',
                        rol: ''
                    }
                }
            });
            setDocentesInfo(items)
        }
    }, [])
    const handleClick = () => {
        const added = detalleTernas.find(detalle => state.docenteId === detalle.docenteId);
        if (!added) {
            if (detalleTernas.length <= 2 && state.docenteId !== "") {
                const ternaInfo: TernaType.DetalleTernaInfo = { ...state };
                const itemDocente = docentes.find(docente => docente.docenteId === state.docenteId)
                if (itemDocente) {
                    setDocentesInfo([
                        ...docentesInfo,
                        {
                            docenteId: itemDocente?.docenteId,
                            nombre: itemDocente?.nombre,
                            rol: state.rol,
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
        } else {
            setIsAdded(true)
            setTimeout(() => {
                setIsAdded(false)
            }, 3000)
        }
    };
    const handleClickBack = () => {
        dispatch(ActionTernas.setStep1(true));
    }
    const handleClickNext = () => {
        dispatch(ActionTernas.setResumen(true));
    }
    const handleDeleteDocente = (docenteId: string) => {
        console.log(docentesInfo, detalleTernas);
        const currentDocentes = docentesInfo.filter(item => {
            if (item.docenteId !== docenteId) {
                return item;
            }
        })
        const currentDetalleTernas = detalleTernas.filter(item => {
            if (item.docenteId !== docenteId) {
                return item;
            }
        })
        console.log(currentDetalleTernas, docenteId);
        const docente = currentDetalleTernas.filter(detalle => detalle.docenteId === docenteId)
        if (docente.length === 0) {
            setHasChange({ ...hasChange, [docente[0].rol]: false });
            setHasCoor(!(docente[0].rol === 'coordina'));
        }
        if (!currentDetalleTernas) {
            dispatch(ActionTernas.setNoDroppedData([]));
            setEnableButton(false);
        } else {
            dispatch(ActionTernas.setNoDroppedData(currentDetalleTernas))
            setEnableButton(false)
        }
        if (!currentDocentes) setDocentesInfo([]);
        else setDocentesInfo(currentDocentes);

    }
    const renderActions = (docenteId: string) => {
        return <ButtonGroup>
            <ButtonDanger onClick={() => handleDeleteDocente(docenteId)}>
                <FontAwesomeIcon icon={faTrash} />
            </ButtonDanger>
        </ButtonGroup>
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
            <Input disabled={hasChange.coordina}
                id="coordina"
                name="coordina"
                type="checkbox"
                onChange={handleCheck}
                checked={state.rol === 'coordina'}
            />
            <Label check for="coordina">&nbsp;Es coordinador</Label>
        </InputGroup>
        <InputGroup>
            <Input disabled={hasChange.estilo}
                id="estilo"
                name="estilo"
                type="checkbox"
                onChange={handleCheck}
                checked={state.rol === 'estilo'}
            />
            <Label check for="estilo">&nbsp;Es revisor de estilos</Label>
        </InputGroup>
        <InputGroup>
            <Input disabled={hasChange.tecnico}
                id="tecnico"
                name="tecnico"
                type="checkbox"
                onChange={handleCheck}
                checked={state.rol === 'tecnico'}
            />
            <Label check for="tecnico">&nbsp;Es es revisor técnico</Label>
        </InputGroup>
        <Alert isOpen={!hasChange} color="dark">Recuerde selecionar al menos un coordinador</Alert>
        <ButtonSecondary className="w-50 mb-4" onClick={handleClick} disabled={enableButton} >Agregar Docente</ButtonSecondary>
        {docentesInfo.length > 0 && <Tables data={docentesInfo.map(item => ({
            ...item,
            rol: item.rol === 'coordina' ? 'Coordinador' : item.rol === 'estilo' ? 'Revisor de Estilos' : 'Revisor Técnico',
            actions: renderActions(item.docenteId)
        }))} headers={["Id Docente", "Nombre", "Rol", "Acciones"]} firstColumnIndex={0} paginated={false} />}
        <ButtonGroup>
            <ButtonSecondary onClick={handleClickBack}>Atras</ButtonSecondary>
            <ButtonPrimary onClick={handleClickNext} disabled={!enableButton}>Siguiente</ButtonPrimary>
        </ButtonGroup>

        <Alert className="alert-color" color="danger" isOpen={isAdded}>El docente ya fue agregado</Alert>
        <Alert className="alert-color" color="danger" isOpen={noIsValid}>El ingreso no es correcto</Alert>
        <Alert className="alert-color" color="info" isOpen={hasCoor}>Debe seleccionar un coordinador</Alert>
    </div>
}