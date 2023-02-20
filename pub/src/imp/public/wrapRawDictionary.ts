import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { panic } from "./panic"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"


export function wrapRawDictionary<T>(source: { [key: string]: T }): pt.Dictionary<T> {


    type KeyValuePair<T> = { key: string, value: T }

    type DictionaryAsArray<T> = KeyValuePair<T>[]


    function createDictionaryImp<X>(source: DictionaryAsArray<X>): pt.Dictionary<X> {

        return {
            map: <NT>(
                $v: (entry: X) => NT
            ) => {
                return createDictionaryImp(source.map(($) => {
                    return {
                        key: $.key,
                        value: $v($.value)
                    }
                }))
            },
            asyncMap: ($v) => {
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
                return imp(
                    source,
                    $v,
                )

            },

            ///////
            __mapWithKey: <NT>(
                $v: (entry: X, key: string) => NT
            ) => {
                return createDictionaryImp(source.map(($) => {
                    return {
                        key: $.key,
                        value: $v($.value, $.key),
                    }
                }))
            },
            __forEach: (
                isFirstBeforeSecond,
                callback
            ) => {
                const sortedKeys = source.map((entry, position) => {
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
                    callback(source[sorted.position].value, sorted.key)
                })
            },
            __unsafeGetEntry: (key) => {
                for (let i = 0; i !== source.length; i += 1) {
                    const element = source[i]
                    if (element.key === key) {
                        return element.value
                    }
                }
                panic(`entry '${key}' not found`)
            },
            __getEntry: (
                key,
                exists,
                nonExists,
            ) => {
                for (let i = 0; i !== source.length; i += 1) {
                    const element = source[i]
                    if (element.key === key) {
                        return exists(element.value)
                    }
                }
                return nonExists()
            },
        }
    }

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
    return createDictionaryImp(daa)
}
