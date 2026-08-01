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
    const userData = useSelector(UserSelector.getUser);
    const isLogged = useSelector(UserSelector.IsLogged);
    const roles = useSelector(UserSelector.getRoles);
    const permissions = useSelector(UserSelector.getPermissions);
    const isPassChangeRequired = useSelector(UserSelector.getPasswordResetRequired);
    const dispatch = useDispatch();
    const [menuItem, setMenuItems] = React.useState<NavigationItem[]>([]);

    useEffect(() => {
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
    }, [dispatch, userData.userId, userData.roleId])

    React.useEffect(() => {
        const combinedPermissionsSet = new Set<string>();

        if (roles && roles.length > 0) {
            roles.forEach(p => {
                if (p?.permission) combinedPermissionsSet.add(p.permission);
            });
        }

        if (permissions && permissions.length > 0) {
            permissions
                .filter(p => p?.permissionType === 'ALLOW')
                .forEach(p => {
                    if (p?.permission) combinedPermissionsSet.add(p.permission);
                });
        }

        const nav = navigation.filter(item =>
            item?.permission && combinedPermissionsSet.has(item.permission)
        );
        setMenuItems(nav)
    }, [roles, permissions])

    if (!isLogged) {
        return <React.Fragment>
            <Navigation />
            <Login />
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