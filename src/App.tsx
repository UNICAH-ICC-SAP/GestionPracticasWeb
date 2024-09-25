import React, { useEffect } from 'react'
import { Navigation } from './components/shared/nav/navigation';
import { MenuItems } from './components/shared/nav/menu';
import { Login } from './pages/login/Login';
import { useSelector, useDispatch } from './store';
import { Selector as UserSelector, Fetcher as FetcherUser } from './store/slices/users';
import { TypeUtilities } from './utilities/TypeUtilities';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'reactstrap';


function App() {
    const userData = useSelector(UserSelector.getUser);
    const dispatch = useDispatch();
    const CurrentNav = MenuItems[userData.roleId - 1]
    useEffect(() => {
        if (userData.roleId) {
            const uriConst = (userData.roleId === 3) ? 'alumno' : 'docente';
            const utils: TypeUtilities = {
                url: `/${uriConst}/get${uriConst}sBy?${uriConst}Id=${userData.userId}`
            }
            dispatch(FetcherUser.userInfo(utils))
        }
    }, [dispatch, userData.userId, userData.roleId])
    return (
        <React.Fragment>
            <Navigation roleId={userData.roleId} />
            {!userData.message && <Login />}
            <Container tag='div' style={{ display: 'flex' }} fluid className='justify-content-center'>
                {CurrentNav && <Routes>
                    {
                        CurrentNav.map(item => {
                            return <Route key={item.pathTo} path={item.pathTo} element={item.component} />
                        })
                    }
                </Routes>}
            </Container>
        </React.Fragment>
    );
}

export default App
