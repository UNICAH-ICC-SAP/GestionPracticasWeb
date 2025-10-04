import React from 'react';
import { Menu } from './types';
import Docentes from '@pages/admin/index';
import DocenteMenu from '@pages/admin/docentePage/docenteIndex';
import CargasMenu from '@pages/admin/cargasPage/cargasIndex';
import Pensums from '@pages/admin/pensums';
import { Home } from '@pages/home/home';
import TernaAlumno from '@pages/perfilAlumnos/ternaAlumno';
import Documentacion from '@pages/perfilAlumnos/documentacion';
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
            'title': 'Home',
            'pathTo': '/',
            'component': <Home />
        },
        {
            'title': 'Mis Ternas',
            'pathTo': '/Ternas',
            'component': <DocentePerfil />
        },
        {
            'title': 'Carga Asignada',
            'pathTo': '/cargaAsignada',
            'component': <CargaDocente />
        }
    ],
    [
        {
            'title': 'Home',
            'pathTo': '/',
            'component': <Home />
        },
        {
            'title': 'Mi Terna',
            'pathTo': '/terna',
            'component': <TernaAlumno />
        },
        {
            'title': 'Documentacion',
            'pathTo': '/documentacion',
            'component': <Documentacion />
        },
    ]
]