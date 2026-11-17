jest.mock('../storeConfig', () => ({
    CreateReducer: jest.requireActual('@reduxjs/toolkit').createReducer,
    CreateActions: jest.requireActual('../storeConfig/_actions').default,
    CreateFetchers: jest.requireActual('../storeConfig/_fetchers').default,
}));

jest.mock('../utilities/Utilities', () => ({ Post: jest.fn() }));

import { configureStore } from '@reduxjs/toolkit';
import { Post } from '../utilities/Utilities';
import { Action, Fetcher, Reducer, FilaCarga } from '../store/slices/cargaAcademica';

const post = Post as jest.Mock;
const row: FilaCarga = {
    docenteId: '9599', nombre_docente: 'Ariel', codigo: 'INF1-IF101', nombre_clase: 'Informática I',
    seccion: '0801A', fecha_inicio: '2026-09-16', fecha_final: '2026-12-19',
    hora_inicio: '08:00', hora_final: '08:50', dias: 'LUN MIE', campus: 'SAP', observacion: '',
    fila: 1, errores: [], advertencias: [],
};
const context = { id_periodo: 'III-2026', facultadId: 'INF' };

beforeEach(() => jest.resetAllMocks());

test('preview calls the import endpoint and stores validation without confirming', async () => {
    const store = configureStore({ reducer: Reducer });
    post.mockResolvedValue({ singleData: { filas: [row], registros: 2, duplicados: 0 }, error: { code: 0 } });
    await store.dispatch(Fetcher.preview({ ...context, nombre: 'carga.pdf', archivo: 'JVBERg==' }));
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith({ url: '/cargas/importar/preview', data: {
        ...context, nombre: 'carga.pdf', archivo: 'JVBERg==',
    } });
    expect(store.getState()).toMatchObject({ filas: [row], registros: 2, loading: false, resultado: null });
});

test('a confirmation conflict preserves the preview and never reports success', async () => {
    const store = configureStore({ reducer: Reducer, preloadedState: { ...Reducer(undefined, { type: 'init' }), filas: [row] } });
    post.mockResolvedValue({ singleData: {}, error: { code: 409, message: 'Conflicto de horario' } });
    await store.dispatch(Fetcher.confirm({ ...context, filas: [row] }));
    expect(store.getState()).toMatchObject({ filas: [row], error: 'Conflicto de horario', resultado: null, loading: false });
});

test('successful confirmation clears the preview and cleanStore removes its result', async () => {
    const store = configureStore({ reducer: Reducer });
    post.mockResolvedValue({ singleData: { insertados: 2, duplicados: 1 }, error: { code: 0 } });
    await store.dispatch(Fetcher.confirm({ ...context, filas: [row] }));
    expect(store.getState()).toMatchObject({ filas: [], resultado: { insertados: 2, duplicados: 1 } });
    store.dispatch(Action.cleanStore());
    expect(store.getState()).toMatchObject({ filas: [], resultado: null, error: '', loading: false });
});

test('transport failures stop the spinner and expose an error', async () => {
    const store = configureStore({ reducer: Reducer });
    post.mockRejectedValue(new Error('Offline'));
    await store.dispatch(Fetcher.preview({ ...context, nombre: 'carga.xlsx', archivo: 'UEs=' }));
    expect(store.getState()).toMatchObject({ filas: [], loading: false, error: 'No se pudo leer el archivo.' });
});
