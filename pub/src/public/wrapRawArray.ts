import * as pt from "pareto-core-types"
import { createCounter } from "../imp/private/createCounter"
import { wrapAsyncValueImp } from "../imp/private/wrapAsyncValueImp"

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return {
        forEach: ($c) => {
            return wrapRawArray(source.map((entry) => {
                return $c(entry)
            }))
        },

        map: <NT>($c: (entry: T) => NT) => {
            return wrapRawArray(source.map((entry) => {
                return $c(entry)
            }))
        },
        reduce: <NT>(
            initialValue: NT,
            $c: (current: NT, entry: T) => NT,
        ) => {
            let current = initialValue

            source.forEach(($) => {
                current = $c(current, $)

            })
            return current
        },
        filter: <NT>(
            $c: (v: T) => NT | undefined
        ) => {
            const filtered: NT[] = []
            source.forEach(($) => {
                const result = $c($)
                if (result !== undefined) {
                    filtered.push(result)
                }
            })
            return wrapRawArray(filtered)
        },
        asyncMap: ($c) => {


            function array<T, NT>(
                array: T[],
                element$c: ($: T) => pt.AsyncValue<NT>
            ): pt.AsyncValue<pt.Array<NT>> {
                return wrapAsyncValueImp({
                    _execute: ($c) => {
                        const temp: NT[] = []
                        createCounter(
                            (counter) => {
                                array.forEach((v) => {
                                    counter.increment()
                                    element$c(v)._execute((v) => {
                                        temp.push(v)
                                        counter.decrement()
                                    })
                                })
                            },
                            () => {
                                $c(wrapRawArray(temp))
                            }
                        )
                    }
                })
            }
            return array(source, $c)
        },
    }
}
