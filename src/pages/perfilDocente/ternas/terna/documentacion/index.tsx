import React from "react";
import { useSelector } from "@store/index";
import { DEF, Props } from '@root/Api/typesProps';
import { Button, ButtonGroup, Container } from "reactstrap";
import Documentos from "./documents";
import { Selector as SelectorFiles } from "@store/slices/documentManager"

export type PropsDocumentacion = {
    onClick: () => void;
};

export default function Documentacion(props: Props<PropsDocumentacion, typeof DEF>) {
    const { onClick } = props;
    const alumno = useSelector(SelectorFiles.getSelectedAlumno);

    return <Container className='align-self-center w-100'>
        <h4>{alumno.alumnoNombre}</h4>
        <Documentos />
        <ButtonGroup>
            <Button onClick={onClick}>Regresar a Ternas</Button>
        </ButtonGroup>
    </Container>
}