import * as pt from "pareto-core-types"

import { AsyncValue } from "pareto-core-types"

import { Execute } from "../types/Execute"

export class AsyncValueClass<T> implements pt.AsyncValue<T> {
    private execute: Execute<T>
    constructor(execute: Execute<T>) {
        this.execute = execute
    }
    map<NT>($v: ($: T) => AsyncValueClass<NT>): pt.AsyncValue<NT> {
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
        return rewrite(this.execute, $v)
    }

    __execute ($i: ($: T) => void) {
        this.execute($i)
    }
}

/**
 * returns an {@link AsyncValue }
 * @param execute the function that produces the eventual value
 * @returns 
 */
export function wrapAsyncValueImp<T>(
    execute: Execute<T>,
): pt.AsyncValue<T> {
    return new AsyncValueClass<T>(execute)

}