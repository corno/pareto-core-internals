import * as pt from 'pareto-core-types'

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