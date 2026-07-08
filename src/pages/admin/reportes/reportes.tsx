import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Input, Label, Row } from "reactstrap";
import NotFound from "../../../components/shared/notFound";
import { axios, config } from "../../../utilities/axiosConfig";

type Reporte = {
  nombre: string;
  descripcion: string;
  total: number;
};

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("");
  const [datos, setDatos] = useState<Reporte[]>([]);

  const generarReporte = async () => {
    try {
      const res = await axios.get("/reportes/resumen", config);
      const resumen = res.data;

      if (tipoReporte === "docentes") {
        setDatos([{ nombre: "Docentes", descripcion: "Total de docentes registrados", total: resumen.docentes }]);
      }

      if (tipoReporte === "clases") {
        setDatos([{ nombre: "Clases", descripcion: "Total de clases registradas", total: resumen.clases }]);
      }

      if (tipoReporte === "ternas") {
        setDatos([{ nombre: "Ternas", descripcion: "Total de ternas registradas", total: resumen.ternas }]);
      }
    } catch (error) {
      console.error("Error al generar reporte:", error);
    }
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
                <option value="">Seleccione</option>
                <option value="docentes">Docentes</option>
                <option value="clases">Clases</option>
                <option value="ternas">Ternas</option>
              </Input>
            </Col>

            <Col md={3}>
              <Button color="primary" block onClick={generarReporte}>
                Generar
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {datos.length > 0 ? (
        <Row>
          {datos.map((item, index) => (
            <Col md={4} key={index}>
              <Card>
                <CardBody className="text-center">
                  <CardTitle tag="h5">{item.nombre}</CardTitle>
                  <p>{item.descripcion}</p>
                  <h1>{item.total}</h1>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center mt-4">
  <h4>No se encontró información</h4>
</div>
      )}
    </Container>
  );
}