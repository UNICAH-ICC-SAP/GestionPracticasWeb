import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { TypeUtilities } from "../../utilities/TypeUtilities";
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from "../../store/slices/ternas";
import { useDispatch, useSelector } from "../../store";
import { isEmpty } from "lodash";
import { Selector as UserSelector } from "../../store/slices/users";
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from "../../store/slices/docentes";
import { Tables } from "../../components/commons/tables/tables";
import NotFound from '../../components/shared/notFound'
import { Type as DocenteType } from '../../store/slices/docentes/_namespace';

export default function DocentesAsignados() {
    const dispatch = useDispatch();
    const [docentesAsignados, setDocentesAsignados] = useState<DocenteType.DocenteInfo[]>([]);
    const ternas = useSelector(SelectorTernas.ternasInfo);
    const Userdata = useSelector(UserSelector.getUser);
    const docentes = useSelector(DocenteSelector.getDocentes);

    useEffect(() => {
        const utils: TypeUtilities = { url: `/ternas/getTernaBy?alumnoId=${Userdata.userId}` };
        dispatch(FetcherTernas.getTernasInfo(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch, Userdata]);

    useEffect(() => {
        if (!isEmpty(ternas) && !isEmpty(docentes)) {
            const docentesData: DocenteType.DocenteInfo[] = [];
            ternas.forEach((terna) => {
                terna.detalleTernas.map((detalle) => {
                    const docente = docentes.find((doc) => doc.docenteId === detalle.docenteId);
                    if (docente) {
                        docentesData.push({
                            docenteId: detalle.docenteId,
                            facultadId: docente.facultadId,
                            nombre: docente.nombre,
                            telefono: docente.telefono,
                            email: docente.email,
                            coordina: detalle.coordina === 'coordina',
                        });
                    }
                });
            });
            setDocentesAsignados(docentesData);
        }
    }, [ternas, docentes]);
    return (
        <Container>
            {!isEmpty(docentesAsignados) ? (
                <Tables
                    data={docentesAsignados.map((docente) => ({
                        ...docente,
                    }))}
                    headers={["Nombre del Docente", "Telefono", "Email", "Coordina"]}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <NotFound />
            )}
        </Container>
    );
}