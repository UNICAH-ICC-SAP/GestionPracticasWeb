export type InfoFile = {
    totalFiles: number;
    data: UserInfo;
}

export type UserInfo = {
    userId: string;
    userName: string;
    userFolder: string;
    files: Files[];
}

export type Files = {
    archivoId: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    sizeBytes: number;
    provider: string;
    bucketName: string;
    fileUrl: string;
    status: string;
    fileStatus: string;
    fileTypeId: number;
}