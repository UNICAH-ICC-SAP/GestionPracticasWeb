import React from "react";
import {
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Image } from "../../Api";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Img from "../../components/shared/Img";
import { ButtonPrimary } from "../../components/shared/buttons";
import {
  Fetcher as FetcherLogin,
  Selector as SelectorLogin,
} from "../../store/slices/users";
import { useDispatch, useSelector } from "../../store";
import { TypeUtilities } from "../../utilities/TypeUtilities";
import Swal from "sweetalert2";

type FormLogin = {
  userId: string;
  pass: string;
};

type FormPasswordReset = {
  newPass: string;
};

function Login() {
  const dispatch = useDispatch();
  const [formLogin, setFormLogin] = React.useState<FormLogin>({
    userId: "",
    pass: "",
  });
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] =
    React.useState(false);
  const [formPasswordReset, setFormPasswordReset] =
    React.useState<FormPasswordReset>({ newPass: "" });

  const [isLoginPasswordVisible, setIsLoginPasswordVisible] =
    React.useState(false);
  const [isResetPasswordVisible, setIsResetPasswordVisible] =
    React.useState(false);
  const passwordRequired = useSelector(SelectorLogin.getPasswordResetRequired);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({
      ...formLogin,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handlePasswordResetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormPasswordReset({
      ...formPasswordReset,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const utilities: TypeUtilities = { url: "/user/login", data: formLogin };

    dispatch(FetcherLogin.login(utilities));
  };

  const handlePasswordResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const utilities: TypeUtilities = {
      url: `/user/resetPassword?userId=${formLogin.userId}`,
      data: { newPassword: formPasswordReset.newPass },
    };

    dispatch(Fetcher.updateData(utilities));
    setShowPasswordResetModal(false);
    Swal.fire({
      title: "¡Éxito!",
      text: "Contraseña actualizada con éxito.",
      icon: "success",
    });
  };

  const handleWelcomeModalNext = () => {
    setShowWelcomeModal(false);
    setShowPasswordResetModal(true);
  };

  React.useEffect(() => {
    if (passwordRequired) {
      setShowWelcomeModal(true);
    }
  }, [passwordRequired]);

  return (
    <Container className="container-login justify-content-center">
      <Img style={{ width: "75%" }} src={Image["logo:main"]} />
      <Form onSubmit={handleSubmit}>
        <InputGroup className="w-100">
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
            <FontAwesomeIcon icon={faKey} />
          </InputGroupText>
          <Input
            id="pass"
            name="pass"
            placeholder="Ingrese su password"
            type={isLoginPasswordVisible ? "text" : "password"}
            value={formLogin.pass}
            onChange={handleChange}
          />
          <InputGroupText
            onClick={() => setIsLoginPasswordVisible(!isLoginPasswordVisible)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={isLoginPasswordVisible ? faEyeSlash : faEye}
            />
          </InputGroupText>
        </InputGroup>
        <ButtonPrimary className="mt-5" color="primary">
          Login
        </ButtonPrimary>
      </Form>

      {/* Modal de bienvenida */}
      <Modal
        isOpen={showWelcomeModal}
        toggle={() => setShowWelcomeModal(!showWelcomeModal)}
      >
        <ModalHeader toggle={() => setShowWelcomeModal(!showWelcomeModal)}>
          Bienvenido
        </ModalHeader>
        <ModalBody>
          <p>¡Hola! Para continuar, necesitas restablecer tu contraseña.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleWelcomeModalNext}>
            Siguiente
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para restablecer la contraseña */}
      <Modal
        isOpen={showPasswordResetModal}
        toggle={() => setShowPasswordResetModal(!showPasswordResetModal)}
      >
        <ModalHeader
          toggle={() => setShowPasswordResetModal(!showPasswordResetModal)}
        >
          Restablecer contraseña
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handlePasswordResetSubmit}>
            <InputGroup className="w-100">
              <InputGroupText htmlFor="newPass">
                <FontAwesomeIcon icon={faKey} />
              </InputGroupText>
              <Input
                id="newPass"
                name="newPass"
                placeholder="Ingrese su nueva contraseña"
                type={isResetPasswordVisible ? "text" : "password"}
                value={formPasswordReset.newPass}
                onChange={handlePasswordResetChange}
                required
              />
              <InputGroupText
                onClick={() =>
                  setIsResetPasswordVisible(!isResetPasswordVisible)
                }
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={isResetPasswordVisible ? faEyeSlash : faEye}
                />
              </InputGroupText>
            </InputGroup>
            <ModalFooter>
              <Button color="primary" type="submit">
                Actualizar contraseña
              </Button>
              <Button
                color="secondary"
                onClick={() => setShowPasswordResetModal(false)}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
}

export { Login };
