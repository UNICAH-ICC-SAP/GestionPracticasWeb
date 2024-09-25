import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Row, Label } from "reactstrap";
import "./_not_found.css";

export default function NotFound() {
    return <Container>
        <Row>
            <Label className="no-data-text">No se Encontró Información</Label>
        </Row>
        <FontAwesomeIcon className="no-data-icon" icon={faFolderOpen} />
    </Container>
}