import React from "react";
import CrearTernas from "../../../pages/admin/crearTernas";
import CreacionDocente from "../../../pages/docentePage/crearDocente/creacionDocente";
import { Menu } from "./types";
import MostrarDocentes from "../../../pages/admin/docentes/MostrarDocentes";
import ModificarDocentes from "../../../pages/admin/docentes/ModificarDocentes";
import Carreras from "../../../pages/pensums/mostrarPensums/carreras";
import Laboratorios from "../../../pages/pensums/mostrarPensums/laboratorios";
import Coprogramaticas from "../../../pages/pensums/mostrarPensums/coprogramaticas";
import NuevaCarga from "../../../pages/admin/Cargas/NuevaCarga";
import ModificarAlumnos from "../../../pages/admin/crearTernas/modificarTernas/ModificarAlumno";
import VerTernas from "../../../pages/admin/crearTernas/modificarTernas/MostrarTernas";
import CargasDocente from "../../../pages/cargasPage/mostrarCargas/cargasDocentes";

export const adminMenu: Array<Menu> = [
  {
    paneId: "CrearTernas",
    title: "Crear Ternas",
    pathTo: "/ternas/crearTernas",
    component: <CrearTernas />,
  },
  {
    paneId: "DocenteTernas",
    title: "Ternas por Docente",
    pathTo: "/ternas/verTernasDocentes",
    component: <Docentes />,
  },
  {
    paneId: "AlumnoTernas",
    title: "Ver Ternas",
    pathTo: "/ternas/modificarTernas",
    component: <VerTernas />,
  },
  {
    paneId: "CrearTernas",
    title: "Crear Ternas",
    pathTo: "/ternas/crearTernas",
    component: <CrearTernas />,
  },
  {
    paneId: "ModificarAlumnos",
    title: "Ver y Modificar Alumnos",
    pathTo: "/Alumnos/modificarAlumnos",
    component: <ModificarAlumnos />,
  },
];

export const cargasMenu: Array<Menu> = [
  {
    paneId: "VerClasesDocente",
    title: "Ver Clases por Docente",
    pathTo: "/cargas/verCargasDocente",
    component: <CargasDocente />,
  },
  {
    paneId: "NuevaCarga",
    title: "Nueva Carga Académica",
    pathTo: "/cargas/crearCarga",
    component: <NuevaCarga />,
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

export const pensumMenu: Array<Menu> = [
  {
    paneId: "Carreras",
    title: "Carreras",
    pathTo: "/pensum/carreras",
    component: <Carreras />,
  },
  {
    paneId: "Laboratorios",
    title: "Laboratorios",
    pathTo: "/pensum/laboratorios",
    component: <Laboratorios />,
  },
  {
    paneId: "Coprogramaticas",
    title: "Coprogramáticas",
    pathTo: "/pensum/coprogramaticas",
    component: <Coprogramaticas />,
  }
];

export default { adminMenu, cargasMenu, docenteMenu, pensumMenu };
