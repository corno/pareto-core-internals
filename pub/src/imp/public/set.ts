import * as pt from "pareto-core-types"

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
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Pareto doesn't use the concept of a class so that keyword should be avoided

 * @param $ the set value
 * @returns a set OptionalValue
 */
export function set<T>($: T): pt.OptionalValue<T> {
    return new SetValue($)
}
