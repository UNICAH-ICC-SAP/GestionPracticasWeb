import { Menu } from './types';
import Docentes from '../../../pages/admin';
import React from 'react';
import DocenteMenu from '../../../pages/docentePage/docenteIndex';
import CargasMenu from '../../../pages/cargasPage/cargasIndex';
import DocentePerfil from "../../../pages/perfilDocente"
import Pensums from '../../../pages/pensums/';
import { Home } from '../../../pages/home/home';
import Alumno from '../../../pages/alumnospage/alumno';


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
        }
    ]
    ,
    [
        {
            'title': 'misTernas',
            'pathTo': '/',
            'component': < DocentePerfil />
        },
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