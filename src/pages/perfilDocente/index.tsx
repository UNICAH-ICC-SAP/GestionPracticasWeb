import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "../../components/shared/nav/types";
import Ternas from "./terna"
import EstadoTerna from './estadoTerna'
import Breadcrumbs from "../../components/shared/breadcrumb/Breadcrumbs";
import UnderConstruction from '../../components/shared/construction'

const perfilDocente: Array<Menu> = [
    {
        paneId: 'Ver ternas',
        title: 'Mis ternas',
        pathTo: '/docentes/ternas',
        component: <Ternas/>
    },
    {
        paneId: 'ActualizarTerna',
        title: 'Actualizar ternas',
        pathTo: '/doente/actualizar',
        component: <EstadoTerna/>
    },
    {
       paneId: 'CargasAsignadas',
        title: 'Cargas asignadas',
        pathTo: '/docente/carga',
        component: <UnderConstruction/>
    },
    {
        paneId: 'DocumentacionTerna',
         title: 'Documentacion de la terna',
         pathTo: '/docente/documentacion',
         component: <UnderConstruction/>
     }
]
export default function PerfilDocente() {
    const [activePane, setActivePane] = useState<string>(perfilDocente[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name)
    }
    const currenTab = perfilDocente.find((item)=> item.paneId === activePane)
    type TypeBreadcrumb = {
        title: string;
    }
    const tabsBreadcrumb: Array<TypeBreadcrumb> =[
        {title: "Inicio"},
        {title: "Docente"},
        {title: currenTab?.title || ""},
    ]
return <div className='align-self-center w-100 px-5'>
    <Breadcrumbs 
    items={tabsBreadcrumb}/>
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


