import { Permissions } from "@components/shared/nav/menu"

export type NavigationItem = {
    paneId?: string;
    title: string;
    pathTo: string;
    component: JSX.Element;
    permission?: Permissions;
};