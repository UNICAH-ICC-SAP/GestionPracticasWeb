import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../store/index";

import { Fetcher as FetcherPensum, Selector as SelectorPensum, Action as ActionPensum } from "../../../../store/slices/pensums";
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '../../../../store/slices/secciones';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "../../../../store/slices/periodo";
import { Selector as SelectorUser } from "../../../../store/slices/users"

import NotFound from "../../../../components/shared/notFound";
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
};

export default function MostrarCarga() {
    const dispatch = useDispatch();
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const clases = useSelector(SelectorPensum.getClases);
    const secciones = useSelector(SelectorSecciones.getSecciones);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const isLoading = useSelector(SelectorPensum.getIsLoading);
    const userData = useSelector(SelectorUser.getUser);

    useEffect(() => {
        if (periodos === null) {
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
        }
    }, [dispatch, periodos])

    useEffect(() => {
        if (periodos) {
            dispatch(ActionPensum.setIsLoading(false));
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo);
            dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" }));
        }
    }, [dispatch, periodos])

    useEffect(() => {
        if (periodos) {
            dispatch(FetcherSecciones.getSecciones({ url: `/clasesDocentes/get?docenteId=${userData.userId}&id_periodo=${periodoSeleccionado}` }));
        }
    }, [periodoSeleccionado])

    const getDayName = (day: number): string => {
        return days[day] || '';
    };

    const seccionesPorClase = secciones?.reduce<Record<string, SeccionDetail>>((acc, seccion) => {
        const clase = clases?.find(c => c.id_clase === seccion.id_clase);
        if (clase) {
            acc[clase.id_clase] = {
                nombre_clase: clase.nombre_clase,
                creditos: clase.creditos,
                seccion: seccion.seccion,
                hora_inicio: seccion.hora_inicio,
                hora_final: seccion.hora_final,
                dia_inicio: seccion.dia_inicio,
                dia_final: seccion.dia_final
            };
        }
        return acc;
    }, {});

    return (
        <Container>
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner color="primary">
                        Loading...
                    </Spinner>
                </div>
            ) : isEmpty(seccionesPorClase) ? (
                <NotFound />
            ) : (
                <Row>
                    {Object.entries(seccionesPorClase).map(([id_clase, clase]) =>
                        <Col key={id_clase} md={4} className="mb-4">
                            <Card>
                                <CardHeader className="d-flex flex-column custom-card-header">
                                    <h5 className="text-center">{clase.nombre_clase}</h5>
                                    <h6>Créditos: {clase.creditos}</h6>
                                </CardHeader>
                                <CardBody className="custom-card-body">
                                    <p className="text-start mb-0">
                                        <strong>Días:</strong> {getDayName(clase.dia_inicio)} - {getDayName(clase.dia_final)}
                                    </p>
                                    <p className="text-start mb-1">
                                        <strong>Horario:</strong> {clase.hora_inicio} - {clase.hora_final}
                                    </p>
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