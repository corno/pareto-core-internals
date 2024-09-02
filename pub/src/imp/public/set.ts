import * as pt from "pareto-core-types"

import { OptionalValue } from "pareto-core-types"

/**
 * this is an implementation, not public by design
 */
class SetValue<T> implements pt.OptionalValue<T> {

    constructor(source: T) {
        this.source = source
        this.raw = [true, source]
    }

    source: T

    public map<NT>(
        set: ($: T) => NT,
        notSet: () => NT,
    ) {
        if (this.raw[0] === true) {
            return set(this.raw[1])
        } else {
            return notSet()
        }
    }

    public mapToNewOptional<NT>(
        set: ($: T) => NT,
    ) {
        return new SetValue(set(this.source))
    }

    raw: pt.RawOptionalValue<T>
}

/**
 * returns a set {@link OptionalValue}.

 * @param $ the set value
 */
export function set<T>($: T): pt.OptionalValue<T> {
    return new SetValue($)
}
