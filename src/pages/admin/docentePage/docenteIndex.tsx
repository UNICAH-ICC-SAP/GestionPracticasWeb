import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { docenteMenu } from "../../../components/shared/nav/subMenus";
import Breadcrumbs from "../../../components/shared/breadcrumb/Breadcrumbs";
import { useSelector } from "@store/index";
import { Selector as SelectorUser } from "@store/slices/users";

export default function DocenteMenu() {
  const user = useSelector(SelectorUser.getUser);

  const [activePane, setActivePane] = useState<string>(docenteMenu[1 - user.roleId].paneId!);

  function onChangeTab(e: React.MouseEvent<HTMLAnchorElement>) {
    setActivePane(e.currentTarget.name);
  };

  const currentTab = docenteMenu.find((item) => item.paneId === activePane);

  type TypeBreadcumb = {
    title: string;
  };

  const tabsBreadcrumb: Array<TypeBreadcumb> = [
    { title: "Inicio" },
    { title: "Docente" },
    { title: currentTab?.title || "" },
  ];

  return (
    <div className="align-self-center w-100 px-5">
      <Breadcrumbs
        items={tabsBreadcrumb}
      />
      <Nav className="mt-5" justified tabs>
        {docenteMenu.map((item, index) => (
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
        {docenteMenu.map((item, index) => (
          <TabPane key={item.paneId! + (index + 1) + "Pane"} tabId={item.paneId}>
            <Container>{item.component}</Container>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
