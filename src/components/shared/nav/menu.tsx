import { Menu } from './types';
import Docentes from '../../../pages/admin';
import React from 'react';

export const MenuItems: Array<Array<Menu>> = [
    [
        {
            'title': 'Ternas',
            'pathTo': '/',
            'component': <Docentes />
        },
        {
            'title': 'Docentes',
            'pathTo': '/docentes',
            'component': <>Crear Ternas</>
        },
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