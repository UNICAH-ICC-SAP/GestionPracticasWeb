import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { configEmail } from "../../../components/shared/nav/subMenus";
import Breadcrumbs from "../../../components/shared/breadcrumb/Breadcrumbs";

export default function ConfigEmail() {
    const [activePane, setActivePane] = useState<string>(configEmail[0].paneId!);

    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name);
    };

    const currentTab = configEmail.find((item) => item.paneId === activePane);
    type TypeBreadcrumb = {
        title: string;
    };

    const tabsBreadcrumb: Array<TypeBreadcrumb> = [
        { title: "Inicio" },
        { title: "Configuracion de Plantillas" },
        { title: currentTab?.title || "" },
    ];
    return (
        <div className="align-self-center w-100 px-5">
            <Breadcrumbs
                items={
                    tabsBreadcrumb
                }
            />
            <Nav className="mt-5" justified tabs>
                {configEmail.map((item, index) => (
                    <NavItem key={item.paneId! + index}>
                        <NavLink
                            active={activePane === item.paneId}
                            name={item.paneId}
                            onClick={onChangeTab}
                        >
                            {item.title}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent className="justify-items-center mt-5" activeTab={activePane}>
                {configEmail.map((item, index) => (
                    <TabPane key={item.paneId! + (index + 1) + "Pane"} tabId={item.paneId}>
                        <Container>{item.component}</Container>
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
}
