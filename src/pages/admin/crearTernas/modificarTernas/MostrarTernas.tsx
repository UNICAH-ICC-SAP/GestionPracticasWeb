import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody, ButtonGroup } from "reactstrap";
import { WhatsappButton } from "@components/shared/buttons";
import { TypeUtilities } from '@utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '@store/slices/ternas';
import { useDispatch, useSelector } from "@store/index";
import { isEmpty } from "lodash";
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from '@store/slices/docentes';
import { Tables } from "@components/commons/tables/tables";
import DocenteInfo, { DocenteInfoType } from "@components/shared/docenteInfo";
import NotFound from "@components/shared/notFound";

type AlumnoInfo = {
    ternaId: number;
    alumnoNombre: string;
    facultad: string;
    email: string;
    telefono: string;
    estadoTerna: string;
};

export default function VerTernas() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Record<number, DocenteInfoType[]>>({});
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTernaDocentes, setSelectedTernaDocentes] = useState<DocenteInfoType[]>([]);
    const [selectedTernaAlumno, setSelectedTernaAlumno] = useState<string>('');
    const ternasDetalle = useSelector(SelectorTernas.getDetalleTernasDocente);
    const docentes = useSelector(DocenteSelector.getDocentes);
    const ternas = useSelector(SelectorTernas.ternasInfo);

    const toggleModal = () => setModalOpen(!modalOpen);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/detalleTernas/getDetalleTernas` };
        dispatch(FetcherTernas.getDetalleTernas(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch]);

    useEffect(() => {
        if (!isEmpty(ternasDetalle)) {
            const idTerna = ternasDetalle.map((terna) => terna.ternaId);
            const ternaIds = Array.from(new Set(idTerna)).join('&ternaId=');
            const utils: TypeUtilities = { url: `/ternas/getTernaBy?ternaId=${ternaIds}` };
            dispatch(FetcherTernas.getTernasInfo(utils));
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
                        docenteId: docentesData.docenteId,
                        docenteNombre: docentesData.nombre,
                        docenteTelefono: docentesData.telefono,
                        docenteEmail: docentesData.email,
                        rol: terna.rol === 'coordina' ? 'Coordinador' : terna.rol === 'estilo' ? 'Revisor de Estilos' : 'Revisor Técnico',
                    };
                    if (!DetallesDocentes[terna.ternaId]) {
                        DetallesDocentes[terna.ternaId] = [];
                    }
                    DetallesDocentes[terna.ternaId].push(ternaDetail);
                }
            });
            setDetalle(DetallesDocentes);
        }
    }, [ternasDetalle, docentes]);

    useEffect(() => {
        const alumnosMapped: AlumnoInfo[] = [];
        if (!isEmpty(ternas)) {
            ternas.forEach((terna) => {
                if (terna.alumno) {
                    const data: AlumnoInfo = {
                        ternaId: terna.ternaId,
                        alumnoNombre: terna.alumno.nombre || "Sin nombre",
                        facultad: terna.alumno.facultadId,
                        email: terna.alumno.email,
                        telefono: terna.alumno.telefono,
                        estadoTerna: getEstadoTerna(parseInt(terna.idEstadoTerna, 10))
                    };
                    alumnosMapped.push(data);
                }
            });
            setAlumnos(alumnosMapped);
        }
    }, [ternas]);

    const VerDetalleTerna = (ternaId: number, alumnoNombre: string) => {
        const ternaDocentes = detalle[ternaId] || [];
        setSelectedTernaDocentes(ternaDocentes);
        setSelectedTernaAlumno(alumnoNombre);
        toggleModal();
    };

    const detalleAllternas = alumnos.filter((alumno) => ternasDetalle.some((terna) =>
        terna.ternaId === alumno.ternaId && terna.docenteId
    ));

    function getEstadoTerna(idEstadoTerna: number) {
        switch (idEstadoTerna) {
            case 1:
                return 'Inactiva';
            case 2:
                return 'En Curso';
            case 3:
                return 'Finalizada';
        }
    }
    return (
        <Container>
            <h4>Ternas</h4>
            {!isEmpty(detalleAllternas) ? (
                <Tables
                    data={detalleAllternas.map((alumno) => ({
                        ...alumno,
                        acciones: (
                            <ButtonGroup>
                                <Button
                                    color="primary"
                                    onClick={() => VerDetalleTerna(alumno.ternaId, alumno.alumnoNombre)}
                                >
                                    Detalles
                                </Button>
                                <WhatsappButton telefono={alumno.telefono} />
                            </ButtonGroup>
                        ),
                    }))}
                    headers={['Terna ID', 'Nombre del Alumno', 'Facultad', 'Email', 'Telefono', 'Estado de la Terna', 'Acciones']}
                    firstColumnIndex={0}
                    paginated={true}
                />
            ) : (
                <NotFound />
            )}
            <Modal isOpen={modalOpen} toggle={toggleModal} style={{ maxWidth: '35%', width: '35%' }}>
                <ModalHeader toggle={toggleModal}>
                    {`Docentes en la terna del alumno ${selectedTernaAlumno}`}
                </ModalHeader>
                <ModalBody style={{ fontSize: '15px' }}>
                    {selectedTernaDocentes.length > 0 ? (
                        selectedTernaDocentes.map((docente) => (
                            <DocenteInfo key={docente.docenteId} docente={docente} />
                        ))
                    ) : (
                        <p>No se encontraron docentes para esta terna.</p>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    );
}

