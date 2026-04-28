import React from 'react';
import Docentes from '@pages/admin/index';
import DocenteMenu from '@pages/admin/docentePage/docenteIndex';
import CargasMenu from '@pages/admin/cargas/cargasIndex';
import Pensums from '@pages/admin/pensums';
import { Home } from '@pages/home/home';
import TernaAlumno from '@pages/perfilAlumnos/ternaAlumno';
import Documentacion from '@pages/perfilAlumnos/documentacion';
import DocentePerfil from "@pages/perfilDocente/ternas"
import ConfigEmail from "@pages/admin/configEmail"
import CargaDocente from '@pages/perfilDocente/cargaDocente';

export enum Permissions {
    VIEW_HOME = 'VIEW_HOME',

    VIEW_TERNAS = 'VIEW_TERNAS',
    VIEW_DOCENTES = 'VIEW_DOCENTES',
    VIEW_PENSUMS = 'VIEW_PENSUMS',
    VIEW_CARGAS = 'VIEW_CARGAS',

    CONFIG_EMAIL_TEMPLATE = 'CONFIG_EMAIL_TEMPLATE',

    VIEW_MIS_TERNAS = 'VIEW_MIS_TERNAS',
    VIEW_CARGA_ASIGNADA = 'VIEW_CARGA_ASIGNADA',

    VIEW_MI_TERNA = 'VIEW_MI_TERNA',
    VIEW_DOCUMENTACION = 'VIEW_DOCUMENTACION',
    VIEW_DOCUMENTACION_PENDIENTE = 'VIEW_DOCUMENTACION_PENDIENTE',
    VIEW_DOCUMENTACION_ENTREGADA = 'VIEW_DOCUMENTACION_ENTREGADA',
};

export const navigation = [
    { title: 'Home', pathTo: '/', component: <Home />, permission: Permissions.VIEW_HOME },

    { title: 'Ternas', pathTo: '/ternas', component: <Docentes />, permission: Permissions.VIEW_TERNAS },

    { title: 'Docentes', pathTo: '/docentes', component: <DocenteMenu />, permission: Permissions.VIEW_DOCENTES },

    { title: 'Pemsuns', pathTo: '/pemsuns', component: <Pensums />, permission: Permissions.VIEW_PENSUMS },

    { title: 'Cargas Academicas', pathTo: '/cargas', component: <CargasMenu />, permission: Permissions.VIEW_CARGAS },

    { title: 'Configurar Plantilla Correo', pathTo: '/configEmail', component: <ConfigEmail />, permission: Permissions.CONFIG_EMAIL_TEMPLATE },

    { title: 'Mis Ternas', pathTo: '/ternas', component: <DocentePerfil />, permission: Permissions.VIEW_MIS_TERNAS },

    { title: 'Carga Asignada', pathTo: '/cargaAsignada', component: <CargaDocente />, permission: Permissions.VIEW_CARGA_ASIGNADA },

    { title: 'Mi Terna', pathTo: '/terna', component: <TernaAlumno />, permission: Permissions.VIEW_MI_TERNA },

    { title: 'Documentacion', pathTo: '/documentacion', component: <Documentacion />, permission: Permissions.VIEW_DOCUMENTACION }
];