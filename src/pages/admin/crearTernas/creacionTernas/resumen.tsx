import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "../../../../store";
import { Selector as SelectorTernas } from "../../../../store/slices/ternas";
import { Selector as SelectorDocentes } from "../../../../store/slices/docentes";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Container } from "reactstrap";
import { Fetcher as FetcherAlumnos } from "../../../../store/slices/alumnos";
import { Fetcher as FetcherDetallesTerna} from "../../../../store/slices/ternas";
import { Fetcher as FetcherTernas } from "../../../../store/slices/ternas";
import { Action as ActionTernas } from "../../../../store/slices/ternas";
import Swal from 'sweetalert2';


type Docente = {
    docenteId: string;
    nombre: string;
    coordina: string;
    telefono: string;
}

export default function Resumen() {
    const dispatch = useDispatch();
    const [docentesInfo, setDocentesInfo] = React.useState<Array<Docente>>([]);
    const ternas = useSelector(SelectorTernas.ternaInfo);
    const [isCardVisible] = useState(true);
    const [isButtonDisabled] = useState(false);
    const userToCreate = useSelector(SelectorTernas.getUserToCreate);
    const docentes = useSelector(SelectorDocentes.getDocentes);
    const alumno = useSelector(SelectorTernas.getAlumo);
    const detalleTerna = useSelector(SelectorTernas.getDetalleTernas);
    console.log(userToCreate, docentes, alumno, detalleTerna);

    useEffect(() => {
        if (ternas.detalleTernas.length === 3) {
            const items: Array<Docente> = ternas.detalleTernas.map(detalle => {
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
    

    const handlesavedata = async () => {
        let success = true;
        if (alumno) {
            const paramsAlumno = {
                url: '/alumno/insert',
                data: alumno,
            };
            const paramsUser = {
                url: '/user/signUp',
                data: {
                    userId: alumno.alumnoId,
                    pass: 'Unicah2024',
                    roleId: 3,
                },
            };
            try {
                await dispatch(FetcherAlumnos.saveDataAlumno(paramsUser));
                await dispatch(FetcherAlumnos.saveDataAlumno(paramsAlumno));
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Hubo un error al guardar el Usuario o Alumno.\nError: ${error}`,
                });
                success = false;
            }
        } else {
            console.log("No hay datos de alumno por guardar");
            success = false;
        }
    
        if (ternas && success) {
            const paramsTerna = {
                url: '/ternas/insert',
                data: {
                    alumnoId: alumno.alumnoId,
                },
            };
            const response = await dispatch(FetcherTernas.saveTernas(paramsTerna)).unwrap();
            const newTernaId = response?.ternaInfo;


                const docentesData = docentesInfo.map(detalle => ({
                    ternaId: newTernaId,
                    docenteId: detalle.docenteId,
                    coordina: detalle.coordina === 'Si',
                }));

                const paramsDetalle = {
                    url: '/detalleTernas/insert',
                    data: docentesData,
                };

            try {
                
                await dispatch(FetcherDetallesTerna.saveDetalleTernas(paramsDetalle));
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Hubo un error al guardar el Detalle de Terna.\nError: ${error}`,
                });
                success = false;
            }
        } else {
            console.log("No hay datos de terna por guardar");
        }
        if (success) {
            Swal.fire({
                title: "¡Éxito!",
                text: "Todos los datos han sido guardados exitosamente.",
                icon: "success",
            });
            setDocentesInfo([]);
            dispatch(ActionTernas.cleanUserData());     
            window.location.reload();
        }
    };
    
    return (
        <Container style={{ display: "flex", justifyContent: 'center' }}>
            {isCardVisible && (
                <Card style={{ width: '50%' }}>
                    <CardBody>
                        <CardTitle tag="h5" className="mb-4">Datos de Terna</CardTitle>
                        <CardSubtitle style={{ display: "flex", width: '75%', justifyContent: 'center', flexDirection: 'column' }} className="mb-2 text-muted" tag="div">
                            <div className="text-start"><strong>Id: </strong><span>{ternas.alumno?.alumnoId}</span></div>
                            <div className="text-start"><strong>Nombre: </strong><span>{ternas.alumno?.nombre}</span></div>
                        </CardSubtitle>
                        <CardText>
                            {docentesInfo.length > 0 && docentesInfo.map(docente => (
                                <div className="text-start mb-2" key={docente.docenteId}>
                                    {docente.docenteId} - {docente.nombre} - {docente.telefono}
                                </div>
                            ))}
                        </CardText>
                        <Button onClick={handlesavedata} disabled={isButtonDisabled}>Guardar</Button>
                    </CardBody>
                </Card>
            )}
        </Container>
    );
};
