import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { panic } from "./panic"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"
import { set } from "./set"
import { notSet } from "./notSet"

type KeyValuePair<T> = { key: string, value: T }

type DictionaryAsArray<T> = KeyValuePair<T>[]

/**
 * this is an implementation, not public by design
 */
class Dictionary<T> implements pt.Dictionary<T> {
    private source: DictionaryAsArray<T>
    constructor(source: DictionaryAsArray<T>) {
        this.source = source
    }
    public map<NT>(
        $v: (entry: T) => NT
    ) {
        return new Dictionary<NT>(this.source.map(($) => {
            return {
                key: $.key,
                value: $v($.value)
            }
        }))
    }
    asyncMap<NT>($v: ($: T) => pt.AsyncValue<NT>) {
        function imp<T, NT>(
            dictionary: DictionaryAsArray<T>,
            $v: ($: T) => pt.AsyncValue<NT>
        ): pt.AsyncValue<pt.Dictionary<NT>> {
            const mapped = dictionary.map(($) => {
                return {
                    key: $.key,
                    value: $v($.value),
                }
            })
            mapped.forEach(($) => {
            })
            return wrapAsyncValueImp(
                (cb) => {
                    const temp: { [key: string]: NT } = {}
                    createCounter(
                        (counter) => {
                            mapped.map(($) => {
                                counter.increment()
                                $.value.__execute((nv) => {
                                    temp[$.key] = nv
                                    counter.decrement()
                                })
                            })
                        },
                        () => {
                            cb(wrapRawDictionary(temp))
                        }
                    )
                }
            )
        }
        return imp<T, NT>(
            this.source,
            $v,
        )

    }

    __mapWithKey<NT>(
        $v: (entry: T, key: string) => NT
    ) {
        return new Dictionary(this.source.map(($) => {
            return {
                key: $.key,
                value: $v($.value, $.key),
            }
        }))
    }

    __forEach(
        isFirstBeforeSecond: (a: string, b: string) => boolean,
        callback: ($: T, key: string) => void,
    ) {
        const sortedKeys = this.source.map((entry, position) => {
            return {
                key: entry.key,
                position: position
            }
        }).sort(
            (a, b) => {
                if (isFirstBeforeSecond(a.key, b.key)) {
                    return -1
                } else {
                    if (isFirstBeforeSecond(b.key, a.key)) {
                        return 1
                    } else {
                        return 0
                    }
                }
            }
        )
        sortedKeys.forEach((sorted) => {
            callback(this.source[sorted.position].value, sorted.key)
        })
    }

    __getEntryOrPanic(key: string) {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return element.value
            }
        }
        panic(`entry '${key}' not found`)
    }

    __unsafeGetEntry(key: string) {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return element.value
            }
        }
        panic(`entry '${key}' not found`)
    }

    __getEntry<NT>(
        key: string,
        exists: ($: T) => NT,
        nonExists: () => NT,
    ) {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return exists(element.value)
            }
        }
        return nonExists()
    }

    __getOptionalEntry(
        key: string,
    ): pt.OptionalValue<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return set(element.value)
            }
        }
        return notSet()
    }

}

/**
 * returns a Pareto dictionary
 * 
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Pareto doesn't use the concept of a class so that keyword should be avoided
 * @param source An object literal
 * @returns 
 */
export function wrapRawDictionary<T>(source: { [key: string]: T }): pt.Dictionary<T> {

    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large

    function createDictionaryAsArray<X>(source: { [key: string]: X }): DictionaryAsArray<X> {
        const imp: DictionaryAsArray<X> = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }
    const daa = createDictionaryAsArray(source)
    return new Dictionary(daa)
}
