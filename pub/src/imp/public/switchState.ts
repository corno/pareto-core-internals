/**
 * ss means 'switch state'.
 */

export type State<T> = [string | boolean, T]

export function ss<T, RT>($: State<T>, cb: ($: T) => RT): RT {
    return cb($[1])
}