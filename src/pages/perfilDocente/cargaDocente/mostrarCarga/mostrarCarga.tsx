import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "@store/index";

import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "@store/slices/periodo";
import { Selector as SelectorUser } from "@store/slices/users"
import { getData } from "@utilities/Utilities";

import NotFound from "@components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Row, Card, CardHeader, CardBody, Spinner, Badge, Input, Label, Button } from "reactstrap";
import Swal from "sweetalert2";
import { PatchData } from "@utilities/Utilities";

import { days } from "../../../../consts";

import "./mostrarCarga.css"

type SeccionDetail = {
    nombre_clase: string;
    creditos: number;
    seccion: string;
    hora_inicio: string;
    hora_final: string;
    dia_inicio: number;
    dia_final: number;
    TipoClase?: number;
    facultadId?: string;
    id_bloque?: number;
    id_detalle?: number;
    observacion?: string;
};

export default function MostrarCarga() {
    const dispatch = useDispatch();
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [guardandoObs, setGuardandoObs] = useState<Record<number, boolean>>({});
    const [obsValues, setObsValues] = useState<Record<number, string>>({});
    const [seccionesData, setSeccionesData] = useState<SeccionDetail[]>([]);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const userData = useSelector(SelectorUser.getUser);

    useEffect(() => {
        if (periodos === null) {
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
        }
    }, [dispatch, periodos]);

    useEffect(() => {
        if (periodos && periodos.length > 0 && !periodoSeleccionado) {
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo);
        }
    }, [periodos, periodoSeleccionado])

    useEffect(() => {
        if (!periodoSeleccionado || !userData?.userId) return;

        setCargandoDatos(true);
        getData({
            url: `/secciones/getSections?id_periodo=${periodoSeleccionado}&docenteId=${userData.userId}`
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
                            TipoClase: clase.TipoClase as number,
                            facultadId: ccb.facultadId as string,
                            id_bloque: ccb.id_bloque as number,
                            id_detalle: seccion.id_detalle as number,
                            observacion: seccion.observacion as string
                        });
                    }
                });
                setSeccionesData(mapped);
            }
        }).finally(() => setCargandoDatos(false));
    }, [periodoSeleccionado, userData?.userId, dispatch]);

    const getDayName = (day: number): string => {
        return days[day] || '';
    };

    const handleGuardarObservacion = useCallback(async (id_detalle: number, observacion: string) => {
        setGuardandoObs(prev => ({ ...prev, [id_detalle]: true }));
        try {
            const response = await PatchData({
                url: "/secciones/updateObservacion",
                data: { id_detalle, observacion }
            });
            if (response.error.code !== 0) {
                Swal.fire("Error", response.error.message || "No se pudo guardar la observación.", "error");
            } else {
                setSeccionesData(prev => prev.map(s =>
                    s.id_detalle === id_detalle ? { ...s, observacion } : s
                ));
                Swal.fire("Éxito", "Observación guardada correctamente.", "success");
            }
        } catch {
            Swal.fire("Error", "No se pudo guardar la observación.", "error");
        } finally {
            setGuardandoObs(prev => ({ ...prev, [id_detalle]: false }));
        }
    }, []);

    const totalClases = seccionesData.length;
    const periodoActivo = periodos?.find(p => p.id_periodo === periodoSeleccionado);

    return (
        <Container>
            {periodoActivo && (
                <div className="mb-3">
                    <Badge color="info" className="me-2">
                        Periodo: {periodoActivo.id_periodo}
                    </Badge>
                    <Badge color="success">
                        Total Clases Asignadas: {totalClases}
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
                                <CardHeader className="d-flex flex-column custom-card-header">
                                    <h5 className="text-center">{clase.nombre_clase}</h5>
                                    <h6>Créditos: {clase.creditos}</h6>
                                </CardHeader>
                                <CardBody className="custom-card-body">
                                    <p className="text-start mb-0">
                                        <strong>Periodo:</strong> {periodoActivo?.id_periodo || 'N/A'}
                                    </p>
                                    <p className="text-start mb-0">
                                        <strong>Días:</strong> {getDayName(clase.dia_inicio)} - {getDayName(clase.dia_final)}
                                    </p>
                                    <p className="text-start mb-1">
                                        <strong>Horario:</strong> {clase.hora_inicio} - {clase.hora_final}
                                    </p>
                                    {clase.facultadId && (
                                        <p className="text-start mb-1">
                                            <small className="text-muted">Salón: {clase.facultadId} - Bloque {clase.id_bloque}</small>
                                        </p>
                                    )}
                                    <Badge color="primary">Sección: {clase.seccion}</Badge>
                                    {clase.id_detalle && (
                                        <div className="mt-3">
                                            <Label for={`obs-${clase.id_detalle}`} className="mb-1">
                                                <small><strong>Observación / Caso especial:</strong></small>
                                            </Label>
                                            <Input
                                                id={`obs-${clase.id_detalle}`}
                                                type="textarea"
                                                rows={2}
                                                value={obsValues[clase.id_detalle] ?? clase.observacion ?? ''}
                                                placeholder="Restricciones o casos especiales..."
                                                onChange={(e) => setObsValues(prev => ({ ...prev, [clase.id_detalle!]: e.target.value }))}
                                                disabled={guardandoObs[clase.id_detalle]}
                                            />
                                            <Button
                                                color="primary"
                                                size="sm"
                                                className="mt-2"
                                                disabled={guardandoObs[clase.id_detalle]}
                                                onClick={() => handleGuardarObservacion(clase.id_detalle!, obsValues[clase.id_detalle] ?? '')}
                                            >
                                                {guardandoObs[clase.id_detalle] ? <Spinner size="sm">Guardando...</Spinner> : "Guardar Observación"}
                                            </Button>
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