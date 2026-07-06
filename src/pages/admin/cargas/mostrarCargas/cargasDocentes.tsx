import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "@store/index";

import { Fetcher as FetcherPensum, Selector as SelectorPensum } from "@store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '@store/slices/docentes';
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '@store/slices/secciones';
import type { Type as TypeSecciones } from '@store/slices/secciones/_namespace';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "@store/slices/periodo";

import NotFound from "@components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Form, FormGroup, Input, Label, Row, Card, CardHeader, CardBody, Spinner, Badge } from "reactstrap";

import { days } from "../../../../consts"

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
};

export default function CargasDocente() {
    const dispatch = useDispatch();
    const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>('');
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const clases = useSelector(SelectorPensum.getClases);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const secciones = useSelector(SelectorSecciones.getSecciones);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);

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
        if (docenteSeleccionado && periodoSeleccionado) {
            setCargandoDatos(true);
            dispatch(FetcherSecciones.getSecciones({
                url: `/secciones/getSections?id_periodo=${periodoSeleccionado}&docenteId=${docenteSeleccionado}`
            })).finally(() => setCargandoDatos(false));
        }
    }, [docenteSeleccionado, periodoSeleccionado, dispatch]);

    const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocenteSeleccionado(e.target.value);
    };

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
                facultadId: ccb.facultadId,
                id_bloque: ccb.id_bloque
            };
        }
        return acc;
    }, {});

    const handleChangePeriodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodoSeleccionado(e.target.value);
    };

    const totalClases = seccionesPorClase ? Object.keys(seccionesPorClase).length : 0;
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
            ) : isEmpty(seccionesPorClase) ? (
                <NotFound />
            ) : (
                <Row>
                    {Object.entries(seccionesPorClase).map(([key, clase]) =>
                        <Col key={key} md={4} className="mb-4">
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
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}