import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"
import { Execute } from "../types/Execute"
import * as arr from "./Array"

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    const data = source.slice() //create a copy
    if (!(data instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return new arr.Array(source)
}
