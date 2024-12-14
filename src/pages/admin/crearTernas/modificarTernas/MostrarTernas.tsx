import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { TypeUtilities } from '../../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../../store/slices/ternas';
import { useDispatch, useSelector } from "../../../../store";
import { isEmpty } from "lodash";
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from '../../../../store/slices/docentes';
import { Tables } from "../../../../components/commons/tables/tables";

type TernaDetail = {
    ternaId: number;
    docenteId: string;
    docenteNombre: string;
    docenteTelefono: string;
    docenteEmail: string;
};

type AlumnoInfo = {
    ternaId: number;
    alumnoNombre: string;
    facultad: string;
    email: string;
    telefono: string;
};

export default function VerTernas() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Record<number, TernaDetail[]>>({});
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTernaDocentes, setSelectedTernaDocentes] = useState<TernaDetail[]>([]);
    const [selectedTernaId, setSelectedTernaId] = useState<number | null>(null);
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
            const DetallesDocentes: Record<number, TernaDetail[]> = {};
            ternasDetalle.forEach((terna) => {
                const docentesData = docentes.find((docente) => docente.docenteId === terna.docenteId);
                if (docentesData) {
                    const ternaDetail: TernaDetail = {
                        ternaId: terna.ternaId,
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
                    };
                    alumnosMapped.push(data);
                }
            });
            setAlumnos(alumnosMapped);
        }
    }, [ternas]);

    const VerDetalleTerna = (ternaId: number) => {
        const ternaDocentes = detalle[ternaId] || [];
        setSelectedTernaDocentes(ternaDocentes);
        setSelectedTernaId(ternaId);
        toggleModal();
    };

    const detalleAllternas = alumnos.filter((alumno) => ternasDetalle.some((terna) => 
        terna.ternaId === alumno.ternaId &&
        !terna.coordina && terna.docenteId
    )
    );

    return (
        <Container>
            <h4>Ternas</h4>
            {!isEmpty(detalleAllternas) ? (
                <Tables
                    data={detalleAllternas.map((alumno) => ({
                        ...alumno,
                        acciones: (
                            <Button
                                color="primary"
                                onClick={() => VerDetalleTerna(alumno.ternaId)}
                            >
                                Detalles
                            </Button>
                        ),
                    }))}
                    headers={['Terna ID', 'Nombre del Alumno', 'Facultad', 'Email', 'Telefono', 'Acciones']}
                    firstColumnIndex={0}
                    paginated={true}
                />
            ) : (
                <p>No tienes ternas donde seas miembro.</p>
            )}
            <Modal isOpen={modalOpen} toggle={toggleModal} style={{ maxWidth: '35%', width: '35%' }}>
                <ModalHeader toggle={toggleModal}>
                    {`Docentes en la terna ${selectedTernaId}`}
                </ModalHeader>
                <ModalBody style={{fontSize: '15px'}}>
                    {selectedTernaDocentes.length > 0 ? (
                        selectedTernaDocentes.map((docente) => (
                            <div key={docente.docenteId}>
                                <p><strong>Nombre:</strong> {docente.docenteNombre}</p>
                                <p><strong>Teléfono:</strong> {docente.docenteTelefono}</p>
                                <p><strong>Email:</strong> {docente.docenteEmail}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron docentes para esta terna.</p>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    );
}
                    
