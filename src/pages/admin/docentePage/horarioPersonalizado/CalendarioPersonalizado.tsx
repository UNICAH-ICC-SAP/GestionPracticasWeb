import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import HorarioGrid from "@components/shared/CalendarioGrid/CalendarioGrid";

export default function VerHorarioDocente() {
  const [activeTab, setActiveTab] = useState("clase");

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Container fluid>
      <h4 className="mb-3">Calendario</h4>
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={activeTab === "clase" ? "active" : ""}
            onClick={() => toggle("clase")}
            style={{ cursor: "pointer" }}
          >
            Clase
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "defensa" ? "active" : ""}
            onClick={() => toggle("defensa")}
            style={{ cursor: "pointer" }}
          >
            Defensa
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="clase">
          <HorarioGrid modoAdmin={true} tipo="clase" />
        </TabPane>
        <TabPane tabId="defensa">
          <HorarioGrid modoAdmin={true} tipo="defensa" />
        </TabPane>
      </TabContent>
    </Container>
  );
}
