import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '@store/slices/docentes';
import { Tables } from "../../../components/commons/tables/tables";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFound from "../../../components/shared/notFound";
import Swal from 'sweetalert2';

type DocenteDetail = {
    docenteId: string;
    nombre: string;
    email: string;
    telefono: string;
    facultad: string;
};

export default function ModificarDocentes() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<DocenteDetail>>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDocente, setSelectedDocente] = useState<DocenteDetail | null>(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const utils = {
        url: '/docente/getDocentes'
    };

    useEffect(() => {
        dispatch(FetcherDocentes.getDocentes(utils));
    }, [dispatch]);

    const docentes = useSelector(SelectorDocentes.getDocentes);

    useEffect(() => {
        if (Array.isArray(docentes) && docentes.length > 0) {
            const docentesMapped = docentes.map(docente => ({
                docenteId: docente.docenteId,
                nombre: docente.nombre,
                email: docente.email,
                telefono: docente.telefono,
                facultad: docente.facultadId
            }));

            setDetalle(docentesMapped);
        }
    }, [docentes]);

    const toggleModal = () => setModalOpen(!modalOpen);
    const toggleDeleteModal = () => setModalDelete(!modalDelete);

    const handleEditClick = (docente: DocenteDetail) => {
        setSelectedDocente(docente);
        toggleModal();
    }

    const handleDeleteClick = (docente: DocenteDetail) => {
        setSelectedDocente(docente);
        setConfirmText("");
        toggleDeleteModal();
    }

    const handleUpdateDocente = () => {
        //FIX: Dispatch call
        if (selectedDocente) {
            const params = {
                url: `/docente/update?docenteId=${selectedDocente.docenteId}`,
                data: selectedDocente,
            };

            dispatch(FetcherDocentes.updateDocente(params))
                .then(() => {
                    dispatch(FetcherDocentes.getDocentes(utils));
                    toggleModal();
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "El docente se ha actualizado exitosamente.",
                        icon: "success",
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `Hubo un error al actualizar el docente. ${error}`,
                    });
                });
        }
    };

    const renderActions = (docente: DocenteDetail) => (
        <ButtonGroup>
            <Button color="success" onClick={() => handleEditClick(docente)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button color="danger" onClick={() => handleDeleteClick(docente)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </ButtonGroup>
    );

    const handleConfirmDelete = () => {
        if (confirmText === selectedDocente?.nombre) {
            const params = {
                url: `/docente/updateStatus?docenteId=${selectedDocente.docenteId}`,
            };

            dispatch(FetcherDocentes.updateDocente(params))
                .then(() => {
                    dispatch(FetcherDocentes.getDocentes(utils));
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "El docente ha sido desactivado exitosamente.",
                        icon: "success",
                    });
                    toggleDeleteModal();
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `Hubo un error al desactivar el docente o usuario. ${error}`,
                    });
                });
        } else {
            alert("El nombre ingresado no coincide. Por favor, verifica y escribe el nombre del docente para confirmar.");
        }
    };

    const isSaveDisabled = () => {
        return !(selectedDocente?.nombre && selectedDocente?.email && selectedDocente?.telefono);
    };

    return (
        <Container>
            {detalle.length > 0 ? (
                <Tables
                    data={detalle.map(docente => ({
                        ...docente,
                        actions: renderActions(docente)
                    }))}
                    headers={['Docente ID', 'Nombre', 'Email', 'Teléfono', 'Facultad', 'Acciones']}
                    firstColumnIndex={0}
                    paginated={true}
                />
            ) : (
                <NotFound />
            )}

            <Modal isOpen={modalOpen} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>Modificar Docente</ModalHeader>
                <ModalBody>
                    {selectedDocente && (
                        <>
                            <div className="mb-3">
                                <Label for="nombre" className="text-left">Nombre Docente</Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    value={selectedDocente.nombre}
                                    onChange={(e) => setSelectedDocente({ ...selectedDocente, nombre: e.target.value })}
                                    placeholder="Nombre"
                                />
                            </div>
                            <div className="mb-3">
                                <Label for="email" className="text-left">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={selectedDocente.email}
                                    onChange={(e) => setSelectedDocente({ ...selectedDocente, email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="mb-3">
                                <Label for="telefono" className="text-left">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    type="text"
                                    value={selectedDocente.telefono}
                                    onChange={(e) => setSelectedDocente({ ...selectedDocente, telefono: e.target.value })}
                                    placeholder="Teléfono"
                                />
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="primary" onClick={handleUpdateDocente} disabled={isSaveDisabled()}>Guardar Cambios</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalDelete} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Confirmar Eliminación</ModalHeader>
                <ModalBody>
                    <p>Para confirmar la eliminación, escribe el nombre completo: <strong>{selectedDocente?.nombre}</strong></p>
                    <Input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Escribe el nombre del docente aquí"
                    />
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="danger" onClick={handleConfirmDelete} disabled={confirmText !== selectedDocente?.nombre}>
                        Eliminar
                    </Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}
