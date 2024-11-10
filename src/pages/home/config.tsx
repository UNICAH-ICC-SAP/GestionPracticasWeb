import CrearTernas from "../admin/crearTernas";
import DocenteMenu from "../docentePage/docenteIndex";
import CargasMenu from "../cargasPage/cargasIndex";
import React from 'react';

export const ButtonHome = [
  { path: "/docentes", name: "DOCENTES", components: <DocenteMenu/> },
  { path: "/alumno", name: "ALUMNOS"},
  { path: "/cargas", name: "CARGAS", components: <CargasMenu/>  },
  { path: "/ternas", name: "TERNAS",components: <CrearTernas/>  },
  { path: "/pensum", name: "PÉNSUMS"}
];

