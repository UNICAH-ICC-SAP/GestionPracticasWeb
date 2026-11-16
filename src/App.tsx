import React, { useEffect } from 'react'
import { Navigation } from './components/shared/nav/navigation';
import { Login } from './pages/login/Login';
import { useSelector, useDispatch } from '@store/index';
import { Selector as UserSelector, Fetcher as FetcherUser } from './store/slices/users';
import { TypeUtilities } from './utilities/TypeUtilities';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'reactstrap';
import { navigation } from '@components/shared/nav/menu';
import { NavigationItem } from '@components/shared/nav/types';

function App() {
    const [invitationToken, setInvitationToken] = React.useState(() =>
        new URLSearchParams(window.location.hash.slice(1)).get('invitation') || '');
    useEffect(() => {
        if (invitationToken) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }, [invitationToken]);
    const userData = useSelector(UserSelector.getUser);
    const isLogged = useSelector(UserSelector.IsLogged);
    const roles = useSelector(UserSelector.getRoles);
    const permissions = useSelector(UserSelector.getPermissions);
    const isPassChangeRequired = useSelector(UserSelector.getPasswordResetRequired);
    const dispatch = useDispatch();
    const [menuItem, setMenuItems] = React.useState<NavigationItem[]>([]);

    useEffect(() => {
        if (!isLogged || isPassChangeRequired) return;
        if (userData.roleId) {
            const uriConst = (userData.roleId === 3) ? 'alumno' : 'docente';
            const utils: TypeUtilities = {
                url: `/${uriConst}/get${uriConst}sBy?${uriConst}Id=${userData.userId}`
            }
            dispatch(FetcherUser.userInfo(utils))
        }
        if (userData.roleId) {
            const rolesUtilities: TypeUtilities = { url: "/rolePermission/getRolesGrouped", data: { roleId: userData.roleId } };

            dispatch(FetcherUser.getRolesPermissionByUserRole(rolesUtilities));
        }
        if (userData.userId) {
            const userUtilities: TypeUtilities = {
                url: "/userPermission/getUserPermissionsByUser", data: {
                    userId: userData.userId
                }
            };
            dispatch(FetcherUser.getUserPermissionByUser(userUtilities));
        }
    }, [dispatch, userData.userId, userData.roleId, isLogged, isPassChangeRequired])

    React.useEffect(() => {
        const allowed = new Set(roles.map(permission => permission.permission));
        permissions.forEach(permission => {
            if (permission.permissionType === 'DENY') allowed.delete(permission.permission);
            if (permission.permissionType === 'ALLOW') allowed.add(permission.permission);
        });
        setMenuItems(navigation.filter(item => item.permission && allowed.has(item.permission)));
    }, [roles, permissions]);

    if (!isLogged || invitationToken) {
        return <React.Fragment>
            <Navigation />
            <Login initialInvitationToken={invitationToken} onActivationComplete={() => setInvitationToken('')} />
        </React.Fragment>
    }

    if (isPassChangeRequired) {
        return <React.Fragment>
            <Navigation />
            <Login />
        </React.Fragment>
    }

    return (
        <React.Fragment>
            <Navigation />
            <Container tag='div' style={{ display: 'flex' }} fluid className='justify-content-center'>
                {menuItem && <Routes>
                    {
                        menuItem.map(item => {
                            return <Route key={item.pathTo} path={item.pathTo} element={item.component} />
                        })
                    }
                </Routes>}
            </Container>
        </React.Fragment>
    );
}

export default App
