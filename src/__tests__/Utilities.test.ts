jest.mock('../utilities/axiosConfig', () => {
    const axios = jest.requireActual('axios');
    return {
        config: { baseURL: 'https://api.example.test', adapter: jest.fn() },
        axiosGCP: axios.create(),
    };
});

import { config, axiosGCP } from '../utilities/axiosConfig';
import { getData, getSingleData, Post, Put, Delete, PatchData, signUp, LogIn, LogOut, uploadToGCP } from '../utilities/Utilities';

const adapter = config.adapter as jest.Mock;
const values = new Map<string, string>();
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

beforeAll(() => {
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: {
            getItem: (key: string) => values.get(key) || null,
            setItem: (key: string, value: string) => values.set(key, value),
            removeItem: (key: string) => values.delete(key),
        },
    });
});

beforeEach(() => {
    adapter.mockReset();
    values.clear();
});

afterEach(() => jest.restoreAllMocks());

afterAll(() => {
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
});

function reply(data: unknown, status = 200) {
    adapter.mockImplementation(async request => ({ data, status, statusText: 'OK', headers: {}, config: request }));
}

function fail(status: number, message = 'Operación rechazada') {
    adapter.mockRejectedValue(Object.assign(new Error('Request failed'), {
        isAxiosError: true,
        response: { status, statusText: 'Error', data: { message } },
    }));
}

test.each([Post, Put, PatchData, signUp])('writes expose the object through singleData and data', async write => {
    reply({ invitationToken: 'invitation', file: { archivoId: 1 } }, 201);
    const response = await write({ url: '/resource', data: { value: 1 } });
    expect(response.singleData).toEqual({ invitationToken: 'invitation', file: { archivoId: 1 } });
    expect(response.data).toEqual(response.singleData);
    expect(response.status).toBe(201);
    expect(response.error.code).toBe(0);
});

test('array responses preserve the collection and select the first item', async () => {
    reply([{ id: 1 }, { id: 2 }]);
    const response = await getSingleData({ url: '/resource' });
    expect(response.singleData).toEqual({ id: 1 });
    expect(response.data).toEqual([{ id: 1 }, { id: 2 }]);
});

test('concurrent requests do not share responses or errors', async () => {
    adapter.mockImplementation(request => new Promise(resolve => {
        setTimeout(() => resolve({ data: { url: request.url }, status: 200, headers: {}, config: request }), request.url === '/first' ? 10 : 0);
    }));
    const [first, second] = await Promise.all([getData({ url: '/first' }), Post({ url: '/second' })]);
    expect(first.singleData).toEqual({ url: '/first' });
    expect(second.singleData).toEqual({ url: '/second' });
    expect(first).not.toBe(second);
    expect(first.error).not.toBe(second.error);
});

test.each([getData, Post, Put, Delete, PatchData, signUp])('HTTP errors retain their status and server message', async send => {
    fail(403, 'No tienes permiso');
    const response = await send({ url: '/resource' });
    expect(response.status).toBe(403);
    expect(response.error).toEqual({ code: 403, message: 'No tienes permiso' });
});

test('network failures return a defined response and do not poison the next request', async () => {
    adapter.mockRejectedValue(new Error('Network down'));
    const failed = await getData({ url: '/resource' });
    expect(failed.status).toBe(503);
    expect(failed.error.message).toBeTruthy();
    reply({ id: 1 });
    expect((await getData({ url: '/resource' })).error.code).toBe(0);
});

test.each(['/user/login', '/user/activate', '/user/login?source=web'])('public authentication request %s omits an old token', async url => {
    values.set('SECURE', 'old-token');
    reply({ token: 'new-token' });
    await Post({ url });
    expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBeUndefined();
});

test('protected requests use the stored token without changing the shared configuration', async () => {
    values.set('SECURE', 'session-token');
    reply({});
    await Put({ url: '/resource', data: { id: 1 } });
    expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer session-token');
    expect(config.headers).toBeUndefined();
});

test('failed login clears an old session, while successful login stores the new token', async () => {
    values.set('SECURE', 'old-token');
    fail(401);
    await LogIn({ url: '/user/login' });
    expect(values.has('SECURE')).toBe(false);
    reply({ token: 'new-token' });
    await LogIn({ url: '/user/login' });
    expect(values.get('SECURE')).toBe('new-token');
});

test('login without a valid token fails instead of storing undefined', async () => {
    values.set('SECURE', 'old-token');
    reply({});
    expect((await LogIn({ url: '/user/login' })).error.code).toBe(502);
    expect(values.has('SECURE')).toBe(false);
});

test('logout preserves unrelated local data', async () => {
    values.set('SECURE', 'session-token');
    values.set('preferences', 'dark');
    await LogOut();
    expect(values.has('SECURE')).toBe(false);
    expect(values.get('preferences')).toBe('dark');
});

test('failed GCP uploads return false', async () => {
    jest.spyOn(axiosGCP, 'put').mockRejectedValue(new Error('Upload failed'));
    expect(await uploadToGCP('https://storage.example.test/file', { type: 'application/pdf' } as File)).toBe(false);
});
