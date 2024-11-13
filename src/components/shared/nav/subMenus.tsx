import React from "react";
import Docentes from "../../../pages/admin/docentes";
import CrearTernas from "../../../pages/admin/crearTernas";
import CreacionDocente from "../../../pages/docentePage/crearDocente/creacionDocente";
import { Menu } from "./types";
import MostrarDocentes from "../../../pages/admin/docentes/MostrarDocentes";
import ModificarDocentes from "../../../pages/admin/docentes/ModificarDocentes";

export const adminMenu: Array<Menu> = [
  {
    paneId: "DocenteTernas",
    title: "Ternas por Docente",
    pathTo: "/ternas/verTernasDocentes",
    component: <Docentes />,
  },
  {
    paneId: "AlumnoTernas",
    title: "Ternas por Alumno",
    pathTo: "/ternas/verTernasAlumnos",
    component: <>Ternas por Alumno</>,
  },
  {
    paneId: "CrearTernas",
    title: "Crear Ternas",
    pathTo: "/ternas/crearTernas",
    component: <CrearTernas />,
  },
];

export const cargasMenu: Array<Menu> = [
  {
    paneId: "VerClasesDocente",
    title: "Ver Clases por Docente",
    pathTo: "/cargas/verCargasDocente",
    component: <>Aquí la página de ver clases por docente</>,
  },
  {
    paneId: "NuevaCarga",
    title: "Nueva Carga Académica",
    pathTo: "/cargas/crearCarga",
    component: <>Aquí la página de crear carga</>,
  },
];

export const docenteMenu: Array<Menu> = [
  {
    paneId: "CrearDocente",
    title: "Crear Docente",
    pathTo: "/docentes/crearDocente",
    component: <CreacionDocente />,
  },
  {
    paneId: "ModificarDocente",
    title: "Modificar Docente",
    pathTo: "/docentes/viewAllDocente",
    component: <ModificarDocentes />,
  },
  {
    paneId: "MostrarDocente",
    title: "Mostrar Docentes",
    pathTo: "/docentes/viewAllDocente",
    component: <MostrarDocentes />,
  },
];

export const carreras: Array<Menu> = [
  {
    paneId: "SISTEMAS",
    title: "SISTEMAS",
    pathTo: "/universidad/sistemas",
    component: <>Contenido de Sistemas</>,
  },
  {
    paneId: "CIVIL",
    title: "CIVIL",
    pathTo: "/universidad/civil",
    component: <>Contenido de Civil</>,
  },
  {
    paneId: "MEDICINA",
    title: "MEDICINA",
    pathTo: "/universidad/medicina",
    component: <>Contenido de Medicina</>,
  },
  {
    paneId: "PSICOLOGIA",
    title: "PSICOLOGIA",
    pathTo: "/universidad/psicologia",
    component: <>Contenido de Psicología</>,
  },
  {
    paneId: "MERCADOTECNIA",
    title: "MERCADOTECNIA",
    pathTo: "/universidad/mercadotecnia",
    component: <>Contenido de Mercadotecnia</>,
  },
  {
    paneId: "GESTION",
    title: "GESTION",
    pathTo: "/universidad/gestion",
    component: <>Contenido de Gestión</>,
  },
  {
    paneId: "INDUSTRIAL",
    title: "INDUSTRIAL",
    pathTo: "/universidad/industrial",
    component: <>Contenido de Industrial</>,
  },
  {
    paneId: "DERECHO",
    title: "DERECHO",
    pathTo: "/universidad/derecho",
    component: <>Contenido de Derecho</>,
  },
];

export default { adminMenu, cargasMenu, docenteMenu, carreras };
