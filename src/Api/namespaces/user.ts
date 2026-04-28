export type TypeLoginResponse = {
    message: string;
    userId: string;
    roleId: number;
    token: string;
    passwordResetRequired: boolean;
}