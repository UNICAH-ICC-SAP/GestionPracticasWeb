import { useState } from 'react';

import { Collapse, Nav, NavItem, Navbar, NavbarBrand, NavbarText, NavbarToggler } from 'reactstrap'
import { useSelector, useDispatch } from '@store/index';
import { Selector as UserSelector, Action as ActionUser } from '@store/slices/users';
import { NavLink } from 'react-router-dom'
import { LogOut } from '@utilities/Utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { ButtonTransparent } from '@components/shared/buttons';
import {
    Selector as SelectorUser,
} from "@store/slices/users";
import React from 'react';

import { navigation } from './menu';
import Img from '@components/shared/Img';
import { Image } from "@root/Api";
import type { NavigationItem } from '@components/shared/nav/types';

export function Navigation() {
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false);
    const userData = useSelector(UserSelector.getUserInfo);
    const toggle = () => setIsOpen(!isOpen);
    const clases = (!userData.nombre) ? 'w-100 text-center' : '';

    const [menuItem, setMenuItems] = React.useState<NavigationItem[] | null>([]);
    const roles = useSelector(SelectorUser.getRoles);
    const permissions = useSelector(SelectorUser.getPermissions);

    const handleLogOut = () => {
        LogOut();
        setMenuItems(null);
        dispatch(ActionUser.cleanStore());
    }

    React.useEffect(() => {
        if (roles && roles.length > 0) {
            const userPermissionsSet = new Set(
                roles.map(p => p?.permission)
            );

            const nav: NavigationItem[] = navigation.filter(item =>
                item?.permission && userPermissionsSet.has(item.permission)
            );
            setMenuItems([...nav])
        }
        if (permissions && permissions.length > 0) {
            const userPermissionsSet = new Set(
                permissions
                    .filter(p => p?.permissionType === 'ALLOW')
                    .map(p => p?.permission)
            );
            const nav = navigation.filter(item =>
                item?.permission && userPermissionsSet.has(item.permission)
            );
            setMenuItems(prev => [...prev, ...nav])
        }
    }, [roles, permissions])

    return <Navbar expand='md' container color='primary' dark={true}>
        <NavbarBrand href="/" className={clases}>
            {userData.nombre &&
                <Img style={{
                    height: '5rem',
                    width: '5rem',
                }} src={Image["logo:main-blanco"]} />}
            Gestion de Practicas
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
                {menuItem && menuItem.map(item => {
                    return <NavItem key={item.pathTo}>
                        <NavLink className='nav-link py-1' to={item.pathTo}>{item.title}</NavLink>
                    </NavItem>
                })}
            </Nav>
            {userData.nombre && <React.Fragment>
                <NavbarText>{userData.nombre}</NavbarText>
                <ButtonTransparent onClick={handleLogOut}><FontAwesomeIcon icon={faPowerOff} /></ButtonTransparent>
            </React.Fragment>}
        </Collapse>
    </Navbar>
}
