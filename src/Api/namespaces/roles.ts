export type RolesTypeResponse = {
    roleId: number,
    roleDescription: string,
    permissions: TypeRolePermissionResponse[]
};

export type TypeRolePermissionResponse = {
    permissionId: number;
    name: string;
    description: string;
}

export type TypePermissionResponse = {
    userId: string;
    permissions: TypeUserPermissionResponse[];
}

export type TypeUserPermissionResponse = {
    permissionId: number;
    permission: string;
    description: string;
    type: string;
}