import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, ModalFooter, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { AlumnoInfo } from "@api/namespaces/alumno";
import { Props, type DEF } from "@api/typesProps";
import { TypeUtilities } from '@utilities/TypeUtilities';
import NotFound from "@components/shared/notFound";
import { Tables } from "@components/commons/tables/tables";
import DocenteInfo, { DocenteInfoType } from "@components/shared/docenteInfo";
import { ButtonPrimary, WhatsappButton } from "@components/shared/buttons";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherTernas, Selector as SelectorTernas, Action as ActionTerna } from '@store/slices/ternas';
import { Selector as UserSelector } from '@store/slices/users';
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from '@store/slices/docentes';
import { Action as ActionFiles } from '@store/slices/documentManager';
import { isEmpty } from "lodash";
import { StatusTerna, TernaRolDocente } from "@root/abstracts";
import Documentacion from "./documentacion";
import Swal from "sweetalert2";

export default function Docentes() {
    const dispatch = useDispatch();
    const [detalles, setDetalles] = useState<Record<number, DocenteInfoType[]>>({});
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTernaDocentes, setSelectedTernaDocentes] = useState<DocenteInfoType[]>([]);
    const [selectedTernaStatus, setSelectedTernaStatus] = useState<string | null>(null);
    const [selectedTernaId, setSelectedTernaId] = useState<number | null>(null);
    const [showDocumentacion, setShowDocumentacion] = useState(false);
    const [tabSel, setTabSel] = useState(0);
    const ternasDetalle = useSelector(SelectorTernas.getDetalleTernasDocente);
    const userLogged = useSelector(UserSelector.getUser);
    const docentes = useSelector(DocenteSelector.getDocentes);
    const ternas = useSelector(SelectorTernas.ternasInfo);
    const updateStatusTerna = useSelector(SelectorTernas.getUpdatedStatusResult);
    const toggleModal = () => setModalOpen(!modalOpen);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/detalleTernas/getDetalleTernas` };
        dispatch(FetcherTernas.getDetalleTernas(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch, userLogged]);

    useEffect(() => {
        if (!isEmpty(ternasDetalle) || updateStatusTerna === true) {
            const idTerna = ternasDetalle.map((terna) => terna.ternaId);
            const ternaIds = Array.from(new Set(idTerna)).join('&ternaId=');
            const utils: TypeUtilities = { url: `/ternas/getTernaBy?ternaId=${ternaIds}` };
            dispatch(FetcherTernas.getTernasInfo(utils));
            dispatch(ActionFiles.setRequestedChangesByDocente(false))
            dispatch(ActionTerna.setUpdatedStatus(false));
        }
    }, [dispatch, ternasDetalle, updateStatusTerna]);

    useEffect(() => {
        if (!isEmpty(ternasDetalle)) {
            const DetallesDocentes: Record<number, DocenteInfoType[]> = {};
            ternasDetalle.forEach((terna) => {
                const docentesData = docentes.find((docente) => docente.docenteId === terna.docenteId);
                if (docentesData) {
                    const ternaDetail: DocenteInfoType = {
                        ternaId: terna.ternaId,
                        rol: terna.rol === TernaRolDocente.COORDINA ? 'Coordinador' : terna.rol === TernaRolDocente.ESTILO ? 'Revisor de Estilos' : 'Revisor Técnico',
                        docenteId: docentesData.docenteId,
                        docenteNombre: docentesData.nombre,
                        docenteTelefono: docentesData.telefono,
                        docenteEmail: docentesData.email,
                    };
                    if (!DetallesDocentes[terna.ternaId]) {
                        DetallesDocentes[terna.ternaId] = [];
                    }
                    DetallesDocentes[terna.ternaId].push(ternaDetail);
                }
            });
            setDetalles(DetallesDocentes);
        }
    }, [ternasDetalle, userLogged, docentes]);

    useEffect(() => {
        const alumnosMapped: AlumnoInfo[] = [];
        if (!isEmpty(ternas)) {
            ternas.forEach((terna) => {
                if (terna.alumno) {
                    const data: AlumnoInfo = {
                        alumnoId: terna.alumno.alumnoId,
                        ternaId: terna.ternaId,
                        alumnoNombre: terna.alumno.nombre || "Sin nombre",
                        facultadId: terna.alumno.facultadId,
                        email: terna.alumno.email,
                        telefono: terna.alumno.telefono,
                        estadoTerna: terna.idEstadoTerna,
                    };
                    alumnosMapped.push(data);
                }
            });
            setAlumnos(alumnosMapped);
        }
    }, [ternas]);

    useEffect(() => {
        if (updateStatusTerna !== false) {
            Swal.fire({
                title: "Terna Actualizada",
                text: "El estado de la terna fue actualizado correctamente.",
                icon: "success",
            }).then(result => {
                if (result.isConfirmed) {
                    setModalOpen(false);
                }
            })
        }
    }, [updateStatusTerna])

    const VerDetalleTerna = (ternaId: number, estado: string) => {
        const ternaDocentes = detalles[ternaId] || [];
        setSelectedTernaDocentes(ternaDocentes);
        setSelectedTernaStatus(estado);
        setSelectedTernaId(ternaId);
        toggleModal();
    };

    const detalleCoordinador = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) =>
            terna.ternaId === alumno.ternaId &&
            terna.rol === 'coordina' &&
            terna.docenteId === userLogged.userId
        )
    );

    const detalleMiembro = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) =>
            terna.ternaId === alumno.ternaId &&
            !terna.rol &&
            terna.docenteId === userLogged.userId
        )
    );

    const tabs = [
        {
            title: 'Coordinador de terna', data: detalleCoordinador,
            headers: ['Terna ID', 'Nombre del alumno', 'Facultad', 'Email', 'Telefono', 'Acciones']
        },
        {
            title: 'Miembro de terna', data: detalleMiembro,
            headers: ['Terna ID', 'Nombre del alumno', 'Facultad', 'Email', 'Telefono', 'Acciones']
        },
    ]
    return (showDocumentacion === false ? <Container className='align-self-center w-100'>
        <Nav className="mt-5" justified tabs>
            {tabs && tabs.map((item, index) => {
                return <NavItem key={index}>
                    <NavLink
                        className={tabSel === index ? "active" : ""}
                        onClick={() => setTabSel(index)}
                    >
                        {item.title}
                    </NavLink>
                </NavItem>
            })}
        </Nav>
        <TabContent className="justify-items-center mt-5" activeTab={tabSel}>
            {tabs && tabs.map((item, index) => {
                return <TabPane key={index} tabId={index}>
                    <h4>{item.title}</h4>
                    {!isEmpty(item.data) ? (
                        <Tables
                            data={item.data.map((alumno) => ({
                                alumnoId: alumno.alumnoId,
                                nombre: alumno.alumnoNombre,
                                facultadId: alumno.facultadId,
                                email: alumno.email,
                                telefono: alumno.telefono,
                                acciones: (
                                    <ButtonGroup>
                                        <Button
                                            color="primary"
                                            onClick={() => VerDetalleTerna(alumno.ternaId, StatusTerna[alumno.estadoTerna])}>
                                            Detalle
                                        </Button>
                                        <Button onClick={() => {
                                            dispatch(ActionFiles.cleanStore());
                                            if (userLogged.roleId === 2) {
                                                dispatch(ActionFiles.setRequestedChangesByDocente(true))
                                                dispatch(ActionFiles.setSelectedAlumno(alumno))
                                            }
                                            setShowDocumentacion(true);
                                        }}>Documentación</Button>
                                        <WhatsappButton telefono={alumno.telefono} />
                                    </ButtonGroup>
                                ),
                            }))}
                            headers={item.headers}
                            firstColumnIndex={0}
                            paginated={false}
                        />
                    ) : (
                        <NotFound />
                    )}
                </TabPane>
            })}
        </TabContent>
        <CustomModal showModal={modalOpen} toggleModal={toggleModal} selectedTernaStatus={selectedTernaStatus} selectedTernaDocentes={selectedTernaDocentes} idTerna={selectedTernaId} />
    </Container> : <Documentacion onClick={() => {
        dispatch(ActionFiles.cleanStore());
        setShowDocumentacion(false);
        dispatch(ActionFiles.setRequestedChangesByDocente(false));
        dispatch(ActionFiles.cleanSelectedAlumno);
    }} />
    );
}

type ProposCustomModal = {
    showModal: boolean;
    toggleModal: () => void;
    selectedTernaStatus: string | null;
    selectedTernaDocentes: DocenteInfoType[];
    idTerna: number;
}

function CustomModal(props: Props<ProposCustomModal, typeof DEF>) {
    const { showModal, toggleModal, selectedTernaStatus, selectedTernaDocentes, idTerna } = props;
    const dispatch = useDispatch();
    const [newStatus, setNewStatus] = useState(undefined);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [itemSelected, setItemSelected] = useState("Seleccione el estado");

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const handleChangeDropdown = (idStatus: number, estado: string) => {
        setNewStatus(idStatus);
        setItemSelected(estado);
    }
    const handleUpdateTerna = () => {
        const utils: TypeUtilities = {
            url: "/ternas/updateTerna",
            data: {
                idTerna,
                estadoTerna: newStatus
            }
        }
        dispatch(FetcherTernas.updateTernaState(utils));
        setItemSelected("Seleccione el estado");
    }
    return <Modal isOpen={showModal} toggle={toggleModal} className="modal-size">
        <ModalHeader toggle={toggleModal}>
            {`Docentes en la terna - Estado: ${selectedTernaStatus}`}
        </ModalHeader>
        <ModalBody className="modal-font-size">
            {selectedTernaDocentes.length > 0 ? (
                selectedTernaDocentes.map((docente) => (
                    <DocenteInfo key={docente.docenteId} docente={docente} />
                ))
            ) : (
                <NotFound />
            )}
        </ModalBody>
        {selectedTernaDocentes.length > 0 &&
            <ModalFooter className="d-flex justify-content-center">
                <Dropdown color="primary" isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>{itemSelected}</DropdownToggle>
                    <DropdownMenu>
                        {Object.entries(StatusTerna).map(([idTerna, estado]) => {
                            return <DropdownItem key={idTerna} onClick={() => handleChangeDropdown(Number(idTerna), estado)}>
                                {estado}
                            </DropdownItem>
                        })}
                    </DropdownMenu>
                </Dropdown>
                <ButtonPrimary onClick={handleUpdateTerna}>
                    Actualizar Terna
                </ButtonPrimary>
            </ModalFooter>
        }
    </Modal>
}