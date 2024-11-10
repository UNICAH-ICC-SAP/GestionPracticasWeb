import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container } from "reactstrap";
import { useDispatch, useSelector } from "../../../store";
import { Fetcher as FetcherDocentes, Selector as SelectorDocentes } from '../../../store/slices/docentes';
import { Tables } from "../../../components/commons/tables/tables";
import { isEmpty } from "lodash";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        console.log("Docentes:", docentes); // Verifica qué se está recibiendo
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
    
    

    const actions = (
        <td>
            <ButtonGroup>
                <Button color="success">
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button color="danger">
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button color="primary">
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            </ButtonGroup>
        </td>
    );

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
