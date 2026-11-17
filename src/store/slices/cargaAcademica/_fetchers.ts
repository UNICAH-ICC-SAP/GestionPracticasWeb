import { CreateFetchers } from "../../../storeConfig";
import { Post } from "@utilities/Utilities";
import { NAME, FilaCarga } from "./_namespace";

type Contexto = { id_periodo: string; facultadId: string };

export default CreateFetchers(NAME, {
    async preview(params: Contexto & { nombre: string; archivo: string }) {
        const response = await Post({ url: "/cargas/importar/preview", data: params });
        const data = response.singleData as unknown as { filas: FilaCarga[]; registros: number; duplicados: number };
        return { ...data, error: response.error.code ? response.error.message : "" };
    },
    async confirm(params: Contexto & { filas: FilaCarga[] }) {
        const response = await Post({ url: "/cargas/importar/confirm", data: params });
        const data = response.singleData as unknown as { insertados: number; duplicados: number };
        return { ...data, error: response.error.code ? response.error.message : "" };
    },
    async excel(params: { filas: FilaCarga[] }) {
        const response = await Post({ url: "/cargas/importar/excel", data: params });
        const data = response.singleData as { archivo?: string };
        return {
            archivo: data.archivo,
            error: response.error.code ? response.error.message : "",
        };
    },
});
