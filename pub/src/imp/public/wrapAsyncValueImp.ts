import * as pt from "pareto-core-types"

import { Execute } from "../types/Execute"


export function wrapAsyncValueImp<T>(
    execute: Execute<T>,
): pt.AsyncValue<T> {
    return {
        map: ($v) => {
            function rewrite<In, Out>(
                source: Execute<In>,
                rewrite: (source: In) => pt.AsyncValue<Out>
            ): pt.AsyncValue<Out> {
                return wrapAsyncValueImp(
                    ((cb) => {
                        source((v) => {
                            rewrite(v).__execute(cb)
                        })
                    })
                )
            }
            return rewrite(execute, $v)
        },

        //////////
        __execute: ($i) => {
            execute($i)
        },
    }

}