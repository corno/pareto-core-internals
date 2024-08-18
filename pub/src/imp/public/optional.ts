import * as pt from 'pareto-core-types'

/**
 * @deprecated use the 'map' method of 'OptionalValue'
 * @param $ 
 * @param set 
 * @param notSet 
 * @returns 
 */
export function optional<T, RT>(
    $: pt.OptionalValue<T>,
    set: ($: T) => RT,
    notSet: () => RT
): RT {
    if ($[0] === true) {
        return set($[1])
    } else {
        return notSet()
    }
}