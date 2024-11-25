import React, { useState } from "react";
import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import { pensumMenu } from "../../components/shared/nav/subMenus";
import Breadcrumbs from "../../components/shared/breadcrumb/Breadcrumbs";

export default function Pensums() {
    const [activePane, setActivePane] = useState<string>(pensumMenu[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setActivePane(e.currentTarget.name);
    };
    const currentTab = pensumMenu.find((item) => item.paneId === activePane);

    return (
        <div className="align-self-center w-100 px-5">
            <Breadcrumbs
                items={[
                    { title: "Inicio" },
                    { title: "Pensums" },
                    { title: currentTab?.title || "" },
                ]}
            />
            <Nav className="mt-5" justified tabs>
                {pensumMenu.map((item, index) => (
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
                {pensumMenu.map((item, index) => (
                    <TabPane
                        key={item.paneId! + (index + 1) + "Pane"}
                        tabId={item.paneId}
                    >
                        <Container>
                            {activePane === item.paneId && item.component}
                        </Container>
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
}
