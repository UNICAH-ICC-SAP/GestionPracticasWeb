import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "@store/index";

import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '@store/slices/secciones';
import type { Type as TypeSecciones } from '@store/slices/secciones/_namespace';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "@store/slices/periodo";
import { Selector as SelectorUser } from "@store/slices/users"

import NotFound from "@components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Row, Card, CardHeader, CardBody, Spinner, Badge } from "reactstrap";

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
};

export default function MostrarCarga() {
    const dispatch = useDispatch();
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const secciones = useSelector(SelectorSecciones.getSecciones);
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
        if (periodoSeleccionado && userData?.userId) {
            setCargandoDatos(true);
            dispatch(FetcherSecciones.getSecciones({
                url: `/secciones/getSections?id_periodo=${periodoSeleccionado}&docenteId=${userData.userId}`
            })).finally(() => setCargandoDatos(false));
        }
    }, [periodoSeleccionado, userData?.userId, dispatch]);

    const getDayName = (day: number): string => {
        return days[day] || '';
    };

    const seccionesPorClase = secciones?.reduce<Record<string, SeccionDetail>>((acc, seccion: TypeSecciones.SeccionInfo) => {
        const ccb = seccion.ccb;
        const clase = ccb?.clase;
        if (clase) {
            const key = `${clase.id_clase}_${seccion.seccion}`;
            acc[key] = {
                nombre_clase: clase.nombre_clase,
                creditos: clase.creditos,
                seccion: seccion.seccion,
                hora_inicio: seccion.hora_inicio,
                hora_final: seccion.hora_final,
                dia_inicio: seccion.dia_inicio,
                dia_final: seccion.dia_final,
                TipoClase: clase.TipoClase,
                facultadId: ccb.facultadId,
                id_bloque: ccb.id_bloque
            };
        }
        return acc;
    }, {});

    const totalClases = seccionesPorClase ? Object.keys(seccionesPorClase).length : 0;
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
            ) : isEmpty(seccionesPorClase) ? (
                <NotFound />
            ) : (
                <Row>
                    {Object.entries(seccionesPorClase).map(([key, clase]) =>
                        <Col key={key} md={4} className="mb-4">
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
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}