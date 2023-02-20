import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"
import { Execute } from "../types/Execute"

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    const data = source.slice() //create a copy
    if (!(data instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return {
        map: <NT>(
            $v: (entry: T) => NT
        ) => {
            return wrapRawArray(data.map((entry) => {
                return $v(entry)
            }))
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

                return wrapAsyncValueImp(
                    ($c) => {
                        const temp: NT[] = []
                        createCounter(
                            (counter) => {
                                mapped.forEach((v) => {
                                    counter.increment()
                                    v.__execute((v) => {
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
            return array(data, $v)
        },


        /////////
        __forEach: ($i) => {
            data.forEach(($) => {
                $i($)
            })
        },
        __getLength: () => {
            return data.length
        },
        __getElementAt: (index) => {
            return data[index]
        }

    }
}
