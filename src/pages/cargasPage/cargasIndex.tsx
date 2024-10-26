// CargasMenu.tsx
import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { cargasMenu } from "../../components/shared/nav/subMenus"; // Ajusta según tu ruta
import Breadcrumbs from "../../components/shared/breadcrumb/Breadcrumbs";

export default function CargasMenu() {
  const [activePane, setActivePane] = useState<string>(cargasMenu[0].paneId!);

  const onChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActivePane(e.currentTarget.name);
  };

  const currentTab = cargasMenu.find((item) => item.paneId === activePane);

  return (
    <div className="align-self-center w-100 px-5">
      <Breadcrumbs
        items={[
          { title: "Inicio" },
          { title: "Cargas" },
          { title: currentTab?.title || "" },
        ]}
      />
      <Nav className="mt-5" justified tabs>
        {cargasMenu.map((item, index) => (
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
        {cargasMenu.map((item, index) => (
          <TabPane key={item.paneId! + (index + 1) + "Pane"} tabId={item.paneId}>
            <Container>{item.component}</Container>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
