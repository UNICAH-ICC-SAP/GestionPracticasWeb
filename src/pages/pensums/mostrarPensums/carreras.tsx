import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../store";

import type { Type as TypePensums } from "../../../store/slices/pensums/_namespace";
import type { Type as TypeSecciones } from "../../../store/slices/secciones/_namespace";
import type { Type as TypeModals } from "../../../Api/namespaces/modals";

import { Action as ActionPensum, Fetcher as FetcherPensum, Selector as SelectorPensum } from "../../../store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../store/slices/docentes';
import { Action as ActionSecciones, Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '../../../store/slices/secciones';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "../../../store/slices/periodo";
import { Fetcher as FetcherFacultad, Selector as SelectorFacultad } from "../../../store/slices/facultades";

import { Container, Card, Row, Col, Button, CardHeader, ButtonGroup, FormGroup, Label, Input, Form, ModalBody, ModalFooter, Modal, ModalHeader, Spinner, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import NotFound from "../../../components/shared/notFound";
import { isEmpty } from "lodash";

import { days, MODALS_TYPES } from "../../../consts"

type ClasesPorBloque = Record<number, TypePensums.ClaseInfo[]>;

type ClaseForm = Omit<TypePensums.ClaseInfo, 'estado'> & {
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

const INITIAL_MODAL_STATE: TypeModals.ModalState = {
    isOpen: false,
    type: null
};

export default function Carreras() {
    const dispatch = useDispatch();
    const [filtroClase, setFiltroClase] = useState<string>('');
    const [clasesFiltradas, setClasesFiltradas] = useState<ClasesPorBloque>({});
    const [clasesPorBloque, setClasesPorBloque] = useState<ClasesPorBloque>({});
    const [facultadSeleccionada, setFacultadSeleccionada] = useState<string>('IG04001');
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const [modal, setModal] = useState<TypeModals.ModalState>(INITIAL_MODAL_STATE);
    const [formData, setFormData] = useState<ClaseForm>(INITIAL_FORM_STATE);
    const [sectionForm, setSectionForm] = useState<SectionForm>(INITIAL_SECTION_FORM);

    const isLoading = useSelector(SelectorPensum.getIsLoading);
    const isUpdatePensum = useSelector(SelectorPensum.getIsUpdate);
    const isUpdateSecciones = useSelector(SelectorSecciones.getIsUpdate);
    const clases = useSelector(SelectorPensum.getClases);
    const carreras = useSelector(SelectorPensum.getCarreras);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const secciones = useSelector(SelectorSecciones.getSecciones);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const facultades = useSelector(SelectorFacultad.getFacultades);

    useEffect(() => {
        if (clases && carreras && periodos && isLoading) {
            dispatch(ActionPensum.setIsLoading(false));
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo)
        }
        if (clases === null && carreras === null && periodos === null && !isLoading) {
            dispatch(ActionPensum.setIsLoading(true));
            dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" }));
            dispatch(FetcherPensum.getCarreras({ url: `/pensum/getPensumBy?facultadId=${facultadSeleccionada}` }));
            dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" }));
            dispatch(FetcherSecciones.getSecciones({ url: `/secciones/getSections?id_periodo=${periodoSeleccionado}` }));
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
            dispatch(FetcherFacultad.getFacultades({ url: "/facultad/getFacultades" }))
        }
    }, [dispatch, clases, carreras, periodos]);

    useEffect(() => {
        dispatch(FetcherPensum.getCarreras({ url: `/pensum/getPensumBy?facultadId=${facultadSeleccionada}` }))
    }, [facultadSeleccionada, isUpdatePensum]);

    useEffect(() => {
        dispatch(FetcherSecciones.getSecciones({ url: `/secciones/getSections?id_periodo=${periodoSeleccionado}` }));
    }, [periodoSeleccionado, isUpdateSecciones]);

    useEffect(() => {
        if (!clases?.length || !carreras?.length) return;

        const clasesConBloque = clases.map(clase => ({
            ...clase,
            bloque: carreras.find(c => c.id_clase === clase.id_clase)?.id_bloque
        }));

        const porBloque = clasesConBloque.reduce<ClasesPorBloque>((acc, clase) => {
            if (clase.bloque) {
                if (!acc[clase.bloque]) {
                    acc[clase.bloque] = [];
                }
                acc[clase.bloque].push(clase);
            }
            return acc;
        }, {});

        setClasesPorBloque(porBloque);
        setClasesFiltradas(porBloque);
    }, [clases, carreras]);

    const getDayName = (day: number): string => {
        return days[day] || '';
    };

    const handleOpenModal = (type: TypeModals.ModalType, bloque?: number, clase?: TypePensums.ClaseInfo) => {
        const newFormData = type === MODALS_TYPES.CREATE
            ? { ...INITIAL_FORM_STATE, id_bloque: bloque || 1, facultadId: facultadSeleccionada }
            : type === MODALS_TYPES.EDIT && clase
                ? {
                    id_clase: clase.id_clase,
                    nombre_clase: clase.nombre_clase,
                    creditos: clase.creditos,
                    TipoClase: clase.TipoClase,
                    facultadId: facultadSeleccionada,
                    id_bloque: clase.bloque || 1
                }
                : INITIAL_FORM_STATE;

        setFormData(newFormData);
        setModal({ isOpen: true, type, currentClase: clase, currentBloque: bloque });
    };

    const handleOpenSectionModal = (type: TypeModals.ModalType, clase: TypePensums.ClaseInfo, seccion?: TypeSecciones.SeccionInfo) => {
        const newSectionForm = type === MODALS_TYPES.CREATE_SECCION
            ? {
                ...INITIAL_SECTION_FORM,
                id_clase: clase.id_clase,
                horario_especial: false
            }
            : type === MODALS_TYPES.EDIT_SECCION && seccion
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
        dispatch(ActionPensum.setIsUpdate(true));
        switch (modal.type) {
            case MODALS_TYPES.CREATE:
                dispatch(FetcherPensum.insertClase({
                    url: '/pensum/insert',
                    data: formData
                }));
                break;
            case MODALS_TYPES.EDIT:
                dispatch(FetcherPensum.updateClase({
                    url: `/pensum/update?id_clase=${modal?.currentClase?.id_clase}`,
                    data: formData
                }))
                break;
            case MODALS_TYPES.STATUS:
                dispatch(FetcherPensum.updateClase({
                    url: `/pensum/updateStatus?id_clase=${modal?.currentClase?.id_clase}`,
                }))
                break;
        }
        handleCloseModal();
    };

    const handleSectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(ActionSecciones.setIsUpdate(true));

        switch (modal.type) {
            case MODALS_TYPES.CREATE_SECCION:
                dispatch(FetcherSecciones.insertSeccion({
                    url: '/secciones/insertSection',
                    data: {
                        ...sectionForm,
                        id_clase: modal.currentClase?.id_clase,
                        horario_especial: sectionForm.horario_especial ? 1 : 0
                    }
                }));
                break;
            case MODALS_TYPES.EDIT_SECCION:
                dispatch(FetcherSecciones.updateSeccion({
                    url: "/secciones/updateSection",
                    data: {
                        ...sectionForm,
                        id_clase: modal.currentClase?.id_clase,
                        horario_especial: sectionForm.horario_especial ? 1 : 0
                    }
                }));
                break;
            case MODALS_TYPES.DELETE_SECCION:
                dispatch(FetcherSecciones.deleteSection({
                    url: `/secciones/deleteSection?id_clase=${modal.currentClase?.id_clase}&seccion=${sectionForm.seccion}`,
                }));
                break;
        }
        handleCloseModal();
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
    };
    const handleChangePeriodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const periodo = e.target.value;
        setPeriodoSeleccionado(periodo);
    };
    return (
        <Container>
            <h4 className="mb-3">
                {facultades.find(f => f.facultadId === facultadSeleccionada)?.nombreFacultad}
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
                                    <option key={facultad.facultadId} value={facultad.facultadId}>
                                        {facultad.nombreFacultad}
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
                                value={periodoSeleccionado}
                                onChange={handleChangePeriodo}
                            >
                                {periodos && periodos.map(facultad => (
                                    <option key={facultad.id_periodo} value={facultad.id_periodo}>
                                        {facultad.id_periodo}
                                    </option>
                                ))}
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
                            onClick={() => handleOpenModal(MODALS_TYPES.CREATE as TypeModals.ModalType)}
                        >
                            AGREGAR CLASE
                        </Button>
                    </Col>
                </Row>
            </Form>

            {isLoading || isUpdatePensum || isUpdateSecciones ? (
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
                                                        onClick={() => handleOpenSectionModal(MODALS_TYPES.CREATE_SECCION as TypeModals.ModalType, clase)}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>
                                                    <Button
                                                        color={"success"}
                                                        onClick={() => handleOpenModal(MODALS_TYPES.EDIT as TypeModals.ModalType, parseInt(bloque), clase)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button
                                                        color={"warning"}
                                                        onClick={() => handleOpenModal(MODALS_TYPES.STATUS as TypeModals.ModalType, parseInt(bloque), clase)}
                                                    >
                                                        <FontAwesomeIcon icon={clase.estado ? faBan : faCheck} />
                                                    </Button>
                                                </ButtonGroup>
                                            </CardHeader>
                                            <CardBody>
                                                {secciones.length > 0 && carreras && secciones
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
                                                                    handleOpenSectionModal(MODALS_TYPES.EDIT_SECCION as TypeModals.ModalType, clase, seccion);
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

            <Modal isOpen={modal.isOpen && [MODALS_TYPES.CREATE, MODALS_TYPES.EDIT, MODALS_TYPES.STATUS].includes(modal.type || '')} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>
                    {modal.type === MODALS_TYPES.CREATE && 'Crear Nueva Clase'}
                    {modal.type === MODALS_TYPES.EDIT && 'Editar Clase'}
                    {modal.type === MODALS_TYPES.STATUS && 'Cambiar Estado de Clase'}
                </ModalHeader>
                <Form onSubmit={handleSubmit}>
                    <ModalBody>
                        {modal.type === MODALS_TYPES.STATUS ? (
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
                            {modal.type === MODALS_TYPES.CREATE && 'Agregar'}
                            {modal.type === MODALS_TYPES.EDIT && 'Guardar'}
                            {modal.type === MODALS_TYPES.STATUS && 'Desactivar'}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal isOpen={modal.isOpen && [MODALS_TYPES.CREATE_SECCION, MODALS_TYPES.EDIT_SECCION, MODALS_TYPES.DELETE_SECCION].includes(modal.type || '')} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>
                    {modal.type === MODALS_TYPES.CREATE_SECCION && `Agregar Sección - ${modal.currentClase?.nombre_clase}`}
                    {modal.type === MODALS_TYPES.EDIT_SECCION && `Editar Sección - ${modal.currentClase?.nombre_clase}`}
                    {modal.type === MODALS_TYPES.DELETE_SECCION && `Eliminar Sección - ${modal.currentClase?.nombre_clase}`}
                </ModalHeader>
                <Form onSubmit={handleSectionSubmit}>
                    <ModalBody>
                        {modal.type === MODALS_TYPES.DELETE_SECCION ? (
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
                                        disabled={modal.type === MODALS_TYPES.CREATE_SECCION}
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
                                        {days && days.map((day, index) => {
                                            return <option key={day + index + 1} value={index + 1}>{day}</option>
                                        })}
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
                                        {days && days.map((day, index) => {
                                            return <option key={day + index + 2} value={index + 1}>{day}</option>
                                        })}
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
                        {modal.type === MODALS_TYPES.EDIT_SECCION && (
                            <Button
                                color="danger"
                                onClick={() => setModal(prev => ({ ...prev, type: MODALS_TYPES.DELETE_SECCION as TypeModals.ModalType }))}
                            >
                                Eliminar
                            </Button>
                        )}
                        <Button
                            color="primary"
                            type="submit"
                        >
                            {modal.type === MODALS_TYPES.CREATE_SECCION && 'Agregar'}
                            {modal.type === MODALS_TYPES.EDIT_SECCION && 'Guardar'}
                            {modal.type === MODALS_TYPES.DELETE_SECCION && 'Eliminar'}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Container>
    );
}