import { useState } from 'react';

import { Collapse, Nav, NavItem, Navbar, NavbarBrand, NavbarText, NavbarToggler } from 'reactstrap'
import { DEF, Props } from '@root/Api/typesProps';
import { useSelector } from '@store/index';
import { Selector as UserSelector, Action as ActionUser } from '@store/slices/users';
import { NavLink } from 'react-router-dom'
import { LogOut } from '@utilities/Utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { ButtonTransparent } from '@components/shared/buttons';
import { useDispatch } from 'react-redux';
import React from 'react';
import { MenuItems } from './menu';
import Img from '@components/shared/Img';
import { Image } from "@root/Api";

type PROPS = {
    roleId: number;
}

export function Navigation(props: Props<PROPS, typeof DEF>) {
    const dispatch = useDispatch()
    const handleLogOut = () => {
        LogOut();
        dispatch(ActionUser.cleanStore());
    }
    const [isOpen, setIsOpen] = useState(false);
    const menuMain = MenuItems[props.roleId - 1]
    const userData = useSelector(UserSelector.getUserInfo);
    const toggle = () => setIsOpen(!isOpen);
    const clases = (!userData.nombre) ? 'w-100 text-center' : '';
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
                {menuMain && menuMain.map(item => {
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
