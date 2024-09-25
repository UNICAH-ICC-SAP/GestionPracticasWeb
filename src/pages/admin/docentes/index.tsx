import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, } from "reactstrap";
import { TypeUtilities } from '../../../utilities/TypeUtilities';
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from '../../../store/slices/ternas'
import { useDispatch, useSelector } from "../../../store";
import { Tables } from "../../../components/commons/tables/tables";
import { isEmpty } from "lodash";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFound from "../../../components/shared/notFound";

type TernaDetail = {
    detalleTernaId?: number;
    ternaId?: number;
    docenteId: string;
    docenteNombre: string;
    coordina: string;
}
const INIT_DETAIL = {
    detalleTernaId: 0,
    ternaId: 0,
    docenteId: '',
    docenteNombre: '',
    coordina: false,
}
export default function Docetes() {
    const dispatch = useDispatch();
    const [detalle, setDetalle] = useState<Array<TernaDetail>>([])
    const utils: TypeUtilities = {
        url: '/detalleTernas/getDetalleTernas'
    }
    useEffect(() => {
        dispatch(FetcherTernas.getDetalleTernas(utils))
    }, [dispatch])
    const docentes = useSelector(SelectorTernas.ternasInfo);
    useEffect(() => {
        if (!isEmpty(docentes)) {
            const docentesMapped = docentes.map(docente => {
                const terna: TernaDetail = {
                    docenteId: docente.docenteId,
                    docenteNombre: docente.docente.nombre,
                    coordina: docente.coordina ? "Coordinador" : ''
                };
                return terna;
            })
            setDetalle(docentesMapped)
        }
    }, [docentes])
    const jsx = <td><ButtonGroup>
        <Button color="success">
            <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button color="danger">
            <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button color="primary">
            <FontAwesomeIcon icon={faEye} />
        </Button>
    </ButtonGroup></td>
    return <Container>
        {detalle.length > 0 && <Tables data={detalle} headers={['Docente Id', 'Nombre Docente', 'Coordina Terna']} firstColumnIndex={0} paginated={false} />}
        {detalle.length === 0 && <NotFound />}
    </Container>
}