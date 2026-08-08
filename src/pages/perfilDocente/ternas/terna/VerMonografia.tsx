import React, { useEffect, useState } from "react";
import {
    Container, Badge, Card, CardBody, CardHeader,
    Row, Col, Spinner, Alert
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faArrowLeft, faUser, faUserCheck, faUsers, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { ButtonPrimary, ButtonSecondary } from "@components/shared/buttons";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '@store/slices/ternas';
import { TypeUtilities } from '@utilities/TypeUtilities';

type Props = {
    ternaId: number;
    onBack: () => void;
};

const EstadoBadge: Record<string, { color: string; bg: string }> = {
    'Inactiva': { color: '#6c757d', bg: '#f8f9fa' },
    'En Curso': { color: '#183979', bg: '#e8eaf6' },
    'Revision Monografia': { color: '#b26a00', bg: '#fff8e1' },
    'Agendada': { color: '#0288d1', bg: '#e1f5fe' },
    'Finalizada': { color: '#2e7d32', bg: '#e8f5e9' },
};

function formatBytes(bytes: number): string {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VerMonografia({ ternaId, onBack }: Props) {
    const dispatch = useDispatch();
    const monografia = useSelector(SelectorTernas.getMonografiaCompleta);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ternaId) return;
        setLoading(true);
        setError(null);
        const utils: TypeUtilities = {
            url: `/ternas/getMonografiaCompleta?ternaId=${ternaId}`
        };
        dispatch(FetcherTernas.getMonografiaCompleta(utils))
            .unwrap()
            .then(() => setLoading(false))
            .catch((err: any) => {
                setError(err?.message || 'Error al cargar la monografía');
                setLoading(false);
            });
    }, [dispatch, ternaId]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
                <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert color="danger">{error}</Alert>
                <ButtonSecondary onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Regresar</ButtonSecondary>
            </Container>
        );
    }

    if (!monografia) {
        return (
            <Container className="mt-4">
                <Alert color="warning">No se encontraron datos para esta terna.</Alert>
                <ButtonSecondary onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Regresar</ButtonSecondary>
            </Container>
        );
    }

    const estadoInfo = EstadoBadge[monografia.estado] || { color: '#6c757d', bg: '#f8f9fa' };
    const coordinador = monografia.docentes.find(d => d.rol === 'Coordinador');
    const miembros = monografia.docentes.filter(d => d.rol !== 'Coordinador');
    const pdfUrl = monografia.monografia?.fileUrl || "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view";

    return (
        <Container className="align-self-center w-100 py-4">
            {/* Header de Página */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-3 border-bottom gap-3">
                <div>
                    <h3 className="mb-1 fw-bold text-dark">Documentación de Monografía</h3>
                    <span className="text-muted small">Terna #{monografia.ternaId}</span>
                </div>
                <ButtonSecondary onClick={onBack} className="px-4 py-2">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Regresar a Ternas
                </ButtonSecondary>
            </div>

            {/* Estado de la Terna */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>
                <CardBody className="py-3 px-4 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold text-secondary">Estado de la Terna:</span>
                        <span 
                            className="badge rounded-pill fw-semibold px-3 py-2" 
                            style={{ 
                                backgroundColor: estadoInfo.bg, 
                                color: estadoInfo.color,
                                fontSize: '0.875rem',
                                border: `1px solid ${estadoInfo.color}33`
                            }}
                        >
                            {monografia.estado}
                        </span>
                    </div>
                </CardBody>
            </Card>

            {/* Grid 2 Columnas: Autor & Tutor */}
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <CardHeader 
                            className="text-white fw-bold py-3 px-4 d-flex align-items-center gap-2" 
                            style={{ backgroundColor: 'var(--main-brand-color, #183979)', borderBottom: 'none' }}
                        >
                            <FontAwesomeIcon icon={faUser} />
                            <span>Autor de la Monografía</span>
                        </CardHeader>
                        <CardBody className="p-4 d-flex flex-column justify-content-center">
                            <table className="table table-sm table-borderless mb-0 align-middle">
                                <tbody>
                                    <tr style={{ height: '36px' }}>
                                        <th className="text-muted fw-semibold" style={{ width: '35%' }}>ID</th>
                                        <td className="text-dark">{monografia.alumno.alumnoId || '—'}</td>
                                    </tr>
                                    <tr style={{ height: '36px' }}>
                                        <th className="text-muted fw-semibold">Nombre</th>
                                        <td className="fw-bold text-dark">{monografia.alumno.nombre || '—'}</td>
                                    </tr>
                                    <tr style={{ height: '36px' }}>
                                        <th className="text-muted fw-semibold">Correo</th>
                                        <td><a href={`mailto:${monografia.alumno.email}`} className="text-primary text-decoration-none">{monografia.alumno.email || '—'}</a></td>
                                    </tr>
                                    <tr style={{ height: '36px' }}>
                                        <th className="text-muted fw-semibold">Teléfono</th>
                                        <td className="text-dark">{monografia.alumno.telefono || '—'}</td>
                                    </tr>
                                    <tr style={{ height: '36px' }}>
                                        <th className="text-muted fw-semibold">Facultad</th>
                                        <td className="text-dark">{monografia.alumno.facultadId || '—'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <CardHeader 
                            className="text-white fw-bold py-3 px-4 d-flex align-items-center gap-2" 
                            style={{ backgroundColor: 'var(--main-brand-color, #183979)', borderBottom: 'none' }}
                        >
                            <FontAwesomeIcon icon={faUserCheck} />
                            <span>Tutor / Coordinador</span>
                        </CardHeader>
                        <CardBody className="p-4 d-flex flex-column justify-content-center">
                            {coordinador ? (
                                <table className="table table-sm table-borderless mb-0 align-middle">
                                    <tbody>
                                        <tr style={{ height: '36px' }}>
                                            <th className="text-muted fw-semibold" style={{ width: '35%' }}>ID</th>
                                            <td className="text-dark">{coordinador.docenteId}</td>
                                        </tr>
                                        <tr style={{ height: '36px' }}>
                                            <th className="text-muted fw-semibold">Nombre</th>
                                            <td className="fw-bold text-dark">{coordinador.nombre}</td>
                                        </tr>
                                        <tr style={{ height: '36px' }}>
                                            <th className="text-muted fw-semibold">Correo</th>
                                            <td><a href={`mailto:${coordinador.email}`} className="text-primary text-decoration-none">{coordinador.email || '—'}</a></td>
                                        </tr>
                                        <tr style={{ height: '36px' }}>
                                            <th className="text-muted fw-semibold">Teléfono</th>
                                            <td className="text-dark">{coordinador.telefono || '—'}</td>
                                        </tr>
                                        <tr style={{ height: '36px' }}>
                                            <th className="text-muted fw-semibold">Rol</th>
                                            <td><Badge color="success" pill>{coordinador.rol}</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-4 my-auto">
                                    <FontAwesomeIcon icon={faUserCheck} size="2x" className="text-muted opacity-50 mb-2" />
                                    <p className="text-muted mb-0 fw-medium">Sin coordinador asignado</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Miembros de la Terna */}
            {miembros.length > 0 && (
                <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                    <CardHeader 
                        className="text-white fw-bold py-3 px-4 d-flex align-items-center gap-2" 
                        style={{ backgroundColor: 'var(--main-brand-color, #183979)', borderBottom: 'none' }}
                    >
                        <FontAwesomeIcon icon={faUsers} />
                        <span>Miembros de la Terna</span>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="py-3 px-4 text-muted fw-semibold small text-uppercase">ID</th>
                                        <th className="py-3 px-4 text-muted fw-semibold small text-uppercase">Nombre</th>
                                        <th className="py-3 px-4 text-muted fw-semibold small text-uppercase">Correo</th>
                                        <th className="py-3 px-4 text-muted fw-semibold small text-uppercase">Teléfono</th>
                                        <th className="py-3 px-4 text-muted fw-semibold small text-uppercase">Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {miembros.map((m) => (
                                        <tr key={m.docenteId}>
                                            <td className="py-3 px-4 text-dark">{m.docenteId}</td>
                                            <td className="py-3 px-4 fw-semibold text-dark">{m.nombre}</td>
                                            <td className="py-3 px-4"><a href={`mailto:${m.email}`} className="text-primary text-decoration-none">{m.email || '—'}</a></td>
                                            <td className="py-3 px-4 text-dark">{m.telefono || '—'}</td>
                                            <td className="py-3 px-4"><Badge color="info" pill>{m.rol}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Archivo de Monografía */}
            <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <CardHeader 
                    className="text-white fw-bold py-3 px-4 d-flex align-items-center gap-2" 
                    style={{ backgroundColor: 'var(--main-brand-color, #183979)', borderBottom: 'none' }}
                >
                    <FontAwesomeIcon icon={faFileAlt} />
                    <span>Archivo de Monografía</span>
                </CardHeader>
                <CardBody className="p-4">
                    {monografia.monografia ? (
                        <Row className="align-items-center g-4">
                            <Col md={8}>
                                <table className="table table-sm table-borderless mb-0 align-middle">
                                    <tbody>
                                        <tr>
                                            <th className="text-muted fw-semibold py-2" style={{ width: '30%' }}>Nombre Documento</th>
                                            <td className="fw-bold text-dark py-2">{monografia.monografia.originalName}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted fw-semibold py-2">Estado Subida</th>
                                            <td className="py-2">
                                                <Badge color={monografia.monografia.status === 'UPLOADED' ? 'success' : monografia.monografia.status === 'FAILED' ? 'danger' : 'warning'} pill>
                                                    {monografia.monografia.status === 'UPLOADED' ? 'Subido' : monografia.monografia.status === 'FAILED' ? 'Fallido' : 'Pendiente'}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted fw-semibold py-2">Estado Revisión</th>
                                            <td className="py-2">
                                                <Badge color={monografia.monografia.fileStatus === 'DELIVERED' ? 'success' : monografia.monografia.fileStatus === 'CHANGE_REQUESTED' ? 'danger' : 'secondary'} pill>
                                                    {monografia.monografia.fileStatus === 'DELIVERED' ? 'Entregado' : monografia.monografia.fileStatus === 'CHANGE_REQUESTED' ? 'Cambios Solicitados' : 'Pendiente'}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted fw-semibold py-2">Tipo</th>
                                            <td className="text-dark py-2">{monografia.monografia.mimeType || '—'}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted fw-semibold py-2">Tamaño</th>
                                            <td className="text-dark py-2">{formatBytes(monografia.monografia.sizeBytes)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col md={4} className="d-flex justify-content-center justify-content-md-end align-items-center">
                                <ButtonPrimary
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    tag="a"
                                    className="px-4 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} /> Ver Monografía (PDF)
                                </ButtonPrimary>
                            </Col>
                        </Row>
                    ) : (
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-2">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-light rounded-circle text-primary">
                                    <FontAwesomeIcon icon={faFilePdf} size="2x" style={{ color: 'var(--main-brand-color, #183979)' }} />
                                </div>
                                <div>
                                    <h6 className="mb-1 fw-bold text-dark">Documento de Monografía</h6>
                                    <span className="text-muted small">Haga clic en el botón para abrir y visualizar el documento en PDF.</span>
                                </div>
                            </div>
                            <ButtonPrimary
                                href={pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                tag="a"
                                className="px-4 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
                            >
                                <FontAwesomeIcon icon={faFilePdf} /> Ver Monografía (PDF)
                            </ButtonPrimary>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Acciones de Footer */}
            <div className="mt-4 pt-3 border-top d-flex justify-content-start">
                <ButtonSecondary onClick={onBack} className="px-4 py-2">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Regresar a Ternas
                </ButtonSecondary>
            </div>
        </Container>
    );
}
