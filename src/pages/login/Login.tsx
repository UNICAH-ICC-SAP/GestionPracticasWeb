import React from 'react';
import { Container, Form, Input, InputGroup, InputGroupText, Toast, ToastBody, ToastHeader } from "reactstrap";
import { Image } from "../../Api";
import './login.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import Img from '../../components/shared/Img';
import { ButtonPrimary } from '../../components/shared/buttons';
import { Fetcher as FetcherLogin, Selector as UserSelector } from '../../store/slices/users';
import { useDispatch, useSelector } from '../../store';
import { TypeUtilities } from '../../utilities/TypeUtilities';

type FormLogin = {
    userId: string;
    pass: string;
}

function Login() {
    const dispatch = useDispatch();
    const [formLogin, setFormLogin] = React.useState<FormLogin>({ userId: '', pass: '' })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormLogin({
            ...formLogin,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    const isLoggedIn = useSelector(UserSelector.IsLogged);
    React.useEffect(() => {
        const utilities: TypeUtilities = { url: '' }
        dispatch(FetcherLogin.validateSession(utilities))
        if (isLoggedIn) {
            dispatch(FetcherLogin.checkUserLogged(''))
        }
    }, [isLoggedIn]);
    const cbHandleSubmit = React.useCallback(handleSubmit, [formLogin, dispatch]);
    return <Container className="container-login justify-content-center" >
        <Img style={{ width: '75%' }} src={Image["logo:main"]} />
        <Form onSubmit={cbHandleSubmit}>
            <InputGroup className='w-100'>
                <InputGroupText htmlFor="userId">
                    <FontAwesomeIcon icon={faUser} />
                </InputGroupText>
                <Input
                    id="userId"
                    name="userId"
                    placeholder="Ingrese su nombre de usuario"
                    type="number"
                    value={formLogin.userId}
                    onChange={handleChange}
                />
            </InputGroup>
            <InputGroup className="mt-5 w-100">
                <InputGroupText htmlFor="pass">
                    <FontAwesomeIcon icon={faEye} />
                </InputGroupText>
                <Input
                    id="pass"
                    name="pass"
                    placeholder="Ingrese su password"
                    type="password"
                    value={formLogin.pass}
                    onChange={handleChange}
                />
            </InputGroup>
            <ButtonPrimary className="mt-5" color="primary" onSubmit={cbHandleSubmit}>
                Login
            </ButtonPrimary>
        </Form>
        <Toast isOpen={false}>
            <ToastHeader>
                Reactstrap
            </ToastHeader>
            <ToastBody>
                This is a toast on a white background — check it out!
            </ToastBody>
        </Toast>
    </Container>
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const utilities: TypeUtilities = { url: '' }
        utilities.url = '/user/login'
        utilities.data = formLogin
        dispatch(FetcherLogin.login(utilities))
    }
}


export { Login };
