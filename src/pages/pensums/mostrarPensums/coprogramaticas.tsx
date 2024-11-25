import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherPensum, Selector as SelectorPensum } from "../../../store/slices/pensums";
import { Container, Card, CardTitle, Row, Col, Button, CardHeader, CardFooter, ButtonGroup, FormGroup, Label, Input, Form, ModalBody, ModalFooter, Modal, ModalHeader, Spinner } from "reactstrap";
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

type ClasesPorBloque = Record<number, ClaseDetail[]>;

type ModalType = 'create' | 'edit' | 'status';

type ModalState = {
    isOpen: boolean;
    type: ModalType | null;
    currentClase?: ClaseDetail;
    currentBloque?: number;
};

type ClaseForm = Omit<ClaseDetail, 'estado'> & {
    facultadId: string;
    id_bloque: number;
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const clases = useSelector(SelectorPensum.getClases);
    const carreras = useSelector(SelectorPensum.getCarreras);

    const getTipoClase = (facultadId: string) => {
        return facultadId === 'IDIN01001' ? 2 : 4;
    };

    const loadData = async (facultadId: string) => {
        setIsLoading(true);
        try {
            const tipoClase = getTipoClase(facultadId);
            await Promise.all([
                dispatch(FetcherPensum.getClases({ url: `/pensum/getPensum?TipoClase=${tipoClase}` })),
                dispatch(FetcherPensum.getCarreras({ url: `/pensum/getPensumBy?facultadId=${facultadId}` }))
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

    const handleCloseModal = () => {
        setModal(INITIAL_MODAL_STATE);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = ['creditos', 'id_bloque'].includes(name) ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
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
                {facultades.find(f => f.id === facultadSeleccionada)?.nombre || 'Plan de Estudios'}
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
                        <FormGroup>
                            <Label for="docenteId">Buscar Docente</Label>
                            <Input
                                id="docenteId"
                                name="docente"
                                placeholder="cargon"
                                type="text"
                            >
                            </Input>
                        </FormGroup>
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
                    <Card body className={"mb-4"}>
                        <Row>
                            {clasesFiltradas[1]?.map((clase) => (
                                <Col key={clase.id_clase} md={3} className={"mb-3"}>
                                    <Card>
                                        <CardHeader>
                                            <h6 className={"text-muted mb-0"}> {clase.id_clase} </h6>
                                            <h5 className="mb-0">{clase.nombre_clase}</h5>
                                            <h6 className={"text-muted mb-0"}> Créditos: {clase.creditos} </h6>
                                        </CardHeader>
                                        <CardFooter>
                                            <ButtonGroup>
                                                <Button color="primary" onClick={() => {/*Implementar creación*/ }}><FontAwesomeIcon icon={faPlus} /> </Button>
                                                <Button
                                                    color={"success"}
                                                    onClick={() => handleOpenModal('edit', 1, clase)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <Button
                                                    color={clase.estado ? "warning" : "info"}
                                                    onClick={() => handleOpenModal('status', 1, clase)}
                                                    title={clase.estado ? "Desactivar" : "Activar"}
                                                >
                                                    <FontAwesomeIcon icon={clase.estado ? faBan : faCheck} />
                                                </Button>
                                            </ButtonGroup>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            ))}
                            <Col md={3} className={"mb-3"}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag={"h5"}> AGREGAR CLASE </CardTitle>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button color="primary" onClick={() => handleOpenModal('create', 1)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                )
            )}
            <Modal isOpen={modal.isOpen} toggle={handleCloseModal}>
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
                            < >
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
                            color={modal.type === 'status' ? (modal.currentClase?.estado ? 'warning' : 'success') : 'primary'}
                            type="submit"
                        >
                            {modal.type === 'create' && 'Crear'}
                            {modal.type === 'edit' && 'Guardar'}
                            {modal.type === 'status' && (modal.currentClase?.estado ? 'Desactivar' : 'Activar')}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Container>
    );
}