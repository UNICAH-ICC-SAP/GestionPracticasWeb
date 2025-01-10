import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Menu } from "../../components/shared/nav/types";
import MostrarAlumnos from './mostrar_alumno';
import UnderConstruction from "../../components/shared/construction";



const adminMenu: Array<Menu> = [
    {
        paneId: 'miTerna',
        title: 'Ternas del Alumno',
        pathTo: '/alumnospage/mostrar_alumnos',
        component: <MostrarAlumnos />
    },
    {
        paneId: 'Documentacion',
        title: 'Documentación',
        pathTo: '/doente/actualizar',
        component: <UnderConstruction />
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