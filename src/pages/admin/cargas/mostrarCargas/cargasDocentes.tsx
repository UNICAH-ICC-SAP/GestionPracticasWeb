import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "@store/index";

import { Fetcher as FetcherPensum, Selector as SelectorPensum } from "@store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '@store/slices/docentes';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "@store/slices/periodo";
import { Selector as SelectorUser } from "@store/slices/users";
import { getData, Post } from "@utilities/Utilities";

import NotFound from "@components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Form, FormGroup, Input, Label, Row, Card, CardHeader, CardBody, Spinner, Badge, Button } from "reactstrap";
import Swal from "sweetalert2";

import { days } from "../../../../consts"

type Comentario = {
    comentarioId?: number;
    autor: string;
    mensaje: string;
    createdAt?: string;
}

type SeccionDetail = {
    nombre_clase: string;
    creditos: number;
    seccion: string;
    hora_inicio: string;
    hora_final: string;
    dia_inicio: number;
    dia_final: number;
    facultadId?: string;
    id_bloque?: number;
    id_detalle?: number;
    observacion?: string;
};

export default function CargasDocente() {
    const dispatch = useDispatch();
    const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>('');
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [seccionesData, setSeccionesData] = useState<SeccionDetail[]>([]);
    const [comentarios, setComentarios] = useState<Record<number, Comentario[]>>({});
    const [comentarioTexto, setComentarioTexto] = useState<Record<number, string>>({});
    const [enviandoComentario, setEnviandoComentario] = useState<Record<number, boolean>>({});
    const clases = useSelector(SelectorPensum.getClases);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const userData = useSelector(SelectorUser.getUser);

    useEffect(() => {
        if (periodos === null) {
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
        }
    }, [dispatch, periodos])

    useEffect(() => {
        if (periodos && periodos.length > 0 && !periodoSeleccionado) {
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo);
        }
    }, [periodos, periodoSeleccionado])

    useEffect(() => {
        if (docentes && docentes.length > 0 && !docenteSeleccionado) {
            setDocenteSeleccionado(docentes[0].docenteId);
        }
    }, [docentes, docenteSeleccionado])

    useEffect(() => {
        if (clases === null && docentes === null) {
            dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" }));
            dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" }));
        }
    }, [dispatch, clases, docentes])

    useEffect(() => {
        if (!docenteSeleccionado || !periodoSeleccionado) return;

        setCargandoDatos(true);
        getData({
            url: `/secciones/getSections?id_periodo=${periodoSeleccionado}&docenteId=${docenteSeleccionado}`
        }).then(response => {
            if (Array.isArray(response.data)) {
                const mapped: SeccionDetail[] = [];
                response.data.forEach((seccion: Record<string, unknown>) => {
                    const ccb = seccion.ccb as Record<string, unknown> | undefined;
                    const clase = ccb?.clase as Record<string, unknown> | undefined;
                    if (clase) {
                        mapped.push({
                            nombre_clase: clase.nombre_clase as string,
                            creditos: clase.creditos as number,
                            seccion: seccion.seccion as string,
                            hora_inicio: seccion.hora_inicio as string,
                            hora_final: seccion.hora_final as string,
                            dia_inicio: seccion.dia_inicio as number,
                            dia_final: seccion.dia_final as number,
                            facultadId: ccb.facultadId as string,
                            id_bloque: ccb.id_bloque as number,
                            id_detalle: seccion.id_detalle as number,
                            observacion: seccion.observacion as string
                        });
                    }
                });
                setSeccionesData(mapped);

                mapped.forEach(s => {
                    if (s.id_detalle) {
                        cargarComentarios(s.id_detalle);
                    }
                });
            }
        }).finally(() => setCargandoDatos(false));
    }, [docenteSeleccionado, periodoSeleccionado, dispatch]);

    const cargarComentarios = useCallback(async (id_detalle: number) => {
        try {
            const response = await getData({
                url: `/comentarios/findBy?modulo=CARGA_ASIGNADA&referenciaId=${id_detalle}`
            });
            if (Array.isArray(response.data)) {
                setComentarios(prev => ({ ...prev, [id_detalle]: response.data as Comentario[] }));
            }
        } catch { /* ignore */ }
    }, []);

    const handleEnviarComentario = useCallback(async (id_detalle: number) => {
        const texto = comentarioTexto[id_detalle]?.trim();
        if (!texto) return;

        setEnviandoComentario(prev => ({ ...prev, [id_detalle]: true }));
        try {
            const response = await Post({
                url: "/comentarios/insert",
                data: {
                    modulo: "CARGA_ASIGNADA",
                    referenciaId: id_detalle,
                    userId: userData?.userId,
                    mensaje: texto
                }
            });
            if (response.error.code === 0) {
                setComentarioTexto(prev => ({ ...prev, [id_detalle]: "" }));
                cargarComentarios(id_detalle);
            } else {
                Swal.fire("Error", "No se pudo enviar el comentario.", "error");
            }
        } catch {
            Swal.fire("Error", "No se pudo enviar el comentario.", "error");
        } finally {
            setEnviandoComentario(prev => ({ ...prev, [id_detalle]: false }));
        }
    }, [comentarioTexto, userData, cargarComentarios]);

    const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocenteSeleccionado(e.target.value);
    };

    const getDayName = (day: number): string => {
        return days[day] || '';
    };

    const handleChangePeriodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodoSeleccionado(e.target.value);
    };

    const totalClases = seccionesData.length;
    const periodoActivo = periodos?.find(p => p.id_periodo === periodoSeleccionado);

    return (
        <Container>
            <Form>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="docenteId">Docente</Label>
                            <Input
                                id="docenteId"
                                name="docenteId"
                                type="select"
                                value={docenteSeleccionado}
                                onChange={handleDocenteChange}
                            >
                                <option value="">Seleccione un docente</option>
                                {docentes?.map(docente => (
                                    <option key={docente.docenteId} value={docente.docenteId}>
                                        {docente.nombre}
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
                                {periodos && periodos.map(periodo => (
                                    <option key={periodo.id_periodo} value={periodo.id_periodo}>
                                        {periodo.id_periodo} ({periodo.fecha_inicio} - {periodo.fecha_final})
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>

            {periodoActivo && (
                <div className="mb-3">
                    <Badge color="info" className="me-2">
                        Periodo Activo: {periodoActivo.id_periodo}
                    </Badge>
                    <Badge color="success">
                        Clases Asignadas: {totalClases}
                    </Badge>
                </div>
            )}

            {cargandoDatos ? (
                <div className="text-center my-5">
                    <Spinner color="primary">
                        Cargando...
                    </Spinner>
                </div>
            ) : isEmpty(seccionesData) ? (
                <NotFound />
            ) : (
                <Row>
                    {seccionesData.map((clase) =>
                        <Col key={`${clase.nombre_clase}_${clase.seccion}`} md={4} className="mb-4">
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">{clase.nombre_clase}</h5>
                                        <small>Créditos: {clase.creditos}</small>
                                    </div>
                                    <span className="badge bg-primary">{clase.seccion}</span>
                                </CardHeader>
                                <CardBody>
                                    <p className="mb-0">
                                        <strong>Días:</strong> {getDayName(clase.dia_inicio)} - {getDayName(clase.dia_final)}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Horario:</strong> {clase.hora_inicio} - {clase.hora_final}
                                    </p>
                                    {clase.facultadId && (
                                        <p className="mb-0">
                                            <small className="text-muted">Facultad: {clase.facultadId} | Bloque: {clase.id_bloque}</small>
                                        </p>
                                    )}
                                    {clase.id_detalle && (
                                        <div className="mt-3">
                                            <Label for={`obs-${clase.id_detalle}`} className="mb-1">
                                                <small><strong>Observación / Caso especial:</strong></small>
                                            </Label>
                                            <Input
                                                id={`obs-${clase.id_detalle}`}
                                                type="textarea"
                                                rows={2}
                                                defaultValue={clase.observacion || ''}
                                                placeholder="Sin observaciones"
                                                readOnly
                                                disabled
                                            />

                                            <Label className="mb-1 mt-3">
                                                <small><strong>Comentarios:</strong></small>
                                            </Label>
                                            <div className="mb-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                {(comentarios[clase.id_detalle] || []).length === 0 ? (
                                                    <p className="text-muted small text-center mb-0">Sin comentarios</p>
                                                ) : (
                                                    (comentarios[clase.id_detalle] || []).map((com) => (
                                                        <div key={com.comentarioId} className="p-2 mb-1 bg-light rounded border-start border-primary border-3">
                                                            <div className="d-flex justify-content-between">
                                                                <strong className="small">{com.autor}</strong>
                                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                    {com.createdAt ? new Date(com.createdAt).toLocaleDateString() : ''}
                                                                </span>
                                                            </div>
                                                            <p className="mb-0 small">{com.mensaje}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Input
                                                    bsSize="sm"
                                                    type="text"
                                                    placeholder="Escriba un comentario..."
                                                    value={comentarioTexto[clase.id_detalle] || ''}
                                                    onChange={(e) => setComentarioTexto(prev => ({ ...prev, [clase.id_detalle!]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleEnviarComentario(clase.id_detalle!);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    disabled={enviandoComentario[clase.id_detalle] || !comentarioTexto[clase.id_detalle]?.trim()}
                                                    onClick={() => handleEnviarComentario(clase.id_detalle!)}
                                                >
                                                    {enviandoComentario[clase.id_detalle] ? <Spinner size="sm" /> : "Enviar"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}
