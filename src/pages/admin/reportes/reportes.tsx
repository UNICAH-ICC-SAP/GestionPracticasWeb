import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Input, Label, Row, Spinner } from "reactstrap";
import { getBlobFile } from "../../../utilities/Utilities";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherFacultad, Selector as SelectorFacultad } from "@store/slices/facultades";

export default function Reportes() {
  const dispatch = useDispatch();
  const [tipoReporte, setTipoReporte] = useState("docentes");
  const [facultadId, setFacultadId] = useState("");
  const [filtroAperturada, setFiltroAperturada] = useState("todas");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const facultades = useSelector(SelectorFacultad.getFacultades);

  useEffect(() => {
    dispatch(FetcherFacultad.getFacultades({ url: "/facultad/getFacultades" }));
  }, [dispatch]);

  const generarReporte = async () => {
    setError("");
    setCargando(true);

    const url = tipoReporte === "clases"
      ? `/reportes/clases?facultadId=${facultadId}&aperturada=${filtroAperturada}`
      : `/reportes/${tipoReporte}`;

    const blob = await getBlobFile({ url });

    if (!blob) {
      setError("No se pudo generar el reporte. Intenta de nuevo.");
      setCargando(false);
      return;
    }

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `reporte-${tipoReporte}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
    setCargando(false);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Reportes</h2>

      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5" className="text-center">
            Generar reporte
          </CardTitle>

          <Row className="align-items-end">
            <Col md={6}>
              <Label>Tipo de reporte</Label>
              <Input
                type="select"
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
              >
                <option value="docentes">Docentes</option>
                <option value="ternas">Ternas</option>
                <option value="clases">Clases</option>
              </Input>
            </Col>

            {tipoReporte === "clases" && (
              <>
                <Col md={6} className="mt-3 mt-md-0">
                  <Label>Facultad</Label>
                  <Input
                    type="select"
                    value={facultadId}
                    onChange={(e) => setFacultadId(e.target.value)}
                  >
                    <option value="">Todas las facultades</option>
                    {facultades.map(facultad => (
                      <option key={facultad.facultadId} value={facultad.facultadId}>
                        {facultad.nombreFacultad}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={6} className="mt-3">
                  <Label>Apertura</Label>
                  <Input
                    type="select"
                    value={filtroAperturada}
                    onChange={(e) => setFiltroAperturada(e.target.value)}
                  >
                    <option value="todas">Todas</option>
                    <option value="si">Aperturadas</option>
                    <option value="no">No aperturadas</option>
                  </Input>
                </Col>
              </>
            )}

            <Col md={3} className="mt-3">
              <Button color="primary" block onClick={generarReporte} disabled={cargando}>
                {cargando ? <Spinner size="sm" /> : "Generar"}
              </Button>
            </Col>
          </Row>

          {error && (
            <div className="text-center text-danger mt-3">{error}</div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
