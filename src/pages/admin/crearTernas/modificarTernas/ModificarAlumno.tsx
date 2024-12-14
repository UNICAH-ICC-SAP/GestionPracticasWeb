import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "../../../../store";
import { Fetcher as FetcherAlumno, Selector as SelectorAlumno } from '../../../../store/slices/alumnos';
import { Tables } from "../../../../components/commons/tables/tables";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFound from "../../../../components/shared/notFound";
import Swal from 'sweetalert2';

type AlumnoDetails = {
  alumnoid: string,
  email: string,
  nombre: string,
  facultad: string,
  telefono: string
}

export default function ModificarAlumnos() {
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<AlumnoDetails>>([]);
    const [selectedAlumno, setSelectedAlumno] = useState<AlumnoDetails | null>(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const utils = {
        url: '/alumno/getAlumnos'
    };

    useEffect(() => {
        dispatch(FetcherAlumno.getAlumnos(utils));
    }, [dispatch]);

    const alumnos = useSelector(SelectorAlumno.getAlumnos);

    useEffect(() => {
        if (Array.isArray(alumnos) && alumnos.length > 0) {
            const alumnosMapped = alumnos.map(alumno => ({
                alumnoid: alumno.alumnoId,
                email: alumno.email,
                nombre: alumno.nombre,
                facultad: alumno.facultad.nombreFacultad,
                telefono: alumno.telefono
              }));   

            setDetalle(alumnosMapped);
        }
    }, [alumnos]);

    const toggleModal = () => setModalOpen(!modalOpen);
    const toggleDeleteModal = () => setModalDelete(!modalDelete);

    const handleEditClick = (alumno: AlumnoDetails) => {
        setSelectedAlumno(alumno);
        toggleModal();}

    const handleDeleteClick = (alumno: AlumnoDetails) => {
        setSelectedAlumno(alumno);
        setConfirmText("");
        toggleDeleteModal();
    }

    const handleUpdateAlumno = () => {
        if (selectedAlumno) {
            const params = {
                url: `/alumno/update?alumnoId=${selectedAlumno.alumnoid}`,
                data: selectedAlumno,
            };
    
            dispatch(FetcherAlumno.updatealumno(params))
                .then(() => {
                    // Después de actualizar al alumno, recargar la lista
                    return dispatch(FetcherAlumno.getAlumnos(utils));
                })
                .then(() => {
                    // Cerrar el modal y mostrar mensaje de éxito
                    toggleModal();
                    Swal.fire("¡Éxito!", "El alumno se ha actualizado exitosamente.", "success");
                })
                .catch((error) => {
                    // Manejar errores y mostrar alerta al usuario
                    Swal.fire("Oops...", "Hubo un error al actualizar el alumno.", "error");
                    console.error("Error actualizando alumno:", error);
                });
        }
    };

    const renderActions = (alumno: AlumnoDetails) => (
        <ButtonGroup>
            <Button color="success" onClick={() => handleEditClick(alumno)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button color="danger" onClick={() => handleDeleteClick(alumno)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </ButtonGroup>
    );


    const handleConfirmDelete = () => {
        if (confirmText === selectedAlumno?.nombre) {
          const params = { url: `/alumno/updateStatus?alumnoId=${selectedAlumno.alumnoid}` };
          try {
            dispatch(FetcherAlumno.updatealumno(params));
            dispatch(FetcherAlumno.getAlumnos(utils));
            toggleDeleteModal();
            Swal.fire("¡Éxito!", "El alumno se ha eliminado exitosamente.", "success");
          } catch (error) {
            Swal.fire("Oops...", "Hubo un error al eliminar el alumno.", error);
          }
        } else {
          alert("El nombre ingresado no coincide.");
        }
      };


    const isSaveDisabled = () => {
        return !(selectedAlumno?.nombre && selectedAlumno?.email && selectedAlumno?.telefono);
    };

    return (
        <Container>
            <h4>Listado de Alumnos</h4>
            {detalle.length > 0 ? (
                <Tables
                    data={detalle.map(alumnos => ({
                        ...alumnos,
                        actions: renderActions(alumnos)
                    }))}
                    headers={['Alumno ID', 'Email', 'Nombre', 'Facultad', 'Telefono', 'Acciones']}
                    firstColumnIndex={0}
                    paginated={true}
                />
            ) : (
                <NotFound />
            )}

            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Modificar Alumno</ModalHeader>
                <ModalBody>
                    {selectedAlumno && (
                        <>
                            <div>
                                <Label for="nombre" className="text-left">Nombre Alumno:</Label>
                                <Input
                                idnombre="nombre"
                                type="text"
                                value={selectedAlumno.nombre}
                                onChange={(e) => setSelectedAlumno({ ...selectedAlumno, nombre: e.target.value })}
                                placeholder="Ingrese el nombre del alumno"
                            />
                            </div>
                            <div>
                                <Label for="email" className="text-left">Email:</Label>
                                <Input
                                id="email"
                                type="email"
                                value={selectedAlumno.email}
                                onChange={(e) => setSelectedAlumno({ ...selectedAlumno, email: e.target.value })}
                                placeholder="Ingrese el email del alumno"
                            />
                            </div>
                            <div>
                                <Label for="telefono" className="text-left">Teléfono:</Label>
                                <Input
                                id="telefono"
                                type="text"
                                value={selectedAlumno.telefono}
                                onChange={(e) => setSelectedAlumno({ ...selectedAlumno, telefono: e.target.value })}
                                placeholder="Ingrese el teléfono del alumno"
                            />
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="primary" onClick={handleUpdateAlumno} disabled={isSaveDisabled()}>
                        Guardar
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalDelete} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Eliminar Alumno</ModalHeader>
                <ModalBody>
                    <p>Para confirmar la eliminación, escribe el nombre completo: <strong>{selectedAlumno?.nombre}</strong></p>
                    <Input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Escribe el nombre del alumno aquí"
                    />
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                <Button color="danger" onClick={handleConfirmDelete} disabled={confirmText !== selectedAlumno?.nombre}>
                        Eliminar
                    </Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );                       
}
        
        