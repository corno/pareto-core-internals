import { Dictionary } from "pareto-core-types"


export function wrapRawDictionary<T>(source: { [key: string]: T }): Dictionary<T> {


    type KeyValuePair<T> = { key: string, value: T }

    type DictionaryAsArray<T> = KeyValuePair<T>[]
    
    function createDictionaryAsArray<X>(source: { [key: string]: X }): DictionaryAsArray<X> {
        const imp: DictionaryAsArray<X> = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }
    
    function createDictionaryImp<X>(source: DictionaryAsArray<X>): Dictionary<X> {
    
        return {
            map: <NT>(callback: (entry: X, key: string) => NT) => {
                return createDictionaryImp(source.map(($) => {
                    return {
                        key: $.key,
                        value: callback($.value, $.key)
                    }
                }))
            },
            forEach: (
                sort,
                callback
            ) => {
                const sortedKeys = source.map((entry, position) => {
                    return {
                        key: entry.key,
                        position: position
                    }
                }).sort(
                    (a, b) => {
                        const after = sort(a.key, b.key)
                        return after ? 1 : -1
                    }
                )
                sortedKeys.forEach((sorted) => {
                    callback(source[sorted.position].value, sorted.key)
                })
            },
            filter: <NT>(
                cb: (v: X, key: string) => NT | undefined
            ) => {
                const filtered: KeyValuePair<NT>[] = []
                source.forEach(($) => {
                    const result = cb($.value, $.key)
                    if (result !== undefined) {
                        filtered.push({
                            key: $.key,
                            value: result
                        })
                    }
                })
                return createDictionaryImp(filtered)
            },
            reduce: <NT>(
                initialValue: NT,
                callback: (current: NT, entry: X, key: string) => NT,
            ) => {
                let current = initialValue
    
                source.forEach(($) => {
                    current = callback(current, $.value, $.key)
    
                })
                return current
            }
        }
    }
    
    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large
    const daa = createDictionaryAsArray(source)
    return createDictionaryImp(daa)
}
