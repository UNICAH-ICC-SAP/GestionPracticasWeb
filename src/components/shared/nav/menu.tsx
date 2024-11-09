import { Menu } from './types';
import Docentes, { adminMenu } from '../../../pages/admin';
import React from 'react';
import CreacionDocente from '../../../pages/docentePage/crearDocente/creacionDocente';
import DocenteMenu from '../../../pages/docentePage/docenteIndex';
import CargasMenu from '../../../pages/cargasPage/cargasIndex';
import DocentePerfil from "../../../pages/perfilDocente"
import { Home } from '../../../pages/home/home';


export const MenuItems: Array<Array<Menu>> = [
    [
        {
            'title': 'Home',
            'pathTo': '/home',
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
            'component': <>Todas las carrerar</>
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
            'title': 'Mis Ternas',
            'pathTo': '/',
            'component': < DocentePerfil/>
        },
    ],
    [
        {
            'title': 'Terna',
            'pathTo': '/',
            'component': <>docnetes </>
        },
        {
            'title': 'Documentacion',
            'pathTo': '/',
            'component': <>Documentacion </>
        },
    ]
]