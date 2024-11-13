import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../store/slices/docentes';
import { Tables } from "../../../components/commons/tables/tables";
import NotFound from "../../../components/shared/notFound";

type DocenteDetail = {
    docenteId: string;
    nombre: string;
    email: string;
    telefono: string;
    facultad: string;
};

export default function MostrarDocentes() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<DocenteDetail>>([]);

    // Configuración del fetch
    const utils = {
        url: '/docente/getDocentes'
    };

    useEffect(() => {
        dispatch(FetcherDocentes.getDocentes(utils));
    }, [dispatch]);

    const docentes = useSelector(SelectorDocentes.getDocentes);

    useEffect(() => {
        if (Array.isArray(docentes) && docentes.length > 0) {
            const docentesMapped = docentes.map(docente => ({
                docenteId: docente.docenteId,
                nombre: docente.nombre,
                email: docente.email,
                telefono: docente.telefono,
                facultad: docente.facultad.nombreFacultad
            }));

            setDetalle(docentesMapped);
        }
    }, [docentes]);

    return (
        <Container>
            {detalle.length > 0 ? (
                <Tables
                    data={detalle}
                    headers={['Docente ID', 'Nombre', 'Email', 'Teléfono', 'Facultad']}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <NotFound />
            )}
        </Container>
    );
}
