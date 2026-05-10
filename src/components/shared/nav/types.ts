import { Permissions } from "@components/shared/nav/menu";
import { Action as DocentesAction } from "@store/slices/docentes"
import { Action as TernasAction } from "@store/slices/ternas"
import { Action as PeriodoAction } from "@store/slices/periodo"
import { Action as FacultadesAction } from "@store/slices/facultades"
import { Action as AlumnosAction } from "@store/slices/alumnos"
import { Action as AccionesPlantillaAction } from "@store/slices/accionesPlantilla"
import { Action as DocumentManagerAction } from "@store/slices/documentManager"
import { Action as PensumsAction } from "@store/slices/pensums"
import { Action as SeccionesAction } from "@store/slices/secciones"


export type NavigationItem = {
    paneId?: string;
    title: string;
    pathTo: string;
    component: JSX.Element;
    permission?: Permissions;
};

export function ClearAppState(dispatch) {
    dispatch(DocentesAction.cleanStore());
    dispatch(TernasAction.cleanStore());
    dispatch(PeriodoAction.cleanStore());
    dispatch(FacultadesAction.cleanStore());
    dispatch(AlumnosAction.cleanStore());
    dispatch(AccionesPlantillaAction.cleanStore());
    dispatch(DocumentManagerAction.cleanStore());
    dispatch(PensumsAction.cleanStore());
    dispatch(SeccionesAction.cleanStore());
}