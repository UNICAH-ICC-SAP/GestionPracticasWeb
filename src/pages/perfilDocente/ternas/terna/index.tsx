import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup } from "reactstrap";
import { TypeUtilities } from '@utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '@store/slices/ternas';
import { useDispatch, useSelector } from "@store/index";
import { Selector as UserSelector } from '@store/slices/users';
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from '@store/slices/docentes';
import { Action as ActionFiles } from '@store/slices/documentManager';
import { isEmpty } from "lodash";
import NotFound from "@components/shared/notFound";
import { Tables } from "@components/commons/tables/tables";
import DocenteInfo, { DocenteInfoType } from "@components/shared/docenteInfo";
import { WhatsappButton } from "@components/shared/buttons";
import { TernaRolDocente } from "@root/abstracts";
import Documentacion from "./documentacion";
import { AlumnoInfo } from "@api/namespaces/alumno";

export default function Docentes() {
    const dispatch = useDispatch();
    const [detalles, setDetalles] = useState<Record<number, DocenteInfoType[]>>({});
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTernaDocentes, setSelectedTernaDocentes] = useState<DocenteInfoType[]>([]);
    const [selectedTernaId, setSelectedTernaId] = useState<number | null>(null);
    const [showDocumentacion, setShowDocumentacion] = useState(false);
    const [tabSel, setTabSel] = useState(0);
    const [selectedAlumno, setSelectedAlumno] = useState<AlumnoInfo | undefined>()
    const ternasDetalle = useSelector(SelectorTernas.getDetalleTernasDocente);
    const userLogged = useSelector(UserSelector.getUser);
    const docentes = useSelector(DocenteSelector.getDocentes);
    const ternas = useSelector(SelectorTernas.ternasInfo);
    const toggleModal = () => setModalOpen(!modalOpen);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/detalleTernas/getDetalleTernas` };
        dispatch(FetcherTernas.getDetalleTernas(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch, userLogged]);

    useEffect(() => {
        if (!isEmpty(ternasDetalle)) {
            const idTerna = ternasDetalle.map((terna) => terna.ternaId);
            const ternaIds = Array.from(new Set(idTerna)).join('&ternaId=');
            const utils: TypeUtilities = { url: `/ternas/getTernaBy?ternaId=${ternaIds}` };
            dispatch(FetcherTernas.getTernasInfo(utils));
            dispatch(ActionFiles.setRequestedChangesByDocente(false))
        }
    }, [dispatch, ternasDetalle]);

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
                    };
                    alumnosMapped.push(data);
                }
            });
            setAlumnos(alumnosMapped);
        }
    }, [ternas]);

    const VerDetalleTerna = (ternaId: number) => {
        const ternaDocentes = detalles[ternaId] || [];
        setSelectedTernaDocentes(ternaDocentes);
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
                                            onClick={() => VerDetalleTerna(alumno.ternaId)}>
                                            Detalle
                                        </Button>
                                        <Button onClick={() => {
                                            console.log(alumno)
                                            dispatch(ActionFiles.cleanStore());
                                            if (userLogged.roleId === 2) {
                                                dispatch(ActionFiles.setRequestedChangesByDocente(true))
                                            }
                                            setShowDocumentacion(true);
                                            setSelectedAlumno(alumno);
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
        <Modal isOpen={modalOpen} toggle={toggleModal} className="modal-size">
            <ModalHeader toggle={toggleModal}>
                {`Docentes en la terna ${selectedTernaId}`}
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
        </Modal>
    </Container> : <Documentacion alumno={selectedAlumno} onClick={() => {
        dispatch(ActionFiles.cleanStore());
        setShowDocumentacion(false);
        dispatch(ActionFiles.setRequestedChangesByDocente(false));
    }} />
    );
}