import React, { useEffect, useState } from "react";
import {
    Container, Button, Badge, Card, CardBody, CardHeader,
    Row, Col, Spinner, Alert
} from "reactstrap";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '@store/slices/ternas';
import { TypeUtilities } from '@utilities/TypeUtilities';

type Props = {
    ternaId: number;
    onBack: () => void;
};

const EstadoBadge: Record<string, string> = {
    'Inactiva': 'secondary',
    'En Curso': 'primary',
    'Revision Monografia': 'warning',
    'Agendada': 'info',
    'Finalizada': 'success',
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
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert color="danger">{error}</Alert>
                <Button color="secondary" onClick={onBack}>← Regresar</Button>
            </Container>
        );
    }

    if (!monografia) {
        return (
            <Container className="mt-4">
                <Alert color="warning">No se encontraron datos para esta terna.</Alert>
                <Button color="secondary" onClick={onBack}>← Regresar</Button>
            </Container>
        );
    }

    const badgeColor = EstadoBadge[monografia.estado] || 'secondary';
    const coordinador = monografia.docentes.find(d => d.rol === 'Coordinador');
    const miembros = monografia.docentes.filter(d => d.rol !== 'Coordinador');

    return (
        <Container className="align-self-center w-100 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1 fw-bold">Documentación de Monografía</h4>
                    <span className="text-muted small">Terna #{monografia.ternaId}</span>
                </div>
                <Button color="secondary" outline onClick={onBack}>← Regresar</Button>
            </div>

            <Row className="mb-3">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <CardBody className="py-2 px-3 d-flex align-items-center gap-2">
                            <span className="fw-semibold text-muted me-2">Estado de la Terna:</span>
                            <Badge color={badgeColor} pill style={{ fontSize: '0.9rem', padding: '0.4em 0.8em' }}>
                                {monografia.estado}
                            </Badge>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3">
                <Col md={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <CardHeader className="bg-primary text-white fw-bold">Autor de la Monografía</CardHeader>
                        <CardBody>
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th className="text-muted" style={{ width: '35%' }}>ID</th>
                                        <td>{monografia.alumno.alumnoId || '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-muted">Nombre</th>
                                        <td className="fw-semibold">{monografia.alumno.nombre || '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-muted">Correo</th>
                                        <td><a href={`mailto:${monografia.alumno.email}`}>{monografia.alumno.email || '—'}</a></td>
                                    </tr>
                                    <tr>
                                        <th className="text-muted">Teléfono</th>
                                        <td>{monografia.alumno.telefono || '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-muted">Facultad</th>
                                        <td>{monografia.alumno.facultadId || '—'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <CardHeader className="bg-success text-white fw-bold">Tutor / Coordinador</CardHeader>
                        <CardBody>
                            {coordinador ? (
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="text-muted" style={{ width: '35%' }}>ID</th>
                                            <td>{coordinador.docenteId}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">Nombre</th>
                                            <td className="fw-semibold">{coordinador.nombre}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">Correo</th>
                                            <td><a href={`mailto:${coordinador.email}`}>{coordinador.email || '—'}</a></td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">Teléfono</th>
                                            <td>{coordinador.telefono || '—'}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">Rol</th>
                                            <td><Badge color="success">{coordinador.rol}</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center mt-3">Sin coordinador asignado</p>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                {miembros.length > 0 && (
                    <Col md={12}>
                        <Card className="shadow-sm border-0">
                            <CardHeader className="bg-info text-white fw-bold">Miembros de la Terna</CardHeader>
                            <CardBody className="p-0">
                                <table className="table table-hover table-sm mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Teléfono</th>
                                            <th>Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {miembros.map((m) => (
                                            <tr key={m.docenteId}>
                                                <td>{m.docenteId}</td>
                                                <td className="fw-semibold">{m.nombre}</td>
                                                <td><a href={`mailto:${m.email}`}>{m.email || '—'}</a></td>
                                                <td>{m.telefono || '—'}</td>
                                                <td><Badge color="info">{m.rol}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                )}

                <Col md={12}>
                    <Card className="shadow-sm border-0">
                        <CardHeader className="bg-warning fw-bold">Archivo de Monografía</CardHeader>
                        <CardBody>
                            {monografia.monografia ? (
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th className="text-muted" style={{ width: '30%' }}>Nombre</th>
                                                    <td className="fw-semibold">{monografia.monografia.originalName}</td>
                                                </tr>
                                                <tr>
                                                    <th className="text-muted">Estado subida</th>
                                                    <td>
                                                        <Badge color={monografia.monografia.status === 'UPLOADED' ? 'success' : monografia.monografia.status === 'FAILED' ? 'danger' : 'warning'}>
                                                            {monografia.monografia.status === 'UPLOADED' ? 'Subido' : monografia.monografia.status === 'FAILED' ? 'Fallido' : 'Pendiente'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="text-muted">Estado revisión</th>
                                                    <td>
                                                        <Badge color={monografia.monografia.fileStatus === 'DELIVERED' ? 'success' : monografia.monografia.fileStatus === 'CHANGE_REQUESTED' ? 'danger' : 'secondary'}>
                                                            {monografia.monografia.fileStatus === 'DELIVERED' ? 'Entregado' : monografia.monografia.fileStatus === 'CHANGE_REQUESTED' ? 'Cambios Solicitados' : 'Pendiente'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="text-muted">Tipo</th>
                                                    <td>{monografia.monografia.mimeType || '—'}</td>
                                                </tr>
                                                <tr>
                                                    <th className="text-muted">Tamaño</th>
                                                    <td>{formatBytes(monografia.monografia.sizeBytes)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col md={4} className="text-center">
                                        {monografia.monografia.fileUrl && (
                                            <a
                                                href={monografia.monografia.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-primary btn-lg"
                                            >
                                                Ver / Descargar Monografía
                                            </a>
                                        )}
                                    </Col>
                                </Row>
                            ) : (
                                <Alert color="secondary" className="mb-0">
                                    El alumno aún no ha subido el archivo de monografía.
                                </Alert>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <div className="mt-4">
                <Button color="secondary" outline onClick={onBack}>← Regresar a Ternas</Button>
            </div>
        </Container>
    );
}
