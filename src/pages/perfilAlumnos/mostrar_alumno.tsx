import React, { useEffect, useState } from "react";
import { ButtonGroup, Container } from "reactstrap";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { Fetcher as FetcherTernas, Selector as SelectorTernas } from "@store/slices/ternas";
import { useDispatch, useSelector } from "@store/index";
import { isEmpty } from "lodash";
import { Selector as UserSelector } from "@store/slices/users";
import { Selector as DocenteSelector, Fetcher as FetcherDocente } from "@store/slices/docentes";
import { Tables } from "@components/commons/tables/tables";
import NotFound from '@components/shared/notFound'
import { Type as DocenteType } from '@store/slices/docentes/_namespace';
import { WhatsappButton } from "@components/shared/buttons";

export default function DocentesAsignados() {
    const dispatch = useDispatch();
    const [docentesAsignados, setDocentesAsignados] = useState<DocenteType.DocenteInfo[]>([]);
    const ternas = useSelector(SelectorTernas.ternasInfo);
    const Userdata = useSelector(UserSelector.getUser);
    const docentes = useSelector(DocenteSelector.getDocentes);
    console.log(Userdata)
    useEffect(() => {
        const utils: TypeUtilities = { url: `/ternas/getTernaBy?alumnoId=${Userdata.userId}` };
        dispatch(FetcherTernas.getTernasInfo(utils));
        utils.url = '/docente/getDocentes';
        dispatch(FetcherDocente.getDocentes(utils));
    }, [dispatch, Userdata]);

    useEffect(() => {
        console.log(ternas, docentes);
        if (!isEmpty(ternas) && !isEmpty(docentes)) {
            const docentesData: DocenteType.DocenteInfo[] = [];
            ternas.forEach((terna) => {
                terna.detalleTernas.map((detalle) => {
                    const docente = docentes.find((doc) => doc.docenteId === detalle.docenteId);
                    if (docente) {
                        docentesData.push({
                            nombre: docente.nombre,
                            email: docente.email,
                            rol: detalle.rol,
                            telefono: docente.telefono,
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
                        rol: docente.rol === 'coordina' ? 'Coordinador' : docente.rol === 'estilo' ? 'Revisor de Estilos' : 'Revisor Técnico',
                        acciones: (
                            <ButtonGroup>
                                <WhatsappButton telefono={docente.telefono} />
                            </ButtonGroup>
                        ),
                    }))}
                    headers={["Nombre del Docente", "Email", "Telefono", "Rol Terna"]}
                    firstColumnIndex={0}
                    paginated={false}
                />
            ) : (
                <NotFound />
            )}
        </Container>
    );
}