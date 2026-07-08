import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap";
import { axios, config } from "../../../utilities/axiosConfig";

export default function Reportes() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios.get("/reportes/resumen", config)
    .then((res) => setData(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return <Spinner color="primary" />;
  }

  return (
    <div className="w-100">
      <h3 className="mb-4">Reportes</h3>

      <Row>
        <Col md={3}>
          <Card>
            <CardHeader>Docentes</CardHeader>
            <CardBody>
              <h2>{data?.docentes || 0}</h2>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <CardHeader>Clases</CardHeader>
            <CardBody>
              <h2>{data?.clases || 0}</h2>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <CardHeader>Ternas</CardHeader>
            <CardBody>
              <h2>{data?.ternas || 0}</h2>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <CardHeader>Clases Aperturadas</CardHeader>
            <CardBody>
              <h2>{data?.secciones || 0}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}