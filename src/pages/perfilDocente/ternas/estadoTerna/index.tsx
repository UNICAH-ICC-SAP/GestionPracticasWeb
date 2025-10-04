import React, { useEffect, useState } from "react";
import { Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { TypeUtilities } from '../../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../../store/slices/ternas';
import { useDispatch, useSelector } from "../../../../store/index";
import { isEmpty } from "lodash";
import { Selector as UserSelector } from '../../../../store/slices/users';
import NotFound from "../../../../components/shared/notFound";
import { Tables } from "../../../../components/commons/tables/tables";

type AlumnoInfo = {
    ternaId: number;
    alumnoNombre: string;
    facultadId: string;
    email: string;
    telefono: string;
    estado: string;
};
const estados = {
    1: "Inactiva",
    2: "En curso",
    3: "Finalizada"
};

export default function Docentes() {
    const dispatch = useDispatch();
    const [alumnos, setAlumnos] = useState<AlumnoInfo[]>([]);
    const [tabSel, setTabSel] = useState(0)

    const ternasDetalle = useSelector(SelectorTernas.getDetalleTernasDocente);
    const Userdata = useSelector(UserSelector.getUser);
    const ternas = useSelector(SelectorTernas.ternasInfo);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/detalleTernas/getDetalleTernas` };
        dispatch(FetcherTernas.getDetalleTernas(utils));
    }, [dispatch, Userdata]);

    useEffect(() => {
        if (!isEmpty(ternasDetalle)) {
            const idTerna = ternasDetalle.map((terna) => terna.ternaId);
            const ternaIds = Array.from(new Set(idTerna)).join('&ternaId=');
            const utils: TypeUtilities = { url: `/ternas/getTernaBy?ternaId=${ternaIds}` };
            dispatch(FetcherTernas.getTernasInfo(utils));
        }
    }, [dispatch, ternasDetalle]);

    useEffect(() => {
        const alumnosMapped: AlumnoInfo[] = [];
        if (!isEmpty(ternas)) {
            ternas.forEach((terna) => {
                if (terna.alumno) {
                    const data: AlumnoInfo = {
                        ternaId: terna.ternaId,
                        alumnoNombre: terna.alumno.nombre || "Sin nombre",
                        facultadId: terna.alumno.facultadId,
                        email: terna.alumno.email,
                        telefono: terna.alumno.telefono,
                        estado: estados[terna.idEstadoTerna],
                    };
                    alumnosMapped.push(data);
                }
            });
            setAlumnos(alumnosMapped);
        }
    }, [ternas]);
    const detalleCoordinador = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) =>
            terna.ternaId === alumno.ternaId &&
            terna.rol &&
            terna.docenteId === Userdata.userId
        )
    );
    const detalleMiembro = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) =>
            terna.ternaId === alumno.ternaId &&
            !terna.rol &&
            terna.docenteId === Userdata.userId
        )
    );
    const tabs = [
        {
            title: 'Coordinador de terna', data: detalleCoordinador,
            headers: ['Terna ID', 'Nombre del alumno', 'Facultad', 'Email', 'Telefono', 'Acciones']
        },
        {
            title: 'Miembro de terna', data: detalleMiembro,
            headers: ['Terna ID', 'Nombre del alumno', 'Facultad', 'Email', 'Telefono', 'Estado']
        },
    ]
    return (
        <Container>
            <div>
                <Row>
                    <Col sm="12" md="2">
                        <Nav pills tabs vertical>
                            {tabs && tabs.map((item, index) => {
                                return <NavItem key={index}>
                                    <NavLink
                                        className={tabSel === index ? "active" : ""}
                                        onClick={() => setTabSel(index)}
                                    >
                                        {item.title}
                                    </NavLink>
                                </NavItem>
                            })}
                        </Nav>
                    </Col>
                    <Col sm="12" md="10">
                        <TabContent activeTab={tabSel}>
                            {tabs && tabs.map((item, index) => {
                                return <TabPane key={index} tabId={index}>
                                    <Container>
                                        <h4>{item.title}</h4>
                                        {!isEmpty(item.data) ? (
                                            <Tables
                                                data={item.data.map((alumno) => ({
                                                    ...alumno,
                                                }))}
                                                headers={item.headers}
                                                firstColumnIndex={0}
                                                paginated={false}
                                            />
                                        ) : (
                                            <NotFound />
                                        )}
                                    </Container>
                                </TabPane>
                            })}

                        </TabContent>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}