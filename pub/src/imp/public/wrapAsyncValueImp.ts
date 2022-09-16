import * as pt from "pareto-core-types"

import { AsyncValueImp } from "../types/AsyncValueImp"


export function wrapAsyncValueImp<T>(
    _isGuaranteedToReturnAResult: boolean,
    $: AsyncValueImp<T>,
): pt.AsyncValue<T> {
    return {
        _execute: ($i) => {
            $._execute($i)
        },
        map: ($v) => {
            function rewrite<In, Out>(
                source: AsyncValueImp<In>,
                rewrite: (source: In) => pt.AsyncValue<Out>
            ): pt.AsyncValue<Out> {
                return wrapAsyncValueImp(
                    _isGuaranteedToReturnAResult,
                    {
                        _execute: ((cb) => {
                            source._execute((v) => {
                                rewrite(v)._execute(cb)
                            })
                        })
                    }
                )
            }
            return rewrite($, $v)
        },
        setCondition: ($v) => {
            function setCondition<In, Out>(
                source: AsyncValueImp<In>,
                rewrite: (v: In) => undefined | pt.AsyncValue<Out>,
            ): pt.AsyncValue<Out> {
                return wrapAsyncValueImp(
                    false,
                    {
                        _execute: (cb) => {
                            source._execute((vIn) => {
                                const res = rewrite(vIn)
                                if (res !== undefined) {
                                    res._execute(cb)
                                }
                                //callback is never called
                            })
                        }
                    }
                )
            }
            return setCondition($, $v)

        },
        _isGuaranteedToReturnAResult: _isGuaranteedToReturnAResult
    }

}