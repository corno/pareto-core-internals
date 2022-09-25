import * as pt from "pareto-core-types"

import { Execute } from "../types/Execute"


export function wrapAsyncValueImp<T>(
    _isGuaranteedToReturnAResult: boolean,
    execute: Execute<T>,
): pt.AsyncValue<T> {
    return {
        _execute: ($i) => {
            execute($i)
        },
        map: ($v) => {
            function rewrite<In, Out>(
                source: Execute<In>,
                rewrite: (source: In) => pt.AsyncValue<Out>
            ): pt.AsyncValue<Out> {
                return wrapAsyncValueImp(
                    _isGuaranteedToReturnAResult,
                    ((cb) => {
                        source((v) => {
                            rewrite(v)._execute(cb)
                        })
                    })
                )
            }
            return rewrite(execute, $v)
        },
        setCondition: ($v) => {
            function setCondition<In, Out>(
                source: Execute<In>,
                rewrite: (v: In) => undefined | pt.AsyncValue<Out>,
            ): pt.AsyncValue<Out> {
                return wrapAsyncValueImp(
                    false,
                    (cb) => {
                        source((vIn) => {
                            const res = rewrite(vIn)
                            if (res !== undefined) {
                                res._execute(cb)
                            }
                            //callback is never called
                        })
                    }
                )
            }
            return setCondition(execute, $v)

        },
        _isGuaranteedToReturnAResult: _isGuaranteedToReturnAResult
    }

}