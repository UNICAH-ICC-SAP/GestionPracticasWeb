import { Menu } from './types';
import Docentes, { adminMenu } from '../../../pages/admin';
import React from 'react';
import CreacionDocente from '../../../pages/docentePage/crearDocente/creacionDocente';
import DocenteMenu from '../../../pages/docentePage/docenteIndex';
import CargasMenu from '../../../pages/cargasPage/cargasIndex';

export const MenuItems: Array<Array<Menu>> = [
    [
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
            'component': <>Mis Ternas</>
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