import React from "react";
import { InputGroup, InputGroupText, Input } from "reactstrap";
import { Type as DocentesType } from '@store/slices/docentes/_namespace';
import { ButtonSecondary } from "@components/shared/buttons";
import MaskedInput from "@components/shared/inputs";
import { Fetcher as FetcherFacultades, Selector as SelectorFacultades } from "@store/slices/facultades";
import { Fetcher as FetcherDocentes } from "@store/slices/docentes";
import { useDispatch, useSelector } from "@store/index";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { Post } from "@utilities/Utilities";
import { showInvitation } from "@utilities/invitations";
import { maskDNI, maskPhone } from "@components/shared/inputs/utils/index";
import '../../../admin/crearTernas/_ternas.css'
import Swal from 'sweetalert2';

type ValidItems = {
    email: boolean;
};

enum FormItems {
    email = "email"
}

enum PlaceHolder {
    phone = "50495000648",
    employee = "9090"
}

export default function CrearDocente() {

    const [isValidItem, setIsValidItem] = React.useState<ValidItems>({ email: false });
    const [state, setState] = React.useState<DocentesType.DocenteInfo>({
        docenteId: '',
        email: '',
        nombre: '',
        facultadId: '',
        telefono: '504',
        rol: ''
    });
    const dispatch = useDispatch();

    const inputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;

        setState({
            ...state,
            [name]: name === 'nombre' ? value.toUpperCase() : value
        });

        if (name === FormItems.email) {
            const emailWithDomain = value + '@unicah.edu';
            validate(emailWithDomain);
            setState((prevState) => ({
                ...prevState,
                email: emailWithDomain
            }));
        }
    };

    const clearForm = () => {
        setState({
            docenteId: '',
            email: '',
            nombre: '',
            facultadId: '',
            telefono: '504',
            rol: ''
        });
        setIsValidItem({ email: false });
    };

    const selectedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    React.useEffect(() => {
        const utils: TypeUtilities = {
            url: '/facultad/getFacultades'
        };
        dispatch(FetcherFacultades.getFacultades(utils));
        if (state.email !== "") {
            validate(state.email);
        }
    }, [dispatch]);

    const facultades = useSelector(SelectorFacultades.getFacultades);

    const [isSaving, setIsSaving] = React.useState(false);
    const savingRef = React.useRef(false);

    const handleSaveDocente = async () => {
        if (savingRef.current || !validateForm()) return;
        savingRef.current = true;
        setIsSaving(true);
        try {
            const response = await Post({
                url: '/user/register',
                data: { accountType: 'docente', profile: state },
            });
            if (response.error.code) {
                await Swal.fire({ icon: 'error', title: 'No se pudo crear el docente', text: response.error.message });
                return;
            }
            const result = response.singleData as { invitationToken: string };
            await showInvitation(result.invitationToken);
            dispatch(FetcherDocentes.getDocentes({ url: '/docente/getDocentes' }));
            clearForm();
        } finally {
            savingRef.current = false;
            setIsSaving(false);
        }
    };

    const validateForm = () => {
        return state.docenteId !== '' && state.nombre !== '' && isValidItem.email && state.email !== '' && state.facultadId !== '' && state.telefono !== '';
    };

    return (
        <div className="form-group">
            <h5 className="mb-4">Creación de Nuevo Docente</h5>
            <InputGroup>
                <InputGroupText>
                    Número de Empleado
                </InputGroupText>
                <MaskedInput maxLength={15} value={state.docenteId} inputMaskChange={inputFunction} name="docenteId" mask="employee" id="docenteId" placeholder={maskDNI(PlaceHolder.employee)} />
            </InputGroup>
            <InputGroup>
                <InputGroupText>
                    Nombre de Docente
                </InputGroupText>
                <Input value={state.nombre} onChange={inputFunction} name="nombre" id="nombre" className="nombre" placeholder="Nombre del Docente" />
            </InputGroup>
            <InputGroup>
                <InputGroupText>
                    Facultad
                </InputGroupText>
                <Input
                    id="facultadId"
                    name="facultadId"
                    type="select"
                    value={state.facultadId} onChange={selectedChange}>
                    {facultades && facultades.map((facultad) => (
                        <option key={facultad.facultadId} value={facultad.facultadId}>{facultad.facultadId} - {facultad.nombreFacultad}</option>
                    ))}
                </Input>
            </InputGroup>
            <InputGroup>
                <Input invalid={!isValidItem.email} valid={isValidItem.email} value={state.email.replace('@unicah.edu', '')} onChange={inputFunction} name="email" id="email" placeholder="jvelas" />
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
            <ButtonSecondary className="w-50" onClick={handleSaveDocente} disabled={isSaving || !validateForm()}>Guardar Datos</ButtonSecondary>
        </div>
    );

    function validate(value: string) {
        const isValid = value.includes("@unicah.edu");
        setIsValidItem({
            ...isValidItem,
            [FormItems.email]: isValid
        });
    }
}
