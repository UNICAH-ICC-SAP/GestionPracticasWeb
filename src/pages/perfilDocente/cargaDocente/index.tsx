import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "../../../components/shared/nav/types";
import Breadcrumbs from "../../../components/shared/breadcrumb/Breadcrumbs";
import MostrarCarga from "./mostrarCarga/mostrarCarga";

const perfilDocente: Array<Menu> = [
    {
        paneId: 'mostrarCarga',
        title: 'Mi Carga',
        pathTo: '/miCarga/mostrarCarga',
        component: <MostrarCarga />
    },
]
export default function CargaDocente() {
    const [activePane, setActivePane] = useState<string>(perfilDocente[0].paneId);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name)
    }
    const currenTab = perfilDocente.find((item) => item.paneId === activePane)
    type TypeBreadcrumb = {
        title: string;
    }
    const tabsBreadcrumb: Array<TypeBreadcrumb> = [
        { title: "Inicio" },
        { title: "Carga Docente" },
        { title: currenTab?.title || "" },
    ]
    return <div className='align-self-center w-100 px-5'>
        <Breadcrumbs
            items={tabsBreadcrumb} />
        <Nav className="mt-5" justified tabs>
            {perfilDocente && perfilDocente.map((item, index) => {
                return <NavItem key={item.paneId! + index}>
                    <NavLink active={(activePane === item.paneId ? true : false)}
                        name={item.paneId}
                        onClick={onChangeTab}>
                        {item.title}
                    </NavLink>
                </NavItem>
            })}
        </Nav>
        <TabContent className="justify-items-center mt-5" activeTab={activePane}>
            {perfilDocente && perfilDocente.map((item, index) => {
                return <TabPane key={item.paneId! + (index + 1) + 'Pane'} tabId={item.paneId}>
                    <Container>
                        {item.component}
                    </Container>
                </TabPane>
            })}
        </TabContent>
    </div>
}


