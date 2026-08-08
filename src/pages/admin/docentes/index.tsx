import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Modal, ModalHeader, ModalBody } from "reactstrap";import { TypeUtilities } from '../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '@store/slices/ternas'
import { Selector as SelectorDocentes } from '@store/slices/docentes'
import { useDispatch, useSelector } from "@store/index";
import { Tables } from "../../../components/commons/tables/tables";
import { isEmpty } from "lodash";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFound from "../../../components/shared/notFound";

type TernaDetail = {
    detalleTernaId?: number;
    ternaId?: number;
    docenteId: string;
    docenteNombre: string;
    rol: string;
    actionButton?: JSX.Element
}

export default function Docetes() {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [comentarioTexto, setComentarioTexto] = useState("");
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [selectedDocente, setSelectedDocente] = useState<TernaDetail | null>(null);
    const [detalle, setDetalle] = useState<Array<TernaDetail>>([])
    const utils: TypeUtilities = {
        url: '/detalleTernas/getDetalleTernas'
    }
    useEffect(() => {
        dispatch(FetcherTernas.getDetalleTernas(utils))
    }, [dispatch])
    const detalleTernas = useSelector(SelectorTernas.getDetalleTernas);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    useEffect(() => {
        if (!isEmpty(detalleTernas)) {
            const docentesMapped = detalleTernas.map(detalle => {
                const currentDocente = docentes.filter(docente => docente.docenteId = detalle.docenteId);

                const terna: TernaDetail = {
                    docenteId: detalle.docenteId,
                    docenteNombre: currentDocente[0].nombre,
                    rol: detalle.rol === 'coordina' ? 'Coordinador' : detalle.rol === 'estilo' ? 'Revisor de Estilos' : 'Revisor Técnico'
                };
                const jsx = <td><ButtonGroup>
                    <Button color="success">
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button color="danger">
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Button color="primary" onClick={() => { setSelectedDocente(terna); setModalOpen(true); }}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </ButtonGroup></td>
                return { ...terna, jsx };
            })
            setDetalle(docentesMapped)
        }
    }, [docentes])
    return <Container>
        {detalle.length > 0 && <Tables data={detalle} headers={['Docente Id', 'Nombre Docente', 'Rol']} firstColumnIndex={0} paginated={false} />}
        {detalle.length === 0 && <NotFound />}
        
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} size="lg">
            <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                Comentarios y Observaciones - {selectedDocente?.docenteNombre}
            </ModalHeader>
            <ModalBody>
                <div className="mb-3 p-2 border rounded bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {comentarios.length === 0 ? (
                        <p className="text-muted small italic mb-0 text-center">No hay observaciones registradas todavía.</p>
                    ) : (
                        comentarios.map((com, idx) => (
                            <div key={idx} className="p-2 mb-2 bg-white rounded border-start border-primary border-3 shadow-sm">
                                <div className="d-flex justify-content-between mb-1">
                                    <strong className="small text-dark">{com.autor}</strong>
                                    <span className="text-muted" style={{fontSize: '0.75rem'}}>{new Date(com.fecha).toLocaleDateString()}</span>
                                </div>
                                <p className="mb-0 small text-secondary">{com.texto}</p>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!comentarioTexto.trim()) return;
                    setComentarios([...comentarios, { autor: "Tú (Docente)", fecha: new Date().toISOString(), texto: comentarioTexto }]);
                    setComentarioTexto('');
                }} className="d-flex gap-2">
                    <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="Escriba una observación..." 
                        value={comentarioTexto}
                        onChange={(e) => setComentarioTexto(e.target.value)}
                    />
                    <Button color="primary" size="sm" type="submit" className="px-3">
                        Comentar
                    </Button>
                </form>
            </ModalBody>
        </Modal>
    </Container>
}