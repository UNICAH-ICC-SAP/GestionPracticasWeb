import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "../../components/shared/nav/types";
import Docentes from "./docentes";
import CrearTernas from "./crearTernas";

const adminMenu: Array<Menu> = [
    {
        paneId: 'DocenteTernas',
        title: 'Ternas por Docente',
        pathTo: '/docentes/ternas',
        component: <Docentes />
    },
    {
        paneId: 'AlumnoTernas',
        title: 'Ternas por Alumno',
        pathTo: '/alumno/ternas',
        component: <>Ternas por Alumno</>
    },
    {
        paneId: 'CrearTernas',
        title: 'Crear Ternas',
        pathTo: '/alumno/ternas',
        component: <CrearTernas />
    }
]

export default function Admin() {
    const [activePane, setActivePane] = useState<string>(adminMenu[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name)
    }
    return <div className='align-self-center w-100 px-5'>
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

