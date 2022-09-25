import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"
import { Execute } from "../types/Execute"

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return {
        forEach: ($i) => {
            source.forEach(($) => {
                $i($)
            })
        },

        map: <NT>(
            $v: (entry: T) => NT
        ) => {
            return wrapRawArray(source.map((entry) => {
                return $v(entry)
            }))
        },
        reduce: <NT>(
            $: NT,
            $v: (current: NT, entry: T) => NT,
        ) => {
            let current = $

            source.forEach(($) => {
                current = $v(current, $)

            })
            return current
        },
        filter: <NT>(
            $v: (v: T) => NT | undefined
        ) => {
            const filtered: NT[] = []
            source.forEach(($) => {
                const result = $v($)
                if (result !== undefined) {
                    filtered.push(result)
                }
            })
            return wrapRawArray(filtered)
        },
        asyncMap: ($v) => {
            // const elements = source.map($v)
            // let _isGuaranteedToReturnAResult = true
            // source.forEach(($) => {
            //     if ($)
            // })
            function array<T, NT>(
                array: T[],
                $v: ($: T) => pt.AsyncValue<NT>
            ): pt.AsyncValue<pt.Array<NT>> {
                const mapped = array.map($v)

                let _isGuaranteedToReturnAResult = true
                mapped.forEach(($) => {
                    if (!$._isGuaranteedToReturnAResult) {
                        _isGuaranteedToReturnAResult = false
                    }
                })
                return wrapAsyncValueImp(
                    _isGuaranteedToReturnAResult,
                    ($c) => {
                        const temp: NT[] = []
                        createCounter(
                            (counter) => {
                                mapped.forEach((v) => {
                                    counter.increment()
                                    v._execute((v) => {
                                        temp.push(v)
                                        counter.decrement()
                                    })
                                })
                            },
                            () => {
                                $c(wrapRawArray(temp))
                            }
                        )
                    },
                )
            }
            return array(source, $v)
        },
    }
}
