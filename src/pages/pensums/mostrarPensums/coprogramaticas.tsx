import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherPensum, Selector as SelectorPensum } from "../../../store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../store/slices/docentes';
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '../../../store/slices/secciones';
import { Container, Card, Row, Col, Button, CardHeader, ButtonGroup, FormGroup, Label, Input, Form, ModalBody, ModalFooter, Modal, ModalHeader, Spinner, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import NotFound from "../../../components/shared/notFound";
import { isEmpty } from "lodash";

type ClaseDetail = {
    id_clase: string;
    nombre_clase: string;
    creditos: number;
    estado: boolean;
    TipoClase: number;
    bloque?: number;
};

type SeccionDetail = {
    id_detalle: number;
    seccion: string;
    docenteId: string;
    id_ccb: number;
    id_periodo: string;
    hora_inicio: string;
    dia_inicio: number;
    dia_final: number;
    hora_final: string;
    horario_especial?: boolean;
}

type ClasesPorBloque = Record<number, ClaseDetail[]>;

type ModalType = 'create' | 'edit' | 'status' | 'createSeccion' | 'editSeccion' | 'deleteSeccion';

type ModalState = {
    isOpen: boolean;
    type: ModalType | null;
    currentClase?: ClaseDetail;
    currentBloque?: number;
    nestedModal?: 'statusSeccion';
};

type ClaseForm = Omit<ClaseDetail, 'estado'> & {
    facultadId: string;
    id_bloque: number;
};

type SectionForm = {
    docenteId: string;
    id_clase: string;
    hora_inicio: string;
    hora_final: string;
    dia_inicio: number;
    dia_final: number;
    horario_especial?: boolean;
    seccion?: string;
};

const facultades: { id: string; nombre: string }[] = [
    { id: 'IDIN01001', nombre: 'Diplomado Ingles' },
    { id: 'COP', nombre: 'Coprogramaticas' },
];

const INITIAL_FORM_STATE: ClaseForm = {
    id_clase: '',
    nombre_clase: '',
    creditos: 0,
    TipoClase: 1,
    facultadId: '',
    id_bloque: 1
};

const INITIAL_SECTION_FORM: SectionForm = {
    docenteId: '',
    id_clase: '',
    hora_inicio: '',
    hora_final: '',
    dia_inicio: 1,
    dia_final: 1,
    horario_especial: false,
};

const INITIAL_MODAL_STATE: ModalState = {
    isOpen: false,
    type: null
};

export default function Coprogramaticas() {
    const dispatch = useDispatch();
    const [filtroClase, setFiltroClase] = useState<string>('');
    const [clasesFiltradas, setClasesFiltradas] = useState<ClasesPorBloque>({});
    const [clasesPorBloque, setClasesPorBloque] = useState<ClasesPorBloque>({});
    const [facultadSeleccionada, setFacultadSeleccionada] = useState<string>('IDIN01001');
    const [modal, setModal] = useState<ModalState>(INITIAL_MODAL_STATE);
    const [formData, setFormData] = useState<ClaseForm>(INITIAL_FORM_STATE);
    const [sectionForm, setSectionForm] = useState<SectionForm>(INITIAL_SECTION_FORM);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const clases = useSelector(SelectorPensum.getClases);
    const carreras = useSelector(SelectorPensum.getCarreras);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const secciones = useSelector(SelectorSecciones.getSecciones);

    const getTipoClase = (facultadId: string) => {
        return facultadId === 'IDIN01001' ? 2 : 4;
    };

    const loadData = async (facultadId: string) => {
        setIsLoading(true);
        const tipoClase = getTipoClase(facultadId);
        try {
            await Promise.all([
                dispatch(FetcherPensum.getClases({ url: `/pensum/getPensum?TipoClase=${tipoClase}` })),
                dispatch(FetcherPensum.getCarreras({ url: `/pensum/getPensumBy?facultadId=${facultadId}` })),
                dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" })),
                dispatch(FetcherSecciones.getSecciones({ url: "/secciones/getSections?id_periodo=I-2025" }))
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData(facultadSeleccionada);
    }, []);

    useEffect(() => {
        if (!clases?.length || !carreras?.length) return;

        const clasesConBloque = clases.map(clase => ({
            ...clase,
            bloque: carreras.find(c => c.id_clase === clase.id_clase)?.id_bloque || 1
        }));

        const todasLasClases: ClasesPorBloque = {
            1: clasesConBloque
        };

        setClasesPorBloque(todasLasClases);
        setClasesFiltradas(todasLasClases);
    }, [clases, carreras]);


    const getDayName = (day: number): string => {
        const days = ['', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
        return days[day] || '';
    };

    const handleOpenModal = (type: ModalType, bloque?: number, clase?: ClaseDetail) => {
        const tipoClase = getTipoClase(facultadSeleccionada);
        const newFormData = type === 'create'
            ? { ...INITIAL_FORM_STATE, id_bloque: bloque || 1, facultadId: facultadSeleccionada }
            : type === 'edit' && clase
                ? {
                    id_clase: clase.id_clase,
                    nombre_clase: clase.nombre_clase,
                    creditos: clase.creditos,
                    TipoClase: tipoClase,
                    facultadId: facultadSeleccionada,
                    id_bloque: clase.bloque || 1
                }
                : INITIAL_FORM_STATE;

        setFormData(newFormData);
        setModal({ isOpen: true, type, currentClase: clase, currentBloque: bloque });
    };

    const handleOpenSectionModal = (type: ModalType, clase: ClaseDetail, seccion?: SeccionDetail) => {
        const newSectionForm = type === 'createSeccion'
            ? {
                ...INITIAL_SECTION_FORM,
                id_clase: clase.id_clase,
                horario_especial: false
            }
            : type === 'editSeccion' && seccion
                ? {
                    docenteId: seccion.docenteId,
                    id_clase: clase.id_clase,
                    seccion: seccion.seccion,
                    hora_inicio: seccion.hora_inicio,
                    hora_final: seccion.hora_final,
                    dia_inicio: seccion.dia_inicio,
                    dia_final: seccion.dia_final,
                    horario_especial: seccion.horario_especial ?? false
                }
                : INITIAL_SECTION_FORM;

        setSectionForm(newSectionForm);
        setModal({ isOpen: true, type, currentClase: clase });
    };

    const handleCloseModal = () => {
        setModal(INITIAL_MODAL_STATE);
        setFormData(INITIAL_FORM_STATE);
        setSectionForm(INITIAL_SECTION_FORM);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = ['creditos', 'id_bloque'].includes(name) ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSectionForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const actions = {
                create: () => dispatch(FetcherPensum.insertClase({
                    url: '/pensum/insert',
                    data: formData
                })),
                edit: () => modal.currentClase && dispatch(FetcherPensum.updateClase({
                    url: `/pensum/update?id_clase=${modal.currentClase.id_clase}`,
                    data: formData
                })),
                status: () => modal.currentClase && dispatch(FetcherPensum.updateClase({
                    url: `/pensum/updateStatus?id_clase=${modal.currentClase.id_clase}`,
                }))
            };

            if (modal.type && actions[modal.type]) {
                await actions[modal.type]();
                await loadData(facultadSeleccionada);
                handleCloseModal();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const actions = {
                createSeccion: () => dispatch(FetcherSecciones.insertSeccion({
                    url: '/secciones/insertSection',
                    data: {
                        ...sectionForm,
                        id_clase: modal.currentClase?.id_clase,
                        horario_especial: sectionForm.horario_especial ? 1 : 0
                    }
                })),
                editSeccion: () => dispatch(FetcherSecciones.updateSeccion({
                    url: "/secciones/updateSection",
                    data: {
                        ...sectionForm,
                        id_clase: modal.currentClase?.id_clase,
                        horario_especial: sectionForm.horario_especial ? 1 : 0
                    }
                })),
                deleteSeccion: () => dispatch(FetcherSecciones.deleteSection({
                    url: `/secciones/deleteSection?id_clase=${modal.currentClase?.id_clase}&seccion=${sectionForm.seccion}`,
                }))
            };

            if (modal.type && actions[modal.type]) {
                await actions[modal.type]();
                await loadData(facultadSeleccionada);
                handleCloseModal();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtro = e.target.value.toLowerCase();
        setFiltroClase(filtro);

        if (!filtro) {
            setClasesFiltradas(clasesPorBloque);
            return;
        }

        const bloquesFiltrados = Object.entries(clasesPorBloque).reduce<ClasesPorBloque>((acc, [bloque, clases]) => {
            const clasesFiltradas = clases.filter(clase =>
                clase.nombre_clase.toLowerCase().includes(filtro) ||
                clase.id_clase.toLowerCase().includes(filtro)
            );

            if (clasesFiltradas.length) {
                acc[parseInt(bloque)] = clasesFiltradas;
            }
            return acc;
        }, {});

        setClasesFiltradas(bloquesFiltrados);
    };

    const handleFacultadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevaFacultad = e.target.value;
        setFacultadSeleccionada(nuevaFacultad);
        loadData(nuevaFacultad);
    };

    return (
        <Container>
            <h4 className="mb-3">
                {facultades.find(f => f.id === facultadSeleccionada)?.nombre}
            </h4>
            <Form>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="facultadId">Facultad</Label>
                            <Input
                                id="facultadId"
                                name="facultad"
                                type="select"
                                value={facultadSeleccionada}
                                onChange={handleFacultadChange}
                            >
                                {facultades.map(facultad => (
                                    <option key={facultad.id} value={facultad.id}>
                                        {facultad.nombre}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="periodoId">Periodo</Label>
                            <Input
                                id="periodoId"
                                name="periodo"
                                type="select"
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="filtroClaseId">Buscar Clase</Label>
                            <Input
                                id="filtroClaseId"
                                name="filtroClase"
                                placeholder="Matemáticas"
                                type="text"
                                value={filtroClase}
                                onChange={handleFiltroChange}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <Button
                            color={"primary"}
                            onClick={() => handleOpenModal('create')}
                        >
                            AGREGAR CLASE
                        </Button>
                    </Col>
                </Row>
            </Form>

            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner color="primary">
                        Loading...
                    </Spinner>
                </div>
            ) : (
                isEmpty(clasesFiltradas) ? (
                    <NotFound />
                ) : (
                    Object.entries(clasesFiltradas).map(([bloque, clases]) => (
                        <Card body key={bloque} className={"mb-4"}>
                            <CardHeader className={"mb-3"} tag={"h4"}>Bloque {bloque}</CardHeader>
                            <Row>
                                {clases.map((clase) => (
                                    <Col key={clase.id_clase} md={3} className={"mb-3"}>
                                        <Card>
                                            <CardHeader>
                                                <h6 className={"text-muted mb-0"}> {clase.id_clase} </h6>
                                                <h5 className={"mb-0"}>{clase.nombre_clase}</h5>
                                                <h6 className={"text-muted"}> Créditos: {clase.creditos} </h6>
                                                <ButtonGroup>
                                                    <Button
                                                        color={"primary"}
                                                        onClick={() => handleOpenSectionModal('createSeccion', clase)}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>
                                                    <Button
                                                        color={"success"}
                                                        onClick={() => handleOpenModal('edit', parseInt(bloque), clase)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button
                                                        color={"warning"}
                                                        onClick={() => handleOpenModal('status', parseInt(bloque), clase)}
                                                    >
                                                        <FontAwesomeIcon icon={clase.estado ? faBan : faCheck} />
                                                    </Button>
                                                </ButtonGroup>
                                            </CardHeader>
                                            <CardBody>
                                                {secciones
                                                    ?.filter(seccion => {
                                                        const carrera = carreras.find(c => c.id_clase === clase.id_clase);
                                                        return carrera && seccion.id_ccb === carrera.id_ccb;
                                                    })
                                                    .map((seccion, index, array) => (
                                                        <div key={seccion.id_detalle}>
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleOpenSectionModal('editSeccion', clase, seccion);
                                                                }}
                                                                className="text-decoration-none text-inherit"
                                                            >
                                                                <Row className="mx-0">
                                                                    <Col>
                                                                        <p className="fw-bold mb-1">
                                                                            Sección {seccion.seccion}
                                                                        </p>
                                                                        <p className="text-muted small mb-1">
                                                                            Días: {getDayName(seccion.dia_inicio)}
                                                                            {seccion.dia_inicio !== seccion.dia_final && ` - ${getDayName(seccion.dia_final)}`}
                                                                        </p>
                                                                        <p className="text-muted small mb-1">
                                                                            Hora: {seccion.hora_inicio} - {seccion.hora_final}
                                                                        </p>
                                                                        <p className="text-muted small mb-0">
                                                                            Profesor: {docentes?.find(d => d.docenteId === seccion.docenteId)?.nombre || 'No asignado'}
                                                                        </p>
                                                                    </Col>
                                                                </Row>
                                                            </a>
                                                            {index < array.length - 1 && <hr className="opacity-10 my-2" />}
                                                        </div>
                                                    ))}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    ))
                )
            )}

            <Modal isOpen={modal.isOpen && ['create', 'edit', 'status'].includes(modal.type || '')} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>
                    {modal.type === 'create' && 'Crear Nueva Clase'}
                    {modal.type === 'edit' && 'Editar Clase'}
                    {modal.type === 'status' && 'Cambiar Estado de Clase'}
                </ModalHeader>
                <Form onSubmit={handleSubmit}>
                    <ModalBody>
                        {modal.type === 'status' ? (
                            <div className="text-center">
                                <h5>¿Está seguro que desea {modal.currentClase?.estado ? 'desactivar' : 'activar'} la clase?</h5>
                                <p className="mb-0">Clase: {modal.currentClase?.nombre_clase}</p>
                                <p className="mb-0">Código: {modal.currentClase?.id_clase}</p>
                                <p className="mb-0">Créditos: {modal.currentClase?.creditos}</p>
                            </div>
                        ) : (
                            <>
                                <FormGroup>
                                    <Label for="id_clase">Código de Clase</Label>
                                    <Input
                                        id="id_clase"
                                        name="id_clase"
                                        value={formData.id_clase}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="nombre_clase">Nombre de Clase</Label>
                                    <Input
                                        id="nombre_clase"
                                        name="nombre_clase"
                                        value={formData.nombre_clase}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="creditos">Créditos</Label>
                                    <Input
                                        id="creditos"
                                        name="creditos"
                                        type="number"
                                        value={formData.creditos}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="id_bloque">Bloque</Label>
                                    <Input
                                        id="id_bloque"
                                        name="id_bloque"
                                        type="number"
                                        value={formData.id_bloque}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button
                            color='primary'
                            type="submit"
                        >
                            {modal.type === 'create' && 'Agregar'}
                            {modal.type === 'edit' && 'Guardar'}
                            {modal.type === 'status' && 'Desactivar'}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal isOpen={modal.isOpen && ['createSeccion', 'editSeccion', 'deleteSeccion'].includes(modal.type || '')} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>
                    {modal.type === 'createSeccion' && `Agregar Sección - ${modal.currentClase?.nombre_clase}`}
                    {modal.type === 'editSeccion' && `Editar Sección - ${modal.currentClase?.nombre_clase}`}
                    {modal.type === 'deleteSeccion' && `Eliminar Sección - ${modal.currentClase?.nombre_clase}`}
                </ModalHeader>
                <Form onSubmit={handleSectionSubmit}>
                    <ModalBody>
                        {modal.type === 'deleteSeccion' ? (
                            <div className="text-center">
                                <h5>¿Está seguro que desea eliminar esta sección?</h5>
                                <p className="mb-0">Sección: {sectionForm.seccion}</p>
                                <p className="mb-0">Clase: {modal.currentClase?.nombre_clase}</p>
                                <p className="mb-0">Código: {modal.currentClase?.id_clase}</p>
                            </div>
                        ) : (
                            <>
                                <FormGroup>
                                    <Label for="docenteId">Docente</Label>
                                    <Input
                                        id="docenteId"
                                        name="docenteId"
                                        type="select"
                                        value={sectionForm.docenteId}
                                        onChange={handleSectionInputChange}
                                        required
                                    >
                                        <option value="">Seleccione un docente</option>
                                        {docentes?.map(docente => (
                                            <option key={docente.docenteId} value={docente.docenteId}>
                                                {docente.nombre}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="seccion">Sección</Label>
                                    <Input
                                        id="seccion"
                                        name="seccion"
                                        type="text"
                                        value={sectionForm.seccion}
                                        onChange={handleSectionInputChange}
                                        disabled={modal.type === 'createSeccion'}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="dia_inicio">Día Inicio</Label>
                                    <Input
                                        id="dia_inicio"
                                        name="dia_inicio"
                                        type="select"
                                        value={sectionForm.dia_inicio}
                                        onChange={handleSectionInputChange}
                                        required
                                    >
                                        <option value="1">Lunes</option>
                                        <option value="2">Martes</option>
                                        <option value="3">Miércoles</option>
                                        <option value="4">Jueves</option>
                                        <option value="5">Viernes</option>
                                        <option value="6">Sábado</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="dia_final">Día Final</Label>
                                    <Input
                                        id="dia_final"
                                        name="dia_final"
                                        type="select"
                                        value={sectionForm.dia_final}
                                        onChange={handleSectionInputChange}
                                        required
                                    >
                                        <option value="1">Lunes</option>
                                        <option value="2">Martes</option>
                                        <option value="3">Miércoles</option>
                                        <option value="4">Jueves</option>
                                        <option value="5">Viernes</option>
                                        <option value="6">Sábado</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="hora_inicio">Hora Inicio</Label>
                                    <Input
                                        id="hora_inicio"
                                        name="hora_inicio"
                                        type="time"
                                        value={sectionForm.hora_inicio}
                                        onChange={handleSectionInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="hora_final">Hora Final</Label>
                                    <Input
                                        id="hora_final"
                                        name="hora_final"
                                        type="time"
                                        value={sectionForm.hora_final}
                                        onChange={handleSectionInputChange}
                                        disabled={!sectionForm.horario_especial}
                                        required={sectionForm.horario_especial}
                                    />
                                </FormGroup>
                                <FormGroup check className="mb-3">
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            name="horario_especial"
                                            checked={sectionForm.horario_especial}
                                            onChange={handleSectionInputChange}
                                        />{' '}
                                        Horario Especial
                                    </Label>
                                </FormGroup>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        {modal.type === 'editSeccion' && (
                            <Button
                                color="danger"
                                onClick={() => setModal(prev => ({ ...prev, type: 'deleteSeccion' }))}
                            >
                                Eliminar
                            </Button>
                        )}
                        <Button
                            color="primary"
                            type="submit"
                        >
                            {modal.type === 'createSeccion' && 'Agregar'}
                            {modal.type === 'editSeccion' && 'Guardar'}
                            {modal.type === 'deleteSeccion' && 'Eliminar'}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Container>
    );
}