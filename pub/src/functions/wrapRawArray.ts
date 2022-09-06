import * as pt from "pareto-core-types"
import { createCounter } from "./createCounter"

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return {
        map: <NT>(callback: (entry: T) => NT) => {
            return wrapRawArray(source.map((entry) => {
                return callback(entry)
            }))
        },
        reduce: <NT>(
            initialValue: NT,
            callback: (current: NT, entry: T) => NT,
        ) => {
            let current = initialValue

            source.forEach(($) => {
                current = callback(current, $)

            })
            return current
        },
        filter: <NT>(
            cb: (v: T) => NT | undefined
        ) => {
            const filtered: NT[] = []
            source.forEach(($) => {
                const result = cb($)
                if (result !== undefined) {
                    filtered.push(result)
                }
            })
            return wrapRawArray(filtered)
        },
        asyncMap: ($c) => {


            function array<T, NT>(
                array: T[],
                elementCallback: ($: T) => pt.AsyncValue<NT>
            ): pt.AsyncValue<pt.Array<NT>> {
                return {
                    execute: (cb) => {
                        const temp: NT[] = []
                        createCounter(
                            (counter) => {
                                array.forEach((v) => {
                                    counter.increment()
                                    elementCallback(v).execute((v) => {
                                        temp.push(v)
                                        counter.decrement()
                                    })
                                })
                            },
                            () => {
                                cb(wrapRawArray(temp))
                            }
                        )
                    }
                }
            }
            return array(source, $c)
        },
    }
}
