import * as pt from "pareto-core-types"

import { Execute } from "../types/Execute"

export class AsyncValue<T> implements pt.AsyncValue<T> {
    private execute: Execute<T>
    constructor(execute: Execute<T>) {
        this.execute = execute
    }
    map<NT>($v: ($: T) => AsyncValue<NT>): pt.AsyncValue<NT> {
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
 * returns a Pareto async value
 * @param execute the function that produces the eventual value
 * @returns 
 */
export function wrapAsyncValueImp<T>(
    execute: Execute<T>,
): pt.AsyncValue<T> {
    return new AsyncValue<T>(execute)

}