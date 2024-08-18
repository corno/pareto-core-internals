
/**
 * function that (eventually) produces a value.
 * the value is provided in a callback ($c)
 */
export type Execute<T> = (
    $c: ($: T) => void
) => void
