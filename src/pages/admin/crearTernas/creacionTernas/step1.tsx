import React from "react";
import { InputGroup, InputGroupText, Input } from "reactstrap";
import { INIT as InitState } from '../../../../store/slices/ternas';
import { Type as AlumnoType } from '../../../../store/slices/alumnos/_namespace'
import { Type as TernaType } from '../../../../store/slices/ternas/_namespace'
import { ButtonSecondary } from "../../../../components/shared/buttons";
import MaskedInput from "../../../../components/shared/inputs";
import { Fetcher as FetcherFacultades, Selector as SelectorFacultades } from "../../../../store/slices/facultades"
import { Action as ActionTernas, Selector as SelectorTernas } from "../../../../store/slices/ternas";
import { useDispatch, useSelector } from "../../../../store";
import { TypeUtilities } from "../../../../utilities/TypeUtilities";
import "../_ternas.css"
import { maskDNI, maskPhone } from "../../../../components/shared/inputs/utils/index"

type ValidItems = {
    email: boolean;
}

enum FormItems {
    email = "email"
}

enum PlaceHolder {
    phone = "50495000648",
    dni = "0801199125021"
}

export default function Step1() {
    const formState = useSelector(SelectorTernas.getAlumo)
    const [userState, setUserState] = React.useState<TernaType.UserCreation>(InitState.userToCreate);
    const [isValidItem, setIsValidItem] = React.useState<ValidItems>({ email: false });
    const [state, setState] = React.useState<AlumnoType.AlumnoInfo>(formState)
    const dispatch = useDispatch();
    const inputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.currentTarget.name]: (e.currentTarget.name === 'nombre') ? e.currentTarget.value.toUpperCase() : e.currentTarget.value
        })
        if (e.currentTarget.name === 'alumnoId') {
            setUserState({
                ...userState,
                userId: e.currentTarget.value
            })
        }
        if (e.currentTarget.name === FormItems.email) {
            validate(e.currentTarget.value)
        }
    };
    const selectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    React.useEffect(() => {
        const utils: TypeUtilities = {
            url: '/facultad/getFacultades'
        }
        dispatch(FetcherFacultades.getFacultades(utils))
        if (state.email !== "") {
            validate(state.email)
        }

    }, [dispatch])
    const facultades = useSelector(SelectorFacultades.getFacutades)
    const handleButtonNext = () => {
        console.log(state)
        dispatch(ActionTernas.setDataAlumno(state));
        dispatch(ActionTernas.setUserCreate(userState));
        dispatch(ActionTernas.setStep1(false));
    }
    return <div className="form-group">
        <h5 className="mb-4">Creacion de Nueva Terna</h5>
        <InputGroup>
            <InputGroupText>
                Numero de Identidad
            </InputGroupText>
            <MaskedInput maxLength={15} value={state.alumnoId} inputMaskChange={inputFunction} name="alumnoId" mask="DNI" id="alumnoId" placeholder={maskDNI(PlaceHolder.dni)} />
        </InputGroup>
        <InputGroup>
            <InputGroupText>
                Nombre de Alumno
            </InputGroupText>
            <Input value={state.nombre} onChange={inputFunction} name="nombre" id="nombre" className="nombre" placeholder="Nombre de Alumno" />
        </InputGroup>
        <InputGroup>
            <InputGroupText>
                Facultad
            </InputGroupText>
            <Input
                id="facultadId"
                name="facultadId"
                type="select"
                value={state.facultadId} onChange={selectedChange} defaultValue={"default"}>
                <option key="defaultValue" value="default">Seleccione la Facultad</option>
                {facultades && facultades.map((facultad) => {
                    return <option key={facultad.facultadId} value={facultad.facultadId}>{facultad.facultadId}-{facultad.nombreFacultad}</option>
                })
                }
            </Input>
        </InputGroup>
        <InputGroup>
            <Input invalid={!isValidItem.email} valid={isValidItem.email} value={state.email} onChange={inputFunction} name="email" id="email" placeholder="jvelas" />
            <InputGroupText>
                @unicah.edu
            </InputGroupText>
        </InputGroup>
        <InputGroup>
            <InputGroupText>
                Número de Teléfono
            </InputGroupText>
            <MaskedInput maxLength={15} value={state.telefono} inputMaskChange={inputFunction} name="telefono" mask="phone" id="telefono" placeholder={maskPhone(PlaceHolder.phone)} />
        </InputGroup>
        <ButtonSecondary onClick={handleButtonNext} >Siguiente</ButtonSecondary>
    </div>
    function validate(value: string) {
        const valid = value !== '' ? !value.includes("@") : false
        setIsValidItem({
            ...isValidItem,
            [FormItems.email]: valid
        })
    }
}