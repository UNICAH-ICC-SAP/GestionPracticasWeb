import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "../../../../store";
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../../store/slices/ternas';
import { Fetcher as FetcherAlumno, Selector as SelectorAlumno } from '../../../../store/slices/alumnos';
import './botonesModificar.css';

type AlumnoDetails = {
  alumnoid: number,
  email: string,
  nombre: string,
  facultad: string,
  telefono: string
}
const BotonesModificar: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [detalle, setDetalle] = useState<Array<AlumnoDetails>>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoDetails | null>(null);
  const [modalTerna, setModalTerna] = useState(false);

  const utils = {
    url: '/alumno/getAlumnos'
  };

  useEffect(() => {
    dispatch(FetcherAlumno.getAlumnos(utils));
  }, [dispatch]);

  const alumnos = useSelector(SelectorAlumno.getAlumnos);

  
  const handleModificarAlumnos = () => {
    setModalOpen(true);
    console.log('Modificar Alumnos');
  };

  const handleModificarTernas = () => {
    setModalOpen(false);
    console.log('Modificar Ternas');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        className="button-modificar"
        onClick={handleModificarAlumnos}
      >
        Modificar Alumnos
      </button>
      <button
        className="button-modificar"
        onClick={handleModificarTernas}
      >
        Modificar Ternas
      </button>
    </div>
  );
};

export default BotonesModificar;