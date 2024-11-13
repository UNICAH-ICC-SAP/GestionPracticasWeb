import React, { useEffect, useState } from "react";
import { Container} from "reactstrap";
import { TypeUtilities } from '../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../store/slices/ternas';
import { useDispatch, useSelector } from "../../../store";
import { isEmpty } from "lodash";
import { Selector as UserSelector } from '../../../store/slices/users';
import { Tables } from "../../../components/commons/tables/tables";



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
                        estado:estados[terna.idEstadoTerna], 
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
            terna.coordina && 
            terna.docenteId === Userdata.userId
        )
    );

    const detalleMiembro = alumnos.filter((alumno) =>
        ternasDetalle.some((terna) => 
            terna.ternaId === alumno.ternaId && 
            !terna.coordina && 
            terna.docenteId === Userdata.userId
        )
    );

    return (
        <Container>
            <h4>Coordinador de Terna</h4>
            {!isEmpty(detalleCoordinador) ? (
                <Tables
                    data={detalleCoordinador.map((alumno) => ({
                        ...alumno
                    }))}
                    headers={['Terna ID', 'Nombre del Alumno', 'Facultad', 'Email', 'Telefono', 'Estado']}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <p>No tienes ternas donde seas coordinador.</p>
            )}

            <h4>Miembro de Terna</h4>
            {!isEmpty(detalleMiembro) ? (
                <Tables
                    data={detalleMiembro.map((alumno) => ({
                        ...alumno,
                    
                    }))}
                    headers={['Terna ID', 'Nombre del Alumno', 'Facultad', 'Email', 'Telefono', 'Estado']}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <p>No tienes ternas donde seas miembro.</p>
            )}

           
        </Container>
    );
}
