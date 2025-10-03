import React from 'react';
import { Menu } from './types';
import Docentes from '@pages/admin/index';
import DocenteMenu from '@pages/admin/docentePage/docenteIndex';
import CargasMenu from '@pages/admin/cargasPage/cargasIndex';
import Pensums from '@pages/pensums/';
import { Home } from '@pages/home/home';
import Alumno from '@pages/perfilAlumnos/alumno';
import DocentePerfil from "@pages/perfilDocente/ternas"
import ConfigEmail from "@pages/admin/configEmail"
import CargaDocente from '@pages/perfilDocente/cargaDocente';


export const MenuItems: Array<Array<Menu>> = [
    [
        {
            'title': 'Home',
            'pathTo': '/',
            'component': <Home />,
        },
        {
            'title': 'Ternas',
            'pathTo': '/ternas',
            'component': <Docentes />,
        },
        {
            'title': 'Docentes',
            'pathTo': '/docentes',
            'component': <DocenteMenu />
        },
        {
            'title': 'Pemsuns',
            'pathTo': '/pemsuns',
            'component': <Pensums />
        },
        {
            'title': 'Cargas Academicas',
            'pathTo': '/cargas',
            'component': <CargasMenu />
        },
        ,
        {
            'title': 'Configurar Plantilla Correo',
            'pathTo': '/configEmail',
            'component': <ConfigEmail />
        }
    ],
    [
        {
            'title': 'Mis Ternas',
            'pathTo': '/',
            'component': < DocentePerfil />
        },
        {
            'title': 'Carga Asignada',
            'pathTo': '/cargaAsignada',
            'component': <CargaDocente />
        }
    ],
    [
        {
            'title': 'Alumno',
            'pathTo': '/',
            'component': <Alumno />
        },
        {
            'title': 'Documentacion',
            'pathTo': '/',
            'component': <>Documentacion </>
        },
    ]
]