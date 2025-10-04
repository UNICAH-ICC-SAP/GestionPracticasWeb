import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "@components/shared/nav/types";
import UnderConstruction from "@components/shared/construction";
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";



const perfilAlumno: Array<Menu> = [
    {
        paneId: 'documentacionEntregada',
        title: 'Documentación Entregada',
        pathTo: '/alumno/documentacion',
        component: <UnderConstruction />
    },
    {
        paneId: 'documentacionFaltante',
        title: 'Documentación Faltante',
        pathTo: '/alumno/documentacion',
        component: <UnderConstruction />
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

        <TabContent className="justify-items-center mt-5" activeTab={activePane}>
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