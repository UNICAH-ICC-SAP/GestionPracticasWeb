export const DEF = {}

type Reqs<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

type Opts<T> = { [K in keyof T]-?: object extends Pick<T, K> ? K : never }[keyof T];

export type Props<
    P, // propTypes
    D, // defaultProps
    R = Pick<P, Reqs<P>>, // all required props
    O = Pick<P, Opts<P>>, // all optional props  that are not in default
> = R & O & D;