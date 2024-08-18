import * as pt from "pareto-core-types"

/**
 * this is an implementation, not public by design
 */
class NotSetValue<T> implements pt.OptionalValue<T> {

    constructor() {
        this.raw = [false]
    }

    public map<NT>(
        set: ($: T) => NT,
        notSet: () => NT,
    ) {
        return notSet()
    }
    
    public mapToNewOptional<NT>(
    ) {
        return new NotSetValue<NT>()
    }

    raw: pt.RawOptionalValue<T>
}

/**
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Pareto doesn't use the concept of a class so that keyword should be avoided

 * creates a not set OptionalValue
 * @returns OptionalValue of type T
 */
export function notSet<T>(): pt.OptionalValue<T> {
    return new NotSetValue()
}