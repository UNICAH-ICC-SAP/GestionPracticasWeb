import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "@store/index";

import { Fetcher as FetcherPensum, Selector as SelectorPensum, Action as ActionPensum } from "@store/slices/pensums";
import { Fetcher as FetcherSecciones, Selector as SelectorSecciones } from "@store/slices/secciones";
import { Fetcher as FetcherPeriodo, Selector as SelectorPeriodos } from "@store/slices/periodo";
import { Selector as SelectorUser } from "@store/slices/users";

import NotFound from "@components/shared/notFound";
import { isEmpty } from "lodash";
import { Badge, Card, CardBody, CardHeader, Col, Container, Row, Spinner } from "reactstrap";

import "./mostrarCarga.css";

export default function MostrarCarga() {
    const dispatch = useDispatch();
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("");
    const clases = useSelector(SelectorPensum.getClases);
    const secciones = useSelector(SelectorSecciones.getSecciones);
    const periodos = useSelector(SelectorPeriodos.getPeriodos);
    const isLoading = useSelector(SelectorPensum.getIsLoading);
    const userData = useSelector(SelectorUser.getUser);

    useEffect(() => {
        if (periodos === null) {
            dispatch(FetcherPeriodo.getPeriodos({ url: "/periodo/get" }));
        }
    }, [dispatch, periodos]);

    useEffect(() => {
        if (periodos) {
            dispatch(ActionPensum.setIsLoading(false));
            setPeriodoSeleccionado(periodos[periodos.length - 1].id_periodo);
            dispatch(FetcherPensum.getClases({ url: "/pensum/getPensum?TipoClase=1" }));
        }
    }, [dispatch, periodos]);

    useEffect(() => {
        if (periodos && periodoSeleccionado) {
            dispatch(FetcherSecciones.getSecciones({
                url: `/clasesDocentes/get?docenteId=${userData.userId}&id_periodo=${periodoSeleccionado}`
            }));
        }
    }, [dispatch, periodoSeleccionado, periodos, userData.userId]);

    console.log("CLASES:", clases);
console.log("SECCIONES:", secciones);
console.log("PERIODOS:", periodos);
console.log("USUARIO:", userData);

    return (
        <Container>
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner color="primary">
                        Loading...
                    </Spinner>
                </div>
            ) : isEmpty(clases) ? (
                <NotFound />
            ) : (
                <Row>
                    {clases?.map((clase) => {
                        const seccion = secciones?.find((item) => item.id_clase === clase.id_clase);
                        const estaAperturada = !!seccion;

                        return (
                            <Col key={clase.id_clase} md={4} className="mb-4">
                                <Card className={estaAperturada ? "clase-aperturada" : "clase-no-aperturada"}>
                                    <CardHeader>
                                        <h5 className="text-center">{clase.nombre_clase}</h5>
                                        <h6>Créditos: {clase.creditos}</h6>
                                    </CardHeader>

                                    <CardBody>
                                        {estaAperturada ? (
                                            <>
                                                <p className="mb-1">
                                                    <strong>Sección:</strong> {seccion.seccion}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Horario:</strong> {seccion.hora_inicio} - {seccion.hora_final}
                                                </p>
                                                <Badge color="success">Aperturada</Badge>
                                            </>
                                        ) : (
                                            <Badge color="secondary">No aperturada</Badge>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}