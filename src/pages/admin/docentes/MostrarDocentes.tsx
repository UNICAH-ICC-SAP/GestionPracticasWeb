import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "@store/index";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '@store/slices/docentes';
import { Tables } from "../../../components/commons/tables/tables";
import NotFound from "../../../components/shared/notFound";
import { TypeUtilities } from "../../../utilities/TypeUtilities";

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

    const utils: TypeUtilities = {
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
                facultad: docente.facultadId
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
                    paginated={true}
                />
            ) : (
                <NotFound />
            )}
        </Container>
    );
}
