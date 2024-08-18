

export type State<T> = [string | boolean, T]

/**
 * ss means 'switch state'.
 * used to make the value T the context variable ('$')
 * given a tuple of a string (or boolean) and a value T,
 * the function takes the value T and calls back the callback ($c)
 * notice that the string part is never used
 * 
 * example:
 * 
 * switch ($.state[0]) {
 *     case "on":
 *          return ss($.state, ($) => $.value
 *     case "off":
 *          return ss($.state, ($) => null
 *     default: au($.state[0])
 * }
 */
export function ss<T, RT>(
    $: State<T>, 
    $c: ($: T) => RT): RT
 {
    return $c($[1])
}