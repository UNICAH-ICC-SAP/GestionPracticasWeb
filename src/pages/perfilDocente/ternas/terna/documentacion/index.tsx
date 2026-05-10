import React from "react";
import { DEF, Props } from '@root/Api/typesProps';
import { Button, ButtonGroup, Container } from "reactstrap";
import Documentos from "./documents";
import { AlumnoInfo } from "@api/namespaces/alumno";

export type PropsDocumentacion = {
    alumno: AlumnoInfo
    onClick: () => void;
};

export default function Documentacion(props: Props<PropsDocumentacion, typeof DEF>) {
    const { alumno, onClick } = props;

    return <Container className='align-self-center w-100'>
        <h4>{alumno.alumnoNombre}</h4>
        <Documentos alumno={alumno} />
        <ButtonGroup>
            <Button onClick={onClick}>Regresar a Ternas</Button>
        </ButtonGroup>
    </Container>
}