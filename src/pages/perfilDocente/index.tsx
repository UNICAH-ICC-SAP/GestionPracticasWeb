import React, { useState } from "react";
import { Breadcrumb, Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "../../components/shared/nav/types";
import Ternas from "./terna"


const adminMenu: Array<Menu> = [
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
        component: <>Actualizar estado</>
    },
    {
       paneId: 'CargasAsignadas',
        title: 'Cargas asignadas',
        pathTo: '/docente/carga',
        component: <>En construción...</>
    },
    {
        paneId: 'DocumentacionTerna',
         title: 'Documentacion de la terna',
         pathTo: '/docente/documentacion',
         component: <>En construción...</>
     }
   
]

export default function Admin() {
    const [activePane, setActivePane] = useState<string>(adminMenu[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name)
    }
    const currenTab = adminMenu.find((item)=> item.paneId === activePane)

return <div className='align-self-center w-100 px-5'>

<Breadcrumb items={[
    {title: "Inicio"},
    {title: "Docente"},
    {title: currenTab?.title || ""},
    ]}
    />
        <Nav className="mt-5" justified tabs>
            {adminMenu && adminMenu.map((item, index) => {
                return <NavItem key={item.paneId! + index}>
                    <NavLink active={(activePane === item.paneId ? true : false)}
                        name={item.paneId}
                        // className="active"
                        onClick={onChangeTab}
                    >
                        {item.title}
                    </NavLink>
                </NavItem>
            })}

        </Nav>

        <TabContent className="justify-items-center mt-5" activeTab={activePane}>
            {adminMenu && adminMenu.map((item, index) => {
                return <TabPane key={item.paneId! + (index + 1) + 'Pane'} tabId={item.paneId}>
                    <Container>
                        {item.component}
                    </Container>
                </TabPane>
            })}
        </TabContent>
    </div>
}


