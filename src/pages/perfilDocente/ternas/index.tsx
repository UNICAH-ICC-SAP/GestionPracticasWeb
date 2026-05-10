import React from "react";
import { Container } from "reactstrap";
import Ternas from "./terna"
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";

export default function PerfilDocente() {
    type TypeBreadcrumb = {
        title: string;
    }
    const tabsBreadcrumb: Array<TypeBreadcrumb> = [
        { title: "Inicio" },
        { title: "Docente" },
        { title: "Mis Ternas" },
    ]
    return <Container className='align-self-center w-100'>
        <Breadcrumbs
            items={tabsBreadcrumb} />
        <Ternas />
    </Container>
}


