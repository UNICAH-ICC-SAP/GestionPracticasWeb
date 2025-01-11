import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "../../../../store";
import { Fetcher as FetcherPlantillas, Selector as SelectorPlantillas } from '../../../../store/slices/plantillas';
import { Fetcher as FetcherCorreo } from "../../../../store/slices/plantillas";
import { Tables } from "../../../../components/commons/tables/tables";
import NotFound from "../../../../components/shared/notFound";
import { TypeUtilities } from "../../../../utilities/TypeUtilities";
import { faEdit, faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import './mostrarPlantilla.css'
import EditForm from "./editPlantilla";

export type PlantillaDetailPreview = {
    idPlantilla: number;
    correo_origen: string;
    correo_password: string;
    asunto: string;
    preview: JSX.Element;
    cuerpo: string;
    estado: string;
};

export default function MostrarPlantilla() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<PlantillaDetailPreview>>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaDetailPreview | null>(null);
    const [changePass, setChangePass] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [testEmail, setTestEmail] = useState("")

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setTestEmail("");
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
                preview: <div className="plantilla-preview" dangerouslySetInnerHTML={{ __html: plantilla.cuerpo }}></div>,
                cuerpo: plantilla.cuerpo,
                estado: plantilla.estado ? "Activa" : "Inactiva",
            }));

            setDetalle(plantillaMapped);
        }
    }, [plantillas]);

    const handleEditClick = (plantilla: PlantillaDetailPreview) => {
        setSelectedPlantilla(plantilla);
        setEditMode(true);
        setChangePass(false);
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
                    setEditMode(false);
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

    const handleTestTemplate = (idPlantilla: number) => {
        console.log("handle")
        const info: TypeUtilities = {
            url: `/correo/enviarCorreo/${idPlantilla}`,
            data: {
                correoDestino: testEmail
            }
        };
        dispatch(FetcherCorreo.sendEmail(info));
        setModalOpen(false);
        setTestEmail("");
    }

    const handleOpenModal = (plantilla: PlantillaDetailPreview) => {
        setModalOpen(true)
        setSelectedPlantilla(plantilla);
    }

    const renderActions = (plantilla: PlantillaDetailPreview) => (
        <ButtonGroup>
            <Button color="success" onClick={() => handleEditClick(plantilla)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button color="warning" onClick={() => handleOpenModal(plantilla)}>
                <FontAwesomeIcon icon={faEnvelopeOpenText} shake />
            </Button>
        </ButtonGroup>
    );


    const isSaveDisabled = () => {
        return !(selectedPlantilla?.asunto && selectedPlantilla?.correo_origen && selectedPlantilla?.cuerpo);
    };

    const isDisabled = () => {
        return testEmail.length > 0;
    }

    const handleClickCancel = () => {
        setEditMode(false)
    }
    const changeText = (value) => {
        setSelectedPlantilla((prevState) => ({
            ...prevState,
            [value.name]: value.value
        }));
    }

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlantilla({ ...selectedPlantilla, [e.target.id]: e.target.value })
    }
    return (
        <Container>
            {detalle.length > 0 ? (
                <Tables
                    data={detalle.map(plantilla => ({
                        idPlantilla: plantilla.idPlantilla,
                        correo_origen: plantilla.correo_origen,
                        asunto: plantilla.asunto,
                        cuerpo: plantilla.preview,
                        estado: plantilla.estado ? "Activa" : "Inactiva",
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
            {editMode && (
                <EditForm
                    state={selectedPlantilla}
                    onChange={onChangeInput}
                    changeText={changeText}
                    changePass={changePass}
                    isSaveDisabled={isSaveDisabled}
                    setChangePass={() => setChangePass(prevState => !prevState)}
                    handleClickCancel={handleClickCancel}
                    handleUpdatePlantilla={handleUpdatePlantilla}

                />
            )}
            {modalOpen && <Modal isOpen={modalOpen} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>Correo de Prueba</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <Label for="correo_origen" className="text-left">Correo Origen</Label>
                        <Input
                            id="correo_origen"
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.currentTarget.value)}
                            placeholder="Email"
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button color="primary" onClick={() => handleTestTemplate(selectedPlantilla.idPlantilla)} disabled={!isDisabled()}>Enviar</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>}
        </Container >
    );
}
