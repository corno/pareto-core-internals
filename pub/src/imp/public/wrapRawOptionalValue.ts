import * as pt from "pareto-core-types"
import { notSet } from "./notSet"
import { set } from "./set"


/**
 * returns an {@link OptionalValue }
 * @returns 
 */
export function wrapRawOptionalValue<T>(
    $: pt.RawOptionalValue<T>,
): pt.OptionalValue<T> {
    if ($[0] === false) {
        return notSet()
    } else {
        return set($[1])
    }

}