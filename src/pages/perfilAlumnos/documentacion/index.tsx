import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";
import Documentos from "./documents";

export default function Documentacion() {
    type TypeBreadcrumb = {
        title: string;
    }
    const tabsBreadcrumb: TypeBreadcrumb[] = [
        { title: "Inicio" },
        { title: "Docente" },
        { title: "Documentación" },
    ]

    return <Container>
        <Breadcrumbs
            items={tabsBreadcrumb} />
        <Documentos />
    </Container>
}