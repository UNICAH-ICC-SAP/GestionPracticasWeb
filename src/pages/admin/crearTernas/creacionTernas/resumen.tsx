import React from "react";
import { useSelector, useDispatch } from "@store/index";
import { Selector as SelectorTernas, Fetcher as FetcherTernas, Action as ActionTernas } from "@store/slices/ternas";
import { Selector as SelectorDocentes } from "@store/slices/docentes";
import { Fetcher as FetcherAlumnos, Action as ActionAlumno } from "@store/slices/alumnos";
import { ButtonGroup, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Container, Input, InputGroup, InputGroupText } from "reactstrap";
import { ButtonSecondary, ButtonPrimary } from "@components/shared/buttons";
import { Post } from "@utilities/Utilities";
import { showInvitation } from "@utilities/invitations";
import Swal from 'sweetalert2';

export default function Resumen() {
    const dispatch = useDispatch();
    const terna = useSelector(SelectorTernas.ternaInfo);
    const alumno = useSelector(SelectorTernas.getAlumo);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
    const isSaving = React.useRef(false);
    const isCardVisible = true;
    const docentesInfo = terna.detalleTernas.map(detalle => ({
        ...docentes.find(docente => docente.docenteId === detalle.docenteId),
        docenteId: detalle.docenteId,
        rol: detalle.rol,
    }));

    const handlesavedata = async () => {
        if (isSaving.current) return;
        isSaving.current = true;
        setIsButtonDisabled(true);
        try {
            const response = await Post({
                url: '/user/register',
                data: { accountType: 'alumno', profile: alumno, detalleTernas: terna.detalleTernas },
            });
            if (response.error.code) {
                await Swal.fire({ icon: 'error', title: 'No se pudo crear la terna', text: response.error.message });
                return;
            }
            const result = response.singleData as { invitationToken: string };
            await showInvitation(result.invitationToken);
            const emails = docentesInfo.map(docente => docente.email).filter(Boolean);
            if (emails.length) {
                const notification = await Post({
                    url: '/correo/enviarCorreo/notificarDocente',
                    data: { correoDestino: emails.join(','), nombreAlumno: alumno.nombre },
                });
                if (notification.error.code) {
                    await Swal.fire({ icon: 'warning', title: 'Terna creada', text: 'No se pudo enviar la notificación a los docentes.' });
                }
            }
            dispatch(ActionTernas.cleanStore());
            dispatch(ActionAlumno.cleanStore());
            dispatch(ActionTernas.setStep1(true));
            dispatch(FetcherTernas.getDetalleTernas({ url: '/detalleTernas/getDetalleTernas' }));
            dispatch(FetcherAlumnos.getAlumnos({ url: '/alumno/getAlumnos' }));
        } finally {
            isSaving.current = false;
            setIsButtonDisabled(false);
        }
    };

    const handleClickBack = () => {
        dispatch(ActionTernas.setStep2(true));
    };

    return (
        <Container className="container-centered">
            {isCardVisible && (
                <Card color="light" className="card-centered">
                    <CardHeader>
                        <CardTitle tag="h5">Datos de Terna</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardSubtitle className="card-subtitle mb-2" tag="div">
                            <InputGroup className="w-100">
                                <InputGroupText className="text-bg-primary">Identidad</InputGroupText>
                                <Input value={terna.alumno?.alumnoId} readOnly />
                            </InputGroup>
                            <InputGroup className="w-100">
                                <InputGroupText className="text-bg-primary">Nombre: </InputGroupText>
                                <Input value={terna.alumno?.nombre} readOnly />
                            </InputGroup>
                        </CardSubtitle>
                        <CardText>
                            {docentesInfo.length > 0 && docentesInfo.map(docente => (
                                <div className="text-start mb-2" key={docente.docenteId}>
                                    <strong>{docente.docenteId}</strong> - {docente.nombre} - {docente.telefono}
                                </div>
                            ))}
                        </CardText>
                    </CardBody>
                    <CardFooter>
                        <ButtonGroup className="w-50">
                            <ButtonSecondary onClick={handleClickBack}>Atras</ButtonSecondary>
                            <ButtonPrimary onClick={handlesavedata} disabled={isButtonDisabled}>Guardar</ButtonPrimary>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            )}
        </Container>
    );
};
