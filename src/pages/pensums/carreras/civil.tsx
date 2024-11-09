import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherPensums, Selector as SelectorPensums, Action as ActionPensums } from "../../../store/slices/pensums";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { Card, CardBody, CardText, CardTitle, Col, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { isEmpty } from "lodash";
import "./pemsuns.css";

type ClaseDetail = {
  id_clase: string;
  nombre_clase: string;
  creditos: number;
  estado: boolean;
  es_lab: boolean;
}

export default function Civil() {
  const dispatch = useDispatch();
  const [detalle, setDetalle] = useState<Array<ClaseDetail>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClaseDetail | null>(null);
  const [newClass, setNewClass] = useState<ClaseDetail>({
    id_clase: "",
    nombre_clase: "",
    creditos: 0,
    estado: true,
    es_lab: false
  });

  const utils: TypeUtilities = {
    url: "/pensum/get"
  }

  useEffect(() => {
    dispatch(FetcherPensums.getPensum(utils));
  }, [dispatch]);

  const pensums = useSelector(SelectorPensums.getPensum);
  useEffect(() => {
    if (!isEmpty(pensums)) {
      const pensumsMapped = pensums.map(pensum => ({
        id_clase: pensum.id_clase,
        nombre_clase: pensum.nombre_clase,
        creditos: pensum.creditos,
        estado: pensum.estado,
        es_lab: pensum.es_lab
      }));
      setDetalle(pensumsMapped);
    }
  }, [pensums]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleAddClass = () => {
    setCurrentClass(null);
    setNewClass({
      id_clase: "",
      nombre_clase: "",
      creditos: 0,
      estado: true,
      es_lab: false
    });
    toggleModal();
  };

  const handleEditClass = (classData: ClaseDetail) => {
    setCurrentClass(classData);
    setNewClass(classData);
    toggleModal();
  };

  const handleSaveClass = () => {
    if (currentClass) {
      // Edit existing class
      dispatch(ActionPensums.setPensum(true));
      const updatedDetalle = detalle.map(item => 
        item.id_clase === currentClass.id_clase ? newClass : item
      );
      setDetalle(updatedDetalle);
    } else {
      dispatch(ActionPensums.setPensum(true));
      setDetalle([...detalle, newClass]);
    }
    toggleModal();
  };

  const handleToggleStatus = (id_clase: string) => {
    const updatedDetalle = detalle.map(item => 
      item.id_clase === id_clase ? {...item, estado: !item.estado} : item
    );
    setDetalle(updatedDetalle);
    //dispatch(FetcherPensums.updateStatus({ id_clase }));
  };

  return (
    <Container className="page-container" fluid style={{ marginTop: "6rem" }}>
      <Row>
        <Col sm="12">
          <div className="headerBanner">
            Ingeniería Civil
          </div>
        </Col>
      </Row>
      <Col sm="12" className="mb-3">
        <Button color="primary" onClick={handleAddClass}>Agregar Nueva Clase</Button>
      </Col>
      <Col sm="12">
        <Row>
          {detalle.map((classData, idx) => (
            <Col sm="3" key={idx} className="mb-4">
              <Card>
                <CardBody>
                  <CardTitle className="card-title-custom" tag="h5">
                    {classData.nombre_clase}
                  </CardTitle>
                  <CardText>
                    {`ID: ${classData.id_clase || "No asignado"}`}<br />
                    {`Créditos: ${classData.creditos}`}<br />
                    {`Estado: ${classData.estado ? 'Activo' : 'Inactivo'}`}<br />
                    {`Es laboratorio: ${classData.es_lab ? 'Sí' : 'No'}`}
                  </CardText>
                  <Button color="info" className="mr-2" onClick={() => handleEditClass(classData)}>Editar</Button>
                  <Button color={classData.estado ? "danger" : "success"} onClick={() => handleToggleStatus(classData.id_clase)}>
                    {classData.estado ? 'Desactivar' : 'Activar'}
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {currentClass ? 'Editar Clase' : 'Agregar Nueva Clase'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="nombre_clase">Nombre de la Clase</Label>
              <Input
                type="text"
                name="nombre_clase"
                id="nombre_clase"
                value={newClass.nombre_clase}
                onChange={(e) => setNewClass({...newClass, nombre_clase: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="creditos">Créditos</Label>
              <Input
                type="number"
                name="creditos"
                id="creditos"
                value={newClass.creditos}
                onChange={(e) => setNewClass({...newClass, creditos: parseInt(e.target.value)})}
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={newClass.es_lab}
                  onChange={(e) => setNewClass({...newClass, es_lab: e.target.checked})}
                />{' '}
                Es laboratorio
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={newClass.estado}
                  onChange={(e) => setNewClass({...newClass, estado: e.target.checked})}
                />{' '}
                Activo
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveClass}>Guardar</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}