import React, { useState } from "react";
import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import { useDispatch } from "@store/index";
import { Action as ActionPensum } from '@store/slices/pensums';
import { Action as ActionSecciones } from '@store/slices/secciones';
import { Action as ActionPeriodo } from '@store/slices/periodo';

import { pensumMenu } from "@components/shared/nav/subMenus";
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";

type TypeBreadcumb = {
    title: string;
}

export default function Pensums() {
    const dispatch = useDispatch();
    const [activePane, setActivePane] = useState<string>(pensumMenu[0].paneId!);
    const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
        dispatch(ActionPensum.cleanStore());
        dispatch(ActionSecciones.cleanStore());
        dispatch(ActionPeriodo.cleanStore());
        setActivePane(e.currentTarget.name);
    };
    const currentTab = pensumMenu.find((item) => item.paneId === activePane);

    const tabsBreadcrumb: Array<TypeBreadcumb> = [
        { title: "Inicio" },
        { title: "Pensums" },
        { title: currentTab?.title || "" },
    ];

    return (
        <div className="align-self-center w-100 px-5">
            <Breadcrumbs
                items={tabsBreadcrumb}
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
