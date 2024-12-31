import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "../../../../store";
import { Selector as SelectorTernas } from "../../../../store/slices/ternas";
import { Selector as SelectorDocentes } from "../../../../store/slices/docentes";
import { ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle, Container } from "reactstrap";
import { Fetcher as FetcherAlumnos, Selector as SelectorAlumno } from "../../../../store/slices/alumnos";
import { Fetcher as FetcherDetallesTerna } from "../../../../store/slices/ternas";
import { Fetcher as FetcherTernas } from "../../../../store/slices/ternas";
import { Action as ActionTernas } from "../../../../store/slices/ternas";
import Swal from 'sweetalert2';
import { ButtonSecondary, ButtonPrimary } from "../../../../components/shared/buttons";


type Docente = {
    docenteId: string;
    nombre: string;
    coordina: string;
    telefono: string;
}

export default function Resumen() {
    const dispatch = useDispatch();
    const [docentesInfo, setDocentesInfo] = React.useState<Array<Docente>>([]);
    const terna = useSelector(SelectorTernas.ternaInfo);
    const [isCardVisible] = useState(true);
    const [isButtonDisabled] = useState(false);
    const [isDistpatched, setDispatched] = useState(false);
    const userToCreate = useSelector(SelectorTernas.getUserToCreate);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const alumno = useSelector(SelectorTernas.getAlumo);
    const detalleTerna = useSelector(SelectorTernas.getDetalleTernas);
    const savedTerna = useSelector(SelectorTernas.getSavedItem);
    const savedUserState = useSelector(SelectorAlumno.getSavedUserState);
    const savedAlumnoState = useSelector(SelectorAlumno.getSavedAlumnoState);
    const savedTernaState = useSelector(SelectorTernas.getSavedTernaState);
    const savedDetailState = useSelector(SelectorTernas.getSavedDetailState);
    console.log(userToCreate, docentes, alumno, detalleTerna);

    useEffect(() => {
        if (savedTerna.ternaId !== 0) {
            const docentesData = docentesInfo.map(detalle => ({
                ternaId: savedTerna.ternaId,
                docenteId: detalle.docenteId,
                coordina: detalle.coordina === 'Si',
            }));

            const paramsDetalle = {
                url: '/detalleTernas/insert',
                data: docentesData,
            };
            setDispatched(true)
            dispatch(FetcherDetallesTerna.saveDetalleTernas(paramsDetalle));
            dispatch(ActionTernas.cleanUserData());
            dispatch(ActionTernas.setStep1(true));
        }
    }, [dispatch, savedTerna])

    useEffect(() => {
        if (savedUserState) {
            const paramsAlumno = {
                url: '/alumno/insert',
                data: alumno,
            };
            dispatch(FetcherAlumnos.saveDataAlumno(paramsAlumno));
        }
    }, [dispatch, savedUserState])

    useEffect(() => {
        if (isDistpatched) {
            if (savedUserState && savedAlumnoState && savedTernaState && savedDetailState) {
                Swal.fire({
                    icon: "success",
                    title: "Datos Creados",
                    text: `La terna fue creada exitosamente`,
                });
            }
            if (!savedDetailState) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Hubo un error al guardar el Detalle de Terna.`,
                });
            }
            if (!savedAlumnoState || !savedUserState) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Hubo un error al guardar el Usuario o Alumno.`,
                });
            }
        }
    }, [savedUserState, savedAlumnoState, savedTernaState, savedDetailState])

    useEffect(() => {
        if (terna.detalleTernas.length === 3) {
            const items: Array<Docente> = terna.detalleTernas.map(detalle => {
                const item = docentes.find(docente => docente.docenteId === detalle.docenteId)
                if (item) {
                    return {
                        docenteId: item.docenteId,
                        nombre: item.nombre,
                        coordina: detalle.coordina,
                        telefono: item.telefono
                    }
                } else {
                    return {
                        docenteId: '',
                        nombre: '',
                        coordina: '',
                        telefono: ''
                    }
                }
            });
            setDocentesInfo(items)
        }
    }, [])

    useEffect(() => {
        if (savedAlumnoState) {
            const paramsTerna = {
                url: '/ternas/insert',
                data: {
                    alumnoId: alumno.alumnoId,
                },
            };
            dispatch(FetcherTernas.saveTernas(paramsTerna));
        }
    }, [dispatch, savedAlumnoState])

    const handlesavedata = async () => {
        if (alumno) {
            const paramsUser = {
                url: '/user/signUp',
                data: {
                    userId: alumno.alumnoId,
                    pass: 'Unicah2024',
                    roleId: 3,
                },
            };
            dispatch(FetcherAlumnos.saveDataUser(paramsUser));
        } else {
            Swal.fire({
                icon: "warning",
                title: "Datos faltantes",
                text: "No hay datos de alumno por guardar.",
            });
        }
    };

    const handleClickBack = () => {
        dispatch(ActionTernas.setStep2(true));
    }
    return (
        <Container className="container-centered">
            {isCardVisible && (
                <Card className="card-centered">
                    <CardBody>
                        <CardTitle tag="h5" className="mb-4">Datos de Terna</CardTitle>
                        <CardSubtitle className="card-subtitle mb-2 text-muted" tag="div">
                            <div className="text-start"><strong>Id: </strong><span>{terna.alumno?.alumnoId}</span></div>
                            <div className="text-start"><strong>Nombre: </strong><span>{terna.alumno?.nombre}</span></div>
                        </CardSubtitle>
                        <CardText>
                            {docentesInfo.length > 0 && docentesInfo.map(docente => (
                                <div className="text-start mb-2" key={docente.docenteId}>
                                    {docente.docenteId} - {docente.nombre} - {docente.telefono}
                                </div>
                            ))}
                        </CardText>
                        <ButtonGroup>
                            <ButtonSecondary onClick={handleClickBack}>Atras</ButtonSecondary>
                            <ButtonPrimary onClick={handlesavedata} disabled={isButtonDisabled}>Guardar</ButtonPrimary>
                        </ButtonGroup>
                    </CardBody>
                </Card>
            )}
        </Container>
    );
};
