import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "../../../../store";
import { Fetcher as FetcherPlantillas, Selector as SelectorPlantillas } from '../../../../store/slices/plantillas';
import { Tables } from "../../../../components/commons/tables/tables";
import NotFound from "../../../../components/shared/notFound";
import { TypeUtilities } from "../../../../utilities/TypeUtilities";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

type PlantillaDetail = {
    idPlantilla: number;
    correo_origen: string;
    correo_password: string;
    asunto: string;
    cuerpo: string;
    estado: string;
};

export default function MostrarPlantilla() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<PlantillaDetail>>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaDetail | null>(null);
    const [changePass, setChangePass] = useState<boolean>(false)
    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setChangePass(false);
    };

    const utils: TypeUtilities = {
        url: '/correo/obtenerPlantillas'
    };

    useEffect(() => {
        dispatch(FetcherPlantillas.getPlantillas(utils));
    }, [dispatch]);

    const plantillas = useSelector(SelectorPlantillas.getPlantillas);

    useEffect(() => {
        if (Array.isArray(plantillas) && plantillas.length > 0) {
            const plantillaMapped = plantillas.map(plantilla => ({
                idPlantilla: plantilla.Id_correo,
                correo_origen: plantilla.correo_origen,
                correo_password: plantilla.correo_password,
                asunto: plantilla.asunto,
                cuerpo: plantilla.cuerpo,
                estado: plantilla.estado ? "Activa" : "Inactiva",
            }));

            setDetalle(plantillaMapped);
        }
    }, [plantillas]);

    const handleEditClick = (plantilla: PlantillaDetail) => {
        setSelectedPlantilla(plantilla);
        toggleModal();
    }

    function obfuscateText(text: string) {
        const obfuscated = "".padStart(text.length, "*");
        return obfuscated;
    }

    const handleUpdatePlantilla = () => {
        //FIX: Dispatch call
        if (selectedPlantilla) {
            const params = {
                url: `/correo/actualizarPlantilla/${selectedPlantilla.idPlantilla}`,
                data: selectedPlantilla,
            };

            dispatch(FetcherPlantillas.updatealumno(params))
                .then(() => {
                    dispatch(FetcherPlantillas.getPlantillas(utils));
                    toggleModal();
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "El plantilla se ha actualizado exitosamente.",
                        icon: "success",
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `Hubo un error al actualizar el plantilla.\n ${error}`,
                    });
                });
        }
    };

    const renderActions = (plantilla: PlantillaDetail) => (
        <ButtonGroup>
            <Button color="success" onClick={() => handleEditClick(plantilla)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
        </ButtonGroup>
    );


    const isSaveDisabled = () => {
        return !(selectedPlantilla?.asunto && selectedPlantilla?.correo_origen && selectedPlantilla?.cuerpo);
    };

    return (
        <Container>
            {detalle.length > 0 ? (
                <Tables
                    data={detalle.map(plantilla => ({
                        ...plantilla,
                        correo_password: obfuscateText(plantilla.correo_password),
                        actions: renderActions(plantilla)
                    }))}
                    headers={['Id Correo', 'Correo Origen', 'Pass', 'Asunto', 'Cuerpo', 'Estado', 'Acciones']}
                    firstColumnIndex={0}
                    paginated={true}
                />
            ) : (
                <NotFound />
            )}
            <Modal isOpen={modalOpen} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>Modificar Plantilla</ModalHeader>
                <ModalBody>
                    {selectedPlantilla && (
                        <>
                            <div className="mb-3">
                                <Label for="asunto" className="text-left">Asunto Correo</Label>
                                <Input
                                    id="asunto"
                                    type="text"
                                    value={selectedPlantilla.asunto}
                                    onChange={(e) => setSelectedPlantilla({ ...selectedPlantilla, asunto: e.target.value })}
                                    placeholder="Nombre"
                                />
                            </div>
                            <div className="mb-3">
                                <Label for="pass" className="text-left">Pass</Label>
                                <Input
                                    id="pass"
                                    type={changePass ? "text" : "password"}
                                    disabled={!changePass}
                                    value={selectedPlantilla.correo_password}
                                    onChange={(e) => setSelectedPlantilla({ ...selectedPlantilla, correo_password: e.target.value })}
                                    placeholder="Nombre"
                                />
                                <FormGroup switch>
                                    <Label check>Modificar Password</Label>
                                    <Input type="switch" checked={changePass} onClick={() => setChangePass(prevState => !prevState)} />
                                </FormGroup>
                            </div>
                            <div className="mb-3">
                                <Label for="correo_origen" className="text-left">Correo Origen</Label>
                                <Input
                                    id="correo_origen"
                                    type="email"
                                    value={selectedPlantilla.correo_origen}
                                    onChange={(e) => setSelectedPlantilla({ ...selectedPlantilla, correo_origen: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="mb-3">
                                <Label for="cuerpo" className="text-left">Contenido</Label>
                                <Input
                                    id="cuerpo"
                                    type="textarea"
                                    value={selectedPlantilla.cuerpo}
                                    onChange={(e) => setSelectedPlantilla({ ...selectedPlantilla, cuerpo: e.target.value })}
                                    placeholder="Teléfono"
                                />
                            </div>
                            <div className="mb-3">
                                <Label for="estado" className="text-left">Contenido</Label>
                                <Input
                                    id="estado"
                                    type="text"
                                    value={selectedPlantilla.estado}
                                    onChange={(e) => setSelectedPlantilla({ ...selectedPlantilla, estado: e.target.value })}
                                    placeholder="Teléfono"
                                />
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="primary" onClick={handleUpdatePlantilla} disabled={isSaveDisabled()}>Guardar Cambios</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}
