import * as Toolkit from "@reduxjs/toolkit";

export default function CreateActions<T extends Record<string, unknown>>(
    name: string,
    keys: (keyof T)[],
) {
    type Actions = {
        [K in keyof T]: T[K] extends never
        ? Toolkit.ActionCreatorWithoutPayload<string>
        : Toolkit.ActionCreatorWithPayload<T[K], string>;
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const reduced = [...new Set(keys)].reduce(
        (acc, key) => ({
            ...acc,
            [key]: Toolkit.createAction<T[typeof key]>(`${name}/${String(key)}`),
        }),
        {} as Actions,
    );
    return reduced;
}
// eslint-enable-next-line @typescript-eslint/ban-ts-comment