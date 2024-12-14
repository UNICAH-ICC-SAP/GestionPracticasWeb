import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherPensum, Selector as SelectorPensum } from "../../../store/slices/pensums";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../store/slices/docentes';
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from '../../../store/slices/secciones';
import NotFound from "../../../components/shared/notFound";
import { isEmpty } from "lodash";
import { Col, Container, Form, FormGroup, Input, Label, Row, Card, CardHeader, CardBody, Spinner } from "reactstrap";
import React, { useEffect, useState } from "react";

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
    const [isLoading, setIsLoading] = useState(false);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState('ANGEL DASSA');
    const clases = useSelector(SelectorPensum.getClases);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const secciones = useSelector(SelectorSecciones.getSecciones);

    const loadData = async (docenteId: string) => {
        setIsLoading(true);
        try {
            await Promise.all([
                dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" })),
                dispatch(FetcherDocentes.getDocentes({ url: "/docente/getDocentes" })),
                dispatch(FetcherSecciones.getSecciones({ url: `/clasesDocentes/get?docenteId=${docenteId}&id_periodo=I-2025` }))
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData(docenteSeleccionado);
    }, []);

    const handleDocenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nuevoDocente = e.target.value;
        setDocenteSeleccionado(nuevoDocente);
        loadData(nuevoDocente);
    };

    const getDayName = (day: number): string => {
        const days = ['', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
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
                            >
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