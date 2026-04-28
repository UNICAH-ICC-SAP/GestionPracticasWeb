import React, { useState } from "react";
import { Button, Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { NavigationItem } from "@components/shared/nav/types";
import DocumentacionEntregada from "./delivered";
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";
import DocumentacionPendiente from "./pending";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const perfilAlumno: Array<NavigationItem> = [
    {
        paneId: 'documentacionFaltante',
        title: 'Documentación Faltante',
        pathTo: '/alumno/documentacion',
        component: <DocumentacionPendiente />
    },
    {
        paneId: 'documentacionEntregada',
        title: 'Documentación Entregada',
        pathTo: '/alumno/documentacion',
        component: <DocumentacionEntregada />
    }
]

export default function Documentacion() {
    const [activePane, setActivePane] = useState<string>(perfilAlumno[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name)
    }
    const currenTab = perfilAlumno.find((item) => item.paneId === activePane)
    type TypeBreadcrumb = {
        title: string;
    }
    const tabsBreadcrumb:
        Array<TypeBreadcrumb> = [
            { title: "Inicio" },
            { title: "Docente" },
            { title: currenTab?.title || "" },
        ]

    return <div className='align-self-center w-100 px-5'>
        <Breadcrumbs
            items={tabsBreadcrumb} />
        <Nav className="mt-5" justified tabs>
            {perfilAlumno && perfilAlumno.map((item, index) => {
                return <NavItem key={item.paneId! + index}>
                    <NavLink
                        active={(activePane === item.paneId ? true : false)}
                        name={item.paneId}
                        onClick={onChangeTab}

                    >
                        {item.title}
                    </NavLink>
                </NavItem>
            })}
        </Nav>
        <Container tag="div" className="d-flex justify-content-end">
            <Button color="success" className="my-1" style={{ width: "5%" }}><FontAwesomeIcon size="2x" icon={faSave} /></Button>
        </Container>
        <TabContent className="justify-items-center" activeTab={activePane}>
            {perfilAlumno && perfilAlumno.map((item, index) => {
                return <TabPane key={item.paneId! + (index + 1) + 'Pane'} tabId={item.paneId}>
                    <Container>
                        {item.component}
                    </Container>
                </TabPane>
            })}
        </TabContent>
    </div>
}