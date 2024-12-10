import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { TypeUtilities } from '../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../store/slices/ternas';
import { useDispatch, useSelector } from "../../../store";
import { isEmpty } from "lodash";
import { Selector as UserSelector } from '../../../store/slices/users';
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from '../../../store/slices/docentes';
import { Tables } from "../../../components/commons/tables/tables";

type TernaDetail = {
    detalleTernaId?: number;
    ternaId: number;
    docenteId: string;
    docenteNombre: string;
    docenteTelefono?: string;
    docenteEmail?: string;
    coordina: string
};
type AlumnoInfo = {
    ternaId: number;
    alumnoNombre: string;
    facultadId: string;
    email: string;
    telefono: string;
};

export default function Docentes() {
    const dispatch = useDispatch();
    const [detalles, setDetalles] = useState<Record<number, TernaDetail[]>>({});
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTernaDocentes, setSelectedTernaDocentes] = useState<TernaDetail[]>([]);
    const [selectedTernaId, setSelectedTernaId] = useState<number | null>(null);
    const ternasDetalle = useSelector(SelectorTernas.getDetalleTernasDocente);
    const Userdata = useSelector(UserSelector.getUser);
    const docentes = useSelector(DocenteSelector.getDocentes);
    const ternas = useSelector(SelectorTernas.ternasInfo);
    const toggleModal = () => setModalOpen(!modalOpen);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/detalleTernas/getDetalleTernas` };
        dispatch(FetcherTernas.getDetalleTernas(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch, Userdata]);

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
                        coordina: terna.coordina ? "Coordinador": "Miembro",
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
    }, [ternasDetalle, Userdata, docentes]);

    useEffect(() => {
        const alumnosMapped: AlumnoInfo[] = [];
        if (!isEmpty(ternas)) {
            ternas.forEach((terna) => {
                if (terna.alumno) {
                    const data: AlumnoInfo = {
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
            terna.coordina && 
            terna.docenteId === Userdata.userId
        )
    );
    const detalleMiembro = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) => 
            terna.ternaId === alumno.ternaId && 
            !terna.coordina && 
            terna.docenteId === Userdata.userId
        )
    );
    const DetalleTerna = (titulo: string, detalle: AlumnoInfo[]) => (
        <>
            <h4>{titulo}</h4>
            {!isEmpty(detalle) ? (
                <Tables
                    data={detalle.map((alumno) => ({
                        ...alumno,
                        acciones: (
                            <Button
                                color="primary"
                                onClick={() => VerDetalleTerna(alumno.ternaId)}>
                                Ver más
                            </Button>
                        ),
                    }))}
                    headers={['Terna ID', 'Nombre del Alumno', 'Facultad','Email', 'Teléfono',  'Acciones']}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <p>No tienes ternas donde seas {titulo.toLowerCase()}.</p>
            )}
        </>
    )
    return (
        <Container>
            {DetalleTerna("Coordinador de Terna", detalleCoordinador)}
            {DetalleTerna("Miembro de Terna", detalleMiembro)}
            <Modal isOpen={modalOpen} toggle={toggleModal} style={{ maxWidth: '35%'}}>
                <ModalHeader toggle={toggleModal}>
                    {`Docentes en la terna ${selectedTernaId}`}
                </ModalHeader>
                <ModalBody style={{ fontSize: '15px' }}>
                    {selectedTernaDocentes.length > 0 ? (
                        selectedTernaDocentes.map((docente) => (
                            <div key={docente.docenteId}>
                                <p><strong>Nombre:</strong> {docente.docenteNombre}</p>
                                <p><strong>Teléfono:</strong> {docente.docenteTelefono}</p>
                                <p><strong>Email:</strong> {docente.docenteEmail}</p>
                                <p><strong>Coordina:</strong> {docente.coordina}</p>
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