import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import HorarioGrid from "@components/shared/horarioGrid/horarioGrid";

export default function MiHorarioDocente() {
  const [activeTab, setActiveTab] = useState("clase");

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Container fluid>
      <h4 className="mb-3">Horarios Personalizados</h4>
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={activeTab === "clase" ? "active" : ""}
            onClick={() => toggle("clase")}
            style={{ cursor: "pointer" }}
          >
            Horario de Clase
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "defensa" ? "active" : ""}
            onClick={() => toggle("defensa")}
            style={{ cursor: "pointer" }}
          >
            Horario para Defensa
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="clase">
          <HorarioGrid modoAdmin={false} tipo="clase" />
        </TabPane>
        <TabPane tabId="defensa">
          <HorarioGrid modoAdmin={false} tipo="defensa" />
        </TabPane>
      </TabContent>
    </Container>
  );
}
