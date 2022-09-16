import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"


export function wrapRawDictionary<T>(source: { [key: string]: T }): pt.Dictionary<T> {


    type KeyValuePair<T> = { key: string, value: T }

    type DictionaryAsArray<T> = KeyValuePair<T>[]

    function createDictionaryAsArray<X>(source: { [key: string]: X }): DictionaryAsArray<X> {
        const imp: DictionaryAsArray<X> = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }

    function createDictionaryImp<X>(source: DictionaryAsArray<X>): pt.Dictionary<X> {

        return {
            map: <NT>(
                $v: (entry: X, key: string) => NT
            ) => {
                return createDictionaryImp(source.map(($) => {
                    return {
                        key: $.key,
                        value: $v($.value, $.key)
                    }
                }))
            },
            // forEach: (
            //     isFirstAfterSecond,
            //     callback
            // ) => {
            //     const sortedKeys = source.map((entry, position) => {
            //         return {
            //             key: entry.key,
            //             position: position
            //         }
            //     }).sort(
            //         (a, b) => {
            //             if(isFirstAfterSecond(a.key, b.key)) {
            //                 return 1
            //             } else {
            //                 if (isFirstAfterSecond(b.key, a.key)) {
            //                     return -1
            //                 } else {
            //                     return 0
            //                 }
            //             }
            //         }
            //     )
            //     sortedKeys.forEach((sorted) => {
            //         callback(source[sorted.position].value, sorted.key)
            //     })
            // },
            filter: <NT>(
                $v: (v: X, key: string) => NT | undefined
            ) => {
                const filtered: KeyValuePair<NT>[] = []
                source.forEach(($) => {
                    const result = $v($.value, $.key)
                    if (result !== undefined) {
                        filtered.push({
                            key: $.key,
                            value: result
                        })
                    }
                })
                return createDictionaryImp(filtered)
            },
            reduce: <NT>(
                initialValue: NT,
                $v: (current: NT, entry: X, key: string) => NT,
            ) => {
                let current = initialValue

                source.forEach(($) => {
                    current = $v(current, $.value, $.key)

                })
                return current
            },
            asyncMap: ($v) => {
                function imp<T, NT>(
                    dictionary: DictionaryAsArray<T>,
                    $v: ($: T, key: string) => pt.AsyncValue<NT>
                ): pt.AsyncValue<pt.Dictionary<NT>> {
                    const mapped = dictionary.map(($) => {
                        return {
                            key: $.key,
                            value: $v($.value, $.key),
                        }
                    })
                    let _isGuaranteedToReturnAResult = true
                    mapped.forEach(($) => {
                        if (!$.value._isGuaranteedToReturnAResult) {
                            _isGuaranteedToReturnAResult = false
                        }
                    })
                    return wrapAsyncValueImp(
                        _isGuaranteedToReturnAResult,
                        {
                            _execute: (cb) => {
                                const temp: { [key: string]: NT } = {}
                                createCounter(
                                    (counter) => {
                                        mapped.map(($) => {
                                            counter.increment()
                                            $.value._execute((nv) => {
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
                        }
                    )
                }
                return imp(
                    source,
                    $v,
                )

            }
        }
    }

    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large
    const daa = createDictionaryAsArray(source)
    return createDictionaryImp(daa)
}
