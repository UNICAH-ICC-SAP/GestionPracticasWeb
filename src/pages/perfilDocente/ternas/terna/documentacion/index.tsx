import React, { useState } from "react";
import { useSelector } from "@store/index";
import { DEF, Props } from '@root/Api/typesProps';
import { Button, Container } from "reactstrap";
import Documentos from "./documents";
import { Selector as SelectorFiles } from "@store/slices/documentManager";
import VerMonografia from "../VerMonografia";

export type PropsDocumentacion = {
    onClick: () => void;
};

export default function Documentacion(props: Props<PropsDocumentacion, typeof DEF>) {
    const { onClick } = props;
    const alumno = useSelector(SelectorFiles.getSelectedAlumno);
    const [showMonografia, setShowMonografia] = useState(false);

    if (showMonografia && alumno?.ternaId) {
        return <VerMonografia ternaId={alumno.ternaId} onBack={() => setShowMonografia(false)} />;
    }

    return (
        <Container className='align-self-center w-100 py-3'>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <h4 className="mb-0 fw-bold">{alumno?.alumnoNombre ? `Documentación: ${alumno.alumnoNombre}` : 'Documentación'}</h4>
                    {alumno?.ternaId && <small className="text-muted">Terna #{alumno.ternaId}</small>}
                </div>
                <div className="d-flex gap-2">
                    {alumno?.ternaId && (
                        <Button color="warning" outline onClick={() => setShowMonografia(true)}>
                            Ver Monografía
                        </Button>
                    )}
                    <Button color="secondary" onClick={onClick}>Regresar a Ternas</Button>
                </div>
            </div>
            <Documentos />
            <div className="mt-4 pt-3 border-top d-flex gap-2">
                {alumno?.ternaId && (
                    <Button color="warning" outline onClick={() => setShowMonografia(true)}>
                        Ver Monografía
                    </Button>
                )}
                <Button color="secondary" onClick={onClick}>Regresar a Ternas</Button>
            </div>
        </Container>
    );
}