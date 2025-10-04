import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { adminMenu } from "@components/shared/nav/subMenus";
import Breadcrumbs from "@components/shared/breadcrumb/Breadcrumbs";

export default function Admin() {
  const [activePane, setActivePane] = useState<string>(adminMenu[0].paneId!);

  const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActivePane(e.currentTarget.name);
  };

  const currentTab = adminMenu.find((item) => item.paneId === activePane);
  type TypeBreadcrumb = {
    title: string;
  };

  const tabsBreadcrumb: Array<TypeBreadcrumb> = [
    { title: "Inicio" },
    { title: "Ternas" },
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
        {adminMenu.map((item, index) => (
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
        {adminMenu.map((item, index) => (
          <TabPane key={item.paneId! + (index + 1) + "Pane"} tabId={item.paneId}>
            <Container>{item.component}</Container>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
