import * as pt from "pareto-core-types"
import { createCounter } from "../private/createCounter"
import { wrapAsyncValueImp } from "./wrapAsyncValueImp"
import { Execute } from "../types/Execute"


export class Array<T> implements pt.Array<T> {
    private data: T[]
    constructor(data: T[]) {
        this.data = data
    }
    map<NT>(
        $v: (entry: T) => NT
    ) {
        return wrapRawArray(this.data.map((entry) => {
            return $v(entry)
        }))
    }
    asyncMap<NT>($v: ($: T) => pt.AsyncValue<NT>) {
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
        return array(this.data, $v)
    }


    /////////
    __forEach($i: ($: T) => void) {
        this.data.forEach(($) => {
            $i($)
        })
    }
    __getLength() {
        return this.data.length
    }
    __getElementAt(index: number) {
        return this.data[index]
    }

}

export function wrapRawArray<T>(source: T[]): pt.Array<T> {
    const data = source.slice() //create a copy
    if (!(data instanceof Array)) {
        throw new Error("invalid input in 'createArray'")
    }
    return new Array(source)
}
