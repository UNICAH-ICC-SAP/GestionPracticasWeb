import React, { useEffect } from "react";
import { useSelector } from "../../../../store";
import { Selector as SelectorTernas } from "../../../../store/slices/ternas";
import { Selector as SelectorDocentes } from "../../../../store/slices/docentes";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Container } from "reactstrap";

type Docente = {
    docenteId: string;
    nombre: string;
    coordina: string;
    telefono: string;
}

export default function Resumen() {
    const [docentesInfo, setDocentesInfo] = React.useState<Array<Docente>>([])
    const ternas = useSelector(SelectorTernas.ternaInfo)
    const docentes = useSelector(SelectorDocentes.getDocentes)
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
    return <Container style={{ display: "flex", justifyContent: 'center' }}>
        <Card
            style={{
                width: '50%'
            }}
        >
            <CardBody>
                <CardTitle tag="h5" className="mb-4">
                    Datos de Terna
                </CardTitle>
                <CardSubtitle style={{ display: "flex", width: '75%', justifyContent: 'center', flexDirection: 'column' }} className="mb-2 text-muted" tag="div">
                    <div className="text-start">
                        <strong>Id: </strong><span>{ternas.alumno.alumnoId}</span>
                    </div>
                    <div className="text-start">
                        <strong>Nombre: </strong><span>{ternas.alumno.nombre}</span>
                    </div>
                </CardSubtitle>
                <CardText>
                    {docentesInfo.length > 0 && docentesInfo.map(docente => {
                        return <div className="text-start mb-2">{docente.docenteId} - {docente.nombre} - {docente.telefono}</div>
                    })}
                </CardText>
                <Button>
                    Button
                </Button>
            </CardBody>
        </Card>
    </Container>
}
