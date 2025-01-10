import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../store";

import { Fetcher as FetcherPensum, Selector as SelectorPensum, Action as ActionPensum } from "../../../../store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../../store/slices/docentes';
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '../../../../store/slices/secciones';
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "../../../../store/slices/periodo";

import NotFound from "../../../../components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Form, FormGroup, Input, Label, Row, Card, CardHeader, CardBody, Spinner } from "reactstrap";

import { days } from "../../../../consts"

type SeccionDetail = {
    nombre_clase: string;
    creditos: number;
    seccion: string;
    hora_inicio: string;
    hora_final: string;
    dia_inicio: number;
    dia_final: number;
};

export default function CargasDocente() {
    const dispatch = useDispatch();
    const [docenteSeleccionado, setDocenteSeleccionado] = useState('ANGEL DASSA');
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
    const clases = useSelector(SelectorPensum.getClases);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const secciones = useSelector(SelectorSecciones.getSecciones);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const isLoading = useSelector(SelectorPensum.getIsLoading);

    useEffect(() => {
        if (periodos === null) {
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
        }
    }, [dispatch, periodos])

    useEffect(() => {
        if (clases && docentes && periodos && isLoading) {
            dispatch(ActionPensum.setIsLoading(false));
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo);
            setDocenteSeleccionado(docentes[docentes.length - 1].nombre);
        }
        if (clases === null && docentes === null && secciones === null && !isLoading) {
            dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" }));
            dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" }));
            dispatch(FetcherSecciones.getSecciones({ url: `/clasesDocentes/get?docenteId=${docenteSeleccionado}&id_periodo=${periodoSeleccionado}` }));
        }
    }, [dispatch, clases, docentes, secciones])

    const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevoDocente = e.target.value;
        setDocenteSeleccionado(nuevoDocente);
    };

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

    const handleChangePeriodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const periodo = e.target.value;
        setPeriodoSeleccionado(periodo);
    };
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
                                {periodos && periodos.map(facultad => (
                                    <option key={facultad.id_periodo} value={facultad.id_periodo}>
                                        {facultad.id_periodo}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>

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
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}